import mongoose from 'mongoose';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Subscriber from './models/Subscriber.js';
import Post from './models/Post.js';
import { sendNewsletter } from './controllers/postController.js';
import * as sendEmailModule from './utils/sendEmail.js';
import sgMail from '@sendgrid/mail';

dotenv.config();

async function runTests() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/walletpickle');

  console.log('--- DB CONNECTED ---');

  const Vertical = (await import('./models/Vertical.js')).default;
  const vertical = await Vertical.findOne();

  // Create dummy post
  const post = await Post.create({
    title: 'Test Newsletter ' + Date.now(),
    slug: 'test-newsletter-' + Date.now(),
    vertical: vertical ? vertical._id : new mongoose.Types.ObjectId(),
    excerpt: 'Test excerpt',
    body: { blocks: [] },
    status: 'published',
  });

  // Create legacy subscriber without token
  await Subscriber.deleteMany({ email: { $in: ['test1@walletpickle.com', 'test2@walletpickle.com', 'test3@walletpickle.com'] } });
  
  await Subscriber.collection.insertOne({
    email: 'test1@walletpickle.com',
    subscribedAt: new Date(),
    // no token to test backfill
  });
  
  await Subscriber.create({
    email: 'test2@walletpickle.com',
    unsubscribeToken: crypto.randomBytes(20).toString('hex')
  });

  await Subscriber.create({
    email: 'test3@walletpickle.com',
    unsubscribeToken: crypto.randomBytes(20).toString('hex')
  });

  console.log('\n--- MONGODB STATE: BEFORE FIRST SEND ---');
  let subs = await Subscriber.find({ email: /test.*@walletpickle.com/ }).lean();
  console.log(subs);

  // Mock sgMail.send to capture payload
  let capturedPayload = null;
  const originalSend = sgMail.send;
  sgMail.send = async (msg) => {
    capturedPayload = msg;
    console.log('\n--- SENDGRID PAYLOAD CAPTURED ---');
    console.log(JSON.stringify(msg, null, 2));
  };

  // Mock req/res
  const req = {
    params: { id: post._id },
    protocol: 'http',
    get: () => 'localhost:5000'
  };
  const res = {
    status: function(s) { this.statusCode = s; return this; },
    json: function(data) { console.log('\n--- FIRST SEND RESPONSE ---', data); }
  };

  console.log('\n--- TRIGGERING FIRST NEWSLETTER SEND ---');
  await sendNewsletter(req, res, () => {});

  console.log('\n--- MONGODB STATE: AFTER FIRST SEND (CHECK BACKFILL) ---');
  subs = await Subscriber.find({ email: /test.*@walletpickle.com/ }).lean();
  console.log(subs);

  // Grab the token for test2
  const test2 = subs.find(s => s.email === 'test2@walletpickle.com');
  const token = test2.unsubscribeToken;

  console.log(`\n--- SIMULATING CLICK ON UNSUBSCRIBE LINK FOR test2 (${token}) ---`);
  
  // Call unsubscribe controller logic directly since we don't have an HTTP server running in this script
  const { unsubscribe } = await import('./controllers/subscriberController.js');
  
  const unsubReq = { params: { token } };
  const unsubRes = {
    status: function(s) { this.statusCode = s; return this; },
    json: function(data) { console.log('Unsubscribe Response:', this.statusCode, data); }
  };
  
  await unsubscribe(unsubReq, unsubRes, (err) => {
    if (err) console.log('Unsubscribe Error:', err.message);
  });

  console.log('\n--- MONGODB STATE: AFTER UNSUBSCRIBE ---');
  subs = await Subscriber.find({ email: /test.*@walletpickle.com/ }).lean();
  console.log(subs);

  console.log('\n--- TRIGGERING SECOND NEWSLETTER SEND ---');
  let capturedSecondPayload = null;
  sgMail.send = async (msg) => {
    capturedSecondPayload = msg;
  };
  
  await sendNewsletter(req, res, () => {});
  console.log('\n--- SECOND SENDGRID PAYLOAD ---');
  console.log(JSON.stringify(capturedSecondPayload.personalizations, null, 2));

  console.log(`\n--- SIMULATING INVALID TOKEN ---`);
  const invalidReq = { params: { token: 'invalid_or_already_used' } };
  await unsubscribe(invalidReq, unsubRes, (err) => {
    if (err) console.log('Invalid Token Error:', err.message);
  });

  // Cleanup
  await Post.deleteOne({ _id: post._id });
  await Subscriber.deleteMany({ email: { $in: ['test1@walletpickle.com', 'test2@walletpickle.com', 'test3@walletpickle.com'] } });
  
  sgMail.send = originalSend;
  mongoose.connection.close();
}

runTests().catch(console.error);
