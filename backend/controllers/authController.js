import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Register function remains the same as you provided
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Authenticate user & get token (Updated)
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (!user.isActive) {
        res.status(403);
        throw new Error('Your account has been banned. Please contact support.');
    }
    
    // ✅✅✅ নতুন কার্যকারিতা: লগইন হিস্ট্রি আপডেট করা হচ্ছে ✅✅✅
    user.loginCount += 1;
    user.loginHistory.push({ ipAddress: req.ip }); // req.ip থেকে IP পাওয়া যায়
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// Authenticate admin & get token (Updated)
const authAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && user.role === 'admin' && (await user.matchPassword(password))) {
        if (!user.isActive) {
            res.status(403);
            throw new Error('Your admin account has been deactivated.');
        }

        // ✅ অ্যাডমিন লগইনের ক্ষেত্রেও হিস্ট্রি আপডেট করা হচ্ছে
        user.loginCount += 1;
        user.loginHistory.push({ ipAddress: req.ip });
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials or not an admin');
    }
});

export { registerUser, authUser, authAdmin };