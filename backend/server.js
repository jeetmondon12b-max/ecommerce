import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route imports
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

// Initial Configuration
dotenv.config();
connectDB();

const app = express();

app.set('trust proxy', 1);

// --- SIMPLIFIED & FINAL CORS CONFIGURATION ---
// This allows requests from your specific frontend URL and localhost
app.use(cors({
  origin: [
    'https://ecommerce-2-odlo.onrender.com', // Your LIVE Frontend URL
    'http://localhost:5173'                 // Your LOCAL Frontend URL
  ]
}));

// Core Middleware
app.use(express.json());

// --- HEALTH CHECK ROUTE FOR DEBUGGING ---
// This will tell us if the server is running correctly.
app.get('/', (req, res) => {
  res.status(200).send('<h1>Backend Server is ALIVE and responding!</h1>');
});

// Static Folder for Image Uploads - Using a more robust path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));


// API Routes
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

// Custom Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server is running successfully on port ${PORT}`));

