import mongoose from 'mongoose';
import slugify from 'slugify';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  vertical: { type: mongoose.Schema.Types.ObjectId, ref: 'Vertical', required: true },
  excerpt: String,
  bannerImage: String,
  body: mongoose.Schema.Types.Mixed,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  publishDate: Date,
  readTime: Number,
  editorsPick: { type: Boolean, default: false },
  isDummySeed: { type: Boolean, default: false },
  adSlot1: { type: mongoose.Schema.Types.ObjectId, ref: 'Ad', default: null },
  adSlot2: { type: mongoose.Schema.Types.ObjectId, ref: 'Ad', default: null },
}, { timestamps: true });

postSchema.index({ status: 1, vertical: 1, createdAt: -1 });
postSchema.index({ status: 1, publishDate: -1 });

postSchema.pre('validate', async function() {
  if (this.isModified('title') || !this.slug) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await mongoose.models.Post.exists({ slug: uniqueSlug, _id: { $ne: this._id } })) {
      counter++;
      uniqueSlug = `${baseSlug}-${counter}`;
    }
    this.slug = uniqueSlug;
  }
});

export default mongoose.model('Post', postSchema);