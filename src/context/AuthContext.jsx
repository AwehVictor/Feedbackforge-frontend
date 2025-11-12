import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      console.log('Login response:', response);
      
      // Handle the nested response structure from API
      const token = response.token;
      const user = response.data?.user || response.user;
      
      if (!user || !token) {
        throw new Error('Invalid response structure');
      }
      
      const userData = {
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
        _id: user._id,
        token: token,
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, data: userData, message: response.message || 'Login successful!' };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      return { success: false, error: message };
    }
  };

  const signup = async (name, email, password, passwordConfirm) => {
    try {
      const response = await authService.signup(name, email, password, passwordConfirm);
      console.log('Signup response:', response);
      
      // Handle the nested response structure from API
      const token = response.token;
      const user = response.data?.user || response.user;
      
      if (!user || !token) {
        throw new Error('Invalid response structure');
      }
      
      const userData = {
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
        _id: user._id,
        token: token,
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, data: userData, message: response.message || 'Signup successful!' };
    } catch (error) {
      console.error('Signup error:', error);
      const message = error.response?.data?.message || error.message || 'Signup failed. Please try again.';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
