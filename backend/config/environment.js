require('dotenv').config();

module.exports = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  SERVER_URL: process.env.SERVER_URL || 'http://localhost:5000',

  // Database
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432,
  DB_NAME: process.env.DB_NAME || 'placement_portal_db',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || '',

  // JWT
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY || 'your_private_key',
  JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY || 'your_public_key',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '30d',

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // Bcrypt
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10'),

  // Email
  MAIL_HOST: process.env.MAIL_HOST || '',
  MAIL_PORT: process.env.MAIL_PORT || 587,
  MAIL_USER: process.env.MAIL_USER || '',
  MAIL_PASSWORD: process.env.MAIL_PASSWORD || '',

  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880'),
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',

  // Cache
  CACHE_EXPIRY: parseInt(process.env.CACHE_EXPIRY || '3600'),

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_DIR: process.env.LOG_DIR || './logs',

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
};
