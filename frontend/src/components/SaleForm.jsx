import React, { useState, useEffect } from 'react'; 
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SalesForm.css';

const translations = {
  ar: {
    titleAdd: 'نموذج البيع',
    titleEdit: 'تعديل عملية البيع',
    productName: 'اسم المنتج',
    price: 'السعر',
    buyer: 'اسم البائع',
    quantity: 'الكمية',
    discount: 'الخصم',
    submitAdd: 'إضافة عملية بيع',
    submitEdit: 'تعديل',
    cancel: 'إلغاء',
    available: 'متاحة',
    fillFields: '⚠️ الرجاء تعبئة جميع الحقول',
    qtyError: '⚠️ الكمية المطلوبة أكبر من المتاحة',
    costWarning: '⚠️ السعر المدخل أقل من تكلفة الشراء. هل تريد المتابعة؟',
    yes: 'نعم',
    no: 'لا',
    successAdd: 'تمت إضافة عملية البيع بنجاح',
    successEdit: 'تم تعديل عملية البيع بنجاح',
    error: 'حدث خطأ أثناء العملية'
  },
  en: {
    titleAdd: 'Sales Form',
    titleEdit: 'Edit Sale',
    productName: 'Product Name',
    price: 'Price',
    buyer: 'Saller Name',
    quantity: 'Quantity',
    discount: 'Discount',
    submitAdd: 'Add Sale',
    submitEdit: 'Update',
    cancel: 'Cancel',
    available: 'Available',
    fillFields: '⚠️ Please fill all fields',
    qtyError: '⚠️ Requested quantity exceeds available stock',
    costWarning: '⚠️ Entered price is below purchase cost. Do you want to proceed?',
    yes: 'Yes',
    no: 'No',
    successAdd: 'Sale added successfully',
    successEdit: 'Sale updated successfully',
    error: 'An error occurred'
  },
  zh: {
    titleAdd: '销售表单',
    titleEdit: '编辑销售',
    productName: '产品名称',
    price: '价格',
    buyer: '卖家',
    quantity: '数量',
    discount: '折扣',
    submitAdd: '添加销售',
    submitEdit: '更新',
    cancel: '取消',
    available: '可用',
    fillFields: '⚠️ 请填写所有字段',
    qtyError: '⚠️ 请求的数量超过可用库存',
    costWarning: '⚠️ 输入的价格低于采购成本。是否要继续？',
    yes: '是',
    no: '否',
    successAdd: '销售添加成功',
    successEdit: '销售更新成功',
    error: '发生错误'
  }
};

const SalesForm = ({ onClose, existingSale }) => {
  const { api } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];

  const [inventory, setInventory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [form, setForm] = useState({
    productName: '',
    price: '',
    buyer: '',
    quantity: '',
    discount: ''
  });
  const [availableQty, setAvailableQty] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    if (existingSale) {
      setForm({
        productName: existingSale.productName,
        price: existingSale.price,
        buyer: existingSale.buyer,
        quantity: existingSale.quantity,
        discount: existingSale.discount || ''
      });

      const productInStock = inventory.find(
        i => (i.productName || i.name) === existingSale.productName
      );
      setAvailableQty(
        productInStock
          ? productInStock.quantity + existingSale.quantity
          : existingSale.quantity
      );
    }
  }, [existingSale, inventory]);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/api/products');
      setInventory(res.data.filter(i => i.quantity > 0));
    } catch (err) {
      toast.error(t.error);
      console.error(err);
    }
  };

  const filteredProducts = inventory.filter(i =>
    (i.productName || i.name || '').toLowerCase().includes(form.productName.toLowerCase())
  );

  const handleProductChange = (e) => {
    const val = e.target.value;
    setForm({ ...form, productName: val });
    setShowSuggestions(true);

    const exactMatch = inventory.find(
      i => (i.productName || i.name || '').toLowerCase() === val.toLowerCase()
    );
    if (exactMatch) {
      setSelectedProduct(exactMatch);
      setAvailableQty(exactMatch.quantity);
      setForm(prev => ({ ...prev, price: '' }));
    } else {
      setSelectedProduct(null);
      setAvailableQty(0);
    }
  };

  const handleSelectProduct = (product) => {
    setForm({ ...form, productName: product.productName || product.name, price: '' });
    setSelectedProduct(product);
    setAvailableQty(product.quantity);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productName || !form.price || !form.buyer || !form.quantity) {
      toast.warn(t.fillFields);
      return;
    }
    if (form.quantity > availableQty && !existingSale) {
      toast.error(t.qtyError);
      return;
    }

    if (selectedProduct) {
      const basePrice = Number(selectedProduct.price) || 0;
      const shippingCost = Number(selectedProduct.shippingCost) || 0;
      const customsFee = Number(selectedProduct.customsFee) || 0;
      const qty = Number(selectedProduct.quantity) || 1;
      const actualPurchaseCost = basePrice + (shippingCost + customsFee) / qty;
      const salePrice = Number(form.price) || 0;

      if (salePrice < actualPurchaseCost) {
        toast.info(
          <div>
            <p>{t.costWarning}</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button
                onClick={() => {
                  toast.dismiss();
                  submitSale();
                }}
              >
                {t.yes}
              </button>
              <button onClick={() => toast.dismiss()}>{t.no}</button>
            </div>
          </div>,
          { autoClose: false }
        );
        return;
      }
    }

    submitSale();
  };

  const submitSale = async () => {
    try {
      const payload = {
        productName: form.productName,
        price: parseFloat(form.price),
        buyer: form.buyer,
        quantity: parseInt(form.quantity),
        discount: parseFloat(form.discount) || 0
      };

      if (existingSale) {
        await api.put(`/api/sales/${existingSale._id}`, payload);
        toast.success(t.successEdit);
      } else {
        await api.post('/api/sales', payload);
        toast.success(t.successAdd);
      }

      await fetchInventory();
      setForm({ productName: '', price: '', buyer: '', quantity: '', discount: '' });
      setAvailableQty(0);
      setSelectedProduct(null);
      onClose(true);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || t.error);
      onClose(false);
    }
  };

  return (
    <div className="sales-page">
      <div className="sales-form-container">
        <h2>{existingSale ? t.titleEdit : t.titleAdd}</h2>
        <form onSubmit={handleSubmit}>
          <label>{t.productName}</label>
          <input
            type="text"
            value={form.productName}
            onChange={handleProductChange}
            onFocus={() => setShowSuggestions(true)}
            autoComplete="off"
            placeholder={`ابدأ بالكتابة للاختيار`}
            disabled={!!existingSale}
          />
          {showSuggestions && filteredProducts.length > 0 && !existingSale && (
            <div className="autocomplete-list">
              {filteredProducts.map(product => (
                <div
                  key={product._id}
                  className="suggestion-item"
                  onClick={() => handleSelectProduct(product)}
                >
                  <span className="product-name">{product.productName || product.name}</span>
                  <span className="product-info" style={{ color: "green", border: ".3px solid green", padding: "5px", borderRadius: "10px", marginRight: "5px" }}>
                    {t.available}: {product.quantity}
                  </span>
                </div>
              ))}
            </div>
          )}

          <label>{t.price}</label>
          <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />

          <label>{t.buyer}</label>
          <input type="text" value={form.buyer} onChange={e => setForm({ ...form, buyer: e.target.value })} required />

          <label>
            {t.quantity} {existingSale ? '' : <span className="available">({t.available}: {availableQty})</span>}
          </label>
          <input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} max={availableQty} min="1" required />

          <label>{t.discount}</label>
          <input type="number" step="0.01" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} placeholder="%" />

          <button type="submit" disabled={availableQty === 0 && !existingSale}>
            {existingSale ? t.submitEdit : t.submitAdd}
          </button>
          <button type="button" onClick={() => onClose(false)} className="btn-cancel">{t.cancel}</button>
        </form>
      </div>
    </div>
  );
};

export default SalesForm;
