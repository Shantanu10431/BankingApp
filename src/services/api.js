import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL1 || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const userAPI = {
  getDashboard: () => api.get('/user/dashboard'),
  getTransactions: (params) => api.get('/user/transactions', { params }),
};

export const transactionAPI = {
  deposit: (data) => api.post('/transaction/deposit', data),
  withdraw: (data) => api.post('/transaction/withdraw', data),
  transfer: (data) => api.post('/transaction/transfer', data),
};

export const adminAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  freezeAccount: (userId, freeze) => api.patch(`/admin/users/${userId}/freeze`, { freeze }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getStats: () => api.get('/admin/stats'),
  getAuditLogs: (params) => api.get('/admin/audit-logs', { params }),
};

export default api;