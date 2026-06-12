require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { generateSKU } = require('../utils/skuGenerator');

const migrateSKUs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({ sku: { $exists: false } });
    console.log(`Found ${products.length} products without SKU.`);

    for (const product of products) {
      const sku = await generateSKU(product.category, product.weight, product.name);
      product.sku = sku;
      await product.save();
      console.log(`Generated SKU ${sku} for product: ${product.name}`);
    }

    console.log('Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
};

migrateSKUs();
