const { prisma } = require('../../config/database');

const deposit = async (req, res) => {
  try {
    const { amount, description } = req.body;
    const userId = req.user.id;

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: userId },
        data: { balance: { increment: amount } },
        select: { id: true, balance: true, accountNumber: true }
      });

      const transaction = await tx.transaction.create({
        data: {
          amount,
          type: 'CREDIT',
          receiverId: userId,
          status: 'SUCCESS',
          description: description || 'Deposit'
        }
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: 'DEPOSIT',
          metadata: { amount, transactionId: transaction.id },
          ipAddress: req.ip
        }
      });

      return { user, transaction };
    });

    res.json({
      message: 'Deposit successful',
      balance: result.user.balance,
      transaction: result.transaction
    });
  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({ message: 'Deposit failed', error: error.message });
  }
};

const withdraw = async (req, res) => {
  try {
    const { amount, description } = req.body;
    const userId = req.user.id;

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { balance: true }
      });

      if (!user || user.balance < amount) {
        throw new Error('Insufficient balance');
      }

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: amount } },
        select: { id: true, balance: true }
      });

      const transaction = await tx.transaction.create({
        data: {
          amount,
          type: 'DEBIT',
          senderId: userId,
          status: 'SUCCESS',
          description: description || 'Withdrawal'
        }
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: 'WITHDRAW',
          metadata: { amount, transactionId: transaction.id },
          ipAddress: req.ip
        }
      });

      return { user: updatedUser, transaction };
    });

    res.json({
      message: 'Withdrawal successful',
      balance: result.user.balance,
      transaction: result.transaction
    });
  } catch (error) {
    console.error('Withdraw error:', error);
    if (error.message === 'Insufficient balance') {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    res.status(500).json({ message: 'Withdrawal failed', error: error.message });
  }
};

const transfer = async (req, res) => {
  try {
    const { receiverAccountNumber, amount, description } = req.body;
    const senderId = req.user.id;

    if (amount <= 0) {
      return res.status(400).json({ message: 'Transfer amount must be positive' });
    }

    const result = await prisma.$transaction(async (tx) => {
      const sender = await tx.user.findUnique({
        where: { id: senderId },
        select: { id: true, balance: true, accountNumber: true, isFrozen: true }
      });

      if (!sender) {
        throw new Error('Sender not found');
      }

      if (sender.isFrozen) {
        throw new Error('Sender account is frozen');
      }

      if (sender.accountNumber === receiverAccountNumber) {
        throw new Error('Cannot transfer to own account');
      }

      if (sender.balance < amount) {
        throw new Error('Insufficient balance');
      }

      const receiver = await tx.user.findUnique({
        where: { accountNumber: receiverAccountNumber },
        select: { id: true, accountNumber: true, isFrozen: true }
      });

      if (!receiver) {
        throw new Error('Receiver account not found');
      }

      if (receiver.isFrozen) {
        throw new Error('Receiver account is frozen');
      }

      await tx.user.update({
        where: { id: senderId },
        data: { balance: { decrement: amount } }
      });

      await tx.user.update({
        where: { id: receiver.id },
        data: { balance: { increment: amount } }
      });

      const debitTransaction = await tx.transaction.create({
        data: {
          amount,
          type: 'DEBIT',
          senderId,
          receiverId: receiver.id,
          status: 'SUCCESS',
          description: description || `Transfer to ${receiverAccountNumber}`
        }
      });

      const creditTransaction = await tx.transaction.create({
        data: {
          amount,
          type: 'CREDIT',
          senderId,
          receiverId: receiver.id,
          status: 'SUCCESS',
          description: description || `Transfer from ${sender.accountNumber}`
        }
      });

      await tx.auditLog.create({
        data: {
          userId: senderId,
          action: 'TRANSFER_SENT',
          metadata: { 
            amount, 
            receiverAccountNumber, 
            debitTransactionId: debitTransaction.id 
          },
          ipAddress: req.ip
        }
      });

      await tx.auditLog.create({
        data: {
          userId: receiver.id,
          action: 'TRANSFER_RECEIVED',
          metadata: { 
            amount, 
            senderAccountNumber: sender.accountNumber,
            creditTransactionId: creditTransaction.id
          },
          ipAddress: req.ip
        }
      });

      const updatedSender = await tx.user.findUnique({
        where: { id: senderId },
        select: { balance: true }
      });

      return { 
        senderBalance: updatedSender.balance, 
        debitTransaction, 
        creditTransaction 
      };
    });

    res.json({
      message: 'Transfer successful',
      balance: result.senderBalance,
      transactions: {
        debit: result.debitTransaction,
        credit: result.creditTransaction
      }
    });
  } catch (error) {
    console.error('Transfer error:', error);
    
    const errorMessages = {
      'Sender not found': { status: 404, message: 'Sender account not found' },
      'Sender account is frozen': { status: 403, message: 'Your account is frozen' },
      'Cannot transfer to own account': { status: 400, message: 'Cannot transfer to your own account' },
      'Insufficient balance': { status: 400, message: 'Insufficient balance' },
      'Receiver account not found': { status: 404, message: 'Receiver account not found' },
      'Receiver account is frozen': { status: 403, message: 'Receiver account is frozen' }
    };

    const errorResponse = errorMessages[error.message];
    if (errorResponse) {
      return res.status(errorResponse.status).json({ message: errorResponse.message });
    }

    res.status(500).json({ message: 'Transfer failed', error: error.message });
  }
};

module.exports = { deposit, withdraw, transfer };