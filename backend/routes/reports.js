const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase'); 
const Sale = require('../models/Sale');
const Expense = require('../models/Expense');

router.get('/', async (req, res) => {
    try {
        const { type, from, to, month, year, date } = req.query;
        let startDate, endDate;

        if (type === 'daily' && date) {
            startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
        } else if (type === 'monthly' && month && year) {
            startDate = new Date(year, month - 1, 1);
            endDate = new Date(year, month, 0, 23, 59, 999);
        } else if (type === 'custom' && from && to) {
            startDate = new Date(from);
            endDate = new Date(to);
        } else {
            return res.status(400).json({ message: 'الرجاء تحديد نوع التقرير والفترة' });
        }

        // ✅ نجيب المبيعات والمشتريات والمصروفات
        const sales = await Sale.find({ date: { $gte: startDate, $lte: endDate } });
        const purchases = await Purchase.find({ purchaseDate: { $gte: startDate, $lte: endDate } });
        const expenses = await Expense.find({ date: { $gte: startDate, $lte: endDate } });

        // ✅ نحسب الأرباح "الحقيقية" (matching sale with purchase)
        let totalSales = 0;
        let totalPurchases = 0;
        let matchedProfit = 0;

        for (const sale of sales) {
            const saleTotal = sale.price * sale.quantity - ((sale.discount || 0) / 100 * (sale.price * sale.quantity));
            totalSales += saleTotal;

            // نلاقي سعر الشراء لنفس المنتج
            const purchase = purchases.find(p => p.productName === sale.productName);
            if (purchase) {
                const costPerItem = purchase.price;
                const purchaseCost = costPerItem * sale.quantity;
                matchedProfit += (saleTotal - purchaseCost);
                totalPurchases += purchaseCost;
            }
        }

        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
        const netProfit = matchedProfit - totalExpenses;

        // ✅ بيانات المخزن (باقي المشتريات اللي لسه متباعتش)
        const inventory = await Purchase.find({});

        res.json({
            summary: {
                sales: totalSales,
                purchases: totalPurchases,
                expenses: totalExpenses,
                profit: netProfit
            },
            details: {
                sales,
                purchases,
                expenses,
                inventory
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'خطأ في السيرفر', error });
    }
});

module.exports = router;
