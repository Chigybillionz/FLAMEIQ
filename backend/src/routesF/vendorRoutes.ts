import { Router } from 'express';
import { vendorListingController } from '../controllers/vendorListingController.js';
import { authenticate } from '../controllers/authControl.js';

const router = Router();

// Create or update a vendor listing (requires authentication as a vendor)
// Note: You may want to add `authorizeVendor` middleware if it exists.
router.put('/listing', authenticate, vendorListingController.upsertListing);

// Get the authenticated vendor's listing
router.get('/listing', authenticate, vendorListingController.getListing);

// Get a specific vendor's listing by ID
router.get('/:vendorId/listing', authenticate, vendorListingController.getListing);

export default router;
