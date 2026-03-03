import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export interface LoginResponse {
  access_token: string;
  user: any; 
}

export const API = {
  auth: {
    login: (data: any) => api.post<LoginResponse>('/login', data),
    logout: () => api.post('/logout'),
    me: () => api.get('/me'),
  },
  users: {
    getAll: () => api.get('/users'),
    create: (data: any) => api.post('/users', data),
    update: (id: number | string, data: any) => api.put(`/users/${id}`, data),
    delete: (id: number | string) => api.delete(`/users/${id}`),
  },
  products: { 
    getAll: () => api.get('/products'),
    create: (data: any) => api.post('/products', data),
    update: (id: number | string, data: any) => api.put(`/products/${id}`, data),
    delete: (id: number | string) => api.delete(`/products/${id}`),
  },
  permissionProfiles: {
    getAll: () => api.get('/permission-profiles'),
    create: (data: { name: string; access: string[] }) => api.post('/permission-profiles', data),
    delete: (id: number | string) => api.delete(`/permission-profiles/${id}`),
  },
};

export default api; 
