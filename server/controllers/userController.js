import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role
  });

  if (user) {
    res.status(201).json({
      success: true,
      message: 'User created',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

export const getUsers = asyncHandler(async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: users });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  
  if (req.body.role) {
    // Check if the user is trying to change their own role to something else
    if (req.params.id === req.user._id.toString() && req.body.role !== user.role) {
      res.status(400);
      throw new Error('You cannot change your own role');
    }
    user.role = req.body.role;
  }

  const updatedUser = await user.save();
  res.status(200).json({
    success: true,
    message: 'User updated',
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    }
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    res.status(400);
    throw new Error('Cannot delete your own admin account');
  }
  
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.deleteOne();
  res.status(200).json({ success: true, message: 'User deleted' });
});

export const changeUserPassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.role === 'admin' && req.user._id.toString() !== user._id.toString()) {
    res.status(400);
    throw new Error('Cannot change password for other admins');
  }

  user.password = req.body.password;
  await user.save();

  res.status(200).json({ success: true, message: 'Password updated successfully' });
});