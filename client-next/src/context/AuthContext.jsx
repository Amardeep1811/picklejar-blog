"use client";

import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await axios.get('/auth/me');
        if (data.success && data.data && data.data.user) {
          setUser(data.data.user);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    const path = window.location.pathname;
    const isPublicAdminRoute = path.startsWith('/admin/login') || path.startsWith('/admin/forgot-password') || path.startsWith('/admin/reset-password');
    if (path.startsWith('/admin') && !isPublicAdminRoute) {
      fetchMe();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => { 
    const res = await axios.post('/auth/login', { email, password });
    if (res.data.success && res.data.data && res.data.data.user) {
      setUser(res.data.data.user);
    }
    return res.data;
  };
  
  const logout = async () => { 
    try {
      await axios.post('/auth/logout');
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null); 
      window.location.href = '/admin/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};