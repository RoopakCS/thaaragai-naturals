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
  numReviews: { type: Number, default: 0 },
  hasNutritionData: { type: Boolean, default: false },
  labTested: { type: Boolean, default: false },
  fssaiCompliant: { type: Boolean, default: false },
  nablAccredited: { type: Boolean, default: false },
  nutritionPer100g: {
    energy: { type: Number, default: null },
    protein: { type: Number, default: null },
    carbs: { type: Number, default: null },
    totalSugars: { type: Number, default: null },
    totalFat: { type: Number, default: null },
    transFat: { type: Number, default: null },
    sodium: { type: Number, default: null },
    calcium: { type: Number, default: null },
    vitaminC: { type: Number, default: null }
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
