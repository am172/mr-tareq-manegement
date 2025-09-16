import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PurchaseForm from '../components/PurchaseForm';
import { FaPrint, FaWhatsapp, FaEdit, FaTrash } from 'react-icons/fa';
import './Purchases.css';
import { useLanguage } from '../context/LanguageContext';


const translations = {
  ar: {
    title: 'المشتريات',
    filterPeriod: 'الفترة:',
    all: 'الكل',
    daily: 'يومي',
    weekly: 'أسبوعي',
    monthly: 'شهري',
    addPurchase: 'إضافة مشتري',
    printReport: 'طباعة تقرير كامل',
    serial: 'الرقم التسلسلي',
    product: 'المنتج',
    type: 'النوع',
    supplier: 'المورد',
    quantity: 'الكمية',
    price: 'السعر',
    total: 'الإجمالي',
    date: 'التاريخ',
    actions: 'أوامر',
    itemCar: 'سيارة',
    itemPart: 'قطعة غيار',
    noPurchases: 'لا توجد مشتريات',
    invoice: 'فاتورة شراء'
  },
  en: {
    title: 'Purchases',
    filterPeriod: 'Period:',
    all: 'All',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    addPurchase: 'Add Purchase',
    printReport: 'Print Full Report',
    serial: 'Serial Number',
    product: 'Product',
    type: 'Type',
    supplier: 'Supplier',
    quantity: 'Quantity',
    price: 'Price',
    total: 'Total',
    date: 'Date',
    actions: 'Actions',
    itemCar: 'Car',
    itemPart: 'Part',
    noPurchases: 'No purchases',
    invoice: 'Purchase Invoice'
  },
  zh: {
    title: '采购',
    filterPeriod: '期间:',
    all: '全部',
    daily: '每日',
    weekly: '每周',
    monthly: '每月',
    addPurchase: '添加采购',
    printReport: '打印完整报告',
    serial: '序列号',
    product: '产品',
    type: '类型',
    supplier: '供应商',
    quantity: '数量',
    price: '价格',
    total: '总计',
    date: '日期',
    actions: '操作',
    itemCar: '汽车',
    itemPart: '零件',
    noPurchases: '暂无采购记录',
    invoice: '采购发票'
  }
};

const Purchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [filter, setFilter] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [editingPurchase, setEditingPurchase] = useState(null);
    const { language } = useLanguage();
    const { user, api } = useAuth();

    const t = translations[language];

    useEffect(() => {
        fetchPurchases();
    }, [filter]);

    const fetchPurchases = async () => {
        try {
            const response = await api.get(`/api/purchases?period=${filter}`);
            setPurchases(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching purchases:', error);
            setPurchases([]);
        }
    };

    const handleSavePurchase = async (data) => {
        try {
            if (editingPurchase) {
                await api.put(`/api/purchases/${editingPurchase.id}`, data);
                fetchPurchases();
            } else {
                const res = await api.post('/api/purchases', data);
                setPurchases(prev => [...prev, res.data]);
            }
            setShowForm(false);
            setEditingPurchase(null);
        } catch (error) {
            console.error('Error saving purchase:', error);
            alert('Error saving purchase. Check console.');
        }
    };

    const handleDelete = async (purchase) => {
        if (!window.confirm(`Delete purchase for "${purchase.productName}"?`)) return;
        try {
            await api.delete(`/api/purchases/${purchase.id}`);
            setPurchases(prev => prev.filter(p => p.id !== purchase.id));
        } catch (error) {
            console.error(error);
            alert('Failed to delete purchase');
        }
    };

    const handleEdit = (purchase) => {
        setEditingPurchase(purchase);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const printInvoice = (purchase) => {
        const html = invoiceHtml(purchase, t);
        const w = window.open('', '_blank', 'width=900,height=800');
        if (!w) { alert('Allow popups'); return; }
        w.document.write(html);
        w.document.close();
        w.focus();
        setTimeout(() => w.print(), 500);
    };

    const printReport = () => {
        const html = reportHtml(purchases, t);
        const w = window.open('', '_blank', 'width=1100,height=800');
        if (!w) { alert('Allow popups'); return; }
        w.document.write(html);
        w.document.close();
        w.focus();
        setTimeout(() => w.print(), 500);
    };

    const sendWhatsApp = (purchase) => {
        const msg = encodeURIComponent(makeWhatsappMessage(purchase, t));
        const url = `https://wa.me/?text=${msg}`;
        window.open(url, '_blank');
    };

    const openNewForm = () => {
        setEditingPurchase(null);
        setShowForm(true);
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB') : '';
    const formatMoney = (num) => Number(num || 0).toLocaleString('en-US', { maximumFractionDigits: 2 });

    return (
        <div className="purchases-page">
            <header className="purchases-header">
                <h1>{t.title}</h1>
                {/* <div className="language-select">
                    <label>Language: </label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <option value="ar">العربية</option>
                        <option value="en">English</option>
                        <option value="zh">中文</option>
                    </select>
                </div> */}
                <div className="header-actions">
                    <div className="filter-wrap">
                        <label className="filter-label">{t.filterPeriod}</label>
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="all">{t.all}</option>
                            <option value="daily">{t.daily}</option>
                            <option value="weekly">{t.weekly}</option>
                            <option value="monthly">{t.monthly}</option>
                        </select>
                    </div>
                    <div className="btn-group">
                        <button className="btn btn-primary" onClick={openNewForm}>{t.addPurchase}</button>
                        <button className="btn btn-secondary" onClick={printReport}>{t.printReport}</button>
                    </div>
                </div>
            </header>

            {showForm && (
                <div className="form-area">
                    <PurchaseForm
                        initialData={editingPurchase || null}
                        onSubmit={handleSavePurchase}
                        onCancel={() => { setShowForm(false); setEditingPurchase(null); }}
                    />
                </div>
            )}

            <div className="table-wrap">
                <table className="purchases-table">
                    <thead>
                        <tr>
                            <th>{t.serial}</th>
                            <th>{t.product}</th>
                            <th>{t.type}</th>
                            <th>{t.supplier}</th>
                            <th>{t.quantity}</th>
                            <th>{t.price}</th>
                            <th>{t.total}</th>
                            <th>{t.date}</th>
                            <th>{t.actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.length > 0 ? (
                            purchases.map(p => (
                                <tr key={p.id || p._id}>
                                    <td>{p.serialNumber || '---'}</td>
                                    <td className="col-product">{p.productName || '---'}</td>
                                    <td>{p.type === 'car' ? t.itemCar : t.itemPart}</td>
                                    <td>{p.supplier || '---'}</td>
                                    <td>{p.price ? Math.round(p.total / p.price) : 0}</td>
                                    <td>{formatMoney(p.price)}</td>
                                    <td>{formatMoney(p.total)}</td>
                                    <td>{p.purchaseDate ? formatDate(p.purchaseDate) : '---'}</td>
                                    <td className="actions-cell">
                                        <button title={t.invoice} className="icon-btn" onClick={() => printInvoice(p)}><FaPrint /></button>
                                        <button title="WhatsApp" className="icon-btn" onClick={() => sendWhatsApp(p)}><FaWhatsapp /></button>
                                        <button title="Edit" className="icon-btn" onClick={() => handleEdit(p)}><FaEdit /></button>
                                        <button title="Delete" className="icon-btn danger" onClick={() => handleDelete(p)}><FaTrash /></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="9" style={{ textAlign: 'center', padding: '24px' }}>{t.noPurchases}</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ======= دوال الطباعة والواتساب مع دعم اللغة =======
function invoiceHtml(p, t) {
    const date = new Date(p.purchaseDate).toLocaleString('en-GB');
    const quantity = p.price ? Math.round(p.total / p.price) : 0;
    return `
  <html>
    <head>
      <title>${t.invoice} - ${escapeHtml(p.productName)}</title>
      <style>
        body{font-family: Arial; margin:20px; direction:rtl;}
        table{width:100%; border-collapse:collapse; margin-top:20px}
        th, td{border:1px solid #ddd; padding:10px;}
        th{background:#f4f4f4;}
      </style>
    </head>
    <body>
      <h2>${t.invoice}</h2>
      <table>
        <tr><th>${t.product}</th><td>${escapeHtml(p.productName)}</td></tr>
        <tr><th>${t.type}</th><td>${p.type === 'car' ? t.itemCar : t.itemPart}</td></tr>
        <tr><th>${t.supplier}</th><td>${escapeHtml(p.supplier)}</td></tr>
        <tr><th>${t.quantity}</th><td>${quantity}</td></tr>
        <tr><th>${t.price}</th><td>${p.price}</td></tr>
        <tr><th>${t.total}</th><td>${p.total}</td></tr>
      </table>
    </body>
  </html>
  `;
}

function reportHtml(purchases, t) {
    const rows = purchases.map(p => {
        const quantity = p.price ? Math.round(p.total / p.price) : 0;
        return `
    <tr>
      <td>${escapeHtml(p.productName)}</td>
      <td>${p.type === 'car' ? t.itemCar : t.itemPart}</td>
      <td>${escapeHtml(p.supplier)}</td>
      <td>${quantity}</td>
      <td>${p.price}</td>
      <td>${p.total}</td>
      <td>${p.purchaseDate ? new Date(p.purchaseDate).toLocaleDateString('en-GB') : ''}</td>
    </tr>`;
    }).join('');
    return `
  <html>
    <head>
      <title>${t.title}</title>
      <style>body{font-family:Arial;margin:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px}th{background:#f4f4f4}</style>
    </head>
    <body>
      <h1>${t.title}</h1>
      <table>
        <thead>
          <tr>
            <th>${t.product}</th>
            <th>${t.type}</th>
            <th>${t.supplier}</th>
            <th>${t.quantity}</th>
            <th>${t.price}</th>
            <th>${t.total}</th>
            <th>${t.date}</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </body>
  </html>
  `;
}

function escapeHtml(str = '') {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function makeWhatsappMessage(p, t) {
    const quantity = p.price ? Math.round(p.total / p.price) : 0;
    return `${t.invoice}\n${t.product}: ${p.productName}\n${t.type}: ${p.type === 'car' ? t.itemCar : t.itemPart}\n${t.supplier}: ${p.supplier}\n${t.quantity}: ${quantity}\n${t.price}: ${p.price}\n${t.total}: ${p.total}\n${t.date}: ${p.purchaseDate ? new Date(p.purchaseDate).toLocaleDateString('en-GB') : ''}`;
}

export default Purchases;
