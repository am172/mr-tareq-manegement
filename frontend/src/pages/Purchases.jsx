// Purchases.jsx
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
        custom: 'مخصص',
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
        itemCar: 'السيارات',
        itemPart: 'قطع الغيار',
        noPurchases: 'لا توجد مشتريات',
        noPurchasesDetail: 'لا توجد نتائج مطابقة للمعايير المحددة.',
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
        invoiceNumber: 'رقم الفاتورة',
        summaryPrefix_car: 'عرض السيارات',
        summaryPrefix_part: 'عرض قطع الغيار',
        during: 'خلال',
        fromTo: 'من',
        toLabel: 'إلى',
        noResultsDuring: 'لا توجد مشتريات خلال هذه الفترة.',
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
    },
    en: {
        title: 'Purchases',
        filterPeriod: 'Period:',
        all: 'All',
        daily: 'Daily',
        weekly: 'Weekly',
        monthly: 'Monthly',
        custom: 'Custom',
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
        noPurchasesDetail: 'No results match the applied filters.',
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
        summaryPrefix_car: 'Showing cars',
        summaryPrefix_part: 'Showing parts',
        during: 'during',
        fromTo: 'from',
        toLabel: 'to',
        noResultsDuring: 'No purchases during this period.',
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
        custom: '自定义',
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
        noPurchasesDetail: '没有匹配当前筛选条件的结果。',
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
        invoiceNumber: '发票号码',
        summaryPrefix_car: '显示汽车',
        summaryPrefix_part: '显示零件',
        during: '在',
        fromTo: '从',
        toLabel: '至',
        noResultsDuring: '该期间内没有采购记录。',
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
    }
};

const Purchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [filter, setFilter] = useState('all'); // all/daily/weekly/monthly/custom
    const [dateValue, setDateValue] = useState(''); // for daily/weekly
    const [monthValue, setMonthValue] = useState(''); // MM
    const [yearValue, setYearValue] = useState(''); // YYYY
    const [fromValue, setFromValue] = useState('');
    const [toValue, setToValue] = useState('');

    const [typeFilter, setTypeFilter] = useState("all");
    const [supplierFilter, setSupplierFilter] = useState("all");
    const [suppliers, setSuppliers] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingPurchase, setEditingPurchase] = useState(null);
    const { language } = useLanguage();
    const { api } = useAuth();

    const t = translations[language];

    useEffect(() => {
        fetchSuppliers();
    }, []);

    useEffect(() => {
        fetchPurchases();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, dateValue, monthValue, yearValue, fromValue, toValue, typeFilter, supplierFilter]);

    const fetchSuppliers = async () => {
        try {
            const res = await api.get('/api/suppliers');
            setSuppliers(res.data || []);
        } catch (err) {
            console.error("Error fetching suppliers:", err);
            setSuppliers([]);
        }
    };

    const buildQuery = () => {
        const params = new URLSearchParams();
        params.append('period', filter || 'all');
        if (filter === 'daily' && dateValue) params.append('date', dateValue);
        if (filter === 'weekly' && dateValue) params.append('date', dateValue);
        if (filter === 'monthly' && monthValue && yearValue) {
            params.append('month', monthValue);
            params.append('year', yearValue);
        }
        if (filter === 'custom' && fromValue && toValue) {
            params.append('from', fromValue);
            params.append('to', toValue);
        }
        params.append('type', typeFilter || 'all');
        // بدل ما تبعت supplier._id
        const s = suppliers.find(s => s._id === supplierFilter);
        params.append('supplier', s ? s.name : supplierFilter);


        return params.toString();
    };

    const fetchPurchases = async () => {
        try {
            const q = buildQuery();
            const response = await api.get(`/api/purchases?${q}`);
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
                toast.success(t.addSuccess);
            } else {
                const res = await api.post('/api/purchases', data);
                setPurchases(prev => [res.data, ...prev]);
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

    // توست التأكيد
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

    const handleDelete = (purchase) => {
        showConfirmToast(`${t.deleteConfirm} "${purchase.productName}"؟`, () => {
            setTimeout(() => {
                showConfirmToast(`${t.deleteFinalConfirm} "${purchase.productName}"؟`, async () => {
                    try {
                        await api.delete(`/api/purchases/${purchase.id || purchase._id}`);
                        setPurchases((prev) => prev.filter((p) => (p.id || p._id) !== (purchase.id || purchase._id)));
                        toast.success(t.deleteSuccess);
                    } catch (error) {
                        console.error(error);
                        toast.error(t.deleteError);
                    }
                });
            }, 400);
        });
    };

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
        if (!w) { alert(t.allowPopups); return; }
        w.document.write(html);
        w.document.close();
        w.focus();
        setTimeout(() => w.print(), 500);
    };

    const printReport = () => {
        const summary = filterSummary(); // ✅ ناخد النص الجاهز من الفلاتر
        const html = reportHtml(purchases, t, summary);
        const w = window.open('', '_blank', 'width=1100,height=800');
        if (!w) { alert(t.allowPopups); return; }
        w.document.write(html);
        w.document.close();
        w.focus();
        setTimeout(() => w.print(), 700);
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

    const calcDisplayTotal = (p) => {
        return (Number(p.price || 0) * Number(p.quantity || 0)) + (Number(p.shippingCost || 0) || 0) + (Number(p.customsFee || 0) || 0);
    };

    // === دالة توليد نص ملخص الفلاتر باللغات الثلاثة ===
    const filterSummary = () => {
        const typeText = typeFilter === 'car' ? t.itemCar : (typeFilter === 'part' ? t.itemPart : '');
        const supplierText = supplierFilter && supplierFilter !== 'all'
            ? (() => {
                const s = suppliers.find(s => (s._id === supplierFilter || s.id === supplierFilter));
                return s ? s.name : supplierFilter;
            })()
            : '';

        // صياغة الفترة
        let periodText = '';
        if (filter === 'all') {
            periodText = language === 'ar' ? ' ' :
                language === 'en' ? 'in all periods' :
                    '在所有时间段';
        } else if (filter === 'daily') {
            periodText = dateValue ? `${t.during} ${formatDate(dateValue)}` : t.daily;
        } else if (filter === 'weekly') {
            periodText = dateValue ? `${t.during} ${formatDate(dateValue)}` : t.weekly;
        } else if (filter === 'monthly') {
            periodText = (monthValue && yearValue) ? `${t.during} ${monthValue}/${yearValue}` : t.monthly;
        } else if (filter === 'custom') {
            periodText = (fromValue && toValue) ? `${t.fromTo} ${formatDate(fromValue)} ${t.toLabel} ${formatDate(toValue)}` : t.custom;
        }

        // ===== العربية =====
        if (language === 'ar') {
            if (!typeText && !supplierText) return `عرض جميع المشتريات ${periodText}`;
            if (!supplierText) return `عرض ${typeText} ${periodText}`;
            if (!typeText) return `عرض جميع المشتريات من المورد "${supplierText}" ${periodText}`;
            return `عرض ${typeText} من المورد "${supplierText}" ${periodText}`;
        }

        // ===== الإنجليزية =====
        if (language === 'en') {
            if (!typeText && !supplierText) return `Showing purchases ${periodText}`;
            if (!supplierText) return `Showing ${typeText}s ${periodText}`;
            if (!typeText) return `Showing purchases from ${supplierText} ${periodText}`;
            return `Showing ${typeText}s from ${supplierText} ${periodText}`;
        }

        // ===== الصينية =====
        if (language === 'zh') {
            if (!typeText && !supplierText) return `显示采购 ${periodText}`;
            if (!supplierText) return `显示${typeText}${periodText}`;
            if (!typeText) return `显示来自 ${supplierText} 的采购 ${periodText}`;
            return `显示${typeText} 来自 ${supplierText} ${periodText}`;
        }

        return '';
    };


    return (
        <div className="purchases-page">
            <h1>{t.title}</h1>
            <header className="purchases-header">

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
                            {/* <option value="weekly">{t.weekly}</option> */}
                            <option value="monthly">{t.monthly}</option>
                            <option value="custom">{t.custom}</option>
                        </select>
                    </div>

                    {/* inputs الخاصة بالتاريخ تبعاً لنوع الفلتر */}
                    {filter === 'daily' && (
                        <div className="filter-wrap">
                            <label>{t.date}</label>
                            <input type="date" value={dateValue} onChange={(e) => setDateValue(e.target.value)} />
                        </div>
                    )}

                    {filter === 'weekly' && (
                        <div className="filter-wrap">
                            <label>{t.weekly}</label>
                            <input type="date" value={dateValue} onChange={(e) => setDateValue(e.target.value)} title="Select any date within the week you want" />
                        </div>
                    )}

                    {filter === 'monthly' && (
                        <>
                            <div className="filter-wrap">
                                <label>شهر</label>
                                <input type="number" min="1" max="12" placeholder="MM" value={monthValue} onChange={(e) => setMonthValue(e.target.value)} />
                            </div>
                            <div className="filter-wrap">
                                <label>سنة</label>
                                <input type="number" min="1900" max="2100" placeholder="YYYY" value={yearValue} onChange={(e) => setYearValue(e.target.value)} />
                            </div>
                        </>
                    )}

                    {filter === 'custom' && (
                        <>
                            <div className="filter-wrap">
                                <label>{t.fromTo}</label>
                                <input type="date" value={fromValue} onChange={(e) => setFromValue(e.target.value)} />
                            </div>
                            <div className="filter-wrap">
                                <label>{t.toLabel}</label>
                                <input type="date" value={toValue} onChange={(e) => setToValue(e.target.value)} />
                            </div>
                        </>
                    )}

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
                                <option key={s._id} value={s._id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </header>

            {/* نص ملخص الفلاتر */}
            <div className="filter-summary">
                {filterSummary() && <small>{filterSummary()}</small>}
            </div>

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
                {purchases.length === 0 ? (
                    <div className="no-results">
                        <p>{t.noPurchasesDetail}</p>
                    </div>
                ) : (
                    <table className="purchases-table">
                        <thead>
                            <tr>
                                {/* <th>{t.invoiceNumber}</th> */}
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
                            {purchases.map((p, idx) => (
                                <tr key={p.id || p._id}>
                                    {/* <td>{p.invoiceNumber || (idx + 1)}</td> */}
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
                )}
            </div>
        </div>
    );
};

// ======= دوال الطباعة والواتساب مع دعم اللغة (محسنة للطباعة: عرض invoiceNumber في التقرير) =======
function invoiceHtml(p, t) {
    const date = p.purchaseDate ? new Date(p.purchaseDate).toLocaleString('en-GB') : '---';
    const totalDisplay = (Number(p.price || 0) * Number(p.quantity || 0)) + (Number(p.shippingCost || 0) || 0) + (Number(p.customsFee || 0) || 0);

    return `
  <html>
    <head>
      <title>${t.invoice} - ${escapeHtml(p.productName)}</title>
      <style>
        body{font-family: Arial; margin:20px; direction:rtl;}
        table{width:100%; border-collapse:collapse; margin-top:20px}
        th, td{border:1px solid #ddd; padding:8px; text-align:right}
        th{background:#f4f4f4;}
        @media print {
          body{margin:10mm}
          table{font-size:12px; table-layout:fixed; word-break:break-word}
        }
      </style>
    </head>
    <body>
      <h2 style="text-align:center">${t.invoice}</h2>
      <table>
        <tr><th>${t.invoiceNumber}</th><td>${escapeHtml(p.invoiceNumber || '')}</td></tr>
        <tr><th>${t.serial}</th><td>${escapeHtml(p.serialNumber || '')}</td></tr>
        <tr><th>${t.product}</th><td>${escapeHtml(p.productName || '')}</td></tr>
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

function reportHtml(purchases, t, summaryText = "") {
    const rows = purchases.map((p, idx) => {
        const totalDisplay = (Number(p.price || 0) * Number(p.quantity || 0)) + (Number(p.shippingCost || 0) || 0) + (Number(p.customsFee || 0) || 0);
        const invoiceNum = p.invoiceNumber || (idx + 1);

        return `
        
        <tr>
          <td>${escapeHtml(invoiceNum)}</td>
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
          <td>${p.price || 0}</td>
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
          body{font-family:Arial;margin:10px;direction:rtl}
          table{width:100%;border-collapse:collapse; font-size:12px;}
          th,td{border:1px solid #ddd;padding:6px; text-align:right}
          th{background:#f4f4f4}
          @media print {
            body{margin:8mm}
            table{font-size:11px; table-layout:fixed; word-break:break-word}
            th,td{padding:4px}
            thead {display:table-header-group}
            tr {page-break-inside: avoid}
          }
                        .summary { margin-bottom:15px; font-size:14px; font-weight:bold; }

        </style>
      </head>
      <body>
        <h1 style="text-align:center">${t.title}</h1>
        
          ${summaryText ? `<div class="summary">${summaryText}</div>` : ""}
        <table>
          <thead>
            <tr>
              <th>${t.invoiceNumber}</th>
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
    const totalDisplay = (Number(p.price || 0) * Number(p.quantity || 0)) + (Number(p.shippingCost || 0) || 0) + (Number(p.customsFee || 0) || 0);
    return `${t.invoice}\n${t.product}: ${p.productName}\n${t.type}: ${p.type === 'car' ? t.itemCar : t.itemPart}\n${t.supplier}: ${p.supplier}\n${t.quantity}: ${p.quantity}\n${t.price}: ${p.price}\n${t.shippingCost}: ${p.shippingCost || 0}\n${t.customsFee}: ${p.customsFee || 0}\n${t.total}: ${totalDisplay}\n${t.date}: ${p.purchaseDate ? new Date(p.purchaseDate).toLocaleDateString('en-GB') : ''}`;
}

export default Purchases;
