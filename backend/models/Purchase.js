// models/Purchase.js
const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  serialNumber: { type: String, required: true, unique: true },
  productName: { type: String, required: true },
  type: { type: String, enum: ['car', 'part'], required: true },
  supplier: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now },
  notes: String,

  // الحقول الجديدة الاختيارية
  model: String,
  manufactureYear: Number,
  color: String,
  chassisNumber: String,
  condition: { type: String, enum: ['new', 'used'] } // الحالة جديدة أو مستعمل
}, { timestamps: true });


purchaseSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
