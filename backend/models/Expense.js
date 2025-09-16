const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },       // اسم المصروف
  amount: { type: Number, required: true },      // المبلغ
  category: { type: String, required: true },    // التصنيف (مثلا: كهرباء، إيجار..)
  note: { type: String },                        // ملاحظات
  date: { type: Date, default: Date.now }        // التاريخ
});

module.exports = mongoose.model('Expense', expenseSchema);
