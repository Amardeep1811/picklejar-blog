import mongoose from 'mongoose';
import PostView from '../models/PostView.js';
import Post from '../models/Post.js';
import TrendingSnapshot from '../models/TrendingSnapshot.js';

export const computeTrending = async () => {
  try {
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

    // Aggregate views
    const trendingViews = await PostView.aggregate([
      { $match: { timestamp: { $gte: fortyEightHoursAgo } } },
      { $group: { _id: '$post', viewCount: { $sum: 1 } } },
      { $sort: { viewCount: -1 } },
      { $limit: 10 } // Get more in case some are deleted
    ]);

    let trendingPostIds = [];
    
    // Verify posts still exist
    if (trendingViews.length > 0) {
      const viewIds = trendingViews.map(tv => tv._id);
      const existingPosts = await Post.find({ _id: { $in: viewIds }, status: 'published' }).select('_id');
      const existingPostIdsStr = existingPosts.map(p => p._id.toString());
      
      // Preserve the sorted order from aggregation
      for (const tv of trendingViews) {
        if (existingPostIdsStr.includes(tv._id.toString())) {
          trendingPostIds.push(tv._id);
          if (trendingPostIds.length === 3) break;
        }
      }
    }

    // If less than 3, fallback to newest published posts
    if (trendingPostIds.length < 3) {
      const remainingSlots = 3 - trendingPostIds.length;
      
      const fallbackPosts = await Post.find({
        status: 'published',
        _id: { $nin: trendingPostIds }
      })
      .sort({ publishDate: -1, createdAt: -1 })
      .limit(remainingSlots)
      .select('_id');

      trendingPostIds = [...trendingPostIds, ...fallbackPosts.map(p => p._id)];
    }

    // Save snapshot
    const snapshot = await TrendingSnapshot.create({
      posts: trendingPostIds,
      computedAt: new Date()
    });

    console.log(`[Trending] Computed snapshot with ${trendingPostIds.length} posts`);

    // Return populated snapshot for immediate use if needed
    return await TrendingSnapshot.findById(snapshot._id).populate({
      path: 'posts',
      populate: { path: 'vertical', select: 'name slug' }
    });

  } catch (error) {
    console.error('[Trending] Failed to compute trending snapshot:', error);
    throw error;
  }
};
