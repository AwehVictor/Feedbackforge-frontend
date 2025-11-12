import api from './api';

export const authService = {
  // Login user
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },

  // Signup user
  signup: async (name, email, password, passwordConfirm) => {
    const response = await api.post('/users/signup', { 
      name, 
      email, 
      password,
      passwordConfirm 
    });
    return response.data;
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Verify token
  verifyToken: async () => {
    const response = await api.get('/users/verify');
    return response.data;
  },
};

