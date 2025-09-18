import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBox, FaShoppingCart, FaDollarSign, FaFileInvoiceDollar, FaChartBar, FaUsers, FaSignOutAlt } from 'react-icons/fa';

import Login from './pages/Login';
import Inventory from './pages/Inventory';
import Purchases from './pages/Purchases';
import Sales from './pages/Sales';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import SupplierDetails from './pages/Suppliers';
import Employees from './pages/Employees';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { testServerConnection } from './utils/testConnection';
import './App.css';

testServerConnection();

/** ✅ حماية الصفحات */
function ProtectedRoute({ children, requiredPermission, adminOnly = false }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;

  if (requiredPermission && !user.permissions?.[requiredPermission]) return <Navigate to="/" />;

  return children;
}

/** ✅ السايدر */
/** ✅ السايدر */
function Sidebar({ isOpen, toggleSidebar }) {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const labels = {
    inventory: { ar: 'المخزون', en: 'Inventory', zh: '库存' },
    purchases: { ar: 'المشتريات', en: 'Purchases', zh: '采购' },
    sales: { ar: 'المبيعات', en: 'Sales', zh: '销售' },
    expenses: { ar: 'المصروفات', en: 'Expenses', zh: '支出' },
    reports: { ar: 'التقارير', en: 'Reports', zh: '报告' },
    employees: { ar: 'الموظفين', en: 'Employees', zh: '员工' },
  };
  const menuItems = [
    { path: '/inventory', label: labels.inventory[language], icon: <FaBox />, permission: 'inventory' },
    { path: '/purchases', label: labels.purchases[language], icon: <FaShoppingCart />, permission: 'purchases' },
    { path: '/sales', label: labels.sales[language], icon: <FaDollarSign />, permission: 'sales' },
    { path: '/expenses', label: labels.expenses[language], icon: <FaFileInvoiceDollar />, permission: 'expenses' },
    { path: '/reports', label: labels.reports[language], icon: <FaChartBar />, permission: 'reports' },
    { path: '/employees', label: labels.employees[language], icon: <FaUsers />, adminOnly: true },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={toggleSidebar}>×</button>

      <nav>
        <ul>
          {menuItems.map((item) => {
            if (item.adminOnly && user?.role !== 'admin') return null;
            if (item.permission && !user?.permissions?.[item.permission]) return null;

            return (
              <li key={item.path}>
                <Link to={item.path} className={location.pathname === item.path ? 'active' : ''}>
                  <span className="text">{item.label}</span>
                  {item.icon}
                </Link>
              </li>
            );
          })}
          <hr />

          <li>
            <button onClick={handleLogout} className="logout-btn">
              <span className="text">{language === 'ar' ? 'تسجيل خروج' : language === 'zh' ? '退出登录' : 'Logout'}</span>
              <FaSignOutAlt className="icon" />
            </button>
          </li>
        </ul>
      </nav>

      <div className="language-selector">
        <label>{language === 'ar' ? 'اللغة:' : language === 'zh' ? '语言:' : 'Language:'}</label>
        <select value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="ar">العربية</option>
          <option value="en">English</option>
          <option value="zh">中文</option>
        </select>
      </div>
      <hr />

      {/* 💰 زر تغيير العملة */}
      <div className="currency-section" style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', marginBottom: '8px', padding: '0 10px' }}>
          {language === 'ar' ? 'العملة الرسمية للموقع هي الدرهم الإماراتي، لتغيير العملة اضغط هنا' :
            language === 'zh' ? '网站官方货币为阿联酋迪拉姆，要更改货币请点击此处' :
              'The official currency of the site is UAE Dirham, click here to change'}
        </p>
        <a
          style={{ background: "none" }}
          href="https://www.xe.com/currencyconverter/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button style={{ padding: '8px 12px', borderRadius: '6px', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }}>
            {language === 'ar' ? 'تغيير العملة' : language === 'zh' ? '更改货币' : 'Change Currency'}
          </button>
        </a>
      </div>
    </div>
  );
}


/** ✅ التطبيق الأساسي */
function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // ❌ متخليش السايدر يفتح تلقائيًا
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div className="app">
      {location.pathname !== '/login' && (
        <>

          <button className="menu-btn" onClick={toggleSidebar}>☰</button>

          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </>
      )}

      <div className="content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/suppliers" element={<SupplierDetails />} />

          <Route
            path="/inventory"
            element={
              <ProtectedRoute requiredPermission="inventory">
                <Inventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/purchases"
            element={
              <ProtectedRoute requiredPermission="purchases">
                <Purchases />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <ProtectedRoute requiredPermission="sales">
                <Sales />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute requiredPermission="expenses">
                <Expenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute requiredPermission="reports">
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute adminOnly={true}>
                <Employees />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/inventory" />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <AppContent />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
