import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, AuthCredentials, RegisterCredentials } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Use stored user data (token validation happens on API calls)
          setUser(JSON.parse(storedUser));
        } catch (error) {
          // Invalid stored data, clear storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: AuthCredentials) => {
    try {
      console.log('AuthContext: Starting login process');
      const response = await authAPI.login(credentials);
      console.log('AuthContext: Login API response:', response);
      
      // Extract user data from the login response
      const user: User = {
        id: response.id,
        username: response.username,
        email: response.email
      };
      
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      console.log('AuthContext: User set, isAuthenticated should be true');
    } catch (error) {
      console.error('Login error:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Network Error') || error.message.includes('ERR_NETWORK')) {
          throw new Error('Unable to connect to the server. Please check if the backend is running on localhost:8080');
        } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          throw new Error('Invalid username or password');
        } else {
          throw error;
        }
      }
      throw new Error('Login failed. Please try again.');
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      await authAPI.register(credentials);
      // Registration successful - user needs to login separately
    } catch (error) {
      console.error('Registration error:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Network Error') || error.message.includes('ERR_NETWORK')) {
          throw new Error('Unable to connect to the server. Please check if the backend is running on localhost:8080');
        } else if (error.message.includes('409') || error.message.includes('already exists')) {
          throw new Error('Username or email already exists');
        } else {
          throw error;
        }
      }
      throw new Error('Registration failed. Please try again.');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
