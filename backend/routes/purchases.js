// routes/purchases
const express = require('express');
const Purchase = require('../models/Purchase');
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const Supplier = require('../models/Supplier'); // ✅ استدعاء المورد
const router = express.Router();

// routes/purchases.js
router.get('/', auth, async (req, res) => {
  try {
    const { period, type, supplier, date, month, year, from, to } = req.query;
    let filter = {};

    // ✅ فلتر المورد
    if (supplier && supplier !== 'all') {
      filter.supplier = supplier; // لازم يكون نفس اللي متخزن في قاعدة البيانات
    }

    // ✅ فلتر النوع
    if (type && type !== 'all') {
      filter.type = type;
    }

    // ✅ فلتر الفترة
    if (period && period !== 'all') {
      const now = new Date();
      if (period === 'daily' && date) {
        const d = new Date(date);
        filter.purchaseDate = {
          $gte: new Date(d.setHours(0, 0, 0, 0)),
          $lte: new Date(d.setHours(23, 59, 59, 999)),
        };
      } else if (period === 'monthly' && month && year) {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59, 999);
        filter.purchaseDate = { $gte: start, $lte: end };
      } else if (period === 'custom' && from && to) {
        filter.purchaseDate = {
          $gte: new Date(new Date(from).setHours(0, 0, 0, 0)),
          $lte: new Date(new Date(to).setHours(23, 59, 59, 999)),
        };
      }
    }

    const purchases = await Purchase.find(filter);
    res.json(purchases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});



// routes/purchases.js
router.post('/', auth, async (req, res) => {
  try {
    let lastInvoice = await Purchase.findOne().sort({ invoiceNumber: -1 });
    let invoiceNumber = lastInvoice ? lastInvoice.invoiceNumber + 1 : 1;

    let { serialNumber, productName, type, supplier, quantity, price, shippingCost, customsFee, notes, model, manufactureYear, color, chassisNumber, condition } = req.body;

    // تحقق من الحقول المطلوبة
    if (!serialNumber || !productName || !type || !supplier || !quantity || !price || !condition) {
      return res.status(400).json({ error: "الحقول الأساسية مطلوبة: الرقم التسلسلي، المنتج، النوع، المورد، الكمية، السعر" });
    }

    type = type === 'spare_part' ? 'part' : type;
    // ✅ تحقق هل الرقم التسلسلي موجود بالفعل
    const existingPurchase = await Purchase.findOne({ serialNumber });
    if (existingPurchase) {
      return res.status(400).json({ error: `❌ الرقم التسلسلي ${serialNumber} مستخدم بالفعل` });
    }

    const total = (quantity * price) + (shippingCost || 0) + (customsFee || 0);

    if (!serialNumber) {
      serialNumber = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    // ✅ 1. سجل المشتريات (ثابت)
    const purchase = new Purchase({
      serialNumber,
      productName,
      type,
      supplier,
      quantity,
      price,
      shippingCost,
      customsFee,
      total,
      notes,
      model,
      manufactureYear,
      color,
      chassisNumber,
      condition,
      invoiceNumber
    });
    await purchase.save();

    // ✅ 2. حدث المخزن
    let product = await Product.findOne({ name: productName });
    if (product) {
      product.quantity += quantity;
      await product.save();
    } else {
      product = new Product({
        name: productName,
        type,
        supplier,
        quantity,
        price,
        serialNumber,
        description: notes,
        model,
        manufactureYear,
        color,
        chassisNumber,
        condition
      });
      await product.save();

    }

    // ✅ 3. حدث المورد
    let sup = await Supplier.findOne({ name: supplier });
    if (!sup) {
      sup = new Supplier({
        name: supplier,
        totalSpent: total,
        cashPaid: 0,
        remaining: total
      });
    } else {
      sup.totalSpent += total;
      sup.remaining = sup.totalSpent - sup.cashPaid;
    }
    await sup.save();


    res.status(201).json({ purchase, product });
  } catch (error) {
    console.error('Error creating purchase:', error);

    // ✅ معالجة خطأ unique index (MongoDB code 11000)
    if (error.code === 11000 && error.keyValue?.serialNumber) {
      return res.status(400).json({ error: `❌ الرقم التسلسلي ${error.keyValue.serialNumber} مستخدم بالفعل` });
    }

    res.status(500).json({ error: 'حدث خطأ غير متوقع', details: error.message });
  }
});


// ✅ تحديث عملية شراء
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    // هات النسخة القديمة قبل التعديل
    const oldPurchase = await Purchase.findById(id);
    if (!oldPurchase) return res.status(404).json({ message: 'لم يتم العثور على المشتري' });

    // احسب الـ total الجديد
    if (update.quantity !== undefined && update.price !== undefined) {
      update.total = (update.quantity * update.price) + (update.shippingCost || 0) + (update.customsFee || 0);
    } else {
      update.total = (oldPurchase.quantity * oldPurchase.price) + (update.shippingCost || oldPurchase.shippingCost || 0) + (update.customsFee || oldPurchase.customsFee || 0);
    }

    // حدث العملية
    const updated = await Purchase.findByIdAndUpdate(id, update, { new: true, runValidators: true });

    // ✅ تعديل المورد
    const diff = updated.total - oldPurchase.total;
    if (diff !== 0) {
      let sup = await Supplier.findOne({ name: updated.supplier });
      if (sup) {
        sup.totalSpent += diff;
        sup.remaining = sup.totalSpent - sup.cashPaid;
        await sup.save();
      }
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'خطأ في التعديل', details: err.message });
  }
});



// ✅ تقرير المشتريات
router.get('/report', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let filter = {};

    if (startDate && endDate) {
      filter.purchaseDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const purchases = await Purchase.find(filter);
    const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.total, 0);

    res.json({
      purchases,
      totalPurchases,
      count: purchases.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});



// ✅ حذف مشتري
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Delete request ID:", id);

    const deleted = await Purchase.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'لم يتم العثور على المشتري' });
    }

    res.json({ message: 'تم الحذف بنجاح', deleted });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(400).json({ message: 'خطأ في الحذف', details: err.message });
  }
});


module.exports = router;
