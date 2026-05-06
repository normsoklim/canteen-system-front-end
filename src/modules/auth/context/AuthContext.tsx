import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import authService from '../services/authService';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (full_name: string, email: string, password: string, phone: string, role?: string) => Promise<{ success: boolean; message?: string }>;
  verifyOTP: (email: string, otpCode: string, full_name: string, password: string, phone?: string) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on app start
    const token = authService.getToken();
    const userData = authService.getUser();
    
    if (token && userData) {
      console.log('Loading user from localStorage:', userData);
      
      // Validate user data exists
      if (!userData.id) {
        console.error('Invalid user data in localStorage:', userData);
        authService.logout();
        setLoading(false);
        return;
      }
      
      // Transform user data to match User interface
      const transformedUser: User = {
        id: userData.id,
        email: userData.email || '',
        full_name: userData.full_name?.split(' ')[0] || '',
        role: userData.role || 'customer',
       
      };
      setUser(transformedUser);
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: string = 'customer') => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      
      console.log('Login response in AuthContext:', response);
      
      // Validate user data exists
      if (!response.user || !response.user.id) {
        throw new Error('Invalid user data received from server');
      }
      
      // Transform user data to match User interface
      const transformedUser: User = {
        id: response.user.id,
        email: response.user.email || '',
        full_name: response.user.full_name?.split(' ')[0] || '',
        role: response.user.role || 'customer',
        
      };
      setUser(transformedUser);
    } catch (error: any) {
      console.error('Login error in AuthContext:', error);
      throw new Error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    full_name: string, 
    email: string, 
    password: string, 
    phone: string, 
    role: string = 'customer'
  ) => {
    setLoading(true);
    try {
      const response = await authService.register({ 
        full_name: `${full_name}`,
        email, 
        password,
        phone,
        role
      });
      
      console.log('Register response in AuthContext:', response);
      
      // Check if registration requires OTP verification
      // If the response contains a message about OTP, return success without setting user
      if ('success' in response && response.success) {
        // OTP flow - registration successful but needs verification
        // Store registration data for OTP verification
        localStorage.setItem('pendingRegistration', JSON.stringify({
          full_name,
          email,
          password,
          phone,
          role
        }));
        
        return { 
          success: true, 
          message: (response as any).message || 'Registration successful. Please verify your email.' 
        };
      }
      
      // If response has user data (non-OTP flow)
      if ('user' in response && response.user && response.user.id) {
        // Transform user data to match User interface
        const transformedUser: User = {
          id: response.user.id,
          email: response.user.email || '',
          full_name: response.user.full_name?.split(' ')[0] || '',
          role: response.user.role || 'customer'
        };
        setUser(transformedUser);
        return { success: true };
      }
      
      // If no user data but registration succeeded (OTP flow)
      localStorage.setItem('pendingRegistration', JSON.stringify({
        full_name,
        email,
        password,
        phone,
        role
      }));
      
      return { success: true, message: 'Registration successful. Please verify your email.' };
    } catch (error: any) {
      console.error('Register error in AuthContext:', error);
      throw new Error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email: string, otpCode: string, full_name: string, password: string, phone?: string) => {
    setLoading(true);
    try {
      // Retrieve pending registration data to get phone number
      const pendingRegistration = localStorage.getItem('pendingRegistration');
      let phone = '';
      
      if (pendingRegistration) {
        try {
          const registrationData = JSON.parse(pendingRegistration);
          phone = registrationData.phone || '';
        } catch (e) {
          console.warn('Failed to parse pending registration data:', e);
        }
      }
      
      const response = await authService.verifyOTP(email, otpCode, full_name, password, phone);
      
      console.log('Verify OTP response in AuthContext:', response);
      
      // Validate user data exists
      if (!response.user || !response.user.id) {
        throw new Error('Invalid user data received from server');
      }
      
      // Transform user data to match User interface
      const transformedUser: User = {
        id: response.user.id,
        email: response.user.email || '',
        full_name: response.user.full_name?.split(' ')[0] || '',
        role: response.user.role || 'customer'
      };
      setUser(transformedUser);
      
      // Clear pending registration data after successful verification
      localStorage.removeItem('pendingRegistration');
      
      // Check if token was provided
      if (!response.access_token) {
        console.warn('⚠️ No token received - user verified but not authenticated');
        console.warn('User should log in to get authentication token');
        // Note: The UI should handle this by redirecting to login if needed
      }
    } catch (error: any) {
      console.error('Verify OTP error in AuthContext:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        url: error.url,
        details: error.details
      });
      
      // Re-throw the error with the original message
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async (email: string) => {
    setLoading(true);
    try {
      await authService.resendOTP(email);
    } catch (error: any) {
      console.error('Resend OTP error in AuthContext:', error);
      throw new Error(error.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token: authService.getToken(),
    isAuthenticated: !!authService.getToken(),
    login,
    register,
    verifyOTP,
    resendOTP,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};