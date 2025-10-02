

// import mongoose from 'mongoose';

// const bannerSchema = mongoose.Schema(
//   {
//     title: { type: String },
//     subtitle: { type: String },
//     link: { type: String },
//     image: { type: String, required: true },
//     imagePublicId: { type: String, required: true }, // ✅ এই ফিল্ডটি যোগ করুন
//   },
//   { timestamps: true }
// );

// const Banner = mongoose.model('Banner', bannerSchema);

// export default Banner;


import mongoose from 'mongoose';

const bannerSchema = mongoose.Schema(
  {
    title: { 
        type: String,
        trim: true 
    },
    subtitle: { 
        type: String,
        trim: true
    },
    link: { 
        type: String,
        trim: true
    },
    // ✅ পরিবর্তন: ছবির সম্পূর্ণ URL ('image') এর পরিবর্তে এখন শুধুমাত্র
    // Cloudinary থেকে পাওয়া public ID ('imagePublicId') সেভ করা হচ্ছে।
    imagePublicId: { 
        type: String, 
        required: true 
    },
  },
  { timestamps: true }
);

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;