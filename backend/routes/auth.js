const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, verifyOTP, resendOTP, logout, googleAuth, getWishlist, toggleWishlist, subscribePush } = require('../controllers/authController');
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
router.get('/wishlist', verifyToken, getWishlist);
router.post('/wishlist/:productId', verifyToken, toggleWishlist);
router.post('/push-subscribe', verifyToken, subscribePush);

module.exports = router;
