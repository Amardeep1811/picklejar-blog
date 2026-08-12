import mongoose from 'mongoose';
const adSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['sponsored', 'banner'], required: true },
  image: String,
  ctaText: String,
  ctaUrl: String,
  targetVertical: { type: mongoose.Schema.Types.ObjectId, ref: 'Vertical', default: null },
  placement: { type: String, enum: ['homepage', 'sidebar', 'in-article', 'top-banner', 'section-divider'], required: true },
  active: { type: Boolean, default: true },
  startDate: Date,
  endDate: Date,
}, { timestamps: true });
export default mongoose.model('Ad', adSchema);