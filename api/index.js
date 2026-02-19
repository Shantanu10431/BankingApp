const app = require('../server/server');
const { connectDB } = require('../server/config/database');

// Ensure database connects in serverless environment
connectDB();

module.exports = app;
