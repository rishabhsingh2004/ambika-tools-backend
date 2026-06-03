const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const IMAGES_DIR = 'C:\\Users\\HP\\Downloads\\product-images';
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const productImageMap = [
  { name: 'Strong Room Door', file: '01-strong-room-door.jpeg' },
  { name: 'Heavy Duty Fire & Burglar Safe', file: '02-heavy-duty-fire-burglar-safe.jpeg' },
  { name: 'Bank Lockers', file: '03-bank-lockers.jpeg' },
  { name: 'Drop-In Safes', file: '04-drop-in-safes.jpeg' },
  { name: 'Hotel Safes', file: '05-hotel-safes.jpeg' },
  { name: 'Luxury Safes — Tiger Series', file: '06-luxury-safes-tiger-series.jpeg' },
  { name: 'Gun Safes', file: '07-gun-safes.jpeg' },
  { name: 'Home & Office Safe', file: '08-home-office-safe.jpeg' },
  { name: 'Counter Safes', file: '09-counter-safes.jpeg' },
  { name: 'AS-6 Single Door Safe — 2.25ft', file: '10-as6-single-door-safe-225ft.jpeg' },
  { name: '2.5ft Safe', file: '11-25ft-safe.jpeg' },
  { name: 'AS-10 Safe — 3.5ft', file: '12-as10-safe-35ft.jpeg' },
  { name: 'AND EK-610GD Weighing Scale', file: '13-and-ek610gd-weighing-scale.jpeg' },
  { name: 'AND EK-610V Gold Weighing Scale', file: '14-and-ek610v-gold-weighing-scale.jpeg' },
  { name: 'Contech CTL Series Scale', file: '15-contech-ctl-series-scale.jpeg' },
  { name: 'Essae Jewellery Scale', file: '16-essae-jewellery-scale.jpeg' },
];

async function uploadImages() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');

  const Product = require('./models/Product');

  for (const item of productImageMap) {
    const imagePath = path.join(IMAGES_DIR, item.file);

    if (!fs.existsSync(imagePath)) {
      console.log(`❌ File not found: ${item.file}`);
      continue;
    }

    try {
      console.log(`Uploading: ${item.name}...`);
      
      const result = await cloudinary.uploader.upload(imagePath, {
        folder: 'ambika_tools_products',
        public_id: item.file.replace('.jpeg', ''),
        overwrite: true,
        transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }]
      });

      await Product.findOneAndUpdate(
        { name: item.name },
        { image: result.secure_url },
        { new: true }
      );

      console.log(`✅ Done: ${item.name}`);
      console.log(`   URL: ${result.secure_url}`);

    } catch (err) {
      console.log(`❌ Error for ${item.name}: ${err.message}`);
    }
  }

  console.log('\n✅ All done! Images uploaded and MongoDB updated.');
  process.exit();
}

uploadImages().catch(console.error);
