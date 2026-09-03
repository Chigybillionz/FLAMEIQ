import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import { PrismaClient } from '../generated/prisma/client.js';
import { Request, Response } from 'express';

import { getallReview } from './reviewController.js';

vi.mock('@/db/prisma.js', () => ({
  prisma: mockDeep<PrismaClient>(),
}));
vi.mock('@/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

import { prisma } from '../db/prisma.js';

const prismaMock = prisma as unknown as ReturnType<typeof mockDeep<PrismaClient>>;

describe('Review Controller', () => {
  let mockReq: Request;
  let mockRes: Response;

  beforeEach(() => {
    mockReset(prismaMock);
    vi.clearAllMocks();
    mockReq = {
      query: {},
      params: {},
    } as unknown as Request;
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
  });

  it('requires explicit pagination parameters for the public review list', async () => {
    await getallReview(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Pagination required. Provide either a valid cursor or both page and limit parameters.',
    });
  });

  it('caps page size and returns bounded pagination metadata', async () => {
    const reviews = [{ id: 'review-1' }, { id: 'review-2' }];
    mockReq.query = { page: '1', limit: '999' } as any;
    prismaMock.review.findMany.mockResolvedValue(reviews as any);
    prismaMock.review.count.mockResolvedValue(60);

    await getallReview(mockReq, mockRes);

    expect(prismaMock.review.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
      skip: 0,
      take: 50,
    });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      data: reviews,
      pagination: {
        page: 1,
        limit: 50,
        total: 60,
        totalPages: 2,
        hasNextPage: true,
      },
    });
  });
});
