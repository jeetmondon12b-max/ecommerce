// import asyncHandler from 'express-async-handler';
// import User from '../models/User.js';

// // @desc    Get user profile
// const getUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (user) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     });
//   } else {
//     res.status(404);
//     throw new Error('User not found');
//   }
// });

// // @desc    Update user profile
// const updateUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (user) {
//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;

//     if (req.body.password) {
//       user.password = req.body.password;
//     }

//     const updatedUser = await user.save();

//     res.json({
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       role: updatedUser.role,
//       token: generateToken(updatedUser._id), // Optionally send a new token
//     });
//   } else {
//     res.status(404);
//     throw new Error('User not found');
//   }
// });

// export { getUserProfile, updateUserProfile };
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users for Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Update user by ID for Admin
const updateUserByAdmin = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        if (req.body.isActive !== undefined) {
            user.isActive = req.body.isActive;
        }
        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Unban all users
const unbanAllUsers = asyncHandler(async (req, res) => {
    const result = await User.updateMany({ isActive: false }, { $set: { isActive: true } });
    if (result.modifiedCount > 0) {
        res.json({ message: `${result.modifiedCount} users have been unbanned.` });
    } else {
        res.json({ message: 'No banned users to unban.' });
    }
});

// ✅ নতুন ফাংশন: অ্যাডমিন দ্বারা ইউজার ডিলিট করার জন্য
// @desc    Delete user by ID
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUserByAdmin = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        if (user.role === 'admin') {
            res.status(400);
            throw new Error('Cannot delete an admin user.');
        }
        await User.deleteOne({ _id: user._id });
        res.json({ message: 'User removed successfully.' });
    } else {
        res.status(404);
        throw new Error('User not found.');
    }
});

export { 
    getUserProfile, 
    updateUserProfile, 
    getAllUsers, 
    updateUserByAdmin,
    unbanAllUsers,
    deleteUserByAdmin // ✅ নতুন ফাংশনটি এক্সপোর্ট করুন
};