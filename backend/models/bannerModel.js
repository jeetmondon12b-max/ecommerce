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
    imagePublicId: { 
        type: String, 
        required: true 
    },
  },
  { timestamps: true }
);

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;