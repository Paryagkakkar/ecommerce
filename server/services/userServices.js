// server/services/userService.js
import User from '../models/User.js';
import bcrypt from 'bcrypt'; // Add bcrypt for password hashing

export const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  return user;
};

export const createUser = async (userData) => {
  const { username, email, password } = userData;
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
  const user = new User({ username, email, password: hashedPassword });
  await user.save();
  return user;
};

export const updateUserAddress = async (userId, newAddress) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  user.address = newAddress;
  await user.save();
  return user;
};

export const loginUser = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error('User not found');
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');
  return user;
};