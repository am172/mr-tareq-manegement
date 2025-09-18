import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Inventory.css';

const translations = {
    ar: {
        title: 'تفاصيل الموردين',
        supplier: 'المورد',
        product: 'المنتج',
        type: 'النوع',
        quantity: 'الكمية',
        price: 'السعر',
        total: 'الإجمالي',
        date: 'التاريخ',
        back: 'العودة للمخزن',
        itemCar: 'سيارة',
        itemPart: 'قطعة غيار'
    },
    en: {
        title: 'Supplier Details',
        supplier: 'Supplier',
        product: 'Product',
        type: 'Type',
        quantity: 'Quantity',
        price: 'Price',
        total: 'Total',
        date: 'Date',
        back: 'Back to Inventory',
        itemCar: 'Car',
        itemPart: 'Part'
    },
    zh: {
        title: '供应商详情',
        supplier: '供应商',
        product: '产品',
        type: '类型',
        quantity: '数量',
        price: '价格',
        total: '总计',
        date: '日期',
        back: '返回库存',
        itemCar: '汽车',
        itemPart: '零件'
    }
};

const SupplierDetails = () => {
    const [inventory, setInventory] = useState([]);
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

    // تجميع المنتجات لكل مورد
    const suppliersData = [...new Set(inventory.map(i => i.supplier))].map(supplier => {
        const items = inventory.filter(i => i.supplier === supplier);
        return {
            supplier,
            products: items.map(i => ({
                name: i.productName,
                type: i.type,
                quantity: i.price ? Math.round(i.total / i.price) : 0,
                price: i.price,
                total: i.total,
                date: i.purchaseDate ? new Date(i.purchaseDate).toLocaleDateString('en-GB') : ''
            }))
        };
    });

    return (
        <div className="inventory-page">
            <h1>{t.title}</h1>
            <button className="btn-primary" onClick={() => window.history.back()}>
                {t.back}
            </button>

            {suppliersData.map(s => (

                <div key={s.supplier} className="supplier-section">
                    <h2>{t.supplier}: {s.supplier}</h2>
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>{t.product}</th>
                                    <th>{t.type}</th>
                                    <th>{t.quantity}</th>
                                    <th>{t.price}</th>
                                    <th>{t.total}</th>
                                    <th>{t.date}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {s.products.map((p, index) => (
                                    <tr key={index}>
                                        <td>{p.name}</td>
                                        <td>{p.type === 'car' ? t.itemCar : t.itemPart}</td>
                                        <td>{p.quantity}</td>
                                        <td>{p.price}</td>
                                        <td>{p.total}</td>
                                        <td>{p.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SupplierDetails;
