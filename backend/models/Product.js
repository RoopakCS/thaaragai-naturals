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
  image: { type: String, default: "" },
  imagePublicId: { type: String, default: "" },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  averageRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 }
});

module.exports = mongoose.model('Product', productSchema);
