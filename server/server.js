require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const { connectDB } = require('./config/database');

const authRoutes = require('./services/auth/auth.routes');
const userRoutes = require('./services/user/user.routes');
const transactionRoutes = require('./services/transaction/transaction.routes');
const adminRoutes = require('./services/admin/admin.routes');
const auditRoutes = require('./services/audit/audit.routes');
const chatRoutes = require('./services/chat/chat.routes');

const app = express();

app.use(helmet());
app.use(cors()); // Allow all origins by default for Vercel/Serverless compatibility
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/debug', (req, res) => {
  res.json({
    status: 'Debug Active v2',
    env: process.env.NODE_ENV,
    hasDbUrl: !!process.env.DATABASE_URL1,
    hasJwtSecret: !!process.env.JWT_SECRET1,
    // precise-check: Check string length to verify it's not empty string
    dbUrlLength: process.env.DATABASE_URL1 ? process.env.DATABASE_URL1.length : 0,
    availableEnvKeys: Object.keys(process.env), // List all keys to see what IS there
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Banking Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

if (require.main === module) {
  startServer().catch(console.error);
}

module.exports = app;