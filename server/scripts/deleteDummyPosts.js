import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Post from '../models/Post.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/picklejar';

async function deleteDummyPosts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const deleteResult = await Post.deleteMany({ isDummySeed: true });
    console.log(`Successfully deleted ${deleteResult.deletedCount} dummy posts.`);

    process.exit(0);
  } catch (error) {
    console.error('Error deleting dummy posts:', error);
    process.exit(1);
  }
}

deleteDummyPosts();
