require('dotenv').config();

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  ISSUE_PERIOD_DAYS: Number(process.env.ISSUE_PERIOD_DAYS) || 14,
  FINE_PER_DAY: Number(process.env.FINE_PER_DAY) || 5,
};

module.exports = env;