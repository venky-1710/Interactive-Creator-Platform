// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser, logoutUser } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error('Failed to load user:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      const { user: userData, token } = await loginUser(username, password);
      localStorage.setItem('token', token);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const { user: newUser, token } = await registerUser(userData);
      localStorage.setItem('token', token);
      setUser(newUser);
      return newUser;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    logoutUser();
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: isAdmin(),
        loading,
        error,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};