import { Router } from 'express';
import { authenticate } from '../controllers/authControl.js';
import { createReview, getallReview, getReview } from '../controllers/reviewController.js';

const router = Router();

router.get('/', getallReview);
router.get('/:id', getReview);
// All review routes require authentication
router.post('/', authenticate, createReview);

export default router;
