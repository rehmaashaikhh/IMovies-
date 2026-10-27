import api from './api';

export const authService = {
  // User registration
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  // User login
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  // Admin registration
  adminRegister: async (adminData) => {
    const response = await api.post('/api/auth/admin/register', adminData);
    return response.data;
  },

  // Admin login
  adminLogin: async (credentials) => {
    const response = await api.post('/api/auth/admin/login', credentials);
    return response.data;
  },

  // Fetch current user profile
  getProfile: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },

  // Health check
  checkHealth: async () => {
    const response = await api.get('/api/health');
    return response.data;
  },
};
