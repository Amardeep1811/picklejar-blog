import mongoose from 'mongoose';
const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
  unsubscribeToken: { type: String, unique: true, sparse: true },
});
export default mongoose.model('Subscriber', subscriberSchema);