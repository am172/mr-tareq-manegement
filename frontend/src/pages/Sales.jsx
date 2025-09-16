import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SalesForm from '../components/SaleForm';
import './Sales.css';
import { FaPrint, FaWhatsapp, FaEdit, FaTrash } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const translations = {
    ar: {
        title: 'المبيعات',
        addSale: 'إضافة عملية بيع',
        product: 'المنتج',
        buyer: 'المشتري',
        quantity: 'الكمية',
        price: 'السعر',
        discount: 'الخصم',
        total: 'الإجمالي',
        date: 'التاريخ',
        actions: 'العمليات',
        invoice: 'فاتورة بيع',
        searchPlaceholder: 'بحث باسم المنتج أو المشتري',
        monthFilter: 'تصفية بالشهر',
        periodFilter: 'تصفية بالمدة',
        printReport: 'طباعة تقرير شامل',
        confirmDelete: 'هل أنت متأكد من الحذف؟'
    },
    en: {
        title: 'Sales',
        addSale: 'Add Sale',
        product: 'Product',
        buyer: 'Buyer',
        quantity: 'Quantity',
        price: 'Price',
        discount: 'Discount',
        total: 'Total',
        date: 'Date',
        actions: 'Actions',
        invoice: 'Sales Invoice',
        searchPlaceholder: 'Search by product or buyer',
        monthFilter: 'Filter by month',
        periodFilter: 'Filter by period',
        printReport: 'Print Full Report',
        confirmDelete: 'Are you sure you want to delete?'
    },
    zh: {
        title: '销售',
        addSale: '添加销售',
        product: '产品',
        buyer: '买家',
        quantity: '数量',
        price: '价格',
        discount: '折扣',
        total: '总计',
        date: '日期',
        actions: '操作',
        invoice: '销售发票',
        searchPlaceholder: '按产品或买家搜索',
        monthFilter: '按月份筛选',
        periodFilter: '按期间筛选',
        printReport: '打印完整报告',
        confirmDelete: '您确定要删除吗？'
    }
};

const Sales = () => {
    const { api } = useAuth();
    const [sales, setSales] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editSale, setEditSale] = useState(null);
    const [search, setSearch] = useState('');
    const [monthFilter, setMonthFilter] = useState('');
    const [periodFilter, setPeriodFilter] = useState({ start: '', end: '' });
    const { language } = useLanguage();

    const t = translations[language];

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async (params = {}) => {
        try {
            const res = await api.get('/api/sales', { params });
            setSales(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t.confirmDelete)) return;
        try {
            await api.delete(`/api/sales/${id}`);
            fetchSales();
        } catch (err) {
            console.error(err);
        }
    };

    const handlePrintInvoice = (sale) => {
        const printContent = `
      <html>
        <head>
          <title>${t.invoice}</title>
          <style>
            body { font-family: Arial; direction: ${language === 'ar' ? 'rtl' : 'ltr'}; padding: 20px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: center; }
            th { background: #eee; }
          </style>
        </head>
        <body>
          <h2>${t.invoice}</h2>
          <table>
            <tr><th>${t.product}</th><td>${sale.productName}</td></tr>
            <tr><th>${t.buyer}</th><td>${sale.buyer}</td></tr>
            <tr><th>${t.quantity}</th><td>${sale.quantity}</td></tr>
            <tr><th>${t.price}</th><td>${sale.price}</td></tr>
            <tr><th>${t.discount}</th><td>${sale.discount || 0}</td></tr>
            <tr><th>${t.total}</th><td>${sale.total}</td></tr>
            <tr><th>${t.date}</th><td>${new Date(sale.date).toLocaleDateString('en-GB')}</td></tr>
          </table>
        </body>
      </html>
    `;
        const newWindow = window.open('', '', 'width=600,height=400');
        newWindow.document.write(printContent);
        newWindow.document.close();
        newWindow.print();
    };

    const handlePrintReport = () => {
        const table = document.querySelector('.sales-table').cloneNode(true);
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

    const handleWhatsApp = (sale) => {
        const message = `${t.invoice}:
${t.product}: ${sale.productName}
${t.buyer}: ${sale.buyer}
${t.quantity}: ${sale.quantity}
${t.price}: ${sale.price}
${t.discount}: ${sale.discount || 0}
${t.total}: ${sale.total}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    const filteredSales = sales.filter(s =>
        s.productName.toLowerCase().includes(search.toLowerCase()) ||
        s.buyer.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="sales-page">
            <div className="top-bar">
                <h1>{t.title}</h1>
                {/* <div className="language-select">
                    <label>Language: </label>
                    <select value={language} onChange={e => setLanguage(e.target.value)}>
                        <option value="ar">العربية</option>
                        <option value="en">English</option>
                        <option value="zh">中文</option>
                    </select>
                </div> */}
            </div>

            <button className="btn-primary" onClick={() => { setEditSale(null); setShowForm(true); }}>
                {t.addSale}
            </button>

            {showForm && (
                <SalesForm
                    existingSale={editSale}
                    onClose={() => { setShowForm(false); fetchSales(); }}
                />
            )}

            <div className="filters">
                <input type="month" value={monthFilter} onChange={e => setMonthFilter(e.target.value)} />
                <button onClick={() => fetchSales({ month: monthFilter.split('-')[1], year: monthFilter.split('-')[0] })}>{t.monthFilter}</button>

                <input type="date" value={periodFilter.start} onChange={e => setPeriodFilter({ ...periodFilter, start: e.target.value })} />
                <input type="date" value={periodFilter.end} onChange={e => setPeriodFilter({ ...periodFilter, end: e.target.value })} />
                <button onClick={() => fetchSales({ startDate: periodFilter.start, endDate: periodFilter.end })}>{t.periodFilter}</button>

                <button onClick={handlePrintReport}>{t.printReport}</button>
            </div>

            <div className="search-bar">
                <input type="text" placeholder={t.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div class="table-wrapper">
                <table className="sales-table">
                    <thead>
                        <tr>
                            <th>{t.product}</th>
                            <th>{t.buyer}</th>
                            <th>{t.quantity}</th>
                            <th>{t.price}</th>
                            <th>{t.discount}</th>
                            <th>{t.total}</th>
                            <th>{t.date}</th>
                            <th>{t.actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSales.map(s => (
                            <tr key={s._id}>
                                <td>{s.productName}</td>
                                <td>{s.buyer}</td>
                                <td>{s.quantity}</td>
                                <td>{s.price}</td>
                                <td>{s.discount || 0}%</td>
                                <td>{s.total}</td>
                                <td>{new Date(s.date).toLocaleDateString('en-GB')}</td>
                                <td>
                                    <button onClick={() => handlePrintInvoice(s)}><FaPrint /></button>
                                    <button onClick={() => handleWhatsApp(s)}><FaWhatsapp /></button>
                                    <button onClick={() => { setEditSale(s); setShowForm(true); }}><FaEdit /></button>
                                    <button onClick={() => handleDelete(s._id)}><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Sales;
