const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// ✅ Get all employees (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    if (!currentUser || currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'غير مصرح لك بهذا الإجراء' });
    }

    // جلب جميع المستخدمين
    const employees = await User.find();

    // نحذف حقل password المشفر من الاستجابة لكي لا يُرسل للـ client
    const safeEmployees = employees.map(emp => {
      const obj = emp.toObject();
      delete obj.password;
      // نضمن ان plainPassword موجود (أو قيمة فارغة)
      obj.plainPassword = obj.plainPassword || '';
      return obj;
    });

    res.json(safeEmployees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// ✅ Create new employee (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    if (!currentUser || currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'غير مصرح لك بهذا الإجراء' });
    }

    const {
      realName, address,
      username, password, role,
      salary, phone,
      hireDate, notes, permissions
    } = req.body;

    if (!realName) {
      return res.status(400).json({ message: 'الرجاء إدخال الاسم الحقيقي' });
    }

    // تحقق من وجود اسم المستخدم إذا تم إدخاله
    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'اسم المستخدم موجود مسبقاً' });
      }
    }

    const userData = {
      realName,
      address: address || '',
      username: username || undefined,
      password: password || undefined, // pre-save سيعالج الحقول إذا كانت موجودة
      role: role || 'employee',
      salary: salary !== undefined ? salary : 0,
      phone: phone || '',
      hireDate: hireDate || undefined,
      notes: notes || '',
      permissions: permissions || {
        inventory: false,
        purchases: false,
        sales: false,
        expenses: false,
        reports: false,
      }
    };

    const user = new User(userData);
    await user.save();

    const responseUser = user.toObject();
    delete responseUser.password; // لا نُرسل الحقل المشفر
    res.status(201).json({ message: 'تم إنشاء الموظف بنجاح', user: responseUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// ✅ Update employee by ID (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    if (!currentUser || currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'غير مصرح لك بهذا الإجراء' });
    }

    const { realName, address, username, password, role, salary, phone, hireDate, notes, permissions } = req.body;

    const employee = await User.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'الموظف غير موجود' });

    // تحديث الحقول
    if (realName) employee.realName = realName;
    if (address !== undefined) employee.address = address;
    if (username !== undefined) employee.username = username;
    if (password) employee.password = password; // pre-save سيشفر ويخزن plainPassword
    if (role) employee.role = role;
    if (salary !== undefined) employee.salary = salary;
    if (phone !== undefined) employee.phone = phone;
    if (hireDate !== undefined) employee.hireDate = hireDate;
    if (notes !== undefined) employee.notes = notes;
    if (permissions) employee.permissions = { ...employee.permissions, ...permissions };

    await employee.save();

    const responseEmployee = employee.toObject();
    delete responseEmployee.password; // لا نُرسل الحقل المشفر
    res.json({ message: 'تم تعديل الموظف بنجاح', employee: responseEmployee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// ✅ Delete employee by ID (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    if (!currentUser || currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'غير مصرح لك بهذا الإجراء' });
    }

    const employee = await User.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'الموظف غير موجود' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم حذف الموظف بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

module.exports = router;
