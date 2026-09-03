import { Request, Response } from 'express';
import { aiService } from '../services/aiService.js';
import { AppError } from '../utils/errors.js';

export const chat = async (req: Request, res: Response) => {
  const { message, history } = req.body;
  
  if (!message) {
    throw new AppError('Message is required', 400);
  }

  // Optional: Fetch user's profile to inject context
  let profileData = {};
  if (req.user && req.user.profile) {
    profileData = {
      name: req.user.name,
      address: req.user.profile.address,
      household_size: (req.user?.profile as any)?.household_size,
      cooking_frequency: (req.user?.profile as any)?.cooking_frequency,
    };
  }

  const result = await aiService.getChatReply({
    user_message: message,
    conversation_history: history || [],
    household_profile: profileData
  });

  res.status(200).json({
    success: true,
    data: result
  });
};
