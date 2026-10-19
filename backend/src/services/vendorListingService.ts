import { VendorListing, Prisma } from '../generated/prisma/client.js';
import { prisma } from '../db/prisma.js';
import { BadRequestError, AppError } from '../utils/errors.js';

class VendorListingNotFoundError extends AppError {
  constructor(message = 'Vendor listing not found.') {
    super(message, 404);
  }
}

class VendorListingService {
  /**
   * Create or update the vendor listing. A vendor can only have one listing.
   */
  public async upsertListing(
    vendorId: string,
    pricePerKg: number,
    maxKg: number
  ): Promise<VendorListing> {
    if (!vendorId) {
      throw new BadRequestError('Vendor ID is required.');
    }
    if (pricePerKg <= 0) {
      throw new BadRequestError('Price per kg must be a positive number.');
    }
    if (maxKg <= 0) {
      throw new BadRequestError('Maximum kg must be a positive number.');
    }

    // Ensure 1 decimal place max for maxKg
    const roundedMaxKg = Math.round(maxKg * 10) / 10;
    const roundedPrice = Math.round(pricePerKg * 100) / 100;

    return prisma.vendorListing.upsert({
      where: { vendorId },
      update: {
        pricePerKg: new Prisma.Decimal(roundedPrice),
        maxKg: new Prisma.Decimal(roundedMaxKg),
      },
      create: {
        vendorId,
        pricePerKg: new Prisma.Decimal(roundedPrice),
        maxKg: new Prisma.Decimal(roundedMaxKg),
      },
    });
  }

  /**
   * Get the listing for a specific vendor.
   */
  public async getListing(vendorId: string): Promise<VendorListing> {
    if (!vendorId) {
      throw new BadRequestError('Vendor ID is required.');
    }
    
    const listing = await prisma.vendorListing.findUnique({
      where: { vendorId },
    });

    if (!listing) {
      throw new VendorListingNotFoundError();
    }

    return listing;
  }
}

export const vendorListingService = new VendorListingService();
