// routes/purchases
const express = require('express');
const Purchase = require('../models/Purchase');
const auth = require('../middleware/auth');
const Product = require('../models/Product');

const router = express.Router();

// ✅ Get all purchases with filters
router.get('/', auth, async (req, res) => {
  try {
    const { period } = req.query;
    let filter = {};

    // Apply time filter
    if (period && period !== 'all') {
      const now = new Date();
      let startDate;

      if (period === 'daily') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (period === 'weekly') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (period === 'monthly') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      filter.purchaseDate = { $gte: startDate };
    }

    const purchases = await Purchase.find(filter).sort({ purchaseDate: -1 });
    res.json(purchases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// router/purchases
router.post('/', auth, async (req, res) => {
  try {
    let { serialNumber, productName, type, supplier, quantity, price, notes, model, manufactureYear, color, chassisNumber, condition } = req.body;

    type = type === 'spare_part' ? 'part' : type;
    const total = quantity * price;

    if (!serialNumber) {
      serialNumber = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    const purchase = new Purchase({
      serialNumber,
      productName,
      type,
      supplier,
      quantity,
      price,
      total,
      notes,
      model,
      manufactureYear,
      color,
      chassisNumber,
      condition
    });

    await purchase.save();
    res.status(201).json(purchase);
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.status(400).json({ error: 'Error creating purchase', details: error.message });
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

router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    if (update.quantity !== undefined && update.price !== undefined) {
      update.total = update.quantity * update.price;
    }

    const updated = await Purchase.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'لم يتم العثور على المشتري' });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'خطأ في التعديل', details: err.message });
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
