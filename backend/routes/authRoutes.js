import express from 'express';
const router = express.Router();
import { registerUser, authUser, authAdmin } from '../controllers/authController.js';

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/admin-login', authAdmin);

export default router;