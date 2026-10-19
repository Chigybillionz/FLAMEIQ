import cors from 'cors';
import { config } from '../config/index.js';

const mobileSchemes = [
  'http://localhost',
  'capacitor://localhost',
];

const allowedOrigins = Array.from(new Set([...config.frontendOrigins, ...mobileSchemes]));

export const corsConfig = cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile native apps, Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow Vercel preview deployments in non-production environments
    if (config.env !== 'production' && origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    return callback(new Error(`CORS policy violation: ${origin} is not allowed`));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
});