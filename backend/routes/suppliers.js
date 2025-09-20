// routes/suppliers
const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const auth = require('../middleware/auth'); // لو عندك مصادقة

// جلب كل الموردين
router.get('/', auth, async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// إضافة مورد جديد
router.post('/', auth, async (req, res) => {
  try {
    const { name, productsSupplied, totalSpent, cashPaid } = req.body;
    const remaining = totalSpent - cashPaid;
    const newSupplier = new Supplier({ name, productsSupplied, totalSpent, cashPaid, remaining });
    await newSupplier.save();
    res.status(201).json(newSupplier);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// تحديث مورد
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, productsSupplied, totalSpent, cashPaid } = req.body;
    const remaining = totalSpent - cashPaid;
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { name, productsSupplied, totalSpent, cashPaid, remaining },
      { new: true }
    );
    res.json(updatedSupplier);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// حذف مورد
router.delete('/:id', auth, async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: 'Supplier deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
