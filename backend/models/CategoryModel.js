import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required.'],
            unique: true,
            trim: true,
            minlength: [2, 'Category name must be at least 2 characters long.'],
            maxlength: [50, 'Category name cannot exceed 50 characters.'],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        // ভবিষ্যতে প্রয়োজন হলে ক্যাটাগরির ছবি যোগ করার জন্য
        // image: {
        //     type: String,
        // },
    },
    { timestamps: true }
);

// ডাটাবেসে সেভ হওয়ার আগে স্বয়ংক্রিয়ভাবে 'slug' তৈরি করার জন্য middleware
categorySchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

export default Category;