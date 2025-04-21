import express from 'express';
import { getShirts, getShirtById, createShirt, updateShirt, deleteShirt } from '../controllers/shirtController.js';
import upload from '../middleware/uploadMiddleware.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

router.get('/get-all-shirts', getShirts);
router.get('/:id', getShirtById);
router.post('/add-shirts', authMiddleware, upload.single('image'), createShirt);
router.put('/:id', authMiddleware, upload.single('image'), updateShirt);
router.delete('/:id', authMiddleware, deleteShirt);

export default router;