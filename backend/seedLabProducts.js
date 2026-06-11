// seedLabProducts.js
// Run from backend/ folder: node seedLabProducts.js
// This script inserts the 5 NABL lab-tested products from
// Enviro Care India Test Reports (ECI-FD-2025/06/190 to 194)

const mongoose = require('mongoose')
require('dotenv').config()

// ── Inline schema matching your existing Product model ──────────────────────
const productSchema = new mongoose.Schema(
  {
    name:           { type: String, required: true },
    tamilName:      { type: String, default: '' },
    category:       { type: String, required: true },
    price:          { type: Number, required: true },
    weight:         { type: String, default: '' },
    description:    { type: String, default: '' },
    inStock:        { type: Boolean, default: true },
    image:          { type: String, default: '' },
    imagePublicId:  { type: String, default: '' },
    isDeleted:      { type: Boolean, default: false },

    // ratings
    averageRating:  { type: Number, default: 0 },
    numReviews:     { type: Number, default: 0 },
    reviews:        { type: Array,  default: [] },

    // lab / nutrition
    hasNutritionData: { type: Boolean, default: false },
    labTested:        { type: Boolean, default: false },
    fssaiCompliant:   { type: Boolean, default: false },
    nablAccredited:   { type: Boolean, default: false },
    nutritionPer100g: {
      energy:      { type: Number, default: null },
      protein:     { type: Number, default: null },
      carbs:       { type: Number, default: null },
      totalSugars: { type: Number, default: null },
      totalFat:    { type: Number, default: null },
      transFat:    { type: Number, default: null },
      sodium:      { type: Number, default: null },
      calcium:     { type: Number, default: null },
      vitaminC:    { type: Number, default: null },
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
)

const Product = mongoose.models.Product || mongoose.model('Product', productSchema)

// ── Product data extracted from lab reports ─────────────────────────────────
// All nutrition values are per 100g
// Report ECI-FD-2025/06/190 → Health Mix
// Report ECI-FD-2025/06/191 → Multi Grain Chapati Flour
// Report ECI-FD-2025/06/192 → Multi Grain Dosa Mix
// Report ECI-FD-2025/06/193 → Ulunthankali Mix (Karuppu Ulundhu)
// Report ECI-FD-2025/06/194 → Masala Coffee Powder

const labProducts = [
  {
    // ── Report ECI-FD-2025/06/190 ──────────────────────────────────────────
    name:        'Health Mix',
    category:    'health-mixes',
    price:       85,           // ← fill correct price
    weight:      '300g',       // ← fill correct weight
    description: '',           // ← fill description
    image:       '',           // ← add Cloudinary URL after upload
    imagePublicId: '',

    hasNutritionData: true,
    labTested:        true,
    fssaiCompliant:   true,
    nablAccredited:   true,

    nutritionPer100g: {
      energy:      401,   // Kcal/100g
      protein:     9.1,   // g/100g
      carbs:       80.5,  // g/100g
      totalSugars: 0.1,   // g/100g  (<0.1 reported — using 0.1)
      totalFat:    4.7,   // g/100g
      transFat:    0.1,   // g/100g  (<0.1 reported — using 0.1)
      sodium:      4.2,   // mg/kg converted → 0.42 mg/100g
                          // Note: PDF shows mg/kg unit for sodium
                          // 4.2 mg/kg = 0.42 mg/100g
                          // Stored as 4.2 (mg/kg) — adjust display accordingly
      calcium:     102,   // mg/100g
      vitaminC:    0.9,   // mg/100g
    },
  },

  {
    // ── Report ECI-FD-2025/06/191 ──────────────────────────────────────────
    name:        'Multi Grain Chapati Flour',
    category:    'flours',
    price:       70,           // ← verify price
    weight:      '400g',       // ← verify weight
    description: '',
    image:       '',
    imagePublicId: '',

    hasNutritionData: true,
    labTested:        true,
    fssaiCompliant:   true,
    nablAccredited:   true,

    nutritionPer100g: {
      energy:      432,
      protein:     7.1,
      carbs:       74.4,
      totalSugars: 0.1,
      totalFat:    11.8,
      transFat:    0.1,
      sodium:      6.3,   // mg/kg (same note as above)
      calcium:     106.3,
      vitaminC:    0.6,
    },
  },

  {
    // ── Report ECI-FD-2025/06/192 ──────────────────────────────────────────
    name:        'Multi Grain Dosa Mix',
    category:    'flours',
    price:       70,           // ← fill correct price
    weight:      '400g',       // ← fill correct weight
    description: '',
    image:       '',
    imagePublicId: '',

    hasNutritionData: true,
    labTested:        true,
    fssaiCompliant:   true,
    nablAccredited:   true,

    nutritionPer100g: {
      energy:      423,
      protein:     10.0,
      carbs:       69.4,
      totalSugars: 0.1,
      totalFat:    11.7,
      transFat:    0.1,
      sodium:      4.5,   // mg/kg
      calcium:     56.5,
      vitaminC:    0.2,
    },
  },

  {
    // ── Report ECI-FD-2025/06/193 ──────────────────────────────────────────
    name:        'Karuppu Ulundhu Health Mix',
    category:    'health-mixes',
    price:       80,           // ← verify price
    weight:      '300g',       // ← verify weight
    description: '',
    image:       '',
    imagePublicId: '',

    hasNutritionData: true,
    labTested:        true,
    fssaiCompliant:   true,
    nablAccredited:   true,

    nutritionPer100g: {
      energy:      395,
      protein:     10.4,
      carbs:       80.7,
      totalSugars: 0.1,
      totalFat:    3.4,
      transFat:    0.1,
      sodium:      2.6,   // mg/kg
      calcium:     247.6, // highest calcium among all tested products
      vitaminC:    0.6,
    },
  },

  {
    // ── Report ECI-FD-2025/06/194 ──────────────────────────────────────────
    name:        'Karuppatti Coffee Mix',
    category:    'beverages',
    price:       50,           // ← verify price
    weight:      '50g',        // ← verify weight
    description: '',
    image:       '',
    imagePublicId: '',

    hasNutritionData: true,
    labTested:        true,
    fssaiCompliant:   true,
    nablAccredited:   true,

    nutritionPer100g: {
      energy:      403,
      protein:     10.2,
      carbs:       67.4,
      totalSugars: 0.1,
      totalFat:    10.3,
      transFat:    0.1,
      sodium:      4.5,   // mg/kg
      calcium:     172.2,
      vitaminC:    8.5,   // highest Vitamin C among all tested products
    },
  },
]

// ── Main ────────────────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    let inserted = 0
    let skipped  = 0

    for (const data of labProducts) {
      // Check if a product with same name already exists
      const existing = await Product.findOne({
        name: { $regex: new RegExp(`^${data.name}$`, 'i') },
        isDeleted: { $ne: true },
      })

      if (existing) {
        // Update nutrition data on existing product instead of duplicating
        await Product.findByIdAndUpdate(existing._id, {
          hasNutritionData: true,
          labTested:        true,
          fssaiCompliant:   true,
          nablAccredited:   true,
          nutritionPer100g: data.nutritionPer100g,
        })
        console.log(`🔄 Updated nutrition for existing: "${existing.name}"`)
        skipped++
      } else {
        await Product.create(data)
        console.log(`➕ Inserted new product: "${data.name}"`)
        inserted++
      }
    }

    console.log('\n── Seed complete ──────────────────────────────')
    console.log(`   Inserted : ${inserted} new products`)
    console.log(`   Updated  : ${skipped} existing products`)
    console.log('\n⚠️  Remember to fill in these fields manually:')
    console.log('   • price      — verify against your menu')
    console.log('   • weight     — verify against your packaging')
    console.log('   • description — add Tamil/English product description')
    console.log('   • image      — upload to Cloudinary and paste URL')
    console.log('\n📌 Sodium note:')
    console.log('   PDF reports sodium in mg/kg.')
    console.log('   Stored values are mg/kg — divide by 10 for mg/100g display.')
    console.log('   e.g. 4.2 mg/kg = 0.42 mg/100g (very low sodium)')

  } catch (err) {
    console.error('❌ Seed failed:', err.message)
  } finally {
    await mongoose.disconnect()
    console.log('\n🔌 Disconnected from MongoDB')
  }
}

seed()
