import { getUserById, createUser as createUserService, updateUserAddress as updateUserAddressService } from '../services/userServices.js';

const userController = {
  getUser: async (req, res) => {
    try {
      const user = await getUserById(req.params.userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  createUser: async (req, res) => {
    try {
      const user = await createUserService(req.body);
      res.status(201).json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  updateUserAddress: async (req, res) => {
    try {
      const { userId, newAddress } = req.body;
      const updatedUser = await updateUserAddressService(userId, newAddress);
      res.json({ success: true, user: updatedUser });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default userController;