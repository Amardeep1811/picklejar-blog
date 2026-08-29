import crypto from 'crypto';
import Post from '../models/Post.js';
import PostView from '../models/PostView.js';
import asyncHandler from '../utils/asyncHandler.js';
import { getCached, setCached } from '../utils/simpleCache.js';

const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const getPosts = asyncHandler(async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const filter = {};

  const isStaff = req.user && ['admin', 'editor'].includes(req.user.role);

  if (isStaff && req.query.status !== undefined) {
    filter.status = req.query.status;
  } else {
    filter.status = 'published';
  }

  if (req.query.editorsPick !== undefined) {
    filter.editorsPick = req.query.editorsPick === 'true';
  }
  if (req.query.vertical !== undefined) {
    filter.vertical = req.query.vertical;
  }

  let query = Post.find(filter)
    .sort({ createdAt: -1 })
    .populate('vertical', 'name slug')
    .select('title slug excerpt bannerImage vertical publishDate status editorsPick adSlot1 adSlot2')
    .lean();

  if (req.query.limit) query = query.limit(parseInt(req.query.limit, 10));
  if (req.query.skip) query = query.skip(parseInt(req.query.skip, 10));

  const posts = await query;
  res.status(200).json({ success: true, data: posts });
});

export const getPost = asyncHandler(async (req, res) => {
  const cacheKey = `post_${req.params.slug}`;
  const isStaff = req.user && ['admin', 'editor'].includes(req.user.role);

  if (!isStaff) {
    const cachedData = getCached(cacheKey);
    
    if (cachedData) {
      // Still track views on cache hit
      const rawIp = req.ip || '';
      const salt = process.env.IP_SALT || 'picklejar-ip-salt';
      const ipHash = crypto.createHmac('sha256', salt).update(rawIp).digest('hex');
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      PostView.findOne({ post: cachedData._id, ipHash, timestamp: { $gte: oneDayAgo } })
        .then(existingView => {
          if (!existingView) PostView.create({ post: cachedData._id, ipHash });
        }).catch(err => console.error('Failed to log post view:', err));

      res.setHeader('Cache-Control', 'public, max-age=60');
      return res.status(200).json({ success: true, data: cachedData });
    }
  }

  const post = await Post.findOne({ slug: req.params.slug }).populate('vertical', 'name slug').populate('adSlot1').populate('adSlot2').lean();
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  if (post.status !== 'published' && !isStaff) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Fetch related posts (same vertical, excluding this post)
  let relatedPosts = [];
  let inArticleAds = [];
  
  if (post.vertical) {
    const relatedPromise = Post.find({
      status: 'published',
      vertical: post.vertical._id,
      _id: { $ne: post._id }
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('vertical', 'name slug')
      .select('title slug excerpt bannerImage vertical publishDate status editorsPick')
      .lean();

    // Fetch in-article ads for this vertical
    const now = new Date();
    const adFilter = {
      placement: 'in-article',
      active: true,
      targetVertical: { $in: [null, post.vertical._id] },
      $and: [
        { $or: [{ startDate: null }, { startDate: { $exists: false } }, { startDate: { $lte: now } }] },
        { $or: [{ endDate: null }, { endDate: { $exists: false } }, { endDate: { $gte: now } }] }
      ]
    };
    const adsPromise = (await import('../models/Ad.js')).default.find(adFilter).sort({ createdAt: 1 }).lean();

    const [relatedRes, adsRes] = await Promise.all([relatedPromise, adsPromise]);
    relatedPosts = relatedRes;

    // Pick ads based on assignments and pseudo-random rotation fallback
    if (adsRes.length > 0 || post.adSlot1 || post.adSlot2) {
      let slot1Ad = post.adSlot1 || null;
      let slot2Ad = post.adSlot2 || null;

      // Filter out assigned ads from the pool to avoid duplicates
      let algoAds = adsRes.filter(a => {
        if (slot1Ad && a._id.toString() === slot1Ad._id.toString()) return false;
        if (slot2Ad && a._id.toString() === slot2Ad._id.toString()) return false;
        return true;
      });

      let hash = 0;
      const postIdStr = post._id.toString();
      for (let i = 0; i < postIdStr.length; i++) {
        hash = (hash << 5) - hash + postIdStr.charCodeAt(i);
        hash |= 0;
      }
      hash = Math.abs(hash);

      if (!slot1Ad && algoAds.length > 0) {
        const startIndex = hash % algoAds.length;
        slot1Ad = algoAds[startIndex];
        algoAds.splice(startIndex, 1);
      }

      if (!slot2Ad && algoAds.length > 0) {
        const nextIndex = (hash + 1) % algoAds.length;
        slot2Ad = algoAds[nextIndex];
      }

      // If we only have 1 ad overall and it was picked by algorithm, repeat it to fill both slots.
      // If it was manually assigned, we do NOT duplicate it.
      if (!slot2Ad && slot1Ad && algoAds.length === 0) {
        if (!post.adSlot1) slot2Ad = slot1Ad;
      } else if (!slot1Ad && slot2Ad && algoAds.length === 0) {
        if (!post.adSlot2) slot1Ad = slot2Ad;
      }

      inArticleAds = [slot1Ad, slot2Ad].filter(Boolean);
    }
  }
  
  // Track view asynchronously on GET /api/posts/:slug with IP hashing and 24h deduplication
  const rawIp = req.ip || '';
  const salt = process.env.IP_SALT;
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

  const responseData = { ...post, relatedPosts, inArticleAds };
  
  if (post.status === 'published') {
    setCached(cacheKey, responseData, 60);
    res.setHeader('Cache-Control', 'public, max-age=60');
  }
  
  res.status(200).json({ success: true, data: responseData });
});

const ALLOWED_POST_FIELDS = [
  'title', 'vertical', 'excerpt', 'bannerImage', 'body',
  'status', 'publishDate', 'readTime', 'editorsPick',
  'adSlot1', 'adSlot2'
];

function pickAllowedFields(body) {
  return ALLOWED_POST_FIELDS.reduce((acc, key) => {
    if (body[key] !== undefined) acc[key] = body[key];
    return acc;
  }, {});
}

export const createPost = asyncHandler(async (req, res) => {
  const data = pickAllowedFields(req.body);
  if (req.user.role !== 'admin') {
    delete data.adSlot1;
    delete data.adSlot2;
  }
  data.author = req.user._id; // always server-determined
  const post = await Post.create(data);
  
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
  
  const data = pickAllowedFields(req.body);
  if (req.user.role !== 'admin') {
    delete data.adSlot1;
    delete data.adSlot2;
  }
  Object.assign(post, data); // author intentionally excluded — never changeable via update
  const updatedPost = await post.save();
  
  res.status(200).json({ success: true, message: 'Post updated', data: updatedPost });
});

export const updateAdSlots = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  
  if (req.body.adSlot1 !== undefined) post.adSlot1 = req.body.adSlot1;
  if (req.body.adSlot2 !== undefined) post.adSlot2 = req.body.adSlot2;
  
  const updatedPost = await post.save();
  res.status(200).json({ success: true, message: 'Ad slots updated', data: updatedPost });
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
  const cacheKey = `search_${JSON.stringify(req.query)}`;
  const cachedData = getCached(cacheKey);
  
  if (cachedData) {
    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.status(200).json({ success: true, data: cachedData });
  }

  const { q, vertical, timeRange, limit = 10, skip = 0 } = req.query;
  const filter = { status: 'published' };
  
  if (q) {
    const escapedQ = escapeRegex(q);
    const mongoose = (await import('mongoose')).default;
    const matchedVerticals = await mongoose.model('Vertical').find({ name: { $regex: escapedQ, $options: 'i' } }).lean();
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
    .populate('vertical', 'name slug')
    .select('title slug excerpt bannerImage vertical publishDate status editorsPick adSlot1 adSlot2')
    .lean();
    
    setCached(cacheKey, posts, 300);
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.status(200).json({ success: true, data: posts });
});

export const sendNewsletter = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('vertical', 'name slug');
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const Subscriber = (await import('../models/Subscriber.js')).default;
  const subscribers = await Subscriber.find({});
  
  if (subscribers.length === 0) {
    return res.status(200).json({ success: true, message: 'No subscribers found' });
  }

  const sendEmail = (await import('../utils/sendEmail.js')).default;
  const protocol = req.protocol === 'http' && req.get('host').includes('localhost') ? 'http' : 'https';
  const clientUrl = process.env.CLIENT_URL || `${protocol}://${req.get('host').replace('5000', '5173')}`;
  
  const vSlug = post.vertical?.slug;
  if (!vSlug) {
    return res.status(400).json({ success: false, message: 'Post must belong to a vertical to be sent in newsletter' });
  }
  const postUrl = `${clientUrl}/${vSlug}/${post.slug}`;
  
  const escapeHtml = (s = '') =>
    String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  
  let bodyPreview = '';
  if (post.body && Array.isArray(post.body.blocks)) {
    const firstPara = post.body.blocks.find(b => b.type === 'paragraph');
    if (firstPara && firstPara.data && firstPara.data.text) {
      const plainText = firstPara.data.text.replace(/<[^>]*>?/gm, '');
      bodyPreview = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
    }
  }

  let bannerImageUrl = post.bannerImage 
    ? (post.bannerImage.startsWith('http') ? post.bannerImage : `${clientUrl}${post.bannerImage}`)
    : '';
  
  let originalBannerUrl = bannerImageUrl; // For logging/verification if needed
  if (bannerImageUrl.includes('res.cloudinary.com')) {
    // Cloudinary supports inserting /f_jpg/ right after /upload/ to force JPG conversion
    bannerImageUrl = bannerImageUrl.replace('/upload/', '/upload/f_jpg/');
  }

  const htmlTemplate = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #fcfbf9; padding: 40px 20px; color: #1a1a1a;">
      
      <!-- Masthead -->
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #1f7a4d; padding-bottom: 20px;">
        <h1 style="margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -1px;">
          <span style="color: #1f7a4d;">Wallet</span><span style="color: #1a1a1a;">Pickle</span>
        </h1>
        <p style="margin: 8px 0 0 0; color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Your Personal Finance Newsletter</p>
      </div>

      <!-- Main Content Container -->
      <div style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        
        ${bannerImageUrl ? `<img src="${bannerImageUrl}" alt="${post.title}" style="width: 100%; height: auto; max-height: 350px; object-fit: cover; display: block; border-bottom: 1px solid #eee;" />` : ''}
        
        <div style="padding: 30px;">
          <h2 style="color: #1a1a1a; font-size: 28px; line-height: 1.3; margin: 0 0 20px 0; font-weight: 800;">${escapeHtml(post.title)}</h2>
          
          ${post.excerpt ? `<p style="font-size: 18px; line-height: 1.6; color: #1f7a4d; font-weight: bold; margin: 0 0 20px 0;">${escapeHtml(post.excerpt)}</p>` : ''}
          ${bodyPreview ? `<p style="font-size: 16px; line-height: 1.7; color: #4a4a4a; margin: 0 0 30px 0;">${escapeHtml(bodyPreview)}</p>` : ''}
          
          <div style="text-align: center; margin-top: 40px; margin-bottom: 10px;">
            <a href="${postUrl}" style="background-color: #1f7a4d; color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px; border: 1px solid #145938;">Read Full Article</a>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; margin-top: 40px; padding-top: 20px;">
        <p style="font-size: 13px; color: #888; margin: 0 0 10px 0;">
          You received this email because you're subscribed to WalletPickle.
        </p>
        <p style="font-size: 13px; color: #888; margin: 0;">
          No longer want to receive these emails? <a href="-unsubscribeUrl-" style="color: #1f7a4d; text-decoration: underline; font-weight: bold;">Unsubscribe instantly</a>
        </p>
      </div>
    </div>
  `;

  const messages = [];
  
  for (const s of subscribers) {
    if (!s.unsubscribeToken) {
      const crypto = (await import('crypto')).default;
      s.unsubscribeToken = crypto.randomBytes(20).toString('hex');
      await s.save();
    }
    
    const unsubscribeUrl = `${clientUrl}/unsubscribe/${s.unsubscribeToken}`;
    const personalizedHtml = htmlTemplate.replace('-unsubscribeUrl-', unsubscribeUrl);
    
    messages.push({
      to: s.email,
      from: process.env.NEWSLETTER_FROM_EMAIL || process.env.SENDGRID_FROM_EMAIL,
      subject: post.title,
      html: personalizedHtml
    });
  }
  
  await sendEmail({ rawMessages: messages });

  res.status(200).json({ success: true, message: `Newsletter sent to ${subscribers.length} subscribers` });
});