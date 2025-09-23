import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPrint, FaWhatsapp } from 'react-icons/fa';
import "./Report.css";
import { useLanguage } from '../context/LanguageContext';

// 1️⃣ إضافة كائن الترجمات في أعلى الملف
const translations = {
    ar: {
        title: "التقارير المالية",
        taq: "تقرير",
        daily: "يومي",
        monthly: "شهري",
        custom: "مخصص",
        show: "عرض",
        summary: "الملخص",
        profitDesc: "💡  الأرباح في هذا التقرير لا تُحسب بطرح جميع المشتريات من المبيعات،وإنما على أساس تكلفة البضائع التي تم بيعها فعليًا خلال الفترة المحددة فقط.ثم تُخصم المصروفات التشغيلية للوصول إلى صافي الربح الحقيقي،مما يعكس النتيجة المالية الفعلية للنشاط دون احتساب المخزون الذي لم يتم تداوله بعد",
        totalSales: "إجمالي المبيعات",
        totalPurchases: "إجمالي المشتريات",
        totalExpenses: "إجمالي المصروفات",
        netProfit: "صافي الربح",
        details: "التفاصيل",
        sales: "تفاصيل المبيعات",
        purchases: "تفاصيل المشتريات",
        expenses: "تفاصيل المصروفات",
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
        parts: "قطع غيار",
        detailsShow: "عرض التفاصيل",
        detailsHide: "إخفاء التفاصيل",
        ribh: " الأرباح 💰"
    },
    en: {
        title: "Financial Reports",
        daily: "Daily",
        monthly: "Monthly",
        custom: "Custom",
        show: "Show",
        summary: "Summary",
        profitDesc: "Profits in this report are calculated only on the basis of the cost of goods actually sold during the selected period, then operating expenses are deducted to reach the true net profit without counting unsold inventory",
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
        parts: "Parts",
        detailsShow: "Show Details",
        detailsHide: "Hide Details",
        ribh: " profit 💰"

    },
    zh: {

        ribh: " 利润 💰",
        title: "财务报告",
        daily: "每日",
        monthly: "每月",
        custom: "自定义",
        show: "显示",
        summary: "摘要",
        profitDesc: "本报告中的利润仅根据所选期间内实际售出的货物成本计算，然后再扣除运营费用以得出真实的净利润，不包含未出售的库存",
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
        parts: "零件",
        detailsShow: "显示详情",
        detailsHide: "隐藏详情",

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
    const [showSalesDetails, setShowSalesDetails] = useState(false);
    const [showPurchasesDetails, setShowPurchasesDetails] = useState(false);
    const [showExpensesDetails, setShowExpensesDetails] = useState(false);
    const [loading, setLoading] = useState(false); // ✅ حالة التحميل
    const t = translations[language];

    const fetchReport = async () => {
        try {
            setLoading(true); // ✅ ابدأ التحميل
            let params = { type: filterType };

            if (filterType === "daily" && dailyDate) {
                params.date = dailyDate;
            } else if (filterType === "daily") {
                setReport(null);
                setLoading(false);
                return;
            }

            if (filterType === "monthly" && month) {
                params.month = month;
                params.year = year;
            } else if (filterType === "monthly") {
                setReport(null);
                setLoading(false);
                return;
            }

            if (filterType === "custom" && from && to) {
                params.from = from;
                params.to = to;
            } else if (filterType === "custom") {
                setReport(null);
                setLoading(false);
                return;
            }

            const res = await axios.get("/api/reports", { params });
            setReport(res.data);
        } catch (err) {
            console.error("Error fetching report:", err);
            setReport(null);
        } finally {
            setLoading(false); // ✅ خلص التحميل
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
        win.print();  // 👈 كده بس
    };

    const handleWhatsApp = () => {
        if (!report) return;
        const text = `${t.financialReport}\n${t.totalSales}: ${report.summary.sales}\n${t.totalPurchases}: ${report.summary.purchases}\n${t.totalExpenses}: ${report.summary.expenses}\n${t.netProfit}: ${report.summary.profit}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    };
    // ✅ دالة تعرض وصف الفترة حسب الفلتر
    const getFilterDescription = () => {
        if (filterType === "daily" && dailyDate) {
            return `${t.daily} - ${new Date(dailyDate).toLocaleDateString()}`;
        }
        if (filterType === "monthly" && month && year) {
            return `${t.monthly} - ${month}/${year}`;
        }
        if (filterType === "custom" && from && to) {
            return `${t.custom} - ${new Date(from).toLocaleDateString()} ${t.to} ${new Date(to).toLocaleDateString()}`;
        }
        return "";
    };


    return (
        <div className="page">
            <h1>{t.title}</h1>
            <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
                {getFilterDescription()}
            </h3>
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

            {/* ✅ الملخص */}
            <div className="summary">
                <h2>{t.summary}</h2>
                <p>{t.profitDesc}</p>
            </div>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                    <div
                        style={{
                            border: "12px solid #f3f3f3",
                            borderTop: "12px solid #007bff",
                            borderRadius: "50%",
                            width: "100px",
                            height: "100px",
                            animation: "spin 1.5s linear infinite",
                        }}
                    />
                    <style>
                        {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
                    </style>
                </div>
            ) : report?.summary ? (
                <>
                    <div id="reportContent">
                        {/* ✅ الملخص في جدول */}
                        <div className="tables">
                            <table className="summary-table">
                                <tbody>
                                    <tr>
                                        <td>{t.totalSales}</td>
                                        <td>{report?.summary?.sales ?? 0}</td>
                                        <td>
                                            <button
                                                style={{ background: "#1668dc", color: "white" }}
                                                onClick={() => setShowSalesDetails(!showSalesDetails)}
                                            >
                                                {showSalesDetails ? t.detailsHide : t.detailsShow}
                                            </button>
                                        </td>
                                    </tr>

                                    {showSalesDetails && (
                                        <tr>
                                            <td colSpan="3">
                                                <h4>{t.sales}</h4>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>{t.product}</th>
                                                            <th>{t.quantity}</th>
                                                            <th>{t.price}</th>
                                                            <th>{t.total}</th>
                                                            <th>{t.date}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(report?.details?.sales || []).map((sale, i) => (
                                                            <tr key={i}>
                                                                <td>{sale.productName}</td>
                                                                <td>{sale.quantity}</td>
                                                                <td>{sale.price}</td>
                                                                <td>{sale.price * sale.quantity}</td>
                                                                <td>{new Date(sale.date).toLocaleDateString()}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )}

                                    <tr>
                                        <td>{t.totalPurchases}</td>
                                        <td>{report?.summary?.purchases ?? 0}</td>
                                        <td>
                                            <button
                                                style={{ background: "#1668dc", color: "white" }}
                                                onClick={() => setShowPurchasesDetails(!showPurchasesDetails)}
                                            >
                                                {showPurchasesDetails ? t.detailsHide : t.detailsShow}
                                            </button>
                                        </td>
                                    </tr>

                                    {showPurchasesDetails && (
                                        <tr>
                                            <td colSpan="3">
                                                <h4>{t.purchases}</h4>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>{t.product}</th>
                                                            <th>{t.quantity}</th>
                                                            <th>{t.price}</th>
                                                            <th>{t.total}</th>
                                                            <th>{t.date}</th>
                                                            <th>{t.supplier}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(report?.details?.sales || []).map((sale, i) => {
                                                            const relatedPurchase = (report?.details?.purchases || []).find(
                                                                (p) => p.productName === sale.productName
                                                            );
                                                            if (!relatedPurchase) return null;
                                                            return (
                                                                <tr key={i}>
                                                                    <td>{relatedPurchase.productName}</td>
                                                                    <td>{sale.quantity}</td>
                                                                    <td>{relatedPurchase.price}</td>
                                                                    <td>{relatedPurchase.price * sale.quantity}</td>
                                                                    <td>{new Date(relatedPurchase.purchaseDate).toLocaleDateString()}</td>
                                                                    <td>{relatedPurchase.supplier}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )}

                                    {/* 📌 الأرباح */}
                                    <tr>
                                        <td>{t.ribh}</td>
                                        <td>
                                            <strong>
                                                {(report?.summary?.sales ?? 0) - (report?.summary?.purchases ?? 0)}
                                            </strong>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>{t.totalExpenses}</td>
                                        <td>{report?.summary?.expenses ?? 0}</td>
                                        <td>
                                            <button
                                                style={{ background: "#1668dc", color: "white" }}
                                                onClick={() => setShowExpensesDetails(!showExpensesDetails)}
                                            >
                                                {showExpensesDetails ? t.detailsHide : t.detailsShow}
                                            </button>
                                        </td>
                                    </tr>

                                    {showExpensesDetails && (
                                        <tr>
                                            <td colSpan="3">
                                                <h4>{t.expenses}</h4>
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
                                                        {(report?.details?.expenses || []).map((expense, i) => (
                                                            <tr key={i}>
                                                                <td>{expense.title}</td>
                                                                <td>{expense.category}</td>
                                                                <td>{expense.amount}</td>
                                                                <td>{expense.notes}</td>
                                                                <td>{new Date(expense.date).toLocaleDateString()}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )}

                                    <tr>
                                        <td>✅ {t.netProfit}</td>
                                        <td>
                                            <strong>
                                                {(report?.summary?.sales ?? 0) -
                                                    (report?.summary?.purchases ?? 0) -
                                                    (report?.summary?.expenses ?? 0)}
                                            </strong>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ✅ أزرار التحكم */}
                    <div className="actions">
                        <button onClick={handlePrint}>
                            <FaPrint /> {t.print}
                        </button>
                    </div>
                </>
            ) : (
                <p style={{ textAlign: "center", color: "red" }}>
                    ⚠️ {language === "ar" ? "لا توجد بيانات متاحة" : "No data available"}
                </p>
            )}



        </div>
    );
}
