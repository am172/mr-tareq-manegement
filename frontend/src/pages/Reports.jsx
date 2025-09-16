import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPrint, FaWhatsapp } from 'react-icons/fa';
import "./Report.css";
import { useLanguage } from '../context/LanguageContext';

// 1️⃣ إضافة كائن الترجمات في أعلى الملف
const translations = {
    ar: {
        title: "التقارير المالية",
        daily: "يومي",
        monthly: "شهري",
        custom: "مخصص",
        show: "عرض",
        summary: "الملخص",
        totalSales: "إجمالي المبيعات",
        totalPurchases: "إجمالي المشتريات",
        totalExpenses: "إجمالي المصروفات",
        netProfit: "صافي الربح",
        details: "التفاصيل",
        sales: "المبيعات",
        purchases: "المشتريات",
        expenses: "المصروفات",
        product: "المنتج",
        buyer: "المشتري",
        quantity: "الكمية",
        price: "السعر",
        discount: "الخصم",
        total: "الإجمالي",
        date: "التاريخ",
        supplier: "المورد",
        titleExpense: "العنوان",
        category: "التصنيف",
        amount: "المبلغ",
        notes: "ملاحظات",
        print: "طباعة",
        shareWhatsApp: "مشاركة عبر واتساب",
        month: "الشهر",
        year: "السنة",
        from: "من",
        to: "إلى",
        selectMonth: "اختر الشهر",
        selectYear: "اختر السنة",
        financialReport: "تقرير مالي",
        salesReport: "تقرير المبيعات",
        purchasesReport: "تقرير المشتريات",
        expensesReport: "تقرير المصروفات",
        cars: "سيارات",
        parts: "قطع غيار"
    },
    en: {
        title: "Financial Reports",
        daily: "Daily",
        monthly: "Monthly",
        custom: "Custom",
        show: "Show",
        summary: "Summary",
        totalSales: "Total Sales",
        totalPurchases: "Total Purchases",
        totalExpenses: "Total Expenses",
        netProfit: "Net Profit",
        details: "Details",
        sales: "Sales",
        purchases: "Purchases",
        expenses: "Expenses",
        product: "Product",
        buyer: "Buyer",
        quantity: "Quantity",
        price: "Price",
        discount: "Discount",
        total: "Total",
        date: "Date",
        supplier: "Supplier",
        titleExpense: "Title",
        category: "Category",
        amount: "Amount",
        notes: "Notes",
        print: "Print",
        shareWhatsApp: "Share via WhatsApp",
        month: "Month",
        year: "Year",
        from: "From",
        to: "To",
        selectMonth: "Select Month",
        selectYear: "Select Year",
        financialReport: "Financial Report",
        salesReport: "Sales Report",
        purchasesReport: "Purchases Report",
        expensesReport: "Expenses Report",
        cars: "Cars",
        parts: "Parts"
    },
    zh: {
        title: "财务报告",
        daily: "每日",
        monthly: "每月",
        custom: "自定义",
        show: "显示",
        summary: "摘要",
        totalSales: "总销售额",
        totalPurchases: "总采购额",
        totalExpenses: "总支出",
        netProfit: "净利润",
        details: "详情",
        sales: "销售",
        purchases: "采购",
        expenses: "支出",
        product: "产品",
        buyer: "买家",
        quantity: "数量",
        price: "价格",
        discount: "折扣",
        total: "总计",
        date: "日期",
        supplier: "供应商",
        titleExpense: "标题",
        category: "分类",
        amount: "金额",
        notes: "备注",
        print: "打印",
        shareWhatsApp: "通过WhatsApp分享",
        month: "月份",
        year: "年份",
        from: "从",
        to: "到",
        selectMonth: "选择月份",
        selectYear: "选择年份",
        financialReport: "财务报告",
        salesReport: "销售报告",
        purchasesReport: "采购报告",
        expensesReport: "支出报告",
        cars: "汽车",
        parts: "零件"
    }
};

export default function Reports() {
    const [report, setReport] = useState(null);
    const [filterType, setFilterType] = useState("daily");
    const [dailyDate, setDailyDate] = useState(new Date().toISOString().split("T")[0]);
    const [month, setMonth] = useState("");
    const [year, setYear] = useState(new Date().getFullYear());
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const { language } = useLanguage();

    const t = translations[language];

    const fetchReport = async () => {
        try {
            let params = { type: filterType };

            if (filterType === "daily" && dailyDate) {
                params.date = dailyDate;
            } else if (filterType === "daily") {
                setReport(null);
                return;
            }

            if (filterType === "monthly" && month) {
                params.month = month;
                params.year = year;
            } else if (filterType === "monthly") {
                setReport(null);
                return;
            }

            if (filterType === "custom" && from && to) {
                params.from = from;
                params.to = to;
            } else if (filterType === "custom") {
                setReport(null);
                return;
            }

            const res = await axios.get("https://mr-tareq-manegement-backend.onrender.com/api/reports", { params });
            setReport(res.data);
        } catch (err) {
            console.error("Error fetching report:", err);
            setReport(null);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [filterType, dailyDate, month, year, from, to]);

    const handlePrint = () => {
        const content = document.getElementById("reportContent").innerHTML;
        const style = `
            <style>
                body { font-family: 'Tahoma', sans-serif; direction: ${language === 'ar' ? 'rtl' : 'ltr'}; text-align: ${language === 'ar' ? 'right' : 'left'}; }
                h1, h2, h3 { text-align: center; margin-bottom: 15px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #444; padding: 8px; text-align: center; }
                th { background: #f0f0f0; }
                ul { list-style: none; padding: 0; }
                li { margin: 5px 0; }
                .summary { margin-bottom: 20px; }
            </style>
        `;
        const win = window.open("", "", "width=800,height=600");
        win.document.write(`<html><head><title>${t.financialReport}</title>${style}</head><body>${content}</body></html>`);
        win.document.close();
        win.focus();
        setTimeout(() => {
            win.print();
            win.close();
        }, 500);
    };

    const handleWhatsApp = () => {
        if (!report) return;
        const text = `${t.financialReport}\n${t.totalSales}: ${report.summary.sales}\n${t.totalPurchases}: ${report.summary.purchases}\n${t.totalExpenses}: ${report.summary.expenses}\n${t.netProfit}: ${report.summary.profit}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    };

    return (
        <div className="page">
            <h1>{t.title}</h1>

            {/* ✅ الفلاتر */}
            <div className="filters">
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="daily">{t.daily}</option>
                    <option value="monthly">{t.monthly}</option>
                    <option value="custom">{t.custom}</option>
                </select>

                {filterType === "daily" && (
                    <input type="date" value={dailyDate} onChange={(e) => setDailyDate(e.target.value)} />
                )}

                {filterType === "monthly" && (
                    <>
                        <input
                            type="number"
                            min="1"
                            max="12"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            placeholder={t.selectMonth}
                        />
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            placeholder={t.selectYear}
                        />
                    </>
                )}

                {filterType === "custom" && (
                    <>
                        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} placeholder={t.from} />
                        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} placeholder={t.to} />
                    </>
                )}

                <button onClick={fetchReport}>{t.show}</button>
            </div>

            {report && (
                <div id="reportContent">
                    {/* ✅ الملخص */}
                    <div className="summary">
                        <h2>{t.summary}</h2>
                        <ul>
                            <li>{t.totalSales}: {report.summary.sales}</li>
                            <li>{t.totalPurchases}: {report.summary.purchases}</li>
                            <li>{t.totalExpenses}: {report.summary.expenses}</li>
                            <li><strong>{t.netProfit}: {report.summary.profit}</strong></li>
                        </ul>
                    </div>

                    {/* ✅ التفاصيل */}
                    <h3 className="h3-details">{t.details} 👇</h3>
                    <div className="tables">
                        <h4 className="h4-details">{t.sales}</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th>{t.product}</th>
                                    <th>{t.buyer}</th>
                                    <th>{t.quantity}</th>
                                    <th>{t.price}</th>
                                    <th>{t.discount}</th>
                                    <th>{t.total}</th>
                                    <th>{t.date}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.details.sales.map((s) => {
                                    const total = (s.price * s.quantity) - ((s.discount || 0) / 100 * (s.price * s.quantity));
                                    return (
                                        <tr key={s._id}>
                                            <td>{s.productName}</td>
                                            <td>{s.buyer}</td>
                                            <td>{s.quantity}</td>
                                            <td>{s.price}</td>
                                            <td>{s.discount || 0}%</td>
                                            <td>{total}</td>
                                            <td>{new Date(s.date).toLocaleDateString()}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <h4 className="h4-details">{t.purchases}</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th>{t.product}</th>
                                    <th>{t.supplier}</th>
                                    <th>{t.quantity}</th>
                                    <th>{t.price}</th>
                                    <th>{t.total}</th>
                                    <th>{t.date}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.details.purchases.map((p) => {
                                    // ✅ نحسب الكمية = الاجمالي ÷ السعر
                                    const quantity = p.price ? (p.total / p.price) : 0;
                                    return (
                                        <tr key={p._id}>
                                            <td>{p.productName}</td>
                                            <td>{p.supplier}</td>
                                            <td>{Number(quantity.toFixed(2))}</td>
                                            <td>{p.price}</td>
                                            <td>{p.total}</td>
                                            <td>{new Date(p.purchaseDate).toLocaleDateString()}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>


                        <h4 className="h4-details">{t.expenses}</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th>{t.titleExpense}</th>
                                    <th>{t.category}</th>
                                    <th>{t.amount}</th>
                                    <th>{t.notes}</th>
                                    <th>{t.date}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.details.expenses.map((e) => (
                                    <tr key={e._id}>
                                        <td>{e.title}</td>
                                        <td>{e.category}</td>
                                        <td>{e.amount}</td>
                                        <td>{e.note || "-"}</td>
                                        <td>{new Date(e.date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* ✅ جدول المخزن */}
                        {report.details.inventory && report.details.inventory.length > 0 && (
                            <>
                                <h4 className="h4-details">{language === 'ar' ? 'المخزن' : language === 'en' ? 'Inventory' : '库存'}</h4>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>{language === 'ar' ? 'الرقم التسلسلي' : language === 'en' ? 'Serial Number' : '序列号'}</th>
                                            <th>{t.product}</th>
                                            <th>{t.type}</th>
                                            <th>{t.supplier}</th>
                                            <th>{t.quantity}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report.details.inventory.map((item) => (
                                            <tr key={item._id}>
                                                <td>{item.serialNumber || '-'}</td>
                                                <td>{item.productName}</td>
                                                <td>{item.type === 'car' ? t.cars : t.parts}</td>
                                                <td>{item.supplier}</td>
                                                <td>{item.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* ✅ أزرار التحكم */}
            {report && (
                <div className="actions">
                    <button onClick={handlePrint}><FaPrint /> {t.print}</button>
                    {/* <button onClick={handleWhatsApp}><FaWhatsapp /> {t.shareWhatsApp}</button> */}
                </div>
            )}
        </div>
    );
}
