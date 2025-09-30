import express from 'express';
import { 
    createProduct, 
    getProducts, 
    getProductById, 
    getProductSuggestions, 
    searchProducts,
    updateProduct,
    deleteProduct 
} from '../controllers/productController.js';
import multer from 'multer';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer configuration for handling image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB Limit

// --- Admin Only Routes ---

// POST /api/products -> Create a new product
router.post(
    '/', 
    protect, 
    admin, 
    upload.fields([
        { name: 'image', maxCount: 1 }, 
        { name: 'productImages', maxCount: 5 }
    ]), 
    createProduct
);

// --- Public Routes ---

// GET /api/products -> Get all products with filtering
router.get('/', getProducts);

// GET /api/products/suggestions -> Get search suggestions
router.get('/suggestions', getProductSuggestions);

// GET /api/products/search -> Search for products
router.get('/search', searchProducts);

// --- Routes for a specific product by ID ---
router.route('/:id')
    // GET /api/products/:id -> Get a single product
    .get(getProductById)
    // ✅ PUT /api/products/:id -> Update a product (Multer middleware added)
    .put(
        protect, 
        admin, 
        upload.fields([
            { name: 'image', maxCount: 1 }, 
            { name: 'productImages', maxCount: 5 }
        ]), 
        updateProduct
    )
    // DELETE /api/products/:id -> Delete a product
    .delete(protect, admin, deleteProduct);

export default router;  