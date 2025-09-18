// routes/sales
const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Purchase = require('../models/Purchase');
const auth = require('../middleware/auth');

// ✅ جلب كل المبيعات مع دعم الفلاتر
router.get('/', auth, async (req, res) => {
  try {
    const { month, year, startDate, endDate } = req.query;
    let filter = {};

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    } else if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const sales = await Sale.find(filter).sort({ date: -1 });
    res.json(sales);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// ✅ إضافة عملية بيع
router.post('/', auth, async (req, res) => {
  try {
    const { productName, price, buyer, quantity, discount = 0 } = req.body;

    if (!productName || !price || !buyer || !quantity) {
      return res.status(400).json({ message: 'جميع الحقول مطلوبة' });
    }

    const item = await Purchase.findOne({
      productName: { $regex: new RegExp(productName, 'i') }
    });

    if (!item) return res.status(404).json({ message: 'المنتج غير موجود في المخزن' });

    const quantityNum = parseInt(quantity);
    const priceNum = parseFloat(price);
    const discountPercent = parseFloat(discount) || 0;

    if (quantityNum > item.quantity) {
      return res.status(400).json({ message: 'الكمية المطلوبة أكبر من المتاحة' });
    }

    // تحديث المخزن
    item.quantity -= quantityNum;
    await item.save();

    // حساب الإجمالي مع الخصم %
    const subtotal = priceNum * quantityNum;
    const total = subtotal * (1 - discountPercent / 100);

    // ✅ إنشاء عملية البيع
    const sale = new Sale({
      serialNumber: item.serialNumber,
      productName: item.productName,
      type: item.type,
      supplier: item.supplier,
      model: item.model,
      manufactureYear: item.manufactureYear,
      color: item.color,
      chassisNumber: item.chassisNumber,
      condition: item.condition,
      price: priceNum,
      buyer,
      quantity: quantityNum,
      discount: discountPercent,
      total,
      date: new Date()
    });


    await sale.save();

    res.status(201).json({ message: 'تمت عملية البيع بنجاح', sale });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ في الخادم', error: err.message });
  }
});

// ✅ تعديل عملية بيع
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, price, buyer, quantity, discount } = req.body;

    const sale = await Sale.findById(id);
    if (!sale) return res.status(404).json({ message: 'عملية البيع غير موجودة' });

    // تحديث المخزن لو الكمية اتغيرت
    if (quantity && quantity !== sale.quantity) {
      const item = await Purchase.findOne({ productName: sale.productName });
      if (!item) return res.status(404).json({ message: 'المنتج غير موجود في المخزن' });

      item.quantity += sale.quantity; // رجّع الكمية القديمة
      if (quantity > item.quantity) {
        return res.status(400).json({ message: 'الكمية الجديدة أكبر من المتاحة' });
      }

      item.quantity -= quantity; // خصم الكمية الجديدة
      await item.save();
    }

    // تحديث بيانات البيع
    sale.productName = productName || sale.productName;
    sale.price = price || sale.price;
    sale.buyer = buyer || sale.buyer;
    sale.quantity = quantity || sale.quantity;
    sale.discount = discount ?? sale.discount;

    // إعادة حساب الإجمالي مع الخصم %
    const subtotal = sale.price * sale.quantity;
    sale.total = subtotal * (1 - (sale.discount || 0) / 100);

    await sale.save();
    res.json({ message: 'تم تعديل عملية البيع', sale });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ في الخادم', error: err.message });
  }
});

// ✅ حذف عملية بيع
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findById(id);
    if (!sale) return res.status(404).json({ message: 'عملية البيع غير موجودة' });

    const item = await Purchase.findOne({ productName: sale.productName });
    if (item) {
      item.quantity += sale.quantity;
      await item.save();
    }

    await sale.deleteOne();
    res.json({ message: 'تم حذف عملية البيع بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ في الخادم', error: err.message });
  }
});

module.exports = router;
