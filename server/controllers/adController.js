import Ad from '../models/Ad.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAds = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.placement) {
    filter.placement = req.query.placement;
  }
  if (req.query.type) {
    filter.type = req.query.type;
  }
  if (req.query.active !== undefined) {
    filter.active = req.query.active === 'true';
  }

  let query = Ad.find(filter).sort({ createdAt: -1 });
  
  if (req.query.limit) {
    query = query.limit(parseInt(req.query.limit, 10));
  }
  
  const ads = await query;
  res.status(200).json({ success: true, data: ads });
});

export const createAd = asyncHandler(async (req, res) => {
  const ad = await Ad.create(req.body);
  if (process.env.NODE_ENV !== 'production') {
    console.log('--- DB WRITE: createAd ---', {
      id: ad._id,
      type: ad.type,
      db: ad.collection.dbName,
      collection: ad.collection.name
    });
  }
  res.status(201).json({ success: true, message: 'Ad created', data: ad });
});

export const updateAd = asyncHandler(async (req, res) => {
  let ad = await Ad.findById(req.params.id);
  if (!ad) {
    res.status(404);
    throw new Error('Ad not found');
  }
  Object.assign(ad, req.body);
  const updatedAd = await ad.save();
  res.status(200).json({ success: true, data: updatedAd });
});

export const deleteAd = asyncHandler(async (req, res) => {
  const ad = await Ad.findById(req.params.id);
  if (!ad) {
    res.status(404);
    throw new Error('Ad not found');
  }
  await ad.deleteOne();
  res.status(200).json({ success: true, message: 'Ad removed' });
});

export const getInArticleAds = asyncHandler(async (req, res) => {
  const { vertical, postId } = req.query;
  const now = new Date();
  
  const filter = {
    placement: 'in-article',
    active: true,
    targetVertical: vertical === 'null' ? null : vertical,
    $and: [
      { $or: [{ startDate: null }, { startDate: { $exists: false } }, { startDate: { $lte: now } }] },
      { $or: [{ endDate: null }, { endDate: { $exists: false } }, { endDate: { $gt: now } }] }
    ]
  };

  const ads = await Ad.find(filter).sort({ createdAt: 1 });
  
  if (ads.length === 0) {
    return res.status(200).json({ success: true, data: [] });
  }
  
  if (ads.length === 1) {
    return res.status(200).json({ success: true, data: [ads[0], ads[0]] });
  }
  
  let hash = 0;
  if (postId) {
    for (let i = 0; i < postId.length; i++) {
      hash = (hash << 5) - hash + postId.charCodeAt(i);
      hash |= 0;
    }
  }
  hash = Math.abs(hash);
  
  const startIndex = hash % ads.length;
  res.status(200).json({ 
    success: true, 
    data: [ads[startIndex], ads[(startIndex + 1) % ads.length]] 
  });
});