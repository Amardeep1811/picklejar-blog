import mongoose from 'mongoose';

const tickerSnapshotSchema = new mongoose.Schema({
  data: [{
    symbol: { type: String, required: true },
    change: { type: String },
    up: { type: Boolean },
    isStatic: { type: Boolean, default: false }
  }],
  fetchedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('TickerSnapshot', tickerSnapshotSchema);
