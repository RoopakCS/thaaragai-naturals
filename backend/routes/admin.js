const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { verifyToken } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');
const { cloudinary } = require('../config/cloudinary');

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
    ).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
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
      { inStock },
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
    const { name, category, price, weight, description, inStock, image, imagePublicId } = req.body;
    
    // Validate required fields
    if (!name || !category || price === undefined) {
      if (imagePublicId) {
        await cloudinary.uploader.destroy(imagePublicId).catch(err => console.error('Cloudinary cleanup failed:', err));
      }
      return res.status(400).json({ message: 'Name, category, and price are required' });
    }

    const newProduct = new Product({
      name,
      category,
      price,
      weight,
      description,
      inStock: inStock !== undefined ? inStock : true,
      image,
      imagePublicId
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
    const { name, category, price, weight, description, image, imagePublicId, inStock } = req.body;
    
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
      { name, category, price, weight, description, image, imagePublicId, inStock },
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
