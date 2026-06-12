const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { verifyToken } = require('../middleware/auth');
const { adminAuth, superAdminAuth } = require('../middleware/adminAuth');
const { cloudinary } = require('../config/cloudinary');
const { generateSKU } = require('../utils/skuGenerator');

// Apply middleware to all routes in this file
router.use(verifyToken, adminAuth);

// GET all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email pushSubscriptions'); // also populate pushSubscriptions if user is not fully populated, but User schema defines it.
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Notify customer
    if (order.user) {
      const { sendNotificationToUser } = require('../utils/push');
      sendNotificationToUser(order.user, {
        title: 'Order Status Updated',
        body: `Your order ${order.orderNumber} is now ${status}.`,
        url: '/orders'
      }).catch(err => console.error('Failed to send push notification to user', err));
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT update user role (Super Admin only)
router.put('/users/:id/role', superAdminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin', 'super_admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    // Prevent a super admin from demoting themselves to avoid locking out the system
    if (req.params.id === req.user.id && role !== 'super_admin') {
      return res.status(400).json({ message: 'Cannot demote your own account' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    res.status(200).json({
      totalOrders,
      totalUsers,
      totalProducts,
      pendingOrders,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT update product stock status
router.put('/products/:id/stock', async (req, res) => {
  try {
    const { inStock } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { inStock, updatedBy: req.user.id },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST create new product
router.post('/products', async (req, res) => {
  try {
    const { name, tamilName, category, price, weight, description, inStock, image, imagePublicId, hasNutritionData, labTested, fssaiCompliant, nablAccredited, nutritionPer100g } = req.body;
    
    // Validate required fields
    if (!name || !category || price === undefined) {
      if (imagePublicId) {
        await cloudinary.uploader.destroy(imagePublicId).catch(err => console.error('Cloudinary cleanup failed:', err));
      }
      return res.status(400).json({ message: 'Name, category, and price are required' });
    }

    const sku = await generateSKU(category, weight, name);

    const newProduct = new Product({
      name,
      sku,
      tamilName,
      category,
      price,
      weight,
      description,
      inStock: inStock !== undefined ? inStock : true,
      image,
      imagePublicId,
      hasNutritionData,
      labTested,
      fssaiCompliant,
      nablAccredited,
      nutritionPer100g,
      createdBy: req.user.id
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    if (req.body.imagePublicId) {
      await cloudinary.uploader.destroy(req.body.imagePublicId).catch(err => console.error('Cloudinary cleanup failed:', err));
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT update product details
router.put('/products/:id', async (req, res) => {
  try {
    const { name, tamilName, category, price, weight, description, image, imagePublicId, inStock, hasNutritionData, labTested, fssaiCompliant, nablAccredited, nutritionPer100g } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Non-blocking old image deletion if replaced
    if (product.imagePublicId && imagePublicId && imagePublicId !== product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId).catch(err => {
        console.error('Non-blocking Cloudinary delete failed:', err);
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, tamilName, category, price, weight, description, image, imagePublicId, inStock, hasNutritionData, labTested, fssaiCompliant, nablAccredited, nutritionPer100g, updatedBy: req.user.id },
      { new: true }
    );
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId).catch(err => {
        console.error('Cloudinary delete failed during product deletion:', err);
      });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
