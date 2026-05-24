const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  tagline: {
    type: String,
    trim: true,
    default: '',
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  categoryId: {
    type: String,
    required: [true, 'Category is required'],
    ref: 'Category',
  },
  image: {
    type: String,
    default: '',
  },
  specs: {
    type: Map,
    of: String,
    default: {},
  },
  featured: {
    type: Boolean,
    default: false,
  },
  price: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
