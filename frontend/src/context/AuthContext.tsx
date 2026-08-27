import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, type RegisterPayload, type LoginPayload } from '../services/authApi';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  countryCode: string;
  currency: string;
  isSubscribed: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (payload: LoginPayload) => Promise<{ success: boolean; message: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('phanilie_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem('phanilie_access_token');
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('phanilie_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('phanilie_user');
    }
  }, [user]);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('phanilie_access_token', accessToken);
    } else {
      localStorage.removeItem('phanilie_access_token');
    }
  }, [accessToken]);

  const login = async (payload: LoginPayload) => {
    const res = await authApi.signIn(payload);
    if (res.success && res.user && res.accessToken) {
      setUser(res.user);
      setAccessToken(res.accessToken);
      return { success: true, message: 'Logged in successfully' };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const register = async (payload: RegisterPayload) => {
    const res = await authApi.signUp(payload);
    if (res.success && res.user && res.accessToken) {
      setUser(res.user);
      setAccessToken(res.accessToken);
      return { success: true, message: 'Registered successfully' };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        accessToken,
        login,
        register,
        logout
      }}
    >
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
