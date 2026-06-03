const mongoose = require('mongoose');
require('dotenv').config();

async function seedProducts() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Product = require('./models/Product');
  await Product.deleteMany({});

  const products = [
    // ===== SAFE LOCKERS =====
    {
      name: 'Strong Room Door',
      categoryId: 'safe-locker',
      tagline: 'Bank-grade vault protection',
      specs: new Map([
        ['Lock Type', 'Electronic + Key Lock'],
        ['Inner Door', 'Grill Door'],
        ['Handle', 'Spanner Rotating'],
        ['Locking', 'Multi-point bolts'],
        ['Color', 'Ivory/White'],
        ['Usage', 'Banks, Vaults, Jewellers']
      ]),
      image: ''
    },
    {
      name: 'Heavy Duty Fire & Burglar Safe',
      categoryId: 'safe-locker',
      tagline: 'Indestructible — Nisho Series',
      specs: new Map([
        ['Lock Type', 'Digital + Key'],
        ['Handle', 'Anti-Spoke Rotating'],
        ['Resistance', 'Fire, Drill, Torch, Burglar'],
        ['Color', 'Grey & White'],
        ['Series', 'Nisho'],
        ['Usage', 'Jewellers, Offices, Banks']
      ]),
      image: ''
    },
    {
      name: 'Bank Lockers',
      categoryId: 'safe-locker',
      tagline: 'Secure lockers for financial institutions',
      specs: new Map([
        ['Units', 'Up to 90+ compartments'],
        ['Lock Type', 'Dual Key'],
        ['Numbering', 'A1 to A90+'],
        ['Material', 'Heavy Steel'],
        ['Usage', 'Banks, Financial Institutions']
      ]),
      image: ''
    },
    {
      name: 'Drop-In Safes',
      categoryId: 'safe-locker',
      tagline: 'Secure cash drop for retail & petrol pumps',
      specs: new Map([
        ['Drop Slot', 'Top Cash Slot'],
        ['Lock Type', 'Digital / Mechanical'],
        ['Handle', 'Anti-Spoke Rotating'],
        ['Colors', 'Beige, Grey'],
        ['Usage', 'Petrol Pumps, Retail, Hotels']
      ]),
      image: ''
    },
    {
      name: 'Hotel Safes',
      categoryId: 'safe-locker',
      tagline: 'Compact in-room security for hotels',
      specs: new Map([
        ['Lock Type', 'Digital Circular Keypad'],
        ['Handle', 'D-Handle'],
        ['Color', 'Black'],
        ['Form', 'Compact Horizontal'],
        ['Usage', 'Hotel Rooms, Resorts']
      ]),
      image: ''
    },
    {
      name: 'Luxury Safes — Tiger Series',
      categoryId: 'safe-locker',
      tagline: 'Security that makes a statement',
      specs: new Map([
        ['Design', 'Tiger Print Laser Cut'],
        ['Lock Type', 'Digital'],
        ['Interior', 'Glass Shelves + Velvet Drawer'],
        ['Color', 'Ivory with Black Print'],
        ['Usage', 'Home, Bedroom, Luxury Office']
      ]),
      image: ''
    },
    {
      name: 'Gun Safes',
      categoryId: 'safe-locker',
      tagline: 'Licensed firearm storage — max security',
      specs: new Map([
        ['Lock Type', 'Digital + Dual Key'],
        ['Inner Lockbox', 'Digital (ammo/docs)'],
        ['Handle', 'Spanner Rotating'],
        ['Color', 'Grey & White'],
        ['Usage', 'Licensed Owners, Police, Army']
      ]),
      image: ''
    },
    {
      name: 'Home & Office Safe',
      categoryId: 'safe-locker',
      tagline: 'Everyday security for home & workplace',
      specs: new Map([
        ['Lock Type', 'Key + Digital'],
        ['Interior', 'Red Carpet Lining'],
        ['Shelf', '1 Adjustable Shelf'],
        ['Color', 'Ivory/White'],
        ['Usage', 'Home, Office, Shop']
      ]),
      image: ''
    },
    {
      name: 'Counter Safes',
      categoryId: 'safe-locker',
      tagline: 'Under-counter security for jewellers',
      specs: new Map([
        ['Units/Set', '6-8 compartments'],
        ['Lock Type', 'Key + Spanner Handle'],
        ['Color', 'Ivory/Cream'],
        ['Mounting', 'Under Counter'],
        ['Usage', 'Jewellery Shops, Gold Shops']
      ]),
      image: ''
    },
    {
      name: 'AS-6 Single Door Safe — 2.25ft',
      categoryId: 'safe-locker',
      tagline: "India's trusted fire & burglar safe",
      specs: new Map([
        ['Weight', '370 kg ±5%'],
        ['Volume', '56 litres'],
        ['Inner Dims', '14.3" W x 11.7" D x 20.3" H'],
        ['Bolts', '30mm, 2-sided locking'],
        ['Lock', 'Digital / Fingerprint / SMS / 4G'],
        ['Colors', 'Black, Ivory, Grey, Black & Gold']
      ]),
      image: ''
    },
    {
      name: '2.5ft Safe',
      categoryId: 'safe-locker',
      tagline: 'Heavy-duty mid-range protection',
      specs: new Map([
        ['Dimensions', '24" W x 24" D x 30" H'],
        ['Weight', '537 kg ±5%'],
        ['Lock Type', 'Digital + Key'],
        ['Resistance', 'Fire, Drill, Torch, Burglar'],
        ['Interior', 'Red Carpet']
      ]),
      image: ''
    },
    {
      name: 'AS-10 Safe — 3.5ft',
      categoryId: 'safe-locker',
      tagline: 'Tall, powerful & premium features',
      specs: new Map([
        ['Dimensions', '24" W x 21" D x 42" H'],
        ['Weight', '612 kg ±5%'],
        ['Volume', '105 litres'],
        ['Interior', 'Auto LED + Luxury Carpet'],
        ['Door', 'Double Step Fire Resistance'],
        ['Protection', '4 Sides + 4 Corner Bolts']
      ]),
      image: ''
    },

    // ===== GOLD & SILVER WEIGHING MACHINES =====
    {
      name: 'AND EK-610GD Weighing Scale',
      categoryId: 'weighing',
      tagline: 'Precision weighing for jewellers',
      specs: new Map([
        ['Brand', 'AND (A&D Japan)'],
        ['Model', 'EK-610GD'],
        ['Capacity', '600g'],
        ['Readability', '0.01g'],
        ['Usage', 'Jewellery, Gold weighing']
      ]),
      image: ''
    },
    {
      name: 'AND EK-610V Gold Weighing Scale',
      categoryId: 'weighing',
      tagline: 'Accurate gold weighing solution',
      specs: new Map([
        ['Brand', 'AND (A&D)'],
        ['Model', 'EK-610V'],
        ['Capacity', '610g'],
        ['Readability', '0.01g'],
        ['Color', 'Black']
      ]),
      image: ''
    },
    {
      name: 'Contech CTL Series Scale',
      categoryId: 'weighing',
      tagline: 'High precision digital weighing',
      specs: new Map([
        ['Brand', 'Contech'],
        ['Series', 'CTL Series'],
        ['Display', 'Green LED'],
        ['Readability', '0.01g'],
        ['Usage', 'Lab, Jewellery, Gold shops']
      ]),
      image: ''
    },
    {
      name: 'Essae Jewellery Scale',
      categoryId: 'weighing',
      tagline: 'Trusted precision for jewellers',
      specs: new Map([
        ['Brand', 'Essae'],
        ['Capacity', '620g'],
        ['Readability', '0.01g'],
        ['Platform', 'Stainless Steel'],
        ['Usage', 'Jewellery, Gold, Silver']
      ]),
      image: ''
    }
  ];

  await Product.insertMany(products);
  console.log('✅ 16 Products seeded successfully!');
  console.log('Safe Lockers: 12');
  console.log('Weighing Machines: 4');
  process.exit();
}

seedProducts().catch(console.error);
