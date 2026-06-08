const { verifyToken } = require('./auth');

const adminAuth = (req, res, next) => {
  // verifyToken has already run and attached req.user
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: Admin privileges required.' });
  }
};

module.exports = { adminAuth };
