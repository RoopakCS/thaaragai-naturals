const { verifyToken } = require('./auth');

const adminAuth = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'super_admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: Admin privileges required.' });
  }
};

const superAdminAuth = (req, res, next) => {
  if (req.user && req.user.role === 'super_admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: Super Admin privileges required.' });
  }
};

module.exports = { adminAuth, superAdminAuth };
