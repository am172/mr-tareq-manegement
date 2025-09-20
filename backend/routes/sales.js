// routes/sales
const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Purchase = require('../models/Purchase');
const auth = require('../middleware/auth');
const Product = require('../models/Product');

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

router.post('/', auth, async (req, res) => {
  try {
    const { productName, price, buyer, quantity, discount = 0 } = req.body;

    if (!productName || !price || !buyer || !quantity) {
      return res.status(400).json({ message: 'جميع الحقول مطلوبة' });
    }

    // ✅ شوف المخزن مش المشتريات
    const item = await Product.findOne({ name: productName });
    if (!item) return res.status(404).json({ message: 'المنتج غير موجود في المخزن' });

    if (quantity > item.quantity) {
      return res.status(400).json({ message: 'الكمية المطلوبة أكبر من المتاحة' });
    }

    // ✅ خصم من المخزن
    item.quantity -= quantity;
    await item.save();

    const subtotal = price * quantity;
    const total = subtotal * (1 - (discount / 100));

      // ✅ احسب آخر رقم فاتورة + 1
    const lastSale = await Sale.findOne().sort({ invoiceNumber: -1 });
    const nextInvoiceNumber = lastSale ? lastSale.invoiceNumber + 1 : 1;


    // ✅ سجل البيع
    const sale = new Sale({
      invoiceNumber: nextInvoiceNumber,
      serialNumber: item.serialNumber,
      productName: item.name,
      type: item.type,
      supplier: item.supplier,
      price,
      buyer,
      quantity,
      discount,
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
