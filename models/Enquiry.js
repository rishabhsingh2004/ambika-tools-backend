const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
  },
  category: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null,
  },
  productName: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'closed'],
    default: 'new',
  },
  source: {
    type: String,
    enum: ['contact-form', 'product-page', 'whatsapp'],
    default: 'contact-form',
  },
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
