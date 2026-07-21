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
  console.log('--- DB WRITE: createAd ---', {
    id: ad._id,
    type: ad.type,
    db: ad.collection.dbName,
    collection: ad.collection.name
  });
  res.status(201).json({ success: true, message: 'Ad created', data: ad });
});