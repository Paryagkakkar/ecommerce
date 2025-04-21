import config from '../config/config.js';

class AuthController {
  async adminLogin(req, res, next) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      if (username !== config.adminCredentials.username || password !== config.adminCredentials.password) {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }
      res.json({ success: true, message: 'Admin login successful' });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();