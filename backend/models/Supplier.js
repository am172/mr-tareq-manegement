const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  productsSupplied: [{ type: String }], // المنتجات التي قام المورد بتوريدها
  totalSpent: { type: Number, default: 0 },
  cashPaid: { type: Number, default: 0 },
  remaining: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Supplier', SupplierSchema);
