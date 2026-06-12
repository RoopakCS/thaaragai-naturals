const Product = require('../models/Product');
const crypto = require('crypto');

const generateSKU = async (category, weight, name) => {
  const categoryPrefixMap = {
    'flours': 'FLR',
    'beverages': 'BEV',
    'health-mixes': 'HLM',
    'podis': 'PDI',
    'laddus': 'LDU',
    'snacks': 'SNK',
    'pickles': 'PCK',
    'personal-care': 'PNC'
  };

  let prefix = categoryPrefixMap[category] || 'GEN';
  
  if (!categoryPrefixMap[category] && name) {
    prefix = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
  }

  let weightStr = '';
  if (weight) {
    // extract alphanumeric characters e.g. "500g" -> "500G"
    weightStr = '-' + weight.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  }

  let sku = '';
  let isUnique = false;
  
  while (!isUnique) {
    const randomSuffix = crypto.randomBytes(2).toString('hex').toUpperCase(); // 4 chars
    sku = `${prefix}${weightStr}-${randomSuffix}`;
    
    const existing = await Product.findOne({ sku });
    if (!existing) {
      isUnique = true;
    }
  }

  return sku;
};

module.exports = { generateSKU };
