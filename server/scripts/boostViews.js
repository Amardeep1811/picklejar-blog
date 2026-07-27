import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Post from '../models/Post.js';
import PostView from '../models/PostView.js';
import User from '../models/User.js';
import Vertical from '../models/Vertical.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function boostViews() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const postsToBoost = [
      { title: "Retirement Planning Mistakes That Could Cost You a Fortune", views: 500 },
      { title: "Investing Tips Every Young Adult Should Know", views: 300 },
      { title: "Debt Mistakes That Keep You Paying for Years", views: 150 }
    ];

    const admin = await mongoose.model('User').findOne({ role: 'admin' });
    const vertical = await mongoose.model('Vertical').findOne({ slug: 'finance' });

    for (const item of postsToBoost) {
      let post = await Post.findOne({ title: item.title });
      if (!post) {
        console.log(`Creating missing post: ${item.title}`);
        post = await Post.create({
          title: item.title,
          excerpt: "An in-depth look at this topic. We break down the latest trends and data so you can make the best financial decisions.",
          bannerImage: "https://picsum.photos/seed/trending/1200/675",
          body: { time: Date.now(), blocks: [], version: "2.30.7" },
          author: admin._id,
          status: 'published',
          publishDate: new Date(),
          vertical: vertical._id,
          isDummySeed: false,
          editorsPick: true,
          readTime: 5
        });
      }

      console.log(`Boosting ${item.title} by ${item.views} views...`);
      
      // Delete existing views for this post to ensure exact counts
      await PostView.deleteMany({ post: post._id });

      const views = [];
      const now = Date.now();
      
      for (let i = 0; i < item.views; i++) {
        // Random time within the last 24 hours
        const randomTimeOffset = Math.floor(Math.random() * 24 * 60 * 60 * 1000);
        const timestamp = new Date(now - randomTimeOffset);
        
        views.push({
          post: post._id,
          timestamp,
          ipHash: `seeded-ip-${Math.random()}`,
          isSeeded: true
        });
      }

      await PostView.insertMany(views);
      console.log(`Inserted ${item.views} seeded views for ${item.title}`);
    }

    console.log("Boost complete.");
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

boostViews();
