import React, { useState, useEffect } from "react";

export default function CurrencyWidget() {
  const [rates, setRates] = useState({});
  const [from, setFrom] = useState("USD"); // العملة الافتراضية
  const [to, setTo] = useState("EGP");     // العملة الافتراضية
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(0);

  // جلب بيانات التحويل من API مجاني
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch("https://api.exchangerate.host/latest?base=USD");
        const data = await res.json();
        setRates(data.rates || {});
      } catch (err) {
        console.error("خطأ في جلب أسعار العملات:", err);
      }
    };
    fetchRates();
  }, []);

  // تحديث نتيجة التحويل
  useEffect(() => {
    if (rates && rates[to]) {
      setResult((amount * rates[to]).toFixed(2));
    } else {
      setResult(0);
    }
  }, [rates, amount, to]);

  return (
    <div className="currency-widget" style={{
      border: "1px solid #ddd",
      padding: "10px",
      borderRadius: "8px",
      display: "inline-block",
      background: "#f9f9f9",
      fontFamily: "Tahoma, sans-serif"
    }}>
      <h4 style={{ marginBottom: "8px" }}>محول العملات</h4>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          style={{ padding: "5px", width: "80px" }}
        />

        <select value={from} onChange={(e) => setFrom(e.target.value)} style={{ padding: "5px" }}>
          {rates && Object.keys(rates).length > 0 ? 
            Object.keys(rates).map((c) => <option key={c}>{c}</option>) :
            <option>USD</option>
          }
        </select>

        <span>➡️</span>

        <select value={to} onChange={(e) => setTo(e.target.value)} style={{ padding: "5px" }}>
          {rates && Object.keys(rates).length > 0 ? 
            Object.keys(rates).map((c) => <option key={c}>{c}</option>) :
            <option>EGP</option>
          }
        </select>
      </div>

      <p style={{ marginTop: "10px", fontWeight: "bold" }}>
        {amount} {from} = {result} {to}
      </p>
    </div>
  );
}
