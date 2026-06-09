const express = require('express');
const router = express.Router();
const { cloudinary, upload } = require('../config/cloudinary');
const { verifyToken } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

// Upload single product image
router.post('/product', verifyToken, adminAuth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    res.status(200).json({
      success: true,
      url: req.file.path,
      publicId: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
});

// Delete image from Cloudinary
router.delete('/product', verifyToken, adminAuth, async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      return res.status(400).json({ success: false, message: 'publicId is required' });
    }
    
    await cloudinary.uploader.destroy(publicId);
    res.status(200).json({ success: true, message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Deletion failed', error: error.message });
  }
});

module.exports = router;
