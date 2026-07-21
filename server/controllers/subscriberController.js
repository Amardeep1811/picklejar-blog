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
  const subscriber = await Subscriber.create({ email });
  res.status(201).json({ success: true, message: 'Subscribed successfully', data: subscriber });
});

export const getSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Subscriber.find({}).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: subscribers });
});