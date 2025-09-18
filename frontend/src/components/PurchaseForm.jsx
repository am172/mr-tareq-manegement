import React, { useState, useEffect } from 'react';
import './Form.css';
import { useLanguage } from '../context/LanguageContext';

const translations = { 
  ar: { 
    titleAdd: 'إضافة مشتري جديد',
    titleEdit: 'تعديل مشتري',
    serialNumber: 'الرقم التسلسلي',
    productName: 'المنتج',
    type: 'النوع',
    typeCar: 'سيارة',
    typePart: 'قطعة غيار',
    supplier: 'المورد',
    quantity: 'الكمية',
    price: 'السعر',
    model: 'موديل',
    manufactureYear: 'سنة الصنع',
    color: 'اللون',
    chassisNumber: 'رقم الشاسيه',
    condition: 'الحالة',
    conditionSelect: 'اختر الحالة',
    conditionNew: 'جديد',
    conditionUsed: 'مستعمل',
    submitAdd: 'إضافة',
    submitEdit: 'تحديث',
    cancel: 'إلغاء'
  }, 
  en: { 
    titleAdd: 'Add New Purchase',
    titleEdit: 'Edit Purchase',
    serialNumber: 'Serial Number',
    productName: 'Product',
    type: 'Type',
    typeCar: 'Car',
    typePart: 'Part',
    supplier: 'Supplier',
    quantity: 'Quantity',
    price: 'Price',
    model: 'Model',
    manufactureYear: 'Manufacture Year',
    color: 'Color',
    chassisNumber: 'Chassis Number',
    condition: 'Condition',
    conditionSelect: 'Select condition',
    conditionNew: 'New',
    conditionUsed: 'Used',
    submitAdd: 'Add',
    submitEdit: 'Update',
    cancel: 'Cancel'
  }, 
  zh: { 
    titleAdd: '添加新采购',
    titleEdit: '编辑采购',
    serialNumber: '序列号',
    productName: '产品',
    type: '类型',
    typeCar: '汽车',
    typePart: '零件',
    supplier: '供应商',
    quantity: '数量',
    price: '价格',
    model: '型号',
    manufactureYear: '生产年份',
    color: '颜色',
    chassisNumber: '底盘号',
    condition: '状态',
    conditionSelect: '选择状态',
    conditionNew: '新的',
    conditionUsed: '二手',
    submitAdd: '添加',
    submitEdit: '更新',
    cancel: '取消'
  } 
};

const PurchaseForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    serialNumber: '',
    productName: '',
    type: 'car',
    supplier: '',
    quantity: 1,
    price: 0,
    model: '',
    manufactureYear: '',
    color: '',
    chassisNumber: '',
    condition: ''
  });

  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <h2>{initialData ? t.titleEdit : t.titleAdd}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t.serialNumber}:</label>
            <input type="text" name="serialNumber" value={formData.serialNumber || ""} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>{t.productName}:</label>
            <input type="text" name="productName" value={formData.productName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>{t.type}:</label>
            <select name="type" value={formData.type} onChange={handleChange} required>
              <option value="car">{t.typeCar}</option>
              <option value="part">{t.typePart}</option>
            </select>
          </div>
          <div className="form-group">
            <label>{t.supplier}:</label>
            <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>{t.quantity}:</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="1" required />
          </div>
          <div className="form-group">
            <label>{t.price}:</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} min="0" step="0.01" required />
          </div>
          <div className="form-group">
            <label>{t.model}:</label>
            <input type="text" name="model" value={formData.model} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>{t.manufactureYear}:</label>
            <input type="number" name="manufactureYear" value={formData.manufactureYear} onChange={handleChange} min="1900" max={new Date().getFullYear()} />
          </div>
          <div className="form-group">
            <label>{t.color}:</label>
            <input type="text" name="color" value={formData.color} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>{t.chassisNumber}:</label>
            <input type="text" name="chassisNumber" value={formData.chassisNumber} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>{t.condition}:</label>
            <select name="condition" value={formData.condition} onChange={handleChange}>
              <option value="">{t.conditionSelect}</option>
              <option value="new">{t.conditionNew}</option>
              <option value="used">{t.conditionUsed}</option>
            </select>
          </div>

          <div className="form-buttons">
            <button type="submit">{initialData ? t.submitEdit : t.submitAdd}</button>
            <button type="button" onClick={onCancel}>{t.cancel}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseForm;
