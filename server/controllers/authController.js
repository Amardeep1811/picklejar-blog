import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from '../utils/asyncHandler.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    res.status(200).json({ 
      success: true, 
      message: 'Login successful', 
      data: { user: { _id: user._id, name: user.name, email: user.email, role: user.role } } 
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
  });
  res.status(200).json({ success: true, message: 'Logged out' });
});

export const getMe = asyncHandler(async (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      data: { user: { _id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } }
    });
  } else {
    res.status(401);
    throw new Error('User not found');
  }
});