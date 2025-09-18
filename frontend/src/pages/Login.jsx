import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import './Login.css';

const translations = {
  ar: {
    title: 'تسجيل الدخول',
    username: 'اسم المستخدم:',
    password: 'كلمة السر:',
    language: 'اللغة:',
    submit: 'دخول',
    loading: 'جاري تسجيل الدخول...',
    errorEmpty: 'يرجى إدخال اسم المستخدم وكلمة المرور',
    loginFailed: 'فشل تسجيل الدخول',
  },
  en: {
    title: 'Login',
    username: 'Username:',
    password: 'Password:',
    language: 'Language:',
    submit: 'Login',
    loading: 'Logging in...',
    errorEmpty: 'Please enter username and password',
    loginFailed: 'Login failed',
  },
  zh: {
    title: '登录',
    username: '用户名:',
    password: '密码:',
    language: '语言:',
    submit: '登录',
    loading: '正在登录...',
    errorEmpty: '请输入用户名和密码',
    loginFailed: '登录失败',
  }
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  // ✅ استخدم اللغة من الـ context
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError(t.errorEmpty);
      return;
    }

    setLoading(true);

    try {
      await login(username, password);

      setTimeout(() => {
        if (!user) return;

        if (user.role === 'admin') navigate('/employees');
        else if (user.permissions?.inventory) navigate('/inventory');
        else if (user.permissions?.purchases) navigate('/purchases');
        else if (user.permissions?.sales) navigate('/sales');
        else if (user.permissions?.expenses) navigate('/expenses');
        else if (user.permissions?.reports) navigate('/reports');
        else navigate('/login');
      }, 200);

    } catch (err) {
      setError(err.message || t.loginFailed);
      console.error('Login failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{t.title}</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>{t.username}</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group password-group">
          <label>{t.password}</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label>{t.language}</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={loading}
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className={loading ? 'loading' : ''}>
          {loading ? t.loading : t.submit}
        </button>
      </form>
    </div>
  );
};

export default Login;
