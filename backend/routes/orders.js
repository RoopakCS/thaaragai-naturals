const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, phone } = req.body;
    
    // Update user phone number if provided
    if (phone) {
      const User = require('../models/User');
      await User.findByIdAndUpdate(req.user.id, { phone });
    }

    // Generate random 6 digit order number
    const orderNumber = `TN-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create new order
    const order = new Order({
      user: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      orderNumber
    });
    
    await order.save();
    
    // Clear the cart
    const cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items = [];
      cart.updatedAt = Date.now();
      await cart.save();
    }
    
    // Notify admins asynchronously
    const { sendNotificationToAdmins } = require('../utils/push');
    sendNotificationToAdmins({
      title: 'New Order Received!',
      body: `Order ${orderNumber} has been placed.`,
      url: '/admin/orders'
    }).catch(err => console.error('Failed to send admin push notification', err));

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/my', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
