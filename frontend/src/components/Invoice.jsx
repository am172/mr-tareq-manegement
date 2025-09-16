import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import './Invoice.css';

const Invoice = ({ sale, onClose }) => {
    const invoiceRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => invoiceRef.current,
        documentTitle: `فاتورة_${sale._id}`
    });

    return (
        <div className="invoice-overlay">
            <div className="invoice-container">
                <div className="invoice-actions">
                    <button onClick={handlePrint}>طباعة</button>
                    <button onClick={onClose}>إغلاق</button>
                </div>

                <div ref={invoiceRef} className="invoice-content">
                    <div className="invoice-header">
                        <h2>فاتورة بيع</h2>
                        <p>رقم الفاتورة: {sale._id}</p>
                        <p>التاريخ: {new Date(sale.saleDate).toLocaleDateString('ar-SA')}</p>
                    </div>

                    <div className="invoice-details">
                        <div className="detail-row">
                            <span>العميل:</span>
                            <span>{sale.customer}</span>
                        </div>
                        <div className="detail-row">
                            <span>المنتج:</span>
                            <span>{sale.product?.name}</span>
                        </div>
                        <div className="detail-row">
                            <span>الكمية:</span>
                            <span>{sale.quantity}</span>
                        </div>
                        <div className="detail-row">
                            <span>سعر الوحدة:</span>
                            <span>{sale.price} ر.س</span>
                        </div>
                        <div className="detail-row total">
                            <span>الإجمالي:</span>
                            <span>{sale.total} ر.س</span>
                        </div>
                    </div>

                    {sale.notes && (
                        <div className="invoice-notes">
                            <h3>ملاحظات:</h3>
                            <p>{sale.notes}</p>
                        </div>
                    )}

                    <div className="invoice-footer">
                        <p>شكراً لتعاملكم معنا</p>
                        <p>للاستفسار: 0123456789</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Invoice;