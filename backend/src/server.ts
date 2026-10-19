import express from 'express'
import dotenv from 'dotenv'
import { corsConfig } from './middleware/corsConfig.js';
import { config } from './config/index.js';
import { fileURLToPath } from 'url'
import route from './routes/routes.js';
import { predictionJob } from './jobs/predictionJob.js';
import { payoutJob } from './jobs/payoutJob.js';
import createRoutesRouter from './routes/listRoutes.js';
import ipTracker from './utils/ipTracker.js';
import httpLogger from './utils/httpLogger.js';
import { generalLimiter, } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
// dotenv.config() is now handled by src/config/index.ts
dotenv.config()


const app = express()
app.set('trust proxy', 1);

app.use(corsConfig)
app.use(express.json())

app.use(ipTracker)
app.use(httpLogger)
app.use(generalLimiter);

// Multer setup for in-memory file storage
//const storage = multer.memoryStorage();
//const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.send('FLAMEIQ backend running')
})

 app.use('/', route)

// --- Developer Route Listing (must be last to see all routes) ---
app.use('/routes', createRoutesRouter(app));

// --- Global Error Handler (must be the last middleware) ---
app.use(errorHandler);

const PORT = config.port;

const isDirectRun =
  !process.argv[1] ||
  process.argv[1].toLowerCase() === fileURLToPath(import.meta.url).toLowerCase() ||
  process.argv[1].endsWith('server.ts') ||
  process.argv[1].endsWith('server.js');

if (isDirectRun) {
  // Initialize background jobs
  if (config.enablePredictionJob) predictionJob.start();
  if (config.enablePayoutJob) payoutJob.start(); // Start the new payout job

  setTimeout(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  }, 0);
}

export default app
