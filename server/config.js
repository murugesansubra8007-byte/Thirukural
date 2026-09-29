const path = require('path');

module.exports = {
  PORT: process.env.PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET || 'kuralagam-dev-secret-change-in-production',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@kuralagam.in',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
  DATA_FILE: path.join(__dirname, 'data', 'kurals.json'),
  URAIS_FILE: path.join(__dirname, 'data', 'urais.json'),
  DB_FILE: path.join(__dirname, 'data', 'db.json'),
};