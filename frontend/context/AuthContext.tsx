'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import apiClient from '@/services/apiClient'; // Path to your apiClient

export interface UserProfile {
  id: string;
  profileType: 'USER' | 'VENDOR' | 'ADMIN';
  isVerified: boolean;
  businessName?: string;
  phone?: string;
  address?: string;
  profilePic?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'VENDOR';
  profile?: UserProfile | null;
  phone?: string;
  address?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'flameiq_token';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    Cookies.remove(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('user');
  }, []);

  const login = useCallback((newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    Cookies.set(TOKEN_KEY, newToken, { expires: 7, path: '/' });
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  }, []);

  const updateUser = useCallback((updatedUser: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const merged = { ...prev, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(merged));
      return merged;
    });
  }, []);

  useEffect(() => {
    const activeToken = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem('user');

    if (!activeToken) {
      setIsLoading(false);
      return;
    }

    setToken(activeToken);

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse cached user', err);
      }
    }

    // Use apiClient instead of fetch
    apiClient
      .get<{ success: boolean; data: User }>('/me')
      .then((res: any) => {
        if (res.success) {
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        } else {
          logout();
        }
      })
      .catch(() => {
        // Keep cached state on network failure
      })
      .finally(() => setIsLoading(false));
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser }}>
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