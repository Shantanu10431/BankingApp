const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../../config/database');

const generateAccountNumber = () => {
  return Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('');
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    let accountNumber;
    let isUnique = false;

    while (!isUnique) {
      accountNumber = generateAccountNumber();
      const existing = await prisma.user.findUnique({
        where: { accountNumber }
      });
      if (!existing) isUnique = true;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        accountNumber,
        ifscCode: 'SBIN0001234',
        balance: 0,
        role: 'USER',
        isFrozen: false
      },
      select: {
        id: true,
        name: true,
        email: true,
        accountNumber: true,
        ifscCode: true,
        balance: true,
        role: true,
        createdAt: true
      }
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET1,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_REGISTERED',
        metadata: { email, accountNumber },
        ipAddress: req.ip
      }
    });

    res.status(201).json({
      message: 'Registration successful',
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.isFrozen) {
      return res.status(403).json({ message: 'Account is frozen. Contact admin.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET1,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        metadata: { email },
        ipAddress: req.ip
      }
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        accountNumber: user.accountNumber,
        ifscCode: user.ifscCode,
        balance: user.balance,
        role: user.role,
        isFrozen: user.isFrozen
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

const getProfile = async (req, res) => {
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
        isFrozen: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};

module.exports = { register, login, getProfile };