import { Router } from 'express';
import { authenticate, authorizeVendor } from '../controllers/authControl.js';
import { getPayoutHistory } from '../controllers/payoutController.js';

const router = Router();

router.get('/history', authenticate, authorizeVendor, getPayoutHistory);

export default router;