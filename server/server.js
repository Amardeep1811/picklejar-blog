import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import verticalRoutes from './routes/verticalRoutes.js';
import postRoutes from './routes/postRoutes.js';
import adRoutes from './routes/adRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import petitionRoutes from './routes/petitionRoutes.js';
import trendingRoutes from './routes/trendingRoutes.js';
import homeRoutes from './routes/homeRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { initTrendingJob } from './jobs/trendingJob.js';
import { initExpiredAdsJob } from './jobs/expiredAdsJob.js';
import { initKeepAliveJob } from './jobs/keepAliveJob.js';

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

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`[TIMING] ${req.method} ${req.originalUrl} - ${Date.now() - start}ms`);
  });
  next();
});

// Basic Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://apis.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://*.placeholder.com"],
      connectSrc: ["'self'", "https://api.cloudinary.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Body and Cookie Parsers BEFORE Mongo Sanitize
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

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
app.use('/api/home', homeRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initTrendingJob();
  initExpiredAdsJob();
  initKeepAliveJob();
});