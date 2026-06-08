const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function generateSitemap() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    const Product = require('./models/Product');
    const products = await Product.find({});
    
    const baseUrl = 'https://ambikatools.in';
    const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/products</loc>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <priority>0.8</priority>
  </url>
`;

    for (const product of products) {
      xml += `  <url>
    <loc>${baseUrl}/products/item/${product._id.toString()}</loc>
    <priority>0.8</priority>
  </url>\n`;
    }

    xml += `</urlset>`;

    fs.writeFileSync(sitemapPath, xml);
    console.log('✅ sitemap.xml generated successfully at ' + sitemapPath);
    process.exit(0);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
