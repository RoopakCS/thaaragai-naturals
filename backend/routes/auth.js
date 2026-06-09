const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, verifyOTP, resendOTP, logout, googleAuth } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Note: try { } catch (e) {} error handling and validate() res.status() are inside controllers
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/google', googleAuth);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

module.exports = router;
