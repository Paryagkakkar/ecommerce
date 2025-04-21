import 'dotenv/config';

const config = {
  mongoURI: process.env.MONGO_URI,
  port: process.env.PORT || 5000,
  adminCredentials: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'password123',
  },
};

export default config;