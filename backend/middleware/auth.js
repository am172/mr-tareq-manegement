const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    console.log('Auth middleware triggered');
    console.log('Headers:', req.headers);
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('Extracted token:', token ? 'Token exists' : 'No token found');
    
    if (!token) {
      console.log('No token provided, rejecting request');
      return res.status(401).json({ message: 'لا يوجد token، مصادقة مرفوضة' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    console.log('Token decoded successfully for user:', decoded.id);

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'انتهت صلاحية الجلسة' });
    }
    
    res.status(401).json({ message: 'Token غير صالح' });
  }
};

module.exports = auth;