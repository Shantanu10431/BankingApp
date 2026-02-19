const { prisma } = require('../../config/database');

const getDashboard = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        accountNumber: true,
        ifscCode: true,
        balance: true,
        role: true,
        isFrozen: true
      }
    });

    const recentTransactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { senderId: req.user.id, type: 'DEBIT' },
          { receiverId: req.user.id, type: 'CREDIT' }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        sender: { select: { name: true, accountNumber: true } },
        receiver: { select: { name: true, accountNumber: true } }
      }
    });

    res.json({
      user,
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard', error: error.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          OR: [
            { senderId: req.user.id, type: 'DEBIT' },
            { receiverId: req.user.id, type: 'CREDIT' }
          ]
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          sender: { select: { name: true, accountNumber: true } },
          receiver: { select: { name: true, accountNumber: true } }
        }
      }),
      prisma.transaction.count({
        where: {
          OR: [
            { senderId: req.user.id, type: 'DEBIT' },
            { receiverId: req.user.id, type: 'CREDIT' }
          ]
        }
      })
    ]);

    res.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
  }
};

module.exports = { getDashboard, getAllTransactions };