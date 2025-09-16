const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  realName: { type: String, required: true },
  address: { type: String, default: '' },
  username: { type: String, unique: true, sparse: true }, // اختياري
  password: { type: String },      // المشفّر (hash)
  plainPassword: { type: String }, // النص الصريح (للعرض فقط)
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  salary: { type: Number, default: 0 },
  phone: { type: String, default: '' },
  hireDate: { type: Date },
  notes: { type: String, default: '' },
  permissions: {
    inventory: { type: Boolean, default: false },
    purchases: { type: Boolean, default: false },
    sales: { type: Boolean, default: false },
    expenses: { type: Boolean, default: false },
    reports: { type: Boolean, default: false }
  }
});

// تشفير الباسورد قبل الحفظ + حفظ نسخة plainPassword
userSchema.pre('save', async function(next) {
  // إذا تم تعديل الحقل password ووُجدت قيمة
  if (this.isModified('password') && this.password) {
    // خزّن النسخة العادية أولًا
    this.plainPassword = this.password;
    // ثم خزّن النسخة المشفرة في حقل password
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// التحقق من الباسورد المشفّر عند تسجيل الدخول
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);
