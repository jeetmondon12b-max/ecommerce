// import mongoose from 'mongoose';

// const bannerSchema = new mongoose.Schema(
//     {
//         title: {
//             type: String,
//             trim: true,
//         },
//         subtitle: {
//             type: String,
//             trim: true,
//         },
//         image: {
//             type: String,
//             required: [true, 'Banner image is required.'], // ✅ শুধু ইমেজটি required
//         },
//         link: {
//             type: String,
//             trim: true,
//         },
//     },
//     { timestamps: true }
// );

// const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);

// export default Banner;


import mongoose from 'mongoose';

const bannerSchema = mongoose.Schema(
  {
    title: { type: String },
    subtitle: { type: String },
    link: { type: String },
    image: { type: String, required: true },
    imagePublicId: { type: String, required: true }, // ✅ এই ফিল্ডটি যোগ করুন
  },
  { timestamps: true }
);

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;