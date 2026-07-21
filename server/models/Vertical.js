import mongoose from 'mongoose';
import slugify from 'slugify';
const verticalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
}, { timestamps: true });
verticalSchema.pre('validate', function() {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});
export default mongoose.model('Vertical', verticalSchema);