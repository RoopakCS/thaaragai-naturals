const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['flours', 'beverages', 'health-mixes', 'podis', 'laddus', 'snacks', 'pickles', 'personal-care']
  },
  price: { type: Number, required: true },
  weight: { type: String },
  description: { type: String },
  inStock: { type: Boolean, default: true },
  image: { type: String, default: "" }
});

module.exports = mongoose.model('Product', productSchema);
