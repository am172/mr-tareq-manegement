import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaPrint, FaWhatsapp, FaTrash } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Inventory.css';

const translations = {
  ar: {
    title: 'المخزن',
    cars: 'السيارات',
    parts: 'قطع الغيار',
    product: 'اسم المنتج',
    item: 'عنصر',
    searchPlaceholder: 'ابحث بالاسم ...',
    all: 'الكل',
    allSuppliers: 'كل الموردين',
    printInventory: 'طباعة المخزن بالكامل',
    type: 'النوع',
    supplier: 'المورد',
    quantity: 'الكمية',
    invoice: 'فاتورة المخزن',
    report: 'تقرير المخزن',
    serial: 'الرقم التسلسلي',
    delete: 'حذف',
    deleteConfirm: 'هل أنت متأكد من حذف هذا المنتج؟',
    deleteFinalConfirm: 'هذه عملية حذف نهائية، هل تريد الاستمرار؟',
    deleteSuccess: 'تم حذف المنتج بنجاح',
    deleteError: 'حدث خطأ أثناء حذف المنتج',
    copySuccess: 'تم نسخ الرسالة للواتساب',
    resultsFor: (type, supplier) => {
      const typeText = type === 'all' ? 'المنتجات' : type === 'car' ? 'السيارات' : 'قطع الغيار';
      const supplierText = supplier === 'all' ? 'من جميع الموردين' : `من المورد "${supplier}"`;
      return `عرض ${typeText} ${supplierText}`;
    },
    noResults: (type, supplier) => {
      const typeText = type === 'all' ? 'منتجات' : type === 'car' ? 'سيارات' : 'قطع غيار';
      const supplierText = supplier === 'all' ? 'من جميع الموردين' : `من المورد "${supplier}"`;
      return `للأسف لا توجد ${typeText} ${supplierText}`;
    }
  },
  en: {
    title: 'Inventory',
    cars: 'Cars',
    parts: 'Parts',
    item: 'Item',
    product: 'Product Name',
    searchPlaceholder: 'Search for a product...',
    all: 'All',
    allSuppliers: 'All Suppliers',
    printInventory: 'Print Full Inventory',
    type: 'Type',
    supplier: 'Supplier',
    quantity: 'Quantity',
    invoice: 'Inventory Invoice',
    report: 'Inventory Report',
    serial: 'Serial Number',
    delete: 'Delete',
    deleteConfirm: 'Are you sure you want to delete this product?',
    deleteFinalConfirm: 'This is a final delete operation. Continue?',
    deleteSuccess: 'Product deleted successfully',
    deleteError: 'Error deleting product',
    copySuccess: 'Message copied for WhatsApp',
    resultsFor: (type, supplier) => {
      const typeText = type === 'all' ? 'products' : type === 'car' ? 'cars' : 'parts';
      const supplierText = supplier === 'all' ? 'from all suppliers' : `from supplier "${supplier}"`;
      return `Showing ${typeText} ${supplierText}`;
    },
    noResults: (type, supplier) => {
      const typeText = type === 'all' ? 'products' : type === 'car' ? 'cars' : 'parts';
      const supplierText = supplier === 'all' ? 'from all suppliers' : `from supplier "${supplier}"`;
      return `Unfortunately, no ${typeText} ${supplierText}`;
    }
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
    serial: '序列号',
    delete: '删除',
    deleteConfirm: '您确定要删除此产品吗？',
    deleteFinalConfirm: '这是最终删除操作，是否继续？',
    deleteSuccess: '产品已成功删除',
    deleteError: '删除产品时出错',
    copySuccess: '消息已复制到WhatsApp',
    product: '产品名称',
    resultsFor: (type, supplier) => {
      const typeText = type === 'all' ? '所有产品' : type === 'car' ? '汽车' : '零件';
      const supplierText = supplier === 'all' ? '来自所有供应商' : `来自供应商 "${supplier}"`;
      return `正在显示 ${typeText} ${supplierText}`;
    },
    noResults: (type, supplier) => {
      const typeText = type === 'all' ? '产品' : type === 'car' ? '汽车' : '零件';
      const supplierText = supplier === 'all' ? '来自所有供应商' : `来自供应商 "${supplier}"`;
      return `很遗憾，没有 ${typeText} ${supplierText}`;
    }
  }

};

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterSupplier, setFilterSupplier] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true); // ✅ حالة التحميل
  const { language } = useLanguage();
  const { api } = useAuth();
  const t = translations[language];

  useEffect(() => { fetchInventory(); }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true); // ✅ بدأ التحميل
      const res = await api.get('/api/products');
      setInventory(res.data);
    } catch (err) {
      console.error(err);
      toast.error(t.deleteError);
    } finally {
      setLoading(false); // ✅ انتهى التحميل
    }
  };

  const deleteItem = async (id, name) => {
    // الخطوة الأولى: تأكيد أولي
    toast.info(
      <div>
        <p>{t.deleteConfirm}</p>
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              toast.dismiss();
              // الخطوة الثانية: تأكيد نهائي
              toast.info(
                <div>
                  <p>{t.deleteFinalConfirm}</p>
                  <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                    <button
                      onClick={async () => {
                        toast.dismiss();
                        try {
                          await api.delete(`/api/products/${id}`);
                          toast.success(` ${t.deleteSuccess}`);
                          fetchInventory();
                        } catch (err) {
                          console.error(err);
                          toast.error(t.deleteError);
                        }
                      }}
                    >
                      ✅ {t.delete}
                    </button>
                    <button onClick={() => toast.dismiss()}>❌ {t.all}</button>
                  </div>
                </div>,
                { autoClose: false }
              );
            }}
          >
            ✅ {t.delete}
          </button>
          <button onClick={() => toast.dismiss()}>❌ {t.all}</button>
        </div>
      </div>,
      { autoClose: false }
    );
  };


  const printItem = (item) => {
    const html = invoiceHtml(item, t);
    const w = window.open('', '_blank', 'width=900,height=800');
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => {
      w.print();
      toast.success(`${item.productName || item.name || '-'}: ${t.invoice}`);
    }, 500);
  };

  const printReport = () => {
    // ✅ خليه يطبع بس المنتجات اللي كميتها > 0
    const validItems = inventory.filter(item => Number(item.quantity) > 0);
    const html = reportHtml(validItems, t);
    const w = window.open('', '_blank', 'width=1100,height=800');
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => {
      w.print();
      toast.success(t.report);
    }, 500);
  };


  const sendWhatsApp = (item) => {
    const msg = makeWhatsappMessage(item, t);
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    navigator.clipboard.writeText(msg)
      .then(() => toast.success(t.copySuccess))
      .catch(() => toast.error(t.deleteError));
    window.open(url, '_blank');
  };

  const filteredInventory = inventory.filter(item => {
    const pname = (item.productName || item.name || "").toLowerCase();
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSupplier = filterSupplier === 'all' || (item.supplier || "") === filterSupplier;
    const matchesSearch = pname.includes(searchText.toLowerCase());
    const hasQuantity = Number(item.quantity) > 0;
    return matchesType && matchesSupplier && matchesSearch && hasQuantity;
  });

  const carsCount = inventory.filter(i => i.type === 'car').reduce((total, item) => total + Number(item.quantity), 0);
  const partsCount = inventory.filter(i => i.type === 'part').reduce((total, item) => total + Number(item.quantity), 0);
  const suppliers = [...new Set(inventory.map(i => i.supplier))];

  return (
    <div className="inventory-page">
      <h1>{t.title}</h1>

      {/* ✅ الكروت + السبينر */}
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

      {/* ✅ لو لسه بيحمل */}
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "30px 0"
          }}
        >
          <div
            style={{
              border: "12px solid #f3f3f3",   // خلفية خفيفة
              borderTop: "12px solid #007bff", // أزرق
              borderRadius: "50%",
              width: "80px",
              height: "80px",
              animation: "spin 1.5s linear infinite"
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
      )}

      {/* ✅ الباقي */}
      {!loading && (
        <>
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

            <button className="btn-primary" onClick={printReport}>{t.printInventory}</button>
          </div>

          <div className="filters-info">
            {filteredInventory.length > 0 ? (
              <p>{t.resultsFor(filterType, filterSupplier)}</p>
            ) : (
              <p style={{ color: 'red' }}>
                {t.noResults(filterType, filterSupplier)}
              </p>
            )}
          </div>

          <div className="inventory-grid">
            {filteredInventory.map(item => (
              <div key={item._id} className="inventory-item">
                <h3 className='ism'>{item.productName || item.name || '-'}</h3>
                <p className='p-inv'>{t.type}: {item.type === 'car' ? t.cars : t.parts}</p>
                <p className='p-inv'>{t.supplier}: {item.supplier || '-'}</p>
                <p className='p-inv'>{t.quantity}: {item.quantity}</p>
                <div className="item-actions">
                  <button title={t.invoice} onClick={() => printItem(item)}><FaPrint /></button>
                  <button title="WhatsApp" onClick={() => sendWhatsApp(item)}><FaWhatsapp /></button>
                  <button title={t.delete} onClick={() => deleteItem(item._id)}><FaTrash style={{ color: 'red' }} /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

};

// ======= دوال الطباعة والواتساب =======
function invoiceHtml(p, t) {
  const name = p.productName || p.name || '-';
  return `
  <html>
    <head>
      <title>${t.invoice} - ${name}</title>
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
        <tr><th>${t.product}</th><td>${name}</td></tr>
        <tr><th>${t.type}</th><td>${p.type === 'car' ? t.cars : t.parts}</td></tr>
        <tr><th>${t.supplier}</th><td>${p.supplier || '-'}</td></tr>
        <tr><th>${t.quantity}</th><td>${p.quantity}</td></tr>
      </table>
    </body>
  </html>
  `;
}

function reportHtml(items, t) {
  const rows = items.map(p => {
    const name = p.productName || p.name || '-';
    return `
    <tr>
      <td>${p.serialNumber || '-'}</td>
      <td>${name}</td>
      <td>${p.type === 'car' ? t.cars : t.parts}</td>
      <td>${p.supplier || '-'}</td>
      <td>${p.quantity}</td>
    </tr>
  `;
  }).join('');
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
  const name = p.productName || p.name || '-';
  return `${t.invoice}\n${t.product}: ${name}\n${t.type}: ${p.type === 'car' ? t.cars : t.parts}\n${t.supplier}: ${p.supplier || '-'}\n${t.quantity}: ${p.quantity}`;
}

export default Inventory;
