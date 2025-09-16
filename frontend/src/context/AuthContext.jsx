import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: 'https://mr-tareq-manegement-backend.onrender.com',
    timeout: 10000,
  });

 // تعديل interceptor لرؤية ما يحدث
api.interceptors.request.use((config) => {
  const t = localStorage.getItem('token');
  console.log('Request interceptor - Token from localStorage:', t);
  
  if (t) {
    config.headers['Authorization'] = `Bearer ${t}`;
    console.log('Authorization header set:', config.headers['Authorization']);
  } else {
    console.log('No token found in localStorage');
  }
  
  return config;
});

// إضافة response interceptor للتصحيح
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      console.log('Unauthorized - redirecting to login');
      logout();
    }
    return Promise.reject(error);
  }
);
 

  useEffect(() => {
    if (token) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/api/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.post('/api/auth/login', { username, password });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'فشل تسجيل الدخول');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,   // ✅ نرجّع التوكن هنا
    login,
    logout,
    api,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
