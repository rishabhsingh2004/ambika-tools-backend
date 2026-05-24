const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const AdminSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
});

const Admin = mongoose.model('Admin', AdminSchema);

async function seedAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const existing = await Admin.findOne({ username: 'admin' });
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await Admin.create({
    username: 'admin',
    password: hashedPassword,
    email: 'rakeshjoshi9814@gmail.com',
  });
  
  console.log('✅ Admin created: admin / admin123');
  process.exit(0);
}

seedAdmin().catch(console.error);
