import mongoose from 'mongoose';

const trendingSnapshotSchema = new mongoose.Schema({
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  computedAt: { type: Date, default: Date.now }
});

export default mongoose.model('TrendingSnapshot', trendingSnapshotSchema);
