const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/google-merchant.xml', async (req, res) => {
  try {
    const products = await Product.find();
    
    // Base URL of the frontend
    const baseUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',')[0] : 'https://thaaragainaturals.com';

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Thaaragai Naturals</title>
    <link>${baseUrl}</link>
    <description>Authentic traditional and natural products from Thaaragai Naturals.</description>
`;

    const escapeXml = (unsafe) => {
      if (!unsafe) return '';
      return String(unsafe).replace(/[<>&'"]/g, function (c) {
        switch (c) {
          case '<': return '&lt;';
          case '>': return '&gt;';
          case '&': return '&amp;';
          case '\'': return '&apos;';
          case '"': return '&quot;';
        }
      });
    };

    for (const product of products) {
      const title = escapeXml(product.name);
      // Fallback to name if description is missing
      let description = escapeXml(product.description);
      if (!description || description.trim() === '') {
        description = title;
      }
      
      const link = `${baseUrl}/product/${product._id}`;
      const imageLink = product.image ? escapeXml(product.image) : '';
      const availability = product.inStock ? 'in_stock' : 'out_of_stock';
      const price = `${product.price}.00 INR`; // Assuming price is in INR
      const id = escapeXml(product.sku || product._id.toString());

      let formattedWeight = '500 g'; // Default shipping weight if missing
      if (product.weight) {
        // e.g., "500g" -> "500 g", "1kg" -> "1 kg"
        const match = product.weight.match(/(\d+(?:\.\d+)?)\s*(g|kg|ml|l)/i);
        if (match) {
          let unit = match[2].toLowerCase();
          if (unit === 'ml') unit = 'g'; // Google expects mass units for shipping
          if (unit === 'l') unit = 'kg';
          formattedWeight = `${match[1]} ${unit}`;
        }
      }

      xml += `    <item>
      <g:id>${id}</g:id>
      <g:title>${title}</g:title>
      <g:description>${description}</g:description>
      <g:link>${link}</g:link>
      <g:image_link>${imageLink}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${price}</g:price>
      <g:shipping_weight>${formattedWeight}</g:shipping_weight>
      <g:condition>new</g:condition>
      <g:brand>Thaaragai Naturals</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
    </item>\n`;
    }

    xml += `  </channel>\n</rss>`;

    res.set('Content-Type', 'text/xml');
    res.send(xml);
  } catch (error) {
    console.error('Error generating Google Merchant feed:', error);
    res.status(500).send('Error generating XML feed');
  }
});

module.exports = router;
