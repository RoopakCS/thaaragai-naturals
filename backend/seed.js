const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product'); // Adjust path if your model is located elsewhere

// 1. Define your specific User ID here
// It is recommended to use environment variables for sensitive IDs:
const myUserId = process.env.ADMIN_USER_ID || 'YOUR_ADMIN_USER_ID_HERE'; 

const products = [
  // --- FLOURS ---
  {
    name: "Millet Dosa Flour",
    tamilName: "சிறுதானிய தோசை மாவு",
    category: "flours",
    price: 70,
    weight: "400g",
    hasNutritionData: true,
    labTested: true,
    fssaiCompliant: true,
    nablAccredited: true,
    nutritionPer100g: {
      energy: 423,
      protein: 10,
      carbs: 69.4,
      totalSugars: 0.1,
      totalFat: 11.7,
      transFat: 0.1,
      sodium: 4.5,
      calcium: 56.5,
      vitaminC: 0.2
    }
  },
  {
    name: "Millet Chapathi Flour",
    tamilName: "சிறுதானிய சப்பாத்தி மாவு",
    category: "flours",
    price: 70,
    weight: "400g",
    hasNutritionData: true,
    labTested: true,
    fssaiCompliant: true,
    nablAccredited: true,
    nutritionPer100g: {
      energy: 432,
      protein: 7.1,
      carbs: 74.4,
      totalSugars: 0.1,
      totalFat: 11.8,
      transFat: 0.1,
      sodium: 6.3,
      calcium: 106.3,
      vitaminC: 0.6
    }
  },
  {
    name: "Adai Mix",
    tamilName: "அடை மாவு",
    category: "flours",
    price: 85,
    weight: "300g"
  },

  // --- BEVERAGE MIXES ---
  {
    name: "Herbal Coffee Mix",
    tamilName: "மூலிகை காபி பொடி",
    category: "beverages",
    price: 50,
    weight: "50g",
    hasNutritionData: true,
    labTested: true,
    fssaiCompliant: true,
    nablAccredited: true,
    nutritionPer100g: {
      energy: 403,
      protein: 10.2,
      carbs: 67.4,
      totalSugars: 0.1,
      totalFat: 10.3,
      transFat: 0.1,
      sodium: 4.5,
      calcium: 172.2,
      vitaminC: 8.5
    }
  },
  {
    name: "Karuppatti Coffee Mix",
    tamilName: "கருப்பட்டி காபி பொடி",
    category: "beverages",
    price: 50,
    weight: "50g"
  },
  {
    name: "ABC Health Malt",
    tamilName: "ஏபிசி ஆரோக்கிய மால்ட்",
    category: "beverages",
    price: 360,
    weight: "250g"
  },
  {
    name: "Panai Pazham Milkshake Mix",
    tamilName: "பனைப் பழ மில்க்ஷேக் கலவை",
    category: "beverages",
    price: 50,
    weight: "50g"
  },
  {
    name: "Panankuruthu Milkshake Mix",
    tamilName: "பனங்குருத்து மில்க்ஷேக் கலவை",
    category: "beverages",
    price: 50,
    weight: "50g"
  },
  {
    name: "Panankarkandu Milagu PaalMilk Mix",
    tamilName: "பனங்கற்கண்டு மிளகு பால் கலவை",
    category: "beverages",
    price: 50,
    weight: "50g"
  },
  {
    name: "Aavarampoo Herbal Tea",
    tamilName: "ஆவரம்பூ மூலிகை தேநீர் கலவை",
    category: "beverages",
    price: 50,
    weight: "50g"
  },

  // --- TRADITIONAL HEALTH MIXES ---
  {
    name: "Karuppu Ulundhu Health Mix",
    tamilName: "கருப்பு உளுந்து களி மாவு",
    category: "health-mixes",
    price: 80,
    weight: "300g",
    hasNutritionData: true,
    labTested: true,
    fssaiCompliant: true,
    nablAccredited: true,
    nutritionPer100g: {
      energy: 395,
      protein: 10.4,
      carbs: 80.7,
      totalSugars: 0.1,
      totalFat: 3.4,
      transFat: 0.1,
      sodium: 2.6,
      calcium: 247.6,
      vitaminC: 0.6
    }
  },
  {
    name: "Vendhayam Health Mix",
    tamilName: "வெந்தயம் களி மாவு",
    category: "health-mixes",
    price: 75,
    weight: "300g"
  },
  {
    name: "Multi-Grain Health Mix",
    tamilName: "பல்தானிய சத்து மாவு",
    category: "health-mixes",
    price: 85,
    weight: "300g",
    hasNutritionData: true,
    labTested: true,
    fssaiCompliant: true,
    nablAccredited: true,
    nutritionPer100g: {
      energy: 401,
      protein: 9.1,
      carbs: 80.5,
      totalSugars: 0.1,
      totalFat: 4.7,
      transFat: 0.1,
      sodium: 4.2,
      calcium: 102,
      vitaminC: 0.9
    }
  },

  // --- IDLI/RICE POWDER (PODIS) ---
  {
    name: "Idli Podi",
    tamilName: "இட்லி பொடி",
    category: "podis",
    price: 80,
    weight: "100g"
  },
  {
    name: "Poondu Podi",
    tamilName: "பூண்டு பொடி",
    category: "podis",
    price: 80,
    weight: "100g"
  },
  {
    name: "Pirandai Podi",
    tamilName: "பிரண்டை பொடி",
    category: "podis",
    price: 80,
    weight: "100g"
  },
  {
    name: "Thoothuvalai Podi",
    tamilName: "தூதுவளை பொடி",
    category: "podis",
    price: 80,
    weight: "100g"
  },
  {
    name: "Mudakathaan Podi",
    tamilName: "முடக்கத்தான் பொடி",
    category: "podis",
    price: 80,
    weight: "100g"
  },
  {
    name: "Vallarai Podi",
    tamilName: "வல்லாரை பொடி",
    category: "podis",
    price: 80,
    weight: "100g"
  },
  {
    name: "Kariveppilai Podi",
    tamilName: "கறிவேப்பிலை பொடி",
    category: "podis",
    price: 80,
    weight: "100g"
  },
  {
    name: "Murungai Ilai Podi",
    tamilName: "முருங்கை இலை பொடி",
    category: "podis",
    price: 80,
    weight: "100g"
  },

  // --- THOKKU & PICKLES ---
  {
    name: "Eraal Pickle",
    tamilName: "இறால் ஊறுகாய்",
    category: "pickles",
    price: 0
  },
  {
    name: "Karuvaadu Pickle",
    tamilName: "கருவாடு ஊறுகாய்",
    category: "pickles",
    price: 0
  },
  {
    name: "Karuvaadu Thokku",
    tamilName: "கருவாடு தொக்கு",
    category: "pickles",
    price: 0
  },
  {
    name: "Mudakathaan Thokku",
    tamilName: "முடக்கத்தான் தொக்கு",
    category: "pickles",
    price: 0
  },
  {
    name: "Pirandai Thokku",
    tamilName: "பிரண்டை தொக்கு",
    category: "pickles",
    price: 0
  },

  // --- MILLET LADDU ---
  {
    name: "Millet Laddu (Box of 6)",
    tamilName: "சிறுதானிய லட்டு",
    category: "laddus",
    price: 65
  },
  {
    name: "Millet Laddu (Box of 15)",
    tamilName: "சிறுதானிய லட்டு",
    category: "laddus",
    price: 155
  },
  {
    name: "Kavuni Arisi Laddu (Box of 6)",
    tamilName: "கவுனி அரிசி லட்டு",
    category: "laddus",
    price: 65
  },
  {
    name: "Thinai Laddu (Box of 6)",
    tamilName: "தினை லட்டு",
    category: "laddus",
    price: 65
  },
  {
    name: "Kambu Laddu (Box of 6)",
    tamilName: "கம்பு லட்டு",
    category: "laddus",
    price: 65
  },
  {
    name: "Paasiparuppu Laddu (Box of 6)",
    tamilName: "பாசிப்பருப்பு லட்டு",
    category: "laddus",
    price: 65
  },
  {
    name: "Paasipayaru Laddu (Box of 6)",
    tamilName: "பாசிப்பயறு லட்டு",
    category: "laddus",
    price: 65
  },
  {
    name: "Karuppu Ulunthu Laddu (Box of 6)",
    tamilName: "கருப்பு உளுந்து லட்டு",
    category: "laddus",
    price: 65
  },
  {
    name: "Kelvaragu Laddu (Box of 6)",
    tamilName: "கேழ்வரகு லட்டு",
    category: "laddus",
    price: 65
  },

  // --- HEALTHY SNACKS ---
  {
    name: "Millet Mysore Pak",
    tamilName: "சிறுதானிய மைசூர் பாக்",
    category: "snacks",
    price: 50,
    weight: "50g"
  },
  {
    name: "Pumpkin Seed Mysore Pak",
    tamilName: "பூசணி விதை மைசூர் பாக்",
    category: "snacks",
    price: 50,
    weight: "50g"
  },
  {
    name: "Kavuni Rice Halwa",
    tamilName: "கருப்பு கவுனி அரிசி அல்வா",
    category: "snacks",
    price: 60,
    weight: "50g"
  },
  {
    name: "Nuts Bar",
    tamilName: "நட்ட்ஸ் பார்",
    category: "snacks",
    price: 75,
    weight: "50g"
  },
  {
    name: "Kelvaragu Mixture",
    tamilName: "கேழ்வரகு மிக்சர்",
    category: "snacks",
    price: 40,
    weight: "100g"
  },

  // --- HERBAL PERSONAL CARE PRODUCTS ---
  {
    name: "Herbal Face Pack",
    tamilName: "ஹெர்பல் ஃபேஸ் பேக்",
    category: "personal-care",
    price: 75
  },
  {
    name: "Night Cream",
    tamilName: "நைட் கிரீம்",
    category: "personal-care",
    price: 300
  },
  {
    name: "Vitamin-E Fairness Cream",
    tamilName: "விடமின்-E ஃபேர்னஸ் கிரீம்",
    category: "personal-care",
    price: 100
  },
  {
    name: "Herbal Hair Oil",
    tamilName: "ஹெர்பல் ஹேர் ஆயில்",
    category: "personal-care",
    price: 215
  },
  {
    name: "Aloe Vera Shampoo",
    tamilName: "அலோவேரா ஷாம்பு",
    category: "personal-care",
    price: 130
  },
  {
    name: "Amla Shampoo",
    tamilName: "ஆம்லா ஷாம்பு",
    category: "personal-care",
    price: 130
  },
  {
    name: "Eye Care Cream",
    tamilName: "கண் பராமரிப்பு கிரீம்",
    category: "personal-care",
    price: 75
  }
];

const seedDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing in your environment variables.');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    // 2. Map over the array to inject the user ID dynamically
    const productsWithUser = products.map(product => ({
      ...product,
      createdBy: myUserId,
      updatedBy: myUserId
    }));

    // 3. Insert the newly mapped array!
    await Product.insertMany(productsWithUser);
    console.log('Inserted all products successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();