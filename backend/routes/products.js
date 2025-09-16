const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const Purchase = require('../models/Purchase');

const router = express.Router();

// Get all inventory items
router.get('/', auth, async (req, res) => {
    try {
        const purchases = await Purchase.find().sort({ purchaseDate: -1 });
        res.json(purchases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'خطأ في الخادم' });
    }
});

// Add new product
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, price, quantity, supplier, serialNumber, description } = req.body;
    const product = new Product({ name, type, price, quantity, supplier, serialNumber, description });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Sell product (new route)
router.post('/sell', auth, async (req, res) => {
  try {
    const { productName, type, quantitySold } = req.body;
    const product = await Product.findOne({ name: productName, type });
    if (!product) return res.status(404).json({ message: 'المنتج غير موجود' });
    if (product.quantity < quantitySold)
      return res.status(400).json({ message: 'الكمية غير كافية للبيع' });

    product.quantity -= quantitySold;
    await product.save();

    res.json({ message: 'تم البيع بنجاح', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Update product
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, type, price, quantity, supplier, serialNumber, description } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, type, price, quantity, supplier, serialNumber, description },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'المنتج غير موجود' });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'المنتج غير موجود' });
    res.json({ message: 'تم حذف المنتج بنجاح' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

module.exports = router;
