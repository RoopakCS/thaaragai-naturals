require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/thaaragai').then(async () => {
  try {
    const products = await Product.find({ $or: [{ image: null }, { image: "" }, { image: { $exists: false } }] });
    console.log("Products missing images:");
    products.forEach(p => console.log(`- ${p.name} (${p.category})`));
  } catch(e) {
    console.error(e);
  } finally {
    mongoose.disconnect();
  }
});
