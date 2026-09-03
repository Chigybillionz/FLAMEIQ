import { Request, Response } from 'express';
import { vendorListingService } from '../services/vendorListingService.js';
import { AppError } from '../utils/errors.js';

class VendorListingController {
  public upsertListing = async (req: Request, res: Response) => {
    // `req.user` should contain the authenticated user's ID
    const vendorId = req.user?.id;
    const { pricePerKg, maxKg } = req.body;

    if (!vendorId) {
      throw new AppError('Unauthorized', 401);
    }

    if (pricePerKg === undefined || maxKg === undefined) {
      throw new AppError('pricePerKg and maxKg are required', 400);
    }

    const listing = await vendorListingService.upsertListing(
      vendorId,
      Number(pricePerKg),
      Number(maxKg)
    );

    res.status(200).json({
      status: 'success',
      data: { listing },
    });
  };

  public getListing = async (req: Request, res: Response) => {
    // If a vendorId is passed in params, get that specific vendor's listing
    // Otherwise, get the authenticated vendor's listing
    const vendorId = req.params.vendorId || req.user?.id;

    if (!vendorId) {
      throw new AppError('Vendor ID is required to fetch listing', 400);
    }

    const listing = await vendorListingService.getListing(vendorId);

    res.status(200).json({
      status: 'success',
      data: { listing },
    });
  };
}

export const vendorListingController = new VendorListingController();
