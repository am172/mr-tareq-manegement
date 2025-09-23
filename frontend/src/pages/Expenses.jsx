import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ExpenseForm from '../components/ExpenseForm';
import './Expenses.css';
import { FaEdit, FaTrash, FaPrint, FaWhatsapp } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const translations = {
    ar: {
        title: 'المصروفات',
        addExpense: 'إضافة مصروف',
        name: 'الاسم',
        category: 'التصنيف',
        amount: 'المبلغ',
        note: 'ملاحظات',
        date: 'التاريخ',
        actions: 'العمليات',
        printInvoice: 'فاتورة مصروف',
        searchPlaceholder: 'بحث باسم المصروف أو التصنيف',
        monthFilter: 'عرض',
        monthFilterDesc: 'فلترة المصروفات حسب الشهر',
        periodFilter: 'عرض',
        periodFilterDesc: 'فلترة المصروفات حسب فترة زمنية',
        printReport: 'طباعة تقرير شامل',
        confirmDelete: 'هل أنت متأكد من الحذف؟',
        noExpenses: 'لا توجد مصروفات مطابقة ❌'
    },
    en: {
        title: 'Expenses',
        addExpense: 'Add Expense',
        name: 'Name',
        category: 'Category',
        amount: 'Amount',
        note: 'Note',
        date: 'Date',
        actions: 'Actions',
        printInvoice: 'Expense Invoice',
        searchPlaceholder: 'Search by name or category',
        monthFilter: 'Show',
        monthFilterDesc: 'Filter expenses by month',
        periodFilter: 'Show',
        periodFilterDesc: 'Filter expenses by period',
        printReport: 'Print Full Report',
        confirmDelete: 'Are you sure you want to delete?',
        noExpenses: 'No matching expenses ❌'
    },
    zh: {
        title: '支出',
        addExpense: '添加支出',
        name: '名称',
        category: '分类',
        amount: '金额',
        note: '备注',
        date: '日期',
        actions: '操作',
        printInvoice: '支出发票',
        searchPlaceholder: '按名称或分类搜索',
        monthFilter: '显示',
        monthFilterDesc: '按月份筛选支出',
        periodFilter: '显示',
        periodFilterDesc: '按期间筛选支出',
        printReport: '打印完整报告',
        confirmDelete: '您确定要删除吗？',
        noExpenses: '未找到匹配的支出 ❌'
    }
};

const Expenses = () => {
    const { api } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editExpense, setEditExpense] = useState(null);
    const [search, setSearch] = useState('');
    const [monthFilter, setMonthFilter] = useState('');
    const [periodFilter, setPeriodFilter] = useState({ start: '', end: '' });
    const { language } = useLanguage();
    const [loading, setLoading] = useState(false);   // ✅ حالة التحميل

    const t = translations[language];


    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async (params = {}) => {
        try {
            setLoading(true); // ✅ ابدأ التحميل
            const res = await api.get('/api/expenses', { params });
            setExpenses(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false); // ✅ وقف التحميل
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t.confirmDelete)) return;
        await new Promise(resolve => setTimeout(resolve, 400));
        if (!window.confirm('هل أنت متأكد نهائيًا من حذف هذه المصروفية؟')) return;

        try {
            await api.delete(`/api/expenses/${id}`);
            fetchExpenses();
        } catch (err) {
            console.error(err);
        }
    };

    const handlePrintInvoice = (expense) => {
        const printContent = `
      <html>
        <head>
          <title>${t.printInvoice}</title>
          <style>
            body { font-family: Arial; direction: ${language === 'ar' ? 'rtl' : 'ltr'}; padding: 20px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: center; }
            th { background: #eee; }
          </style>
        </head>
        <body>
          <h2>${t.printInvoice}</h2>
          <table>
            <tr><th>${t.name}</th><td>${expense.title}</td></tr>
            <tr><th>${t.category}</th><td>${expense.category}</td></tr>
            <tr><th>${t.amount}</th><td>${expense.amount}</td></tr>
            <tr><th>${t.note}</th><td>${expense.note || '-'}</td></tr>
            <tr><th>${t.date}</th><td>${new Date(expense.date).toLocaleDateString('en-GB')}</td></tr>
          </table>
        </body>
      </html>
    `;
        const newWindow = window.open('', '', 'width=600,height=400');
        newWindow.document.write(printContent);
        newWindow.document.close();
        newWindow.print();
    };

    const handleWhatsApp = (expense) => {
        const message = `${t.printInvoice}:
${t.name}: ${expense.title}
${t.category}: ${expense.category}
${t.amount}: ${expense.amount}
${t.note}: ${expense.note || '-'}
${t.date}: ${new Date(expense.date).toLocaleDateString('en-GB')}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handlePrintReport = () => {
        const table = document.querySelector('.expenses-table').cloneNode(true);
        Array.from(table.querySelectorAll('tr')).forEach(row => row.deleteCell(-1));

        const printContent = `
      <html>
        <head>
          <title>${t.title}</title>
          <style>
            body { font-family: Arial; direction: ${language === 'ar' ? 'rtl' : 'ltr'}; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: center; }
            th { background: #eee; }
          </style>
        </head>
        <body>
          <h2 style="text-align:center;">${t.title}</h2>
          ${table.outerHTML}
        </body>
      </html>
    `;
        const newWindow = window.open('', '', 'width=800,height=600');
        newWindow.document.write(printContent);
        newWindow.document.close();
        newWindow.print();
    };

    const handleMonthFilter = () => {
        if (!monthFilter) return;
        setPeriodFilter({ start: '', end: '' });
        fetchExpenses({ month: monthFilter.split('-')[1], year: monthFilter.split('-')[0] });
    };

    const handlePeriodFilter = () => {
        if (!periodFilter.start || !periodFilter.end) return;
        setMonthFilter('');
        fetchExpenses({ startDate: periodFilter.start, endDate: periodFilter.end });
    };

    const filteredExpenses = expenses.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="expenses-page">
            <div className="top-bar">
                <h1>{t.title}</h1>
            </div>

            <button className="btn-primary" onClick={() => { setEditExpense(null); setShowForm(true); }}>
                {t.addExpense}
            </button>

            {showForm && (
                <ExpenseForm
                    existingExpense={editExpense}
                    onClose={() => { setShowForm(false); fetchExpenses(); }}
                />
            )}

            <div className="filters">
                <div>
                    <input
                        type="month"
                        value={monthFilter}
                        onChange={e => setMonthFilter(e.target.value)}
                    />
                    <button onClick={handleMonthFilter}>{t.monthFilter}</button>
                    <p>{t.monthFilterDesc}</p>
                </div>

                <div>
                    <input
                        type="date"
                        value={periodFilter.start}
                        onChange={e => setPeriodFilter({ ...periodFilter, start: e.target.value })}
                    />
                    <input
                        type="date"
                        value={periodFilter.end}
                        onChange={e => setPeriodFilter({ ...periodFilter, end: e.target.value })}
                    />
                    <button onClick={handlePeriodFilter}>{t.periodFilter}</button>
                    <p>{t.periodFilterDesc}</p>
                </div>

                <button onClick={handlePrintReport}>{t.printReport}</button>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

               {loading ? (
                // ✅ سبينر التحميل
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
            ) : (
                <div className="table-wrapper">
                    <table className="expenses-table">
                        <thead>
                            <tr>
                                <th>{t.name}</th>
                                <th>{t.category}</th>
                                <th>{t.amount}</th>
                                <th>{t.note}</th>
                                <th>{t.date}</th>
                                <th>{t.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses.length > 0 ? (
                                filteredExpenses.map(e => (
                                    <tr key={e._id}>
                                        <td>{e.title}</td>
                                        <td>{e.category}</td>
                                        <td>{e.amount}</td>
                                        <td>{e.note || '-'}</td>
                                        <td>{new Date(e.date).toLocaleDateString('en-GB')}</td>
                                        <td className="actions-cell">
                                            <button className="icon-btn print" onClick={() => handlePrintInvoice(e)}><FaPrint /></button>
                                            <button className="icon-btn whatsapp" onClick={() => handleWhatsApp(e)}><FaWhatsapp /></button>
                                            <button className="icon-btn delete" onClick={() => handleDelete(e._id)}><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                        {t.noExpenses}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Expenses;
