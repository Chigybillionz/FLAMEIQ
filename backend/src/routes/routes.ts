import { notificationService } from '../services/notificationService.js'
import { authLimiter } from '../middleware/rateLimiter.js';
import { authenticate, authorizeAdmin, deleteSelf, deleteUsers, flagVendor, forgotPassword, getMe, getTotalProfit, getUsers, resendOtp, resetPassword, signIn, signUp, updateProfile, verifyOtp } from '../controllers/authControl.js';
import { uploadProfilePicture } from '../controllers/uploadController.js';
import { encryptionController } from '../controllers/encryptionController.js';
import orderRoutes from '../routes/orderRoutes.js';
import paymentRoutes from '../routes/paymentRoutes.js';
import payoutRoutes from '../routes/payoutRoutes.js';
import cylinderRoutes from '../routes/cylinderRoutes.js';
import reviewRoutes from '../routes/reviewRoutes.js';
import {aiService} from '../services/aiService.js';
import { Router } from 'express';
import multer from 'multer';
// Multer setup for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const route = Router();

// Auth routes
route.post('/api/auth/signup', authLimiter, signUp);
route.post('/api/auth/verify-otp', authLimiter, verifyOtp);
route.post('/api/auth/resendOtp', authLimiter, resendOtp);
route.post('/api/auth/signin', authLimiter, signIn);
route.post('/api/auth/login', authLimiter, signIn);
route.post('/api/auth/forgot-password', authLimiter, forgotPassword);
route.post('/api/auth/reset-password', authLimiter, resetPassword);
route.put('/api/auth/profile', authenticate, updateProfile);
route.patch('/api/auth/profile', authenticate, updateProfile);
route.post('/api/auth/profile/picture', authenticate, upload.single('profileImage'), uploadProfilePicture);
route.get('/api/me', authenticate, getMe);
route.delete('/api/auth/me', authenticate, deleteSelf);

// Admin routes
route.get('/api/users', authenticate, authorizeAdmin, getUsers);
route.get('/api/profit', authenticate, authorizeAdmin, getTotalProfit);
route.delete('/api/users/:id', authenticate, authorizeAdmin, deleteUsers);
route.patch('/api/users/:id/flag', authenticate, authorizeAdmin, flagVendor);
route.get('/api/admin/profit', authenticate, authorizeAdmin, getTotalProfit);
// Order routes
route.use('/api/orders', orderRoutes);
// Cylinder Routes 
route.use('/api/cylinders', cylinderRoutes);
//  Review Routes 
route.use('/api/reviews', reviewRoutes);

//  Prediction Routes 
route.post('/api/predictions', authenticate, aiService.getRefillPrediction);
route.post('/api/chat', authenticate, aiService.getChatReply);
// Payout Routes

route.use('/api/payouts', payoutRoutes);
// Payment Routes (initiate, verify, wallet, webhook)
route.use('/api/payments', paymentRoutes);

// Encryption Route 
route.post('/api/encrypt', encryptionController.encryptPayload);

// Real-time Notifications (Server-Sent Events) (SSE) This needs update
route.get('/api/notifications/stream', authenticate, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable Nginx buffering
  res.flushHeaders();

  const userId = req.user!.id;
  notificationService.addClient(res, userId);

  // Send a heartbeat every 30s to keep the connection alive
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 30000);

  res.on('close', () => clearInterval(heartbeat));
});

// GET /api/notifications — fetch persisted notifications for the user
route.get('/api/notifications', authenticate, async (req, res) => {
  try {
    const { prisma } = await import('../db/prisma.js');
    const userId = req.user!.id;
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return res.json({ success: true, data: notifications });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to fetch notifications.' });
  }
});

// PATCH /api/notifications/:id/read — mark a notification as read
route.patch('/api/notifications/:id/read', authenticate, async (req, res) => {
  try {
    const { prisma } = await import('../db/prisma.js');
    const { id } = req.params;
    await prisma.notification.update({ where: { id }, data: { isRead: true } });
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to mark notification as read.' });
  }
});
export default route;