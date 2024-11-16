import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, usersApi } from '../services/apiSWR';
import useUserStore from '../stores/userStore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('auth_token'));
  const { user, isError } = usersApi.useGetMe();

  // Effetto per gestire i dati dell'utente
  useEffect(() => {
    if (isAuthenticated && user) {
      useUserStore.getState().setCurrentUser(user);
    }
    
    if (isError) {
      logout();
    }
  }, [isAuthenticated, user, isError]);

  const login = async (userData, accessToken) => {
    useUserStore.getState().setCurrentUser(userData);
    setToken(accessToken);
    setIsAuthenticated(true);
  };

  const register = (userData, accessToken) => {
    useUserStore.getState().setCurrentUser(userData);
    setToken(accessToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    authApi.logout();
    useUserStore.getState().clearCurrentUser();
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