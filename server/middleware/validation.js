const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const depositSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().optional(),
});

const withdrawSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().optional(),
});

const transferSchema = z.object({
  receiverAccountNumber: z.string().length(12, 'Invalid account number'),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().optional(),
});

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.errors.map(e => ({ field: e.path[0], message: e.message }))
      });
    }
    next(error);
  }
};

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  depositSchema,
  withdrawSchema,
  transferSchema
};