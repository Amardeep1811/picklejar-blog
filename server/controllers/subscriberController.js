import crypto from 'crypto';
import Subscriber from '../models/Subscriber.js';
import asyncHandler from '../utils/asyncHandler.js';

export const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }
  const existing = await Subscriber.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error('Already subscribed');
  }
  const unsubscribeToken = crypto.randomBytes(20).toString('hex');
  const subscriber = await Subscriber.create({ email, unsubscribeToken });
  res.status(201).json({ success: true, message: 'Subscribed successfully', data: subscriber });
});

export const unsubscribe = asyncHandler(async (req, res) => {
  const { token } = req.params;
  if (!token) {
    res.status(400);
    throw new Error('Invalid token');
  }

  const subscriber = await Subscriber.findOne({ unsubscribeToken: token });
  if (!subscriber) {
    res.status(404);
    throw new Error('Invalid or expired unsubscribe link.');
  }

  await subscriber.deleteOne();
  res.status(200).json({ success: true, message: 'You have been successfully unsubscribed.' });
});

export const getSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Subscriber.find({}).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: subscribers });
});

export const deleteSubscriber = asyncHandler(async (req, res) => {
  const subscriber = await Subscriber.findById(req.params.id);
  if (!subscriber) {
    res.status(404);
    throw new Error('Subscriber not found');
  }
  await subscriber.deleteOne();
  res.status(200).json({ success: true, message: 'Subscriber deleted successfully' });
});