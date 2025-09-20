// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['car', 'part'], required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  supplier: { type: String, required: true },
  serialNumber: { type: String, unique: true },
  description: String,
  
  // الحقول الجديدة
  model: String,
  manufactureYear: Number,
  color: String,
  chassisNumber: String,
  condition: { type: String, enum: ['new', 'used'], default: 'new' },

  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Product', productSchema);
