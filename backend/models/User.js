import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        isActive: { type: Boolean, default: true },
        
        // ✅✅✅ নতুন ফিল্ড: ইউজারের কার্যকলাপ ট্র্যাক করার জন্য ✅✅✅
        loginHistory: [
            {
                _id: false,
                timestamp: { type: Date, default: Date.now },
                ipAddress: { type: String }
            }
        ],
        loginCount: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

// পাসওয়ার্ড মেলানোর জন্য মেথড
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// ডেটাবেসে সেভ হওয়ার আগে পাসওয়ার্ড হ্যাশ করার জন্য
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;