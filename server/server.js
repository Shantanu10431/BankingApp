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

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? true : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/audit', auditRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Banking Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

if (process.env.NODE_ENV !== 'production') {
  startServer().catch(console.error);
}

module.exports = app;