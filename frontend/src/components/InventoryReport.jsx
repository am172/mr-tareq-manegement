import React from 'react';
import { useReactToPrint } from 'react-to-print';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

// إنشاء تقرير PDF
const PDFReport = ({ products }) => {
  return (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.header} fixed>تقرير المخزن</Text>
        <Text style={styles.date}>تاريخ: {new Date().toLocaleDateString('ar-SA')}</Text>
        
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text>الاسم</Text></View>
            <View style={styles.tableColHeader}><Text>النوع</Text></View>
            <View style={styles.tableColHeader}><Text>السعر</Text></View>
            <View style={styles.tableColHeader}><Text>الكمية</Text></View>
          </View>
          
          {products.map((product, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}><Text>{product.name}</Text></View>
              <View style={styles.tableCol}><Text>{product.type === 'car' ? 'سيارة' : 'قطعة غيار'}</Text></View>
              <View style={styles.tableCol}><Text>{product.price} ر.س</Text></View>
              <View style={styles.tableCol}><Text>{product.quantity}</Text></View>
            </View>
          ))}
        </View>
        
        <Text style={styles.footer}>إجمالي المنتجات: {products.length}</Text>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  body: { padding: 30, direction: 'rtl' },
  header: { fontSize: 20, marginBottom: 10, textAlign: 'center' },
  date: { fontSize: 12, marginBottom: 20 },
  table: { width: '100%', display: 'flex', flexDirection: 'column' },
  tableRow: { flexDirection: 'row' },
  tableColHeader: { width: '25%', borderStyle: 'solid', borderWidth: 1, padding: 5, backgroundColor: '#f0f0f0' },
  tableCol: { width: '25%', borderStyle: 'solid', borderWidth: 1, padding: 5 },
  footer: { marginTop: 20, fontSize: 14 }
});

const InventoryReport = ({ products }) => {
  const handlePrint = useReactToPrint({
    content: () => {
      const blob = pdf(<PDFReport products={products} />).toBlob();
      return blob;
    },
    documentTitle: 'تقرير المخزن'
  });

  return (
    <button onClick={handlePrint} className="print-btn">
      طباعة التقرير
    </button>
  );
};

export default InventoryReport;