import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/apiSWR';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('auth_token'));

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
      setToken(token);
    }
  }, []);

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    setIsAuthenticated(true);
    localStorage.setItem('auth_token', accessToken);
  };

  const register = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    setIsAuthenticated(true);
    localStorage.setItem('auth_token', accessToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    authApi.logout();
  };

  const value = {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 