{/* ✅ الملخص */}
<div className="summary">
  <h2>{t.summary}</h2>
  <p>{t.profitDesc}</p>
</div>

{loading ? (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
    <div
      style={{
        border: "12px solid #f3f3f3",
        borderTop: "12px solid #007bff",
        borderRadius: "50%",
        width: "100px",
        height: "100px",
        animation: "spin 1.5s linear infinite",
      }}
    />
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
) : report?.summary ? (
  <>
    <div id="reportContent">
      {/* ✅ الملخص في جدول */}
      <div className="tables">
        <table className="summary-table">
          <tbody>
            <tr>
              <td>{t.totalSales}</td>
              <td>{report?.summary?.sales ?? 0}</td>
              <td>
                <button
                  style={{ background: "#1668dc", color: "white" }}
                  onClick={() => setShowSalesDetails(!showSalesDetails)}
                >
                  {showSalesDetails ? t.detailsHide : t.detailsShow}
                </button>
              </td>
            </tr>

            {showSalesDetails && (
              <tr>
                <td colSpan="3">
                  <h4>{t.sales}</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>{t.product}</th>
                        <th>{t.quantity}</th>
                        <th>{t.price}</th>
                        <th>{t.total}</th>
                        <th>{t.date}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(report?.details?.sales || []).map((sale, i) => (
                        <tr key={i}>
                          <td>{sale.productName}</td>
                          <td>{sale.quantity}</td>
                          <td>{sale.price}</td>
                          <td>{sale.price * sale.quantity}</td>
                          <td>{new Date(sale.date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            )}

            <tr>
              <td>{t.totalPurchases}</td>
              <td>{report?.summary?.purchases ?? 0}</td>
              <td>
                <button
                  style={{ background: "#1668dc", color: "white" }}
                  onClick={() => setShowPurchasesDetails(!showPurchasesDetails)}
                >
                  {showPurchasesDetails ? t.detailsHide : t.detailsShow}
                </button>
              </td>
            </tr>

            {showPurchasesDetails && (
              <tr>
                <td colSpan="3">
                  <h4>{t.purchases}</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>{t.product}</th>
                        <th>{t.quantity}</th>
                        <th>{t.price}</th>
                        <th>{t.total}</th>
                        <th>{t.date}</th>
                        <th>{t.supplier}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(report?.details?.sales || []).map((sale, i) => {
                        const relatedPurchase = (report?.details?.purchases || []).find(
                          (p) => p.productName === sale.productName
                        );
                        if (!relatedPurchase) return null;
                        return (
                          <tr key={i}>
                            <td>{relatedPurchase.productName}</td>
                            <td>{sale.quantity}</td>
                            <td>{relatedPurchase.price}</td>
                            <td>{relatedPurchase.price * sale.quantity}</td>
                            <td>{new Date(relatedPurchase.purchaseDate).toLocaleDateString()}</td>
                            <td>{relatedPurchase.supplier}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </td>
              </tr>
            )}

            {/* 📌 الأرباح */}
            <tr>
              <td>{t.ribh}</td>
              <td>
                <strong>
                  {(report?.summary?.sales ?? 0) - (report?.summary?.purchases ?? 0)}
                </strong>
              </td>
            </tr>

            <tr>
              <td>{t.totalExpenses}</td>
              <td>{report?.summary?.expenses ?? 0}</td>
              <td>
                <button
                  style={{ background: "#1668dc", color: "white" }}
                  onClick={() => setShowExpensesDetails(!showExpensesDetails)}
                >
                  {showExpensesDetails ? t.detailsHide : t.detailsShow}
                </button>
              </td>
            </tr>

            {showExpensesDetails && (
              <tr>
                <td colSpan="3">
                  <h4>{t.expenses}</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>{t.titleExpense}</th>
                        <th>{t.category}</th>
                        <th>{t.amount}</th>
                        <th>{t.notes}</th>
                        <th>{t.date}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(report?.details?.expenses || []).map((expense, i) => (
                        <tr key={i}>
                          <td>{expense.title}</td>
                          <td>{expense.category}</td>
                          <td>{expense.amount}</td>
                          <td>{expense.notes}</td>
                          <td>{new Date(expense.date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            )}

            <tr>
              <td>✅ {t.netProfit}</td>
              <td>
                <strong>
                  {(report?.summary?.sales ?? 0) -
                    (report?.summary?.purchases ?? 0) -
                    (report?.summary?.expenses ?? 0)}
                </strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* ✅ أزرار التحكم */}
    <div className="actions">
      <button onClick={handlePrint}>
        <FaPrint /> {t.print}
      </button>
    </div>
  </>
) : (
  <p style={{ textAlign: "center", color: "red" }}>
    ⚠️ {language === "ar" ? "لا توجد بيانات متاحة" : "No data available"}
  </p>
)}
