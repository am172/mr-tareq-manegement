// App.js
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
import { ToastContainer } from 'react-toastify';
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

/** ✅ الهيدر */
function Header() {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();



  return (
    <div className="header">
      {user && (
        <div className="header-user">
          <div className="user-avatar">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <span className="username">{user.username}</span>
        </div>
      )}

        {/* ✅ تغيير اللغة */}
        <div className="header-language">
          <select value={language} onChange={e => setLanguage(e.target.value)}>
            <option value="ar">العربية</option>
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>
        </div>


      </div>

  );
}

/** ✅ السايدر */
function Sidebar({ isOpen, toggleSidebar }) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const location = useLocation();

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

      <nav style={{marginTop:"31px"}}>
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
        </ul>

      </nav>
      {/* 💰 زر تغيير العملة */}
      <div className="currency-section" style={{ marginTop: '2px', textAlign: 'center', borderBottom: '.3px solid' }}>
        <p style={{ fontSize: '16px', marginBottom: '8px', padding: '0 10px' }}>
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
          <button style={{ padding: '8px 12px', borderRadius: '6px', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', margin: '0 auto', }}>
            {language === 'ar' ? 'تغيير العملة' : language === 'zh' ? '更改货币' : 'Change Currency'}
          </button>
        </a>
      </div>

      {/* ✅ تسجيل الخروج */}
      <button onClick={handleLogout} className="logout-btn">
        {language === 'ar' ? 'تسجيل خروج' : language === 'zh' ? '退出登录' : 'Logout'}
        <FaSignOutAlt className="icon" />
      </button>
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
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app">
      {location.pathname !== '/login' && (
        <>
          <Header />
          <button className="menu-btn" onClick={toggleSidebar}>☰</button>
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </>
      )}

      <div className="content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/suppliers" element={<SupplierDetails />} />

          <Route path="/inventory" element={<ProtectedRoute requiredPermission="inventory"><Inventory /></ProtectedRoute>} />
          <Route path="/purchases" element={<ProtectedRoute requiredPermission="purchases"><Purchases /></ProtectedRoute>} />
          <Route path="/sales" element={<ProtectedRoute requiredPermission="sales"><Sales /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute requiredPermission="expenses"><Expenses /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute requiredPermission="reports"><Reports /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute adminOnly={true}><Employees /></ProtectedRoute>} />

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
          <ToastContainer position="top-right" autoClose={4000} />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;

