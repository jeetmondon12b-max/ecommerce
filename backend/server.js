// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import connectDB from './config/db.js';
// import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// // --- Route Imports ---
// import productRoutes from './routes/productRoutes.js';
// import authRoutes from './routes/authRoutes.js';
// import adminRoutes from './routes/adminRoutes.js';
// import orderRoutes from './routes/orderRoutes.js';
// import couponRoutes from './routes/couponRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import wishlistRoutes from './routes/wishlistRoutes.js';
// import categoryRoutes from './routes/categoryRoutes.js';
// import pageCategoryRoutes from './routes/pageCategoryRoutes.js';
// import bannerRoutes from './routes/bannerRoutes.js';

// // --- Initial Setup ---
// dotenv.config();
// connectDB();

// const app = express();
// app.set('trust proxy', 1);

// // --- CORS Setup ---
// app.use(
//   cors({
//     origin: [
//       'https://ecommerce-2-odlo.onrender.com', // ✅ Render (LIVE Frontend)
//       'http://localhost:5173', // ✅ Local Frontend (Vite)
//     ],
//     credentials: true,
//   })
// );

// // --- Core Middleware ---
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // --- Health Check ---
// app.get('/', (req, res) => {
//   res.status(200).send('<h1>✅ Backend Server is ALIVE and responding!</h1>');
// });

// // --- Static Folder for Uploads ---
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // --- API Routes ---
// app.use('/api/products', productRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/coupons', couponRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/wishlist', wishlistRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/page-categories', pageCategoryRoutes);
// app.use('/api/banners', bannerRoutes);

// // --- Error Handling Middleware ---
// app.use(notFound);
// app.use(errorHandler);

// // --- Server Start ---
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });


import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// --- Route Imports ---
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import userRoutes from './routes/userRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import pageCategoryRoutes from './routes/pageCategoryRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';

// --- Initial Setup ---
dotenv.config();
connectDB();

const app = express();
app.set('trust proxy', 1);

// --- CORS Setup ---
app.use(
  cors({
    origin: [
      'https://ecommerce-2-odlo.onrender.com', // ✅ Render (LIVE Frontend)
      'http://localhost:5173', // ✅ Local Frontend (Vite)
    ],
    credentials: true,
  })
);

// --- Core Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health Check ---
app.get('/', (req, res) => {
  res.status(200).send('<h1>✅ Backend Server is ALIVE and responding!</h1>');
});

// --- Static Folder for Uploads (REMOVED) ---
// ✅ এই অংশটি মুছে ফেলা হয়েছে কারণ ছবিগুলো এখন Cloudinary থেকে আসবে।
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API Routes ---
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/page-categories', pageCategoryRoutes);
app.use('/api/banners', bannerRoutes);

// --- Error Handling Middleware ---
app.use(notFound);
app.use(errorHandler);

// --- Server Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});