import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SalesForm from '../components/SaleForm';
import './Sales.css';
import { FaPrint, FaWhatsapp, FaEdit, FaTrash } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const translations = {
  ar: {
    title: 'المبيعات',
    addSale: 'إضافة عملية بيع',
    product: 'المنتج',
    buyer: 'البائع',
    quantity: 'الكمية',
    price: 'السعر',
    discount: 'الخصم',
    total: 'الإجمالي',
    date: 'التاريخ',
    actions: 'العمليات',
    invoice: 'فاتورة بيع / عقد بيع سيارات',
    searchPlaceholder: 'بحث باسم المنتج أو المشتري',
    monthFilter: 'عرض',
    monthFilterDesc: 'فلترة المبيعات حسب الشهر',
    periodFilter: 'عرض',
    periodFilterDesc: 'فلترة المبيعات حسب فترة زمنية',
    printReport: 'طباعة تقرير شامل',
    noProducts: 'لا توجد منتجات مطابقة لبحثك ❌',
    confirmDelete: 'هل أنت متأكد أنك تريد الحذف؟',
    finalConfirm: 'هل أنت متأكد نهائيًا من الحذف؟',
    deleted: 'تم الحذف بنجاح ✅',
    error: 'حدث خطأ أثناء العملية ❌',
    added: 'تمت الإضافة بنجاح ✅',
    updated: 'تم التعديل بنجاح ✅',
    addError: 'حدث خطأ أثناء الإضافة ❌',
    updateError: 'حدث خطأ أثناء التعديل ❌',
    itemCar: 'سيارة',
    itemPart: 'قطعة',
    conditionNew: 'جديد',
    conditionUsed: 'مستعمل',
    serial: 'الرقم التسلسلي',
    invoiceNumber: 'رقم الفاتورة',
    type: 'النوع',
    supplier: 'المورد',
    model: 'الموديل',
    year: 'سنة الصنع',
    color: 'اللون',
    chassis: 'رقم الشاسيه',
    condition: 'الحالة',
    yes: 'نعم',
    no: 'لا'
  },
  en: {
    title: 'Sales',
    addSale: 'Add Sale',
    product: 'Product',
    buyer: 'Saller',
    quantity: 'Quantity',
    price: 'Price',
    discount: 'Discount',
    total: 'Total',
    date: 'Date',
    actions: 'Actions',
    invoice: 'Sales Invoice / Car Sales Agreement',
    searchPlaceholder: 'Search by product or Saller',
    monthFilter: 'Show',
    monthFilterDesc: 'Filter sales by month',
    periodFilter: 'Show',
    periodFilterDesc: 'Filter sales by period',
    printReport: 'Print Full Report',
    noProducts: 'No matching products found ❌',
    confirmDelete: 'Are you sure you want to delete?',
    finalConfirm: 'Are you absolutely sure?',
    deleted: 'Deleted successfully ✅',
    error: 'Error while processing ❌',
    added: 'Added successfully ✅',
    updated: 'Updated successfully ✅',
    addError: 'Error while adding ❌',
    updateError: 'Error while updating ❌',
    itemCar: 'Car',
    itemPart: 'Part',
    conditionNew: 'New',
    conditionUsed: 'Used',
    serial: 'Serial',
    invoiceNumber: 'Invoice Number',
    type: 'Type',
    supplier: 'Supplier',
    model: 'Model',
    year: 'Year',
    color: 'Color',
    chassis: 'Chassis No',
    condition: 'Condition',
    yes: 'Yes',
    no: 'No'
  },
  zh: {
    title: '销售',
    addSale: '添加销售',
    product: '产品',
    buyer: '卖家',
    quantity: '数量',
    price: '价格',
    discount: '折扣',
    total: '总计',
    date: '日期',
    actions: '操作',
    invoice: '销售发票 / 汽车销售协议',
    searchPlaceholder: '按产品或买家搜索',
    monthFilter: '显示',
    monthFilterDesc: '按月份筛选销售',
    periodFilter: '显示',
    periodFilterDesc: '按时间段筛选销售',
    printReport: '打印完整报告',
    noProducts: '未找到匹配的产品 ❌',
    confirmDelete: '您确定要删除吗？',
    finalConfirm: '您确定要永久删除吗？',
    deleted: '删除成功 ✅',
    error: '处理时出错 ❌',
    added: '添加成功 ✅',
    updated: '更新成功 ✅',
    addError: '添加时出错 ❌',
    updateError: '更新时出错 ❌',
    itemCar: '汽车',
    itemPart: '零件',
    conditionNew: '新的',
    conditionUsed: '二手的',
    serial: '序列号',
    invoiceNumber: '发票号码',
    type: '类型',
    supplier: '供应商',
    model: '型号',
    year: '年份',
    color: '颜色',
    chassis: '车架号',
    condition: '状况',
    yes: '是',
    no: '否'
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
  const [filterDescription, setFilterDescription] = useState('');

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


  // فلتر الشهر
  const handleMonthFilter = () => {
    if (monthFilter) {
      // تصفير فلتر الفترة
      setPeriodFilter({ start: '', end: '' });

      const [year, month] = monthFilter.split('-');
      fetchSales({ month, year });

      // الجملة الوصفية
      setFilterDescription(`المبيعات خلال شهر ${month} - ${year}`);
    }
  };

  // فلتر الفترة
  const handlePeriodFilter = () => {
    if (periodFilter.start && periodFilter.end) {
      // تصفير فلتر الشهر
      setMonthFilter('');

      fetchSales({ startDate: periodFilter.start, endDate: periodFilter.end });

      // الجملة الوصفية
      setFilterDescription(`المبيعات من ${periodFilter.start} إلى ${periodFilter.end}`);
    }
  };

  const handleDelete = async (id) => {
    toast.info(
      <div>
        <p>{t.confirmDelete}</p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <button
            onClick={async () => {
              toast.dismiss();
              toast.info(
                <div>
                  <p>{t.finalConfirm}</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <button
                      onClick={async () => {
                        try {
                          await api.delete(`/api/sales/${id}`);
                          fetchSales();
                          toast.success(t.deleted);
                        } catch (err) {
                          toast.error(t.error);
                        }
                      }}
                    >
                      {t.yes}
                    </button>
                    <button onClick={() => toast.dismiss()}>{t.no}</button>
                  </div>
                </div>,
                { autoClose: false }
              );
            }}
          >
            {t.yes}
          </button>
          <button onClick={() => toast.dismiss()}>{t.no}</button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  const handlePrintInvoice = (sale) => {
    const printContent = `

<!DOCTYPE html>
<html lang="${language}">
<head>
<meta charset="UTF-8">
<title>.</title>
<style>
  /* CSS مخصص لطباعة جدول الفاتورة فقط */
  body.invoice-print { 
    font-family: Arial; 
    direction: ${language === 'ar' ? 'rtl' : 'ltr'}; 
    padding: 20px; 
    line-height: 1.6; 
  }
  h2, h3 { text-align: center; margin: 5px 0; }
  table.invoice-table { 
    width: 100%; 
    border-collapse: collapse; 
    margin-top: 20px; 
    table-layout: fixed; 
  }
  table.invoice-table th, table.invoice-table td { 
    border: 1px solid #000; 
    padding: 2px; 
    text-align: center; 
    word-wrap: break-word; 
  }
  table.invoice-table th { background: #eee; }
  tr { height: 28px; }
  .header { text-align: center; margin-bottom: 20px; }
  .signatures { margin-top: 40px; display: flex; justify-content: space-between; }
</style>
</head>
        <body class="invoice-print">
  <div class="header">
            <h2>WAZIR GLOBALX FZCO</h2>
            <p>License No.: 67652  | Registration No.: 65609</p>
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
  <table class="invoice-table">
    <thead>
      <tr>
        <th>${t.invoiceNumber}</th>
        <th>${t.serial}</th>
        <th>${t.product}</th>
        <th>${t.model}</th>
        <th>${t.year}</th>
        <th>${t.color}</th>
        <th>${t.chassis}</th>
        <th>${t.condition}</th>
        <th>${t.quantity}</th>
        <th>${t.price}</th>
        <th>${t.total}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${sale.invoiceNumber || ''}</td>
        <td>${sale.serialNumber || ''}</td>
        <td>${sale.productName}</td>
        <td>${sale.model || ''}</td>
        <td>${sale.manufactureYear || ''}</td>
        <td>${sale.color || ''}</td>
        <td>${sale.chassisNumber || ''}</td>
        <td>${sale.condition === 'new' ? t.conditionNew : t.conditionUsed}</td>
        <td>${sale.quantity || ''}</td>
        <td>${sale.price || ''}</td>
        <td>${sale.total}</td>
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
    table.classList.add('invoice-table');

    const printContent = `
<!DOCTYPE html>
<html lang="${language}">
<head>
<meta charset="UTF-8">
<title>${t.title}</title>
<style>
  body.report-print { font-family: Arial; direction: ${language === 'ar' ? 'rtl' : 'ltr'}; padding: 20px; }
  table.invoice-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  table.invoice-table th, table.invoice-table td { border: 1px solid #000; font-size:14px; text-align: center; word-wrap: break-word; }
  table.invoice-table th { background: #eee; }
  tr { height: 28px; }
  h2 { text-align: center; margin-bottom: 10px; }
</style>
</head>
<body class="report-print">
  <h2>${t.title}</h2>
  ${table.outerHTML}
</body>
</html>
  `;

    const newWindow = window.open('', '_blank');
    newWindow.document.write(printContent);
    newWindow.document.close();
    newWindow.focus();
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

      {/* ✅ الجملة الوصفية تحت الفلاتر */}
      {filterDescription && (
        <div className="filter-description">
          <strong>{filterDescription}</strong>
        </div>
      )}


      {/* <div className="search-bar">
        <input type="text" placeholder={t.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} />
      </div> */}

      <div className="table-wrapper">
        <table className="sales-table">
          <thead>
            <tr>
              {/* <th>{t.invoiceNumber}</th> */}
              <th>{t.serial}</th>
              <th>{t.product}</th>
              <th>{t.type}</th>
              <th>{t.supplier}</th>
              <th>{t.model}</th>
              <th>{t.year}</th>
              <th>{t.color}</th>
              <th>{t.chassis}</th>
              <th>{t.condition}</th>
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
            {filteredSales.length > 0 ? (
              filteredSales.map(s => (
                <tr key={s._id}>
                  {/* <td>{s.invoiceNumber}</td> */}
                  <td>{s.serialNumber}</td>
                  <td>{s.productName}</td>
                  <td>{s.type === 'car' ? t.itemCar : t.itemPart}</td>
                  <td>{s.supplier}</td>
                  <td>{s.model}</td>
                  <td>{s.manufactureYear}</td>
                  <td>{s.color}</td>
                  <td>{s.chassisNumber}</td>
                  <td>{s.condition === 'new' ? t.conditionNew : t.conditionUsed}</td>
                  <td>{s.buyer}</td>
                  <td>{s.quantity}</td>
                  <td>{s.price}</td>
                  <td>{s.discount || 0}%</td>
                  <td>{s.total}</td>
                  <td>{new Date(s.date).toLocaleDateString('en-GB')}</td>
                  <td className='actions-cell'>
                    <button onClick={() => handlePrintInvoice(s)}><FaPrint /></button>
                    <button onClick={() => handleWhatsApp(s)}><FaWhatsapp /></button>
                    <button onClick={() => { setEditSale(s); setShowForm(true); }}><FaEdit /></button>
                    <button onClick={() => handleDelete(s._id)}><FaTrash /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="17" style={{ textAlign: 'center', padding: '20px' }}>{t.noProducts}</td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default Sales;
