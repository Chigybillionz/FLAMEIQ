import { Request, Response } from 'express';
import { prisma } from '@/db/prisma.js';
import { logger } from '@/utils/logger.js';
import { createReviewSchema } from '@/validators/reviewValidators.js';

const MAX_PAGE_SIZE = 50;
const DEFAULT_PAGE_SIZE = 20;

const parsePositiveInteger = (value: unknown) => {
  if (typeof value !== 'string') {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
};

const isValidUuid = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export const createReview = async (req: Request, res: Response) => {
  const result = createReviewSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.flatten().fieldErrors });
  }
  const { orderId, rating, comment } = result.data;
  const authorId = req.user!.id;
  
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { review: true },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.userId !== authorId) {
      return res.status(403).json({ success: false, message: 'You can only review your own orders.' });
    }

    if (order.status !== 'CONFIRMED') {
      return res.status(400).json({ success: false, message: 'You can only review orders that you have confirmed as delivered.' });
    }

    if (order.review) {
      return res.status(409).json({ success: false, message: 'A review for this order already exists.' });
    }

    const newReview = await prisma.review.create({
      data: {
        orderId,
        rating,
        comment: comment || null,
        authorId,
        targetUserId: order.vendorId, // The vendor is the target of the review
      },
    });

    return res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    logger.error({ err: error }, 'Failed to create review');
    return res.status(500).json({ success: false, message: 'Failed to create review.' });
  }
};

export const getReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }
    return res.status(200).json({ success: true, data: review });
  } catch (error) {
    logger.error({ err: error }, 'Failed to get review');
    return res.status(500).json({ success: false, message: 'Failed to retrieve review.' });
  }
};

export const getallReview = async (req: Request, res: Response) => {
  const cursor = typeof req.query.cursor === 'string' ? req.query.cursor.trim() : undefined;
  const page = parsePositiveInteger(req.query.page);
  const limit = parsePositiveInteger(req.query.limit);

  const hasCursor = !!cursor && isValidUuid(cursor);
  const hasPageBasedPagination = !!page && !!limit;

  if (!hasCursor && !hasPageBasedPagination) {
    return res.status(400).json({
      success: false,
      message: 'Pagination required. Provide either a valid cursor or both page and limit parameters.',
    });
  }

  try {
    if (hasCursor) {
      const limitValue = Math.min(limit ?? DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
      const reviews = await prisma.review.findMany({
        orderBy: { createdAt: 'desc' },
        cursor: { id: cursor },
        skip: 1,
        take: limitValue + 1,
      });

      const hasNextPage = reviews.length > limitValue;
      const boundedReviews = hasNextPage ? reviews.slice(0, limitValue) : reviews;
      const lastReview = boundedReviews[boundedReviews.length - 1];

      return res.status(200).json({
        success: true,
        data: boundedReviews,
        pagination: {
          limit: limitValue,
          nextCursor: hasNextPage && lastReview ? lastReview.id : null,
          hasNextPage,
        },
      });
    }

    const pageValue = page!;
    const limitValue = Math.min(limit!, MAX_PAGE_SIZE);
    const skip = (pageValue - 1) * limitValue;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitValue,
      }),
      prisma.review.count(),
    ]);

    return res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        page: pageValue,
        limit: limitValue,
        total,
        totalPages: Math.ceil(total / limitValue),
        hasNextPage: pageValue * limitValue < total,
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to fetch reviews');
    return res.status(500).json({ success: false, message: 'Failed to retrieve reviews.' });
  }
};