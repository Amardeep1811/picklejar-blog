import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
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

connectDB();
const app = express();
app.use(helmet());
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

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Increased limit just in case
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api/auth', limiter);
app.use(express.json());
app.use(cookieParser());

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