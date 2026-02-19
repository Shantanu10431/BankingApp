const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    // process.exit(1); // Don't crash serverless function
  }
};

module.exports = { prisma, connectDB };