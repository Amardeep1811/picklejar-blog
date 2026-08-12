import mongoose from 'mongoose';

const PetitionSignatureSchema = new mongoose.Schema({
  petition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Petition',
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

PetitionSignatureSchema.index({ petition: 1, email: 1 }, { unique: true });

const PetitionSignature = mongoose.models.PetitionSignature || mongoose.model('PetitionSignature', PetitionSignatureSchema);

export default PetitionSignature;
