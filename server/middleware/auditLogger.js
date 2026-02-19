const { prisma } = require('../config/database');

const auditLogger = (action) => async (req, res, next) => {
  const originalSend = res.send.bind(res);
  
  res.send = async (body) => {
    try {
      if (req.user) {
        await prisma.auditLog.create({
          data: {
            userId: req.user.id,
            action,
            metadata: {
              method: req.method,
              path: req.path,
              body: req.body,
              statusCode: res.statusCode,
              ipAddress: req.ip
            },
            ipAddress: req.ip
          }
        });
      }
    } catch (error) {
      console.error('Audit log error:', error);
    }
    
    return originalSend(body);
  };
  
  next();
};

module.exports = auditLogger;