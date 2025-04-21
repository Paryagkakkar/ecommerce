import Shirt from '../models/shirtModel.js';

export const getShirts = async (req, res) => {
  try {
    const shirts = await Shirt.find();
    res.json(shirts);
  } catch (error) {
    console.error('Error fetching shirts:', error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getShirtById = async (req, res) => {
  try {
    const shirt = await Shirt.findById(req.params.id);
    if (!shirt) {
      return res.status(404).json({ success: false, error: 'Shirt not found' });
    }
    res.json(shirt);
  } catch (error) {
    console.error('Error fetching shirt:', error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const createShirt = async (req, res) => {
  try {
    const { title, price, size, color, category, description } = req.body;
    if (!req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    if (!image) {
      return res.status(400).json({ success: false, error: 'Image is required' });
    }
    const shirt = new Shirt({ title, price, image, size, color, category, description });
    await shirt.save();
    res.status(201).json({ success: true, data: shirt });
  } catch (error) {
    console.error('Error creating shirt:', error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const updateShirt = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    const { title, price, size, color, category, description } = req.body;
    const updateData = { title, price, size, color, category, description };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    const shirt = await Shirt.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!shirt) {
      return res.status(404).json({ success: false, error: 'Shirt not found' });
    }
    res.json({ success: true, data: shirt });
  } catch (error) {
    console.error('Error updating shirt:', error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const deleteShirt = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    const shirt = await Shirt.findByIdAndDelete(req.params.id);
    if (!shirt) {
      return res.status(404).json({ success: false, error: 'Shirt not found' });
    }
    res.json({ success: true, message: 'Shirt deleted' });
  } catch (error) {
    console.error('Error deleting shirt:', error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};