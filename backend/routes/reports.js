const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase'); // المخزن
const Sale = require('../models/Sale');
const Expense = require('../models/Expense');

// ✅ تقرير شامل مع بيانات المخزن
router.get('/', async (req, res) => {
    try {
        const { type, from, to, month, year } = req.query;
        let startDate, endDate;

        if (type === 'daily' && req.query.date) {
            startDate = new Date(req.query.date);
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(req.query.date);
            endDate.setHours(23, 59, 59, 999);
        } else if (type === 'monthly' && month && year) {
            startDate = new Date(year, month - 1, 1);
            endDate = new Date(year, month, 0, 23, 59, 59, 999);
        } else if (type === 'custom' && from && to) {
            startDate = new Date(from);
            endDate = new Date(to);
        } else {
            return res.status(400).json({ message: 'الرجاء تحديد نوع التقرير والفترة' });
        }

        // ✅ المبيعات
        const sales = await Sale.find({
            date: { $gte: startDate, $lte: endDate },
        });

        const totalSales = sales.reduce((acc, s) => {
            const subtotal = s.price * s.quantity;
            const discountAmount = (s.discount || 0) / 100 * subtotal;
            return acc + (subtotal - discountAmount);
        }, 0);

        // ✅ المشتريات
        const purchases = await Purchase.find({
            purchaseDate: { $gte: startDate, $lte: endDate },
        });

        // نضيف حسبة الكمية لكل عملية شراء
        const purchasesWithQuantity = purchases.map(p => {
            let quantity = 0;
            if (p.price && p.total) {
                quantity = p.total / p.price;
            }
            return {
                ...p.toObject(),
                quantity: Number(quantity.toFixed(2)) // عشان يبقى رقم مضبوط
            };
        });

        const totalPurchases = purchases.reduce((sum, p) => sum + p.total, 0);


        // ✅ المصروفات
        const expenses = await Expense.find({
            date: { $gte: startDate, $lte: endDate },
        });

        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

        // ✅ بيانات المخزن (كل المنتجات)
        const inventory = await Purchase.find({}); // أو أي فلتر تحبه للكمية المتاحة
        // ممكن بعد كده تعمل فلتر على الكمية المتاحة لو عايز تعرض بس المخزون المتوفر
        // .find({ quantity: { $gt: 0 } });

        // ✅ صافي الربح
        const profit = totalSales - (totalPurchases + totalExpenses);

        res.json({
            summary: {
                sales: totalSales,
                purchases: totalPurchases,
                expenses: totalExpenses,
                profit,
            },
            details: {
                sales,
                purchases,
                expenses,
                inventory, // 👈 إضافتنا هنا
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'خطأ في السيرفر', error });
    }
});

module.exports = router;
