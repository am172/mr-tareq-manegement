const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'يرجى إدخال اسم المستخدم وكلمة المرور' });
    }

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found:', username);
      return res.status(400).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    // Check password
    const isMatch = await user.correctPassword(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for user:', username);
      return res.status(400).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    // Create token بدون تاريخ انتهاء (أو بفترة طويلة جداً)
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'secret'
      // يمكنك استخدام { expiresIn: '3650d' } لجعلها 10 سنوات بدلاً من لا نهائي
    );

    console.log('Login successful for user:', username);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }
    
    // إضافة توكن جديد في header إذا كان الطلب يحتاج إلى تجديد
    const newToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'secret'
    );
    
    res.setHeader('New-Token', newToken);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// إنشاء endpoint جديد لتجديد التوكن
router.post('/refresh', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    // إنشاء توكن جديد
    const newToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'secret'
    );

    res.json({
      token: newToken,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ message: 'خطأ في تجديد الجلسة' });
  }
});

// Create new user (admin only)
router.post('/register', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);

    if (!currentUser || currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'غير مصرح لك بهذا الإجراء' });
    }

    const { username, password, role, permissions } = req.body;

    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'اسم المستخدم موجود مسبقاً' });
    }

    // Create user
    user = new User({
      username,
      password,
      role,
      permissions
    });

    await user.save();

    res.status(201).json({ message: 'تم إنشاء المستخدم بنجاح' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

module.exports = router;