import React, { createContext, useCallback, useEffect, useState } from 'react';
import { authAPI } from '../api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.register(userData);
      const { data, token: newToken, refreshToken } = response.data;
      setUser(data);
      setToken(newToken);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(email, password);
      const { data, token: newToken } = response.data;
      setUser(data);
      setToken(newToken);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, []);

  const updateProfile = useCallback(async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      const updatedUser = response.data.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true, data: updatedUser };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Update failed',
      };
    }
  }, []);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    register,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
