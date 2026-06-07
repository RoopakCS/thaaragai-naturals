const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const products = [
  // Flours
  { name: 'Millet Dosa Flour', category: 'flours', price: 70, weight: '400g' },
  { name: 'Millet Chapathi Flour', category: 'flours', price: 70, weight: '400g' },
  { name: 'Adai Mix', category: 'flours', price: 85, weight: '300g' },
  
  // Beverages
  { name: 'Herbal Coffee Mix', category: 'beverages', price: 50, weight: '50g' },
  { name: 'Karuppatti Coffee Mix', category: 'beverages', price: 50, weight: '50g' },
  { name: 'Panai Pazham Milkshake Mix', category: 'beverages', price: 50, weight: '50g' },
  { name: 'Panankuruthu Milkshake Mix', category: 'beverages', price: 50, weight: '50g' },
  { name: 'Panankarkandu Milagu Paal Mix', category: 'beverages', price: 50, weight: '50g' },
  { name: 'Aavarampoo Herbal Tea', category: 'beverages', price: 50, weight: '50g' },
  { name: 'ABC Health Malt', category: 'beverages', price: 360, weight: '250g' },
  
  // Health Mixes
  { name: 'Karuppu Ulundhu Health Mix', category: 'health-mixes', price: 80, weight: '300g' },
  { name: 'Vendhayam Health Mix', category: 'health-mixes', price: 75, weight: '300g' },
  { name: 'Multi-Grain Health Mix', category: 'health-mixes', price: 85, weight: '300g' },
  
  // Podis
  { name: 'Idli Podi', category: 'podis', price: 80, weight: '100g' },
  { name: 'Poondu Podi', category: 'podis', price: 80, weight: '100g' },
  { name: 'Pirandai Podi', category: 'podis', price: 80, weight: '100g' },
  { name: 'Thoothuvalai Podi', category: 'podis', price: 80, weight: '100g' },
  { name: 'Mudakathaan Podi', category: 'podis', price: 80, weight: '100g' },
  { name: 'Vallarai Podi', category: 'podis', price: 80, weight: '100g' },
  { name: 'Kariveppilai Podi', category: 'podis', price: 80, weight: '100g' },
  { name: 'Murungai Ilai Podi', category: 'podis', price: 80, weight: '100g' },

  // Laddus
  { name: 'Millet Laddu (Box of 6)', category: 'laddus', price: 65, weight: 'Box of 6' },
  { name: 'Millet Laddu (Box of 15)', category: 'laddus', price: 155, weight: 'Box of 15' },
  { name: 'Kavuni Arisi Laddu', category: 'laddus', price: 65, weight: 'Box of 6' },
  { name: 'Thinai Laddu', category: 'laddus', price: 65, weight: 'Box of 6' },
  { name: 'Kambu Laddu', category: 'laddus', price: 65, weight: 'Box of 6' },
  { name: 'Paasiparuppu Laddu', category: 'laddus', price: 65, weight: 'Box of 6' },
  { name: 'Paasipayaru Laddu', category: 'laddus', price: 65, weight: 'Box of 6' },
  { name: 'Karuppu Ulunthu Laddu', category: 'laddus', price: 65, weight: 'Box of 6' },
  { name: 'Kelvaragu Laddu', category: 'laddus', price: 65, weight: 'Box of 6' },

  // Snacks
  { name: 'Millet Mysore Pak', category: 'snacks', price: 50, weight: '50g' },
  { name: 'Pumpkin Seed Mysore Pak', category: 'snacks', price: 50, weight: '50g' },
  { name: 'Kavuni Rice Halwa', category: 'snacks', price: 60, weight: '50g' },
  { name: 'Nuts Bar', category: 'snacks', price: 75, weight: '50g' },
  { name: 'Kelvaragu Mixture', category: 'snacks', price: 40, weight: '100g' },

  // Pickles
  { name: 'Eraal Pickle', category: 'pickles', price: 0, weight: 'per order' },
  { name: 'Karuvaadu Pickle', category: 'pickles', price: 0, weight: 'per order' },
  { name: 'Karuvaadu Thokku', category: 'pickles', price: 0, weight: 'per order' },
  { name: 'Mudakathaan Thokku', category: 'pickles', price: 0, weight: 'per order' },
  { name: 'Pirandai Thokku', category: 'pickles', price: 0, weight: 'per order' },

  // Personal Care
  { name: 'Herbal Face Pack', category: 'personal-care', price: 75 },
  { name: 'Night Cream', category: 'personal-care', price: 300 },
  { name: 'Vitamin-E Fairness Cream', category: 'personal-care', price: 100 },
  { name: 'Herbal Hair Oil', category: 'personal-care', price: 215 },
  { name: 'Aloe Vera Shampoo', category: 'personal-care', price: 130 },
  { name: 'Amla Shampoo', category: 'personal-care', price: 130 },
  { name: 'Eye Care Cream', category: 'personal-care', price: 75 }
];

const seedDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    await Product.insertMany(products);
    console.log('Inserted products successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
