// SalesForm.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './SalesForm.css';

const translations = {
  ar: {
    titleAdd: 'نموذج البيع',
    titleEdit: 'تعديل عملية البيع',
    productName: 'اسم المنتج',
    price: 'السعر',
    buyer: 'اسم المشتري',
    quantity: 'الكمية',
    discount: 'الخصم',
    submitAdd: 'إضافة عملية بيع',
    submitEdit: 'تعديل',
    cancel: 'إلغاء',
    available: 'متاحة'
  },
  en: {
    titleAdd: 'Sales Form',
    titleEdit: 'Edit Sale',
    productName: 'Product Name',
    price: 'Price',
    buyer: 'Buyer Name',
    quantity: 'Quantity',
    discount: 'Discount',
    submitAdd: 'Add Sale',
    submitEdit: 'Update',
    cancel: 'Cancel',
    available: 'Available'
  },
  zh: {
    titleAdd: '销售表单',
    titleEdit: '编辑销售',
    productName: '产品名称',
    price: '价格',
    buyer: '买家姓名',
    quantity: '数量',
    discount: '折扣',
    submitAdd: '添加销售',
    submitEdit: '更新',
    cancel: '取消',
    available: '可用'
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
      // ✅ دلوقتي بيجيب من المخزن مش المشتريات
      const res = await api.get('/api/products');
      setInventory(res.data.filter(i => i.quantity > 0));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = inventory.filter(i =>
    (i.productName || i.name || '')
      .toLowerCase()
      .includes(form.productName.toLowerCase())
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
      return alert('الرجاء تعبئة جميع الحقول');
    }
    if (form.quantity > availableQty && !existingSale) {
      return alert('الكمية المطلوبة أكبر من المتاحة');
    }

    // ✅ التحقق من التكلفة
    if (selectedProduct) {
      const basePrice = Number(selectedProduct.price) || 0;
      const shippingCost = Number(selectedProduct.shippingCost) || 0;
      const customsFee = Number(selectedProduct.customsFee) || 0;
      const qty = Number(selectedProduct.quantity) || 1;

      const perUnitExtra = (shippingCost + customsFee) / qty;
      const actualPurchaseCost = basePrice + perUnitExtra;

      const salePrice = Number(form.price) || 0;

      if (salePrice < actualPurchaseCost) {
        const confirmProceed = window.confirm(
          `⚠️ السعر المدخل  أقل من تكلفة الشراء الكاملة  للوحدة.\nهل تريد المتابعة؟`
        );
        if (!confirmProceed) {
          return;
        }
      }
    }

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
        alert('تم تعديل عملية البيع بنجاح!');
      } else {
        await api.post('/api/sales', payload);
        alert('تمت عملية البيع بنجاح!');
      }

      await fetchInventory();
      setForm({ productName: '', price: '', buyer: '', quantity: '', discount: '' });
      setAvailableQty(0);
      setSelectedProduct(null);
      onClose();
    } catch (err) {
      console.error('Error in sale:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'حدث خطأ أثناء العملية');
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
                  <span className="product-name"> {product.productName || product.name}</span>
                  <span className="product-info" style={{ color: "green",border:".3px solid green", padding:"5px", borderRadius:"10px", marginRight:"5px"}}>  {t.available}: {product.quantity}</span>
                
                </div>
              ))}
            </div>
          )}

          <label>{t.price}</label>
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            required
          />

          <label>{t.buyer}</label>
          <input
            type="text"
            value={form.buyer}
            onChange={e => setForm({ ...form, buyer: e.target.value })}
            required
          />

          <label>
            {t.quantity} {existingSale ? '' : <span className="available">({t.available}: {availableQty})</span>}
          </label>
          <input
            type="number"
            value={form.quantity}
            onChange={e => setForm({ ...form, quantity: e.target.value })}
            max={availableQty}
            min="1"
            required
          />

          <label>{t.discount}</label>
          <input
            type="number"
            step="0.01"
            value={form.discount}
            onChange={e => setForm({ ...form, discount: e.target.value })}
            placeholder="%"
          />

          <button type="submit" disabled={availableQty === 0 && !existingSale}>
            {existingSale ? t.submitEdit : t.submitAdd}
          </button>
          <button type="button" onClick={onClose} className="btn-cancel">{t.cancel}</button>
        </form>
      </div>
    </div>
  );
};

export default SalesForm;
