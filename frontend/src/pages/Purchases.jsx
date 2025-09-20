import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PurchaseForm from '../components/PurchaseForm';
import { FaPrint, FaWhatsapp, FaEdit, FaTrash } from 'react-icons/fa';
import './Purchases.css';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        shippingCost: 'سعر الشحن',
        customsFee: 'التخليص الجمركي',
        total: 'الإجمالي',
        date: 'التاريخ',
        actions: 'أوامر',
        itemCar: 'سيارة',
        itemPart: 'قطعة غيار',
        noPurchases: 'لا توجد مشتريات',
        invoice: 'فاتورة شراء',
        model: 'موديل',
        manufactureYear: 'سنة الصنع',
        color: 'اللون',
        chassisNumber: 'رقم الشاسيه',
        condition: 'الحالة',
        conditionNew: 'جديد',
        conditionUsed: 'مستعمل',
        conditionEmpty: '---',
        filterType: "النوع:",
        filterSupplier: "المورد:",
        allSuppliers: "كل الموردين",
        allTypes: "الكل",
        car: "سيارة",
        part: "قطعة غيار",

        // إشعارات
        addSuccess: '✅ تم إضافة المنتج بنجاح',
        editConfirm: 'هل أنت متأكد أنك تريد تعديل عملية الشراء الخاصة بـ',
        deleteConfirm: 'هل أنت متأكد أنك تريد حذف عملية الشراء الخاصة بـ',
        deleteFinalConfirm: 'هذه عملية حذف نهائية! هل تريد المتابعة لحذف',
        deleteSuccess: '🗑️ تم الحذف بنجاح',
        deleteError: '❌ فشل الحذف، حاول مرة أخرى',
        errorOccurred: '❌ حدث خطأ غير متوقع، حاول مرة أخرى',
        allowPopups: '⚠️ من فضلك اسمح بالنوافذ المنبثقة',
        confirm: 'تأكيد',
        cancel: 'إلغاء',
        invoiceNumber: 'رقم الفاتورة',
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
        shippingCost: 'Shipping Cost',
        customsFee: 'Customs Clearance',
        total: 'Total',
        date: 'Date',
        actions: 'Actions',
        itemCar: 'Car',
        itemPart: 'Part',
        noPurchases: 'No purchases',
        invoice: 'Purchase Invoice',
        model: 'Model',
        manufactureYear: 'Manufacture Year',
        color: 'Color',
        chassisNumber: 'Chassis Number',
        condition: 'Condition',
        conditionNew: 'New',
        conditionUsed: 'Used',
        conditionEmpty: '---',
        filterType: "Type:",
        filterSupplier: "Supplier:",
        allSuppliers: "All suppliers",
        allTypes: "All",
        car: "Car",
        part: "Part",
        invoiceNumber: 'Invoice Number',

        // Notifications
        addSuccess: '✅ Product added successfully',
        editConfirm: 'Are you sure you want to edit the purchase of',
        deleteConfirm: 'Are you sure you want to delete the purchase of',
        deleteFinalConfirm: 'This is a final delete! Do you want to continue deleting',
        deleteSuccess: '🗑️ Deleted successfully',
        deleteError: '❌ Deletion failed, try again',
        errorOccurred: '❌ Unexpected error, please try again',
        allowPopups: '⚠️ Please allow popups',
        confirm: 'Confirm',
        cancel: 'Cancel',
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
        shippingCost: '运费',
        customsFee: '清关费用',
        total: '总计',
        date: '日期',
        actions: '操作',
        itemCar: '汽车',
        itemPart: '零件',
        noPurchases: '暂无采购记录',
        invoice: '采购发票',
        model: '型号',
        manufactureYear: '生产年份',
        color: '颜色',
        chassisNumber: '底盘号',
        condition: '状态',
        conditionNew: '新的',
        conditionUsed: '二手',
        conditionEmpty: '---',
        filterType: "类型:",
        filterSupplier: "供应商:",
        allSuppliers: "所有供应商",
        allTypes: "全部",
        car: "汽车",
        part: "零件",

        // Notifications
        addSuccess: '✅ 产品添加成功',
        editConfirm: '您确定要修改该采购吗',
        deleteConfirm: '您确定要删除该采购吗',
        deleteFinalConfirm: '这是最终删除！您确定要继续删除',
        deleteSuccess: '🗑️ 删除成功',
        deleteError: '❌ 删除失败，请重试',
        errorOccurred: '❌ 发生意外错误，请重试',
        allowPopups: '⚠️ 请允许弹出窗口',
        confirm: '确认',
        cancel: '取消',
        invoiceNumber: '发票号码',
    }
};

const Purchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [filter, setFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState("all");
    const [supplierFilter, setSupplierFilter] = useState("all");
    const [suppliers, setSuppliers] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingPurchase, setEditingPurchase] = useState(null);
    const { language } = useLanguage();
    const { api } = useAuth();

    const t = translations[language];

    useEffect(() => {
        fetchPurchases();
    }, [filter, typeFilter, supplierFilter]);

    const fetchPurchases = async () => {
        try {
            const response = await api.get(`/api/purchases?period=${filter}&type=${typeFilter}&supplier=${supplierFilter}`);
            setPurchases(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching purchases:', error);
            setPurchases([]);
        }
    };

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const res = await api.get('/api/suppliers');
                setSuppliers(res.data || []);
            } catch (err) {
                console.error("Error fetching suppliers:", err);
            }
        };
        fetchSuppliers();
    }, []);

    const handleSavePurchase = async (data) => {
        try {
            if (editingPurchase) {
                await api.put(`/api/purchases/${editingPurchase.id}`, data);
                fetchPurchases();
                toast.success(t.addSuccess);
            } else {
                const res = await api.post('/api/purchases', data);
                setPurchases(prev => [...prev, res.data]);
                toast.success(t.addSuccess);
                window.location.reload();
            }
            setShowForm(false);
            setEditingPurchase(null);
        } catch (error) {
            console.error('Error saving purchase:', error);
            toast.error(error.response?.data?.error || t.errorOccurred);
        }
    };

    // ✅ توست للتأكيد
    const showConfirmToast = (message, onConfirm) => {
        toast.info(
            ({ closeToast }) => (
                <div>
                    <p>{message}</p>
                    <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                        <button
                            style={{ padding: "4px 8px", background: "red", color: "white", border: "none", borderRadius: "4px" }}
                            onClick={() => {
                                onConfirm();
                                closeToast();
                            }}
                        >
                            {t.confirm}
                        </button>
                        <button
                            style={{ padding: "4px 8px", background: "gray", color: "white", border: "none", borderRadius: "4px" }}
                            onClick={closeToast}
                        >
                            {t.cancel}
                        </button>
                    </div>
                </div>
            ),
            { autoClose: false }
        );
    };

    // ✅ حذف بخطوتين
    const handleDelete = (purchase) => {
        showConfirmToast(`${t.deleteConfirm} "${purchase.productName}"؟`, () => {
            setTimeout(() => {
                showConfirmToast(`${t.deleteFinalConfirm} "${purchase.productName}"؟`, async () => {
                    try {
                        await api.delete(`/api/purchases/${purchase.id}`);
                        setPurchases((prev) => prev.filter((p) => p.id !== purchase.id));
                        toast.success(t.deleteSuccess);
                    } catch (error) {
                        console.error(error);
                        toast.error(t.deleteError);
                    }
                });
            }, 400);
        });
    };

    // ✅ تعديل
    const handleEdit = (purchase) => {
        showConfirmToast(`${t.editConfirm} "${purchase.productName}"؟`, () => {
            setEditingPurchase(purchase);
            setShowForm(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
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

    // ✅ دالة لحساب الإجمالي الظاهر
    const calcDisplayTotal = (p) => {
        return (p.price * p.quantity) + (p.shippingCost || 0) + (p.customsFee || 0);
    };

    return (
        <div className="purchases-page">
            <header className="purchases-header">
                <h1>{t.title}</h1>
                <div className="btn-group">
                    <button className="btn btn-primary" onClick={openNewForm}>{t.addPurchase}</button>
                    <button className="btn btn-secondary" onClick={printReport}>{t.printReport}</button>
                </div>
                <div className="header-actions">
                    <div className="filter-wrap">
                        <label>{t.filterPeriod}</label>
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="all">{t.all}</option>
                            <option value="daily">{t.daily}</option>
                            <option value="weekly">{t.weekly}</option>
                            <option value="monthly">{t.monthly}</option>
                        </select>
                    </div>

                    <div className="filter-wrap">
                        <label>{t.filterType}</label>
                        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                            <option value="all">{t.allTypes}</option>
                            <option value="car">{t.car}</option>
                            <option value="part">{t.part}</option>
                        </select>
                    </div>

                    <div className="filter-wrap">
                        <label>{t.filterSupplier}</label>
                        <select value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value)}>
                            <option value="all">{t.allSuppliers}</option>
                            {suppliers.map(s => (
                                <option key={s._id} value={s.name}>{s.name}</option>
                            ))}
                        </select>
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
                            <th>{t.model}</th>
                            <th>{t.manufactureYear}</th>
                            <th>{t.color}</th>
                            <th>{t.chassisNumber}</th>
                            <th>{t.condition}</th>
                            <th>{t.quantity}</th>
                            <th>{t.price}</th>
                            <th>{t.shippingCost}</th>
                            <th>{t.customsFee}</th>
                            <th>{t.total}</th>
                            <th>{t.date}</th>
                            <th>{t.actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.map(p => (
                            <tr key={p.id || p._id}>
                                <td>{p.serialNumber || '---'}</td>
                                <td>{p.productName || '---'}</td>
                                <td>{p.type === 'car' ? t.itemCar : t.itemPart}</td>
                                <td>{p.supplier || '---'}</td>
                                <td>{p.model || '---'}</td>
                                <td>{p.manufactureYear || '---'}</td>
                                <td>{p.color || '---'}</td>
                                <td>{p.chassisNumber || '---'}</td>
                                <td>{p.condition ? (p.condition === 'new' ? t.conditionNew : t.conditionUsed) : t.conditionEmpty}</td>
                                <td>{p.quantity || 0}</td>
                                <td>{formatMoney(p.price)}</td>
                                <td>{formatMoney(p.shippingCost || 0)}</td>
                                <td>{formatMoney(p.customsFee || 0)}</td>
                                <td>{formatMoney(calcDisplayTotal(p))}</td>
                                <td>{p.purchaseDate ? formatDate(p.purchaseDate) : '---'}</td>
                                <td className="actions-cell">
                                    <button title={t.invoice} className="icon-btn" onClick={() => printInvoice(p)}><FaPrint /></button>
                                    <button title="WhatsApp" className="icon-btn" onClick={() => sendWhatsApp(p)}><FaWhatsapp /></button>
                                    <button title="Edit" className="icon-btn" onClick={() => handleEdit(p)}><FaEdit /></button>
                                    <button title="Delete" className="icon-btn danger" onClick={() => handleDelete(p)}><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ======= دوال الطباعة والواتساب مع دعم اللغة =======
function invoiceHtml(p, t, invoiceNumber = 1) {
    const date = p.purchaseDate ? new Date(p.purchaseDate).toLocaleString('en-GB') : '---';
    const totalDisplay = (p.price * p.quantity) + (p.shippingCost || 0) + (p.customsFee || 0);

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
      <h2 style="text-align:center">${t.invoice}</h2>
      <table>
        <tr><th>${t.invoiceNumber}</th><td>${p.invoiceNumber}</td></tr>
        <tr><th>${t.serial}</th><td>${escapeHtml(p.serialNumber || '')}</td></tr>
        <tr><th>${t.product}</th><td>${escapeHtml(p.productName)}</td></tr>
        <tr><th>${t.type}</th><td>${p.type === 'car' ? t.itemCar : t.itemPart}</td></tr>
        <tr><th>${t.supplier}</th><td>${escapeHtml(p.supplier || '')}</td></tr>
        <tr><th>${t.model}</th><td>${escapeHtml(p.model || '')}</td></tr>
        <tr><th>${t.manufactureYear}</th><td>${p.manufactureYear || '---'}</td></tr>
        <tr><th>${t.color}</th><td>${escapeHtml(p.color || '')}</td></tr>
        <tr><th>${t.chassisNumber}</th><td>${escapeHtml(p.chassisNumber || '')}</td></tr>
        <tr><th>${t.condition}</th><td>${p.condition ? (p.condition === 'new' ? t.conditionNew : t.conditionUsed) : t.conditionEmpty}</td></tr>
        <tr><th>${t.quantity}</th><td>${p.quantity || 0}</td></tr>
        <tr><th>${t.price}</th><td>${p.price}</td></tr>
        <tr><th>${t.shippingCost}</th><td>${p.shippingCost || 0}</td></tr>
        <tr><th>${t.customsFee}</th><td>${p.customsFee || 0}</td></tr>
        <tr><th>${t.total}</th><td>${totalDisplay}</td></tr>
        <tr><th>${t.date}</th><td>${date}</td></tr>
      </table>
    </body>
  </html>
  `;
}


function reportHtml(purchases, t) {
    const rows = purchases.map((p) => {
        const totalDisplay = (p.price * p.quantity) + (p.shippingCost || 0) + (p.customsFee || 0);
        
        return `
        <tr>
          <td>${escapeHtml(p.serialNumber || '')}</td>
          <td>${escapeHtml(p.productName || '')}</td>
          <td>${p.type === 'car' ? t.itemCar : t.itemPart}</td>
          <td>${escapeHtml(p.supplier || '')}</td>
          <td>${escapeHtml(p.model || '')}</td>
          <td>${p.manufactureYear || '---'}</td>
          <td>${escapeHtml(p.color || '')}</td>
          <td>${escapeHtml(p.chassisNumber || '')}</td>
          <td>${p.condition ? (p.condition === 'new' ? t.conditionNew : t.conditionUsed) : t.conditionEmpty}</td>
          <td>${p.quantity || 0}</td>
          <td>${p.price}</td>
          <td>${p.shippingCost || 0}</td>
          <td>${p.customsFee || 0}</td>
          <td>${totalDisplay}</td>
          <td>${p.purchaseDate ? new Date(p.purchaseDate).toLocaleDateString('en-GB') : ''}</td>
        </tr>`;
    }).join('');

    return `
    <html>
      <head>
        <title>${t.title}</title>
        <style>
          body{font-family:Arial;margin:20px;direction:rtl}
          table{width:100%;border-collapse:collapse}
          th,td{border:1px solid #ddd;padding:8px}
          th{background:#f4f4f4}
        </style>
      </head>
      <body>
        <h1 style="text-align:center">${t.title}</h1>
        <table>
          <thead>
            <tr>
              <th>${t.serial}</th>
              <th>${t.product}</th>
              <th>${t.type}</th>
              <th>${t.supplier}</th>
              <th>${t.model}</th>
              <th>${t.manufactureYear}</th>
              <th>${t.color}</th>
              <th>${t.chassisNumber}</th>
              <th>${t.condition}</th>
              <th>${t.quantity}</th>
              <th>${t.price}</th>
              <th>${t.shippingCost}</th>
              <th>${t.customsFee}</th>
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
    const totalDisplay = (p.price * p.quantity) + (p.shippingCost || 0) + (p.customsFee || 0);
    return `${t.invoice}\n${t.product}: ${p.productName}\n${t.type}: ${p.type === 'car' ? t.itemCar : t.itemPart}\n${t.supplier}: ${p.supplier}\n${t.quantity}: ${p.quantity}\n${t.price}: ${p.price}\n${t.shippingCost}: ${p.shippingCost || 0}\n${t.customsFee}: ${p.customsFee || 0}\n${t.total}: ${totalDisplay}\n${t.date}: ${p.purchaseDate ? new Date(p.purchaseDate).toLocaleDateString('en-GB') : ''}`;
}

export default Purchases;
