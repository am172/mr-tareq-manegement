import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaPrint, FaWhatsapp } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import './Inventory.css';

const translations = {
  ar: {
    title: 'المخزن',
    cars: 'السيارات',
    parts: 'قطع الغيار',
    item: 'عنصر',
    searchPlaceholder: 'ابحث عن منتج...',
    all: 'الكل',
    allSuppliers: 'كل الموردين',
    printInventory: 'طباعة المخزن بالكامل',
    type: 'النوع',
    supplier: 'المورد',
    quantity: 'الكمية',
    invoice: 'فاتورة المخزن',
    report: 'تقرير المخزن',
    serial: 'الرقم التسلسلي'
  },
  en: {
    title: 'Inventory',
    cars: 'Cars',
    parts: 'Parts',
    item: 'Item',
    searchPlaceholder: 'Search for a product...',
    all: 'All',
    allSuppliers: 'All Suppliers',
    printInventory: 'Print Full Inventory',
    type: 'Type',
    supplier: 'Supplier',
    quantity: 'Quantity',
    invoice: 'Inventory Invoice',
    report: 'Inventory Report',
    serial: 'Serial Number'
  },
  zh: {
    title: '库存',
    cars: '汽车',
    parts: '零件',
    item: '项',
    searchPlaceholder: '搜索产品...',
    all: '全部',
    allSuppliers: '所有供应商',
    printInventory: '打印完整库存',
    type: '类型',
    supplier: '供应商',
    quantity: '数量',
    invoice: '库存发票',
    report: '库存报告',
    serial: '序列号'
  }
};

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterSupplier, setFilterSupplier] = useState('all');
  const [searchText, setSearchText] = useState('');
  const { language } = useLanguage();
  const { api } = useAuth();

  const t = translations[language];

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/api/purchases');
      setInventory(res.data);
    } catch (err) {
      console.error(err);
      setInventory([]);
    }
  };

  const printItem = (item) => {
    const html = invoiceHtml(item, t);
    const w = window.open('', '_blank', 'width=900,height=800');
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 500);
  };

  const printReport = () => {
    const html = reportHtml(inventory, t);
    const w = window.open('', '_blank', 'width=1100,height=800');
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 500);
  };

  const sendWhatsApp = (item) => {
    const msg = encodeURIComponent(makeWhatsappMessage(item, t));
    const url = `https://wa.me/?text=${msg}`;
    window.open(url, '_blank');
  };

  const filteredInventory = inventory.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSupplier = filterSupplier === 'all' || item.supplier === filterSupplier;
    const matchesSearch = item.productName.toLowerCase().includes(searchText.toLowerCase());
    return matchesType && matchesSupplier && matchesSearch;
  });

  const carsCount = inventory
    .filter(i => i.type === 'car')
    .reduce((total, item) => total + Number(item.quantity), 0);

  const partsCount = inventory
    .filter(i => i.type === 'part')
    .reduce((total, item) => total + Number(item.quantity), 0);
  const suppliers = [...new Set(inventory.map(i => i.supplier))];

  return (
    <div className="inventory-page">
      <h1>{t.title}</h1>

      {/* <div className="language-select">
                <label>Language: </label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                    <option value="zh">中文</option>
                </select>
            </div> */}

      <div className="inventory-cards">
        <div className="card" onClick={() => setFilterType('car')}>
          <h2>{t.cars}</h2>
          <p>{carsCount} {t.item}</p>
        </div>
        <div className="card" onClick={() => setFilterType('part')}>
          <h2>{t.parts}</h2>
          <p>{partsCount} {t.item}</p>
        </div>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">{t.all}</option>
          <option value="car">{t.cars}</option>
          <option value="part">{t.parts}</option>
        </select>

        <select value={filterSupplier} onChange={(e) => setFilterSupplier(e.target.value)}>
          <option value="all">{t.allSuppliers}</option>
          {suppliers.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* زر تفاصيل الموردين */}
        <button
          className="btn-primary"
          onClick={() => window.location.href = '/suppliers'}
        >
          {language === 'ar' ? 'تفاصيل الموردين' : language === 'en' ? 'Supplier Details' : '供应商详情'}
        </button>

        <button className="btn-primary" onClick={printReport}>{t.printInventory}</button>
      </div>

      <div className="inventory-grid">
        {filteredInventory.map(item => (
          <div key={item.id} className="inventory-item">
            <h3 className='ism'>{item.productName}</h3>
            <p className='p-inv'>{t.type}: {item.type === 'car' ? t.cars : t.parts}</p>
            <p className='p-inv'>{t.supplier}: {item.supplier}</p>
            <p className='p-inv'>{t.quantity}: {item.quantity}</p>
            <div className="item-actions">
              <button title={t.invoice} onClick={() => printItem(item)}><FaPrint /></button>
              <button title="WhatsApp" onClick={() => sendWhatsApp(item)}><FaWhatsapp /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ======= دوال الطباعة والواتساب مع دعم اللغة =======
function invoiceHtml(p, t) {
  return `
  <html>
    <head>
      <title>${t.invoice} - ${p.productName}</title>
      <style>
        body{font-family: Arial; margin:20px; direction:rtl;}
        table{width:100%; border-collapse:collapse; margin-top:20px;}
        th, td{border:1px solid #ddd; padding:10px;}
        th{background:#f4f4f4;}
      </style>
    </head>
    <body>
      <h2>${t.invoice}</h2>
      <table>
        <tr><th>${t.serial}</th><td>${p.serialNumber || '-'}</td></tr>
        <tr><th>${t.product}</th><td>${p.productName}</td></tr>
        <tr><th>${t.type}</th><td>${p.type === 'car' ? t.cars : t.parts}</td></tr>
        <tr><th>${t.supplier}</th><td>${p.supplier}</td></tr>
        <tr><th>${t.quantity}</th><td>${p.quantity}</td></tr>
      </table>
    </body>
  </html>
  `;
}

function reportHtml(items, t) {
  const rows = items.map(p => `
    <tr>
      <td>${p.serialNumber}</td>
      <td>${p.productName}</td>
      <td>${p.type === 'car' ? t.cars : t.parts}</td>
      <td>${p.supplier}</td>
      <td>${p.quantity}</td>
    </tr>
  `).join('');
  return `
  <html>
    <head>
      <title>${t.report}</title>
      <style>
        body{font-family: Arial; margin:20px; direction:rtl;}
        table{width:100%; border-collapse:collapse;}
        th, td{border:1px solid #ddd; padding:8px;}
        th{background:#f4f4f4;}
      </style>
    </head>
    <body>
      <h1>${t.report}</h1>
      <table>
        <thead>
          <tr>
            <th>${t.serial}</th>
            <th>${t.product}</th>
            <th>${t.type}</th>
            <th>${t.supplier}</th>
            <th>${t.quantity}</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </body>
  </html>
  `;
}

function makeWhatsappMessage(p, t) {
  return `${t.invoice}\n${t.product}: ${p.productName}\n${t.type}: ${p.type === 'car' ? t.cars : t.parts}\n${t.supplier}: ${p.supplier}\n${t.quantity}: ${p.quantity}`;
}

export default Inventory;
