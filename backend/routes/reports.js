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

        // ✅ 1. المبيعات في الفترة
        const sales = await Sale.find({ date: { $gte: startDate, $lte: endDate } });

        // ✅ 2. أسماء المنتجات اللي اتباعت
        const soldProducts = [...new Set(sales.map(s => s.productName))];

        // ✅ 3. المشتريات الخاصة بالمنتجات دي (بغض النظر عن التاريخ)
        const purchases = await Purchase.find({ productName: { $in: soldProducts } });

        // ✅ 4. المصروفات في الفترة
        const expenses = await Expense.find({ date: { $gte: startDate, $lte: endDate } });

        // ✅ 5. الحسابات
        let totalSales = 0;
        let totalPurchases = 0;
        let matchedProfit = 0;

        for (const sale of sales) {
            const saleTotal =
                sale.price * sale.quantity -
                ((sale.discount || 0) / 100 * (sale.price * sale.quantity));
            totalSales += saleTotal;

            // نلاقي سعر الشراء للمنتج اللي اتباع
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

        // ✅ 6. حساب المخزن (بناءً على المشتريات - المبيعات)
        let inventory = [];
        const allPurchases = await Purchase.find(); // كل المشتريات عشان نجيب المخزن الحالي

        for (const product of allPurchases) {
            const totalPurchasedQty = allPurchases
                .filter(p => p.productName === product.productName)
                .reduce((sum, p) => sum + p.quantity, 0);

            const totalSoldQty = await Sale.find({ productName: product.productName })
                .then(salesList => salesList.reduce((sum, s) => sum + s.quantity, 0));

            const remainingQty = totalPurchasedQty - totalSoldQty;

            if (remainingQty > 0) {
                inventory.push({
                    _id: product._id,
                    serialNumber: product.serialNumber,
                    productName: product.productName,
                    type: product.type,
                    supplier: product.supplier,
                    quantity: remainingQty
                });
            }
        }

        // ✅ 7. نرجع التقرير
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
                inventory // 👈 المخزن
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'خطأ في السيرفر', error });
    }
});

module.exports = router;
