const mongoose = require('mongoose');

// models/Sale.js
const saleSchema = new mongoose.Schema({
  productName: String,
  price: Number,
  buyer: String,
  quantity: Number,
  discount: { type: Number, default: 0 }, // 👈 الخصم
  total: Number,
  date: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Sale', saleSchema);
