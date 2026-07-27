import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import verticalRoutes from './routes/verticalRoutes.js';
import postRoutes from './routes/postRoutes.js';
import adRoutes from './routes/adRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import petitionRoutes from './routes/petitionRoutes.js';
import trendingRoutes from './routes/trendingRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { initTrendingJob } from './jobs/trendingJob.js';
import { initExpiredAdsJob } from './jobs/expiredAdsJob.js';

// Startup env check
const requiredEnv = ['JWT_SECRET', 'MONGO_URI', 'CLIENT_URL'];
const missingEnv = requiredEnv.filter(key => {
  if (key === 'MONGO_URI') return !process.env.MONGO_URI && !process.env.MONGODB_URI;
  return !process.env[key];
});

if (missingEnv.length > 0) {
  console.error(`FATAL ERROR: Missing required environment variable(s): ${missingEnv.join(', ')}`);
  process.exit(1);
}

connectDB();
const app = express();

// Trust proxy settings (Render reverse proxy)
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Body and Cookie Parsers BEFORE Mongo Sanitize
app.use(express.json());
app.use(cookieParser());

// Mongo Sanitization
app.use((req, res, next) => {
  req.body = mongoSanitize.sanitize(req.body);
  req.params = mongoSanitize.sanitize(req.params);
  
  Object.defineProperty(req, 'query', {
    value: mongoSanitize.sanitize(req.query),
    configurable: true,
    enumerable: true,
    writable: true
  });
  next();
});

// Health check endpoint (placed before rate limiters)
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  const statusCode = isConnected ? 200 : 503;
  res.status(statusCode).json({
    success: isConnected,
    status: isConnected ? 'ok' : 'degraded',
    db: isConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/verticals', verticalRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/petitions', petitionRoutes);
app.use('/api/trending', trendingRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initTrendingJob();
  initExpiredAdsJob();
});