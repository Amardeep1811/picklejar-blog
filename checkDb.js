import mongoose from 'mongoose';
import Post from './server/models/Post.js';

mongoose.connect('mongodb://127.0.0.1:27017/picklejar')
  .then(async () => {
    const posts = await Post.find({ status: 'published' });
    console.log('Total published:', posts.length);
    posts.forEach(p => console.log(`- ${p.title} (editorsPick: ${p.editorsPick})`));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
