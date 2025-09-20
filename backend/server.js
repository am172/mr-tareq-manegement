const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'https://accounting-management-abjr.onrender.com',
  credentials: true
}));
app.use(express.json());

// Route for testing connection
app.get('/api/test', (req, res) => {
  console.log('تم استلام طلب test');
  res.json({ message: 'Server is working!', status: 'success' });
});

const supplierRoutes = require('./routes/suppliers');
app.use('/api/suppliers', supplierRoutes);
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/purchases', require('./routes/purchases'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/employees', require('./routes/employees'));
require("./routes/dailyReportJob"); // تشغيل كود التقرير اليومي

// app.use('/api/inventory', require('./routes/inventory'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected successfully');
  
  // إنشاء مستخدم مسؤول إذا لم يكن موجودًا
  const User = require('./models/User');
  const adminUser = await User.findOne({ username: 'admin' });
  
  if (!adminUser) {
    const newAdmin = new User({
      realName: 'مدير النظام',
      username: 'admin',
      password: 'admin123', // النص العادي → pre('save') هيشفره
      role: 'admin',
      permissions: {
        inventory: true,
        purchases: true,
        sales: true,
        expenses: true,
        reports: true
      }
    });
    
    await newAdmin.save();
    console.log('✅ تم إنشاء المستخدم المسؤول: admin / admin123');
  } else {
    console.log('ℹ️ المستخدم admin موجود بالفعل');
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
});
