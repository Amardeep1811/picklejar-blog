import Vertical from '../models/Vertical.js';
import asyncHandler from '../utils/asyncHandler.js';
import slugify from 'slugify';

export const getFeaturedVerticals = asyncHandler(async (req, res) => {
  const verticals = await Vertical.find({ active: true, featured: true }).limit(4).sort({ featuredOrder: 1, createdAt: -1 });
  res.status(200).json({ success: true, data: verticals });
});

export const getVerticals = asyncHandler(async (req, res) => {
  const verticals = await Vertical.find({}).sort({ featuredOrder: 1, createdAt: -1 });
  res.status(200).json({ success: true, data: verticals });
});

export const createVertical = asyncHandler(async (req, res) => {
  const { name, active, featured, featuredOrder } = req.body;

  const orderToUse = featuredOrder ? Number(featuredOrder) : 1;

  if (featured) {
    const featuredCount = await Vertical.countDocuments({ featured: true });
    if (featuredCount >= 4) {
      res.status(400);
      throw new Error('Only 4 verticals can be featured at once — unfeature one first');
    }

    const existingFeatured = await Vertical.findOne({ featured: true, featuredOrder: orderToUse });
    if (existingFeatured) {
      res.status(400);
      throw new Error(`Another vertical is already featured at priority ${orderToUse}. Please pick a different priority or change the other vertical first.`);
    }
  }

  const vertical = await Vertical.create({ name, active, featured, featuredOrder: orderToUse });
  console.log('--- DB WRITE: createVertical ---', {
    id: vertical._id,
    name: vertical.name,
    slug: vertical.slug,
    db: vertical.collection.dbName,
    collection: vertical.collection.name
  });
  res.status(201).json({ success: true, message: 'Vertical created', data: vertical });
});

export const updateVertical = asyncHandler(async (req, res) => {
  const { name, active, featured, featuredOrder } = req.body;
  const vertical = await Vertical.findById(req.params.id);
  if (!vertical) {
    res.status(404);
    throw new Error('Vertical not found');
  }
  
  const willBeFeatured = featured !== undefined ? featured : vertical.featured;
  const newFeaturedOrder = featuredOrder !== undefined ? Number(featuredOrder) : vertical.featuredOrder;
  const prevFeatured = vertical.featured;
  const prevFeaturedOrder = vertical.featuredOrder;

  let swapVertical = null;

  if (willBeFeatured && newFeaturedOrder) {
    swapVertical = await Vertical.findOne({ featured: true, featuredOrder: newFeaturedOrder, _id: { $ne: req.params.id } });
  }

  if (name && name !== vertical.name) {
    vertical.name = name;
    vertical.slug = slugify(name, { lower: true, strict: true });
  }
  
  if (active !== undefined) {
    vertical.active = active;
  }
  
  if (featured !== undefined) {
    if (featured && !prevFeatured) {
      const featuredCount = await Vertical.countDocuments({ featured: true });
      if (featuredCount >= 4 && !swapVertical) {
        res.status(400);
        throw new Error('Only 4 verticals can be featured at once — unfeature one first');
      }
    }
    vertical.featured = featured;
  }

  if (featuredOrder !== undefined) {
    vertical.featuredOrder = Number(featuredOrder);
  }
  
  if (swapVertical) {
    if (prevFeatured && prevFeaturedOrder) {
      swapVertical.featuredOrder = prevFeaturedOrder;
    } else {
      swapVertical.featured = false;
      swapVertical.featuredOrder = null;
    }
    await swapVertical.save();
  }
  
  const updatedVertical = await vertical.save();
  res.status(200).json({ success: true, message: 'Vertical updated', data: updatedVertical });
});

export const deleteVertical = asyncHandler(async (req, res) => {
  const vertical = await Vertical.findById(req.params.id);
  if (!vertical) {
    res.status(404);
    throw new Error('Vertical not found');
  }
  await vertical.deleteOne();
  res.status(200).json({ success: true, message: 'Vertical deleted' });
});