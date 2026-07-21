import mongoose from 'mongoose';
const postViewSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  timestamp: { type: Date, default: Date.now },
  ipHash: String,
});
export default mongoose.model('PostView', postViewSchema);