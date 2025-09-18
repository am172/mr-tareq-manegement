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
        invoice: 'فاتورة بيع / عقد بيع سيارات',
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
        invoice: 'Sales Invoice / Car Sales Agreement',
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
        invoice: '销售发票 / 汽车销售协议',
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
        // التنبيه الأول
        if (!window.confirm(t.confirmDelete)) return;

        // فرق زمني 500ms قبل التنبيه الثاني
        await new Promise(resolve => setTimeout(resolve, 400));

        // التنبيه الثاني
        if (!window.confirm('هل أنت متأكد نهائيًا من حذف هذه العملية؟')) return;

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
            body { font-family: Arial; direction: ${language === 'ar' ? 'rtl' : 'ltr'}; padding: 20px; line-height: 1.6; }
            h2, h3 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 6px; text-align: center; }
            th { background: #eee; }
            .header { text-align: center; margin-bottom: 20px; }
            .signatures { margin-top: 40px; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>WAZIR GLOBALX FZCO</h2>
            <p>License No.: 6765 | Registration No.: 65609</p>
            <p>Address 1: IFZA DIGITAL PARK – A2, Dubai Silicon Oasis, Dubai, UAE</p>
            <p>Address 2: Burjuman Business Tower, Khalid Bin Walid Road, Dubai, UAE, Unit No: BT09-967</p>
            <p>Phone/WhatsApp: +971581079794 | Website: www.wazirglobalx.com | Email: [To be added]</p>
          </div>

          <h3>عقد بيع سيارات / Car Sales Agreement</h3>

          <p>1- هذا العقد مبرم بين شركة وزير جلوبال إكس (البائع) والمشتري الموضحة بياناته أدناه.<br>
          1- This agreement is made between Wazir GlobalX FZCO (the Seller) and the Buyer whose details are provided below.</p>

          <p>2- يقر البائع ببيع المركبة/المركبات الموضحة في الملحق، ويقر المشتري بشرائها وفق الشروط والأحكام المذكورة.<br>
          2- The Seller agrees to sell the vehicle(s) listed in the annex, and the Buyer agrees to purchase them under the stated terms and conditions.</p>

          <p>3- يلتزم المشتري بدفع مبلغ مقدم والرصيد النهائي في التواريخ المتفق عليها.<br>
          3- The Buyer undertakes to pay a deposit and the remaining balance on the agreed dates.</p>

          <p>4- يتم تسليم السيارة في المدة المتفق عليها، وفي حال التأخير يلتزم البائع بإخطار المشتري كتابيًا.<br>
          4- The vehicle will be delivered within the agreed timeframe, and in case of delay, the Seller shall notify the Buyer in writing.</p>

          <p>5- في حال تأخر المشتري عن الدفع، يحق للبائع فرض غرامة تأخير بنسبة ___% عن كل يوم/أسبوع تأخير.<br>
          5- In case of late payment by the Buyer, the Seller may impose a late fee of ___% for each day/week of delay.</p>

          <p>6- يضمن البائع خلو المركبة من أي حقوق أو التزامات مالية حتى تاريخ التسليم.<br>
          6- The Seller guarantees that the vehicle is free from any financial encumbrances until the delivery date.</p>

          <p>7- يخضع هذا العقد لقوانين إمارة دبي ودولة الإمارات العربية المتحدة.<br>
          7- This agreement is governed by the laws of the Emirate of Dubai and the United Arab Emirates.</p>

          <h3>ملحق توصيف السيارات / Car Specification Annex</h3>
          <table>
            <thead>
              <tr>
                <th>رقم<br>No.</th>
                <th>النوع<br>Type</th>
                <th>الموديل<br>Model</th>
                <th>سنة الصنع<br>Year</th>
                <th>اللون<br>Color</th>
                <th>رقم الشاسيه<br>Chassis No.</th>
                <th>الحالة<br>Condition</th>
                <th>السعر<br>Price</th>
                <th>ملاحظات<br>Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>${sale.productName}</td>
                <td>${sale.model || ''}</td>
                <td>${sale.year || ''}</td>
                <td>${sale.color || ''}</td>
                <td>${sale.chassis || ''}</td>
                <td>${sale.condition || ''}</td>
                <td>${sale.total}</td>
                <td>${sale.remarks || ''}</td>
              </tr>
            </tbody>
          </table>

          <div class="signatures">
            <p>توقيع البائع: ____________<br>Seller’s Signature: ____________</p>
            <p>توقيع المشتري: ____________<br>Buyer’s Signature: ____________</p>
          </div>
        </body>
      </html>
    `;
        const newWindow = window.open('', '', 'width=900,height=700');
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
            <div className="table-wrapper">
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
            
