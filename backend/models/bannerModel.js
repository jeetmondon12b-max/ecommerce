import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        subtitle: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
            required: [true, 'Banner image is required.'], // ✅ শুধু ইমেজটি required
        },
        link: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);

export default Banner;