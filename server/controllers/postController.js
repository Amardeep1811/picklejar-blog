import Post from '../models/Post.js';
import PostView from '../models/PostView.js';
import asyncHandler from '../utils/asyncHandler.js';

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
  
  const posts = await query;
  res.status(200).json({ success: true, data: posts });
});

export const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug }).populate('vertical', 'name slug');
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  
  // Track view asynchronously so we don't block the response
  PostView.create({ post: post._id, ipHash: req.ip }).catch(err => {
    console.error('Failed to log post view:', err);
  });

  res.status(200).json({ success: true, data: post });
});

export const createPost = asyncHandler(async (req, res) => {
  const post = await Post.create(req.body);
  console.log('--- DB WRITE: createPost ---', {
    id: post._id,
    title: post.title,
    slug: post.slug,
    db: post.collection.dbName,
    collection: post.collection.name
  });
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