'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IUser } from '@/models/User';

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string; redirectTo?: string }>;

  register: (
    name: string,
    email: string,
    password: string,
    role?: string
  ) => Promise<{ success: boolean; message: string }>;

  updateProfile: (data: {
    name: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
  }) => Promise<{ success: boolean; message: string }>;

  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string; redirectTo?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('auth_token', data.token);
        setUser(data.user);

        return {
          success: true,
          message: 'Đăng nhập thành công!',
          redirectTo: data.redirectTo,
        };
      }

      return {
        success: false,
        message: data.message || 'Đăng nhập thất bại!',
      };
    } catch {
      return {
        success: false,
        message: 'Có lỗi xảy ra, vui lòng thử lại!',
      };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: string = 'Learner'
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('auth_token', data.token);
        setUser(data.user);

        return { success: true, message: 'Đăng ký thành công!' };
      }

      return {
        success: false,
        message: data.message || 'Đăng ký thất bại!',
      };
    } catch {
      return {
        success: false,
        message: 'Có lỗi xảy ra, vui lòng thử lại!',
      };
    }
  };

  const updateProfile = async (data: {
    name: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetch('/api/auth/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setUser(result.user);
        return {
          success: true,
          message: result.message || 'Cập nhật thông tin thành công!',
        };
      }

      return {
        success: false,
        message: result.message || 'Cập nhật thất bại!',
      };
    } catch {
      return {
        success: false,
        message: 'Có lỗi xảy ra, vui lòng thử lại!',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    updateProfile,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};