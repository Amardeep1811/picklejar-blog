import crypto from 'crypto';
import Post from '../models/Post.js';
import PostView from '../models/PostView.js';
import asyncHandler from '../utils/asyncHandler.js';

const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const getPosts = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.editorsPick !== undefined) {
    filter.editorsPick = req.query.editorsPick === 'true';
  }
  if (req.query.status !== undefined) {
    filter.status = req.query.status;
  }
  if (req.query.vertical !== undefined) {
    filter.vertical = req.query.vertical;
  }
  
  let query = Post.find(filter).sort({ createdAt: -1 }).populate('vertical', 'name slug');
  
  if (req.query.limit) {
    query = query.limit(parseInt(req.query.limit, 10));
  }
  if (req.query.skip) {
    query = query.skip(parseInt(req.query.skip, 10));
  }
  
  const posts = await query;
  res.status(200).json({ success: true, data: posts });
});

export const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug }).populate('vertical', 'name slug');
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  
  // Track view asynchronously on GET /api/posts/:slug with IP hashing and 24h deduplication
  const rawIp = req.ip || '';
  const salt = process.env.IP_SALT || 'picklejar-ip-salt';
  const ipHash = crypto.createHmac('sha256', salt).update(rawIp).digest('hex');
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  PostView.findOne({
    post: post._id,
    ipHash,
    timestamp: { $gte: oneDayAgo }
  }).then(existingView => {
    if (!existingView) {
      return PostView.create({ post: post._id, ipHash });
    }
  }).catch(err => {
    console.error('Failed to log post view:', err);
  });

  res.status(200).json({ success: true, data: post });
});

export const createPost = asyncHandler(async (req, res) => {
  const post = await Post.create(req.body);
  if (process.env.NODE_ENV !== 'production') {
    console.log('--- DB WRITE: createPost ---', {
      id: post._id,
      title: post.title,
      slug: post.slug,
      db: post.collection.dbName,
      collection: post.collection.name
    });
  }
  res.status(201).json({ success: true, message: 'Post created', data: post });
});

export const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  
  Object.assign(post, req.body);
  const updatedPost = await post.save();
  
  res.status(200).json({ success: true, message: 'Post updated', data: updatedPost });
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  await post.deleteOne();
  res.status(200).json({ success: true, message: 'Post deleted' });
});

export const searchPosts = asyncHandler(async (req, res) => {
  const { q, vertical, timeRange, limit = 10, skip = 0 } = req.query;
  const filter = { status: 'published' };
  
  if (q) {
    const escapedQ = escapeRegex(q);
    const mongoose = (await import('mongoose')).default;
    const matchedVerticals = await mongoose.model('Vertical').find({ name: { $regex: escapedQ, $options: 'i' } });
    const verticalIds = matchedVerticals.map(v => v._id);
    
    filter.$or = [
      { title: { $regex: escapedQ, $options: 'i' } },
      { vertical: { $in: verticalIds } }
    ];
  }
  
  if (vertical && vertical !== 'all') {
    filter.vertical = vertical;
  }
  
  if (timeRange && timeRange !== 'any') {
    const now = new Date();
    let startDate;
    if (timeRange === '24h') {
      startDate = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    } else if (timeRange === 'week') {
      startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    } else if (timeRange === 'month') {
      startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    }
    
    if (startDate) {
      filter.publishDate = { $gte: startDate };
    }
  }
  
  const posts = await Post.find(filter)
    .sort({ publishDate: -1, createdAt: -1 })
    .skip(parseInt(skip, 10))
    .limit(parseInt(limit, 10))
    .populate('vertical', 'name slug');
    
  res.status(200).json({ success: true, data: posts });
});