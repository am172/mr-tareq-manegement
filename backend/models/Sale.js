// models/Sale.js
const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  invoiceNumber: { type: Number, unique: true }, // ✅ رقم الفاتورة
  serialNumber: String,
  productName: String,
  type: String,
  supplier: String,
  model: String,
  manufactureYear: Number,
  color: String,
  chassisNumber: String,
  condition: String,
  price: Number,
  buyer: String,
  quantity: Number,
  discount: { type: Number, default: 0 },
  total: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sale', saleSchema);
