import asyncHandler from '../utils/asyncHandler.js';
import TrendingSnapshot from '../models/TrendingSnapshot.js';
import { computeTrending } from '../utils/computeTrending.js';

export const getLatestTrending = asyncHandler(async (req, res) => {
  const snapshot = await TrendingSnapshot.findOne()
    .sort({ computedAt: -1 })
    .populate({
      path: 'posts',
      populate: { path: 'vertical', select: 'name slug' }
    }).lean();

  if (!snapshot) {
    return res.status(200).json({ success: true, data: [] });
  }

  res.status(200).json({ success: true, data: snapshot.posts });
});

export const recomputeTrending = asyncHandler(async (req, res) => {
  const snapshot = await computeTrending();
  res.status(200).json({ success: true, message: 'Trending recomputed manually', data: snapshot.posts });
});
