// models/Sale.js
const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  serialNumber: String,   // ✅ رقم السريال
  productName: String,
  type: String,           // ✅ عربية / قطعة
  supplier: String,       // ✅ المورد
  model: String,          // ✅ الموديل
  manufactureYear: Number,// ✅ سنة الصنع
  color: String,          // ✅ اللون
  chassisNumber: String,  // ✅ رقم الشاسيه
  condition: String,      // ✅ الحالة (جديد / مستعمل)
  price: Number,
  buyer: String,
  quantity: Number,
  discount: { type: Number, default: 0 },
  total: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sale', saleSchema);

