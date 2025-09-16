const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// ✅ جلب كل المصروفات مع فلاتر
router.get('/', auth, async (req, res) => {
  try {
    const { month, year, startDate, endDate } = req.query;
    let filter = {};

    if (month && year) {
      filter.date = {
        $gte: new Date(year, month - 1, 1),
        $lte: new Date(year, month, 0)
      };
    }

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في جلب المصروفات', error: err.message });
  }
});

// ✅ إضافة مصروف
router.post('/', auth, async (req, res) => {
  try {
    const { title, amount, category, note } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({ message: 'جميع الحقول مطلوبة' });
    }

    const expense = new Expense({ title, amount, category, note });
    await expense.save();

    res.status(201).json({ message: 'تمت إضافة المصروف', expense });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في إضافة المصروف', error: err.message });
  }
});

// ✅ تعديل مصروف
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, amount, category, note } = req.body;

    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { title, amount, category, note },
      { new: true }
    );

    if (!expense) return res.status(404).json({ message: 'المصروف غير موجود' });

    res.json({ message: 'تم تحديث المصروف', expense });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في تعديل المصروف', error: err.message });
  }
});

// ✅ حذف مصروف
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ message: 'المصروف غير موجود' });

    res.json({ message: 'تم حذف المصروف' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الحذف', error: err.message });
  }
});

module.exports = router;
