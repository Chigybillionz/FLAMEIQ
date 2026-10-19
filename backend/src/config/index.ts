import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// Define schema for environment variables
const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  API_BASE_URL: z.string().url().default('http://localhost:3000'),
  AI_API_BASE_URL: z.string().url().optional(),

  // Frontend Origins
  FRONTEND_URLS: z.string().optional(),
  FRONTEND_URL: z.string().optional(),

  // Flutterwave Settings (Required for payments)
  FLUTTER_KEY: z.string().min(1, 'FLUTTER_KEY is required'),
  FLUTTERWAVE_SECRET_HASH: z.string().min(1, 'FLUTTERWAVE_SECRET_HASH is required'),
  FLUTTERWAVE_PUBLIC_KEY: z.string().min(1, 'FLUTTERWAVE_PUBLIC_KEY is required'),
  FLUTTERWAVE_ENCRYPTION_KEY: z.string().optional(),
  FLUTTERWAVE_CLIENT_ID: z.string().optional(),
  FLUTTERWAVE_CLIENT_SECRET: z.string().optional(),
  FLUTTERWAVE_BASE_URL: z.string().url().default('https://developersandbox-api.flutterwave.com'),

  // Platform
  PLATFORM_COMMISSION_RATE: z.coerce.number().default(0.10),

  // Job Toggles (Coerce 'true'/'false' strings to boolean)
  ENABLE_PREDICTION_JOB: z.string().optional().transform((val) => val === 'true'),
  ENABLE_PAYOUT_JOB: z.string().optional().transform((val) => val === 'true'),

  // Email Service (Required for notifications)
  SENDLIB_API_KEY: z.string().min(1, 'SENDLIB_API_KEY is required'),
  SENDLIB_FROM_EMAIL: z.string().email('SENDLIB_FROM_EMAIL must be a valid email address'),
});

// Run validation
const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Environment Variable Validation Failure:');
    console.error(JSON.stringify(result.error.format(), null, 2));
    process.exit(1); // Stop server immediately on missing config
  }

  return result.data;
};

const env = parseEnv();

// Parse frontend origins array
const rawOrigins = env.FRONTEND_URLS || env.FRONTEND_URL || 'http://localhost:3000';
const frontendOrigins = rawOrigins
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const config = {
  port: env.PORT,
  env: env.NODE_ENV,
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
  apiBaseUrl: env.API_BASE_URL,
  aiApiBaseUrl: env.AI_API_BASE_URL,
  frontendOrigins,

  flutterwaveSecretKey: env.FLUTTER_KEY,
  flutterwaveSecretHash: env.FLUTTERWAVE_SECRET_HASH,
  flutterwavePublicKey: env.FLUTTERWAVE_PUBLIC_KEY,
  flutterwaveEncryptionKey: env.FLUTTERWAVE_ENCRYPTION_KEY,
  flutterwaveClientId: env.FLUTTERWAVE_CLIENT_ID,
  flutterwaveClientSecret: env.FLUTTERWAVE_CLIENT_SECRET,
  flutterwaveBaseUrl: env.FLUTTERWAVE_BASE_URL,

  platformCommissionRate: env.PLATFORM_COMMISSION_RATE,

  enablePredictionJob: env.ENABLE_PREDICTION_JOB,
  enablePayoutJob: env.ENABLE_PAYOUT_JOB,

  sendlibApiKey: env.SENDLIB_API_KEY,
  sendlibFromEmail: env.SENDLIB_FROM_EMAIL,
};