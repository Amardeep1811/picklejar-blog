import mongoose from 'mongoose';

const petitionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  signatureCount: { type: Number, default: 0 },
  goalCount: { type: Number, required: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Petition', petitionSchema);
