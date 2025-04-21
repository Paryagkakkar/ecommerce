import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.post('/create-user', userController.createUser);
router.post('/update-user-address', userController.updateUserAddress);
router.get('/:userId', userController.getUser);

export default router;