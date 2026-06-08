const fs = require('fs');
const http = require('http');

http.get('http://localhost:5000/api/products', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const dbProducts = JSON.parse(data);
    const staticPath = '../src/data/products.jsx';
    
    const dummyProducts = [
      {
        id: 'cc-001',
        categoryId: 'cash-counting',
        name: 'AT-50 Basic Cash Counter',
        tagline: 'Best for small shops & retail',
        image: '/cash_counting.png',
        price: 'Ask for Price',
        specs: ['Speed: 1,000 notes/min', 'UV + MG Detection', 'LCD Display', 'Auto-Start/Stop'],
        badge: null,
      },
      {
        id: 'gm-001',
        categoryId: 'gold-melting',
        name: 'AT-GM 1 KG Induction Melter',
        tagline: 'Melt up to 1 kg of gold per cycle',
        image: '/gold_melting.png',
        price: 'Ask for Price',
        specs: ['Capacity: 1 Kg Gold', 'Max Temp: 1300°C', 'Induction Technology', 'Digital Temperature Control'],
        badge: null,
      }
    ];

    const all = [
      ...dbProducts.map(p => ({
        id: p._id,
        categoryId: p.categoryId,
        name: p.name,
        tagline: p.tagline,
        image: p.image,
        price: p.price || 'Ask for Price',
        specs: Object.entries(p.specs).map(([k,v]) => `${k}: ${v}`),
        badge: p.badge || null
      })),
      ...dummyProducts
    ];

    const newContent = `// src/data/products.jsx
import React from 'react';
import { Banknote, Flame, Scale, Lock } from 'lucide-react';

export const CATEGORIES = [
  { id: 'cash-counting', label: 'Cash Counting Machines', icon: <Banknote size={18} />, color: '#1d4ed8' },
  { id: 'gold-melting', label: 'Gold Melting Machines', icon: <Flame size={18} />, color: '#b45309' },
  { id: 'weighing', label: 'Gold & Silver Weighing Machines', icon: <Scale size={18} />, color: '#15803d' },
  { id: 'safe-locker', label: 'Safe Lockers', icon: <Lock size={18} />, color: '#6d28d9' },
];

export const PRODUCTS = ${JSON.stringify(all, null, 2).replace(/"([^"]+)":/g, '$1:')};
`;

    fs.writeFileSync(staticPath, newContent);
    console.log('Successfully updated src/data/products.jsx');
  });
});
