const mongoose = require('mongoose');
require('dotenv').config();

const CategorySchema = new mongoose.Schema({
  id: String,
  label: String,
  icon: String,
});

const Category = mongoose.model('Category', CategorySchema);

async function seedCategories() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  await Category.deleteMany({});
  
  await Category.insertMany([
    { id: 'cash-counting', label: 'Cash Counting Machines', icon: '💵' },
    { id: 'gold-melting', label: 'Gold Melting Machines', icon: '🔥' },
    { id: 'weighing', label: 'Gold & Silver Weighing Machines', icon: '⚖️' },
    { id: 'safe-locker', label: 'Safe Lockers', icon: '🔒' },
  ]);
  
  console.log('✅ Categories seeded');
  process.exit(0);
}

seedCategories().catch(console.error);
