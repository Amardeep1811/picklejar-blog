import asyncHandler from '../utils/asyncHandler.js';
import Post from '../models/Post.js';
import Vertical from '../models/Vertical.js';
import TrendingSnapshot from '../models/TrendingSnapshot.js';
import Petition from '../models/Petition.js';
import Ad from '../models/Ad.js';
import { getCached, setCached } from '../utils/simpleCache.js';

export const getHomeData = asyncHandler(async (req, res) => {
  const cacheKey = 'home_data';
  const cachedData = getCached(cacheKey);
  
  if (cachedData) {
    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.status(200).json({ success: true, data: cachedData });
  }

  // 1. Trending Snapshot
  const trendingPromise = TrendingSnapshot.findOne()
    .sort({ computedAt: -1 })
    .populate({
      path: 'posts',
      populate: { path: 'vertical', select: 'name slug' }
    }).lean();

  // 2. Verticals (Featured + Sports)
  const verticalsPromise = Vertical.find({ active: true }).sort({ featuredOrder: 1, createdAt: -1 }).lean();

  // 3. Petitions for Sports Section
  const petitionsPromise = Petition.find({ active: true }).sort({ createdAt: -1 }).limit(5).lean();

  // 4. Ads
  const sidebarAdPromise = Ad.find({ placement: 'sidebar', active: true }).sort({ createdAt: -1 }).limit(1).lean();
  const dividerAdPromise = Ad.find({ placement: 'section-divider', active: true }).sort({ createdAt: -1 }).limit(1).lean();

  // 5. Initial published posts (excluding trending, to fetch moreStories)
  // We fetch a batch, but we can't filter out trending until trending resolves.
  // We'll fetch 15 latest posts.
  const latestPostsPromise = Post.find({ status: 'published' })
    .sort({ createdAt: -1 })
    .limit(15)
    .populate('vertical', 'name slug')
    .select('title slug excerpt bannerImage vertical publishDate status editorsPick')
    .lean();

  const [trendingSnap, allVerticals, sportsPetitions, sidebarAd, dividerAd, latestPosts] = await Promise.all([
    trendingPromise,
    verticalsPromise,
    petitionsPromise,
    sidebarAdPromise,
    dividerAdPromise,
    latestPostsPromise
  ]);

  const trendingPosts = trendingSnap ? trendingSnap.posts : [];
  const trendingIds = trendingPosts.map(p => p._id.toString());

  const moreStories = latestPosts
    .filter(p => !trendingIds.includes(p._id.toString()))
    .slice(0, 7);

  // Extract featured verticals and sports vertical
  const featuredVerticals = allVerticals.filter(v => v.featured);
  const sportsVertical = allVerticals.find(v => v.slug === 'sports');
  const targetVertA = featuredVerticals.find(v => v.featuredOrder === 3) || null;
  const targetVertB = featuredVerticals.find(v => v.featuredOrder === 4) || null;
  const targetHeroVert = featuredVerticals.find(v => v.featuredOrder === 1) || featuredVerticals[0] || null;
  const targetVertSec = featuredVerticals.find(v => v.featuredOrder === 2) || (featuredVerticals.length > 1 ? featuredVerticals[1] : featuredVerticals[0]) || null;

  // Fetch posts for verticals
  const postPromises = [];
  if (targetHeroVert) {
    postPromises.push(Post.find({ status: 'published', vertical: targetHeroVert._id }).sort({ createdAt: -1 }).limit(9).populate('vertical', 'name slug').select('title slug excerpt bannerImage vertical publishDate status editorsPick').lean());
  } else postPromises.push(Promise.resolve([]));

  if (targetVertSec) {
    postPromises.push(Post.find({ status: 'published', vertical: targetVertSec._id }).sort({ createdAt: -1 }).limit(7).populate('vertical', 'name slug').select('title slug excerpt bannerImage vertical publishDate status editorsPick').lean());
  } else postPromises.push(Promise.resolve([]));

  if (targetVertA) {
    postPromises.push(Post.find({ status: 'published', vertical: targetVertA._id }).sort({ createdAt: -1 }).limit(4).populate('vertical', 'name slug').select('title slug excerpt bannerImage vertical publishDate status editorsPick').lean());
  } else postPromises.push(Promise.resolve([]));

  if (targetVertB) {
    postPromises.push(Post.find({ status: 'published', vertical: targetVertB._id }).sort({ createdAt: -1 }).limit(3).populate('vertical', 'name slug').select('title slug excerpt bannerImage vertical publishDate status editorsPick').lean());
  } else postPromises.push(Promise.resolve([]));

  if (sportsVertical) {
    postPromises.push(Post.find({ status: 'published', vertical: sportsVertical._id }).sort({ createdAt: -1 }).limit(7).populate('vertical', 'name slug').select('title slug excerpt bannerImage vertical publishDate status editorsPick').lean());
  } else postPromises.push(Promise.resolve([]));

  const [heroPosts, vertSecPosts, vertAPosts, vertBPosts, sportsPosts] = await Promise.all(postPromises);

  const responseData = {
    trending: trendingPosts,
    moreStories,
    heroVertical: targetHeroVert ? { vertical: targetHeroVert, posts: heroPosts } : null,
    featuredVertical: targetVertSec ? { vertical: targetVertSec, posts: vertSecPosts } : null,
    featuredVertA: targetVertA ? { vertical: targetVertA, posts: vertAPosts } : null,
    featuredVertB: targetVertB ? { vertical: targetVertB, posts: vertBPosts } : null,
    sports: sportsVertical ? { vertical: sportsVertical, posts: sportsPosts, petitions: sportsPetitions } : null,
    ads: {
      sidebar: sidebarAd.length ? sidebarAd[0] : null,
      sectionDivider: dividerAd.length ? dividerAd[0] : null
    }
  };

  setCached(cacheKey, responseData, 300);
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.status(200).json({
    success: true,
    data: responseData
  });
});
