import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
// import './ExpenseForm.css';

const translations = {
  ar: {
    titleAdd: 'إضافة مصروف',
    titleEdit: 'تعديل المصروف',
    name: 'اسم المصروف',
    category: 'التصنيف',
    amount: 'المبلغ',
    note: 'ملاحظات',
    date: 'التاريخ',
    submitAdd: 'إضافة',
    submitEdit: 'تعديل',
    cancel: 'إلغاء',
    categories: [
      'إيجار', 'رواتب', 'فواتير كهرباء', 'مياه', 'إنترنت',
      'صيانة', 'تسويق', 'مشتريات مكتبية', 'مواصلات',
      'ضيافة', 'ضرائب', 'أخرى'
    ]
  },
  en: {
    titleAdd: 'Add Expense',
    titleEdit: 'Edit Expense',
    name: 'Expense Name',
    category: 'Category',
    amount: 'Amount',
    note: 'Note',
    date: 'Date',
    submitAdd: 'Add',
    submitEdit: 'Update',
    cancel: 'Cancel',
    categories: [
      'Rent', 'Salaries', 'Electricity Bills', 'Water', 'Internet',
      'Maintenance', 'Marketing', 'Office Supplies', 'Transportation',
      'Hospitality', 'Taxes', 'Other'
    ]
  },
  zh: {
    titleAdd: '添加支出',
    titleEdit: '编辑支出',
    name: '支出名称',
    category: '类别',
    amount: '金额',
    note: '备注',
    date: '日期',
    submitAdd: '添加',
    submitEdit: '更新',
    cancel: '取消',
    categories: [
      '租金', '工资', '电费', '水费', '互联网',
      '维护', '营销', '办公用品', '交通',
      '招待', '税务', '其他'
    ]
  }
};

const ExpenseForm = ({ existingExpense, onClose }) => {
  const { api } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(t.categories[0]);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (existingExpense) {
      setTitle(existingExpense.title);
      setCategory(existingExpense.category);
      setAmount(existingExpense.amount);
      setNote(existingExpense.note || '');
      setDate(existingExpense.date.split('T')[0]);
    }
  }, [existingExpense, t.categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { title, category, amount, note, date };
      if (existingExpense) {
        await api.put(`/api/expenses/${existingExpense._id}`, payload);
      } else {
        await api.post('/api/expenses', payload);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء العملية');
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder={t.name}
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />

      <select value={category} onChange={e => setCategory(e.target.value)}>
        {t.categories.map((cat, idx) => (
          <option key={idx} value={cat}>{cat}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder={t.amount}
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
      />

      {/* <input type="date" value={date} onChange={e => setDate(e.target.value)} required /> */}

      <input
        type="text"
        placeholder={t.note}
        value={note}
        onChange={e => setNote(e.target.value)}
      />

      <button type="submit">{existingExpense ? t.submitEdit : t.submitAdd}</button>
      <button type="button" onClick={onClose}>{t.cancel}</button>
    </form>
  );
};

export default ExpenseForm;
