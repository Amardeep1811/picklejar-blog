import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/walletpickle');
  const Post = (await import('./models/Post.js')).default;
  
  // Find a post with a cloudinary image
  const post = await Post.findOne({ bannerImage: /cloudinary/ });
  
  if (post) {
    const original = post.bannerImage;
    const modified = original.replace('/upload/', '/upload/f_jpg/');
    console.log("ORIGINAL URL:");
    console.log(original);
    console.log("\nMODIFIED URL:");
    console.log(modified);
  } else {
    console.log("No posts with cloudinary images found.");
  }
  process.exit(0);
}

run().catch(console.error);
