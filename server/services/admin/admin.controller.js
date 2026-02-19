const { prisma } = require('../../config/database');

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          accountNumber: true,
          ifscCode: true,
          balance: true,
          role: true,
          isFrozen: true,
          createdAt: true
        }
      }),
      prisma.user.count()
    ]);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

const freezeAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    const { freeze } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isFrozen: freeze },
      select: {
        id: true,
        name: true,
        email: true,
        accountNumber: true,
        isFrozen: true
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: freeze ? 'ACCOUNT_FROZEN' : 'ACCOUNT_UNFROZEN',
        metadata: { targetUserId: userId, targetUserEmail: user.email },
        ipAddress: req.ip
      }
    });

    res.json({
      message: `Account ${freeze ? 'frozen' : 'unfrozen'} successfully`,
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Operation failed', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'ADMIN') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    await prisma.$transaction(async (tx) => {
      await tx.auditLog.deleteMany({ where: { userId } });
      await tx.transaction.deleteMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }]
        }
      });
      await tx.user.delete({ where: { id: userId } });
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'USER_DELETED',
        metadata: { deletedUserId: userId, deletedUserEmail: user.email },
        ipAddress: req.ip
      }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

const getSystemStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalTransactions,
      totalLiquidity,
      frozenAccounts,
      todayTransactions
    ] = await Promise.all([
      prisma.user.count(),
      prisma.transaction.count(),
      prisma.user.aggregate({
        _sum: { balance: true }
      }),
      prisma.user.count({ where: { isFrozen: true } }),
      prisma.transaction.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      })
    ]);

    const recentTransactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        sender: { select: { name: true, accountNumber: true } },
        receiver: { select: { name: true, accountNumber: true } }
      }
    });

    res.json({
      stats: {
        totalUsers,
        totalTransactions,
        totalLiquidity: totalLiquidity._sum.balance || 0,
        frozenAccounts,
        todayTransactions
      },
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: { name: true, email: true, accountNumber: true }
          }
        }
      }),
      prisma.auditLog.count()
    ]);

    res.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch audit logs', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  freezeAccount,
  deleteUser,
  getSystemStats,
  getAuditLogs
};