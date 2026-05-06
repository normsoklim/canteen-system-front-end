import api from '../../../services/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
}

interface LoginResponse {
  
  user: {
    id: string;
    email: string;
    full_name: string;
    role: string;
  };
  access_token: string;
}

interface RegisterResponse {
  
  user: {
    id: string;
    email: string;
    full_name: string;
    phone: string;
    provider:string;
    role: string;
    isEmailVerified: boolean;
    
  };
  access_token: string;
}

class AuthService {
  private tokenKey = 'authToken';
  private userKey = 'user';
  private isDevelopment = import.meta.env.DEV;

  // Helper method to check if backend is available
  private async isBackendAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Mock OTP verification for development
  private async mockVerifyOTP(email: string, otpCode: string, full_name: string, password: string): Promise<RegisterResponse> {
    console.log('🔧 Using mock OTP verification (development mode)');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Accept any 6-digit OTP for testing
    if (otpCode.length !== 6 || !/^\d+$/.test(otpCode)) {
      throw new Error('Invalid OTP code. Please enter a 6-digit code.');
    }
    
    // Generate mock user data
    const mockUser = {
      id: `mock_${Date.now()}`,
      email,
      full_name,
      phone: '09745886',
      provider: 'local',
      role: 'customer',
      isEmailVerified: true
    };
    
    // Generate mock token
    const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2)}`;
    
    console.log('✅ Mock OTP verification successful');
    
    return {
      user: mockUser,
      access_token: mockToken
    };
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post<any>('/auth/login', credentials);
      
      console.log('Login API response:', response);
      
      // Handle different response structures
      const userData = response.user || response.data?.user;
      const token = response.access_token || response.data?.access_token || response.token;
      
      if (!userData || !userData.id) {
        console.error('Invalid user data in response:', response);
        throw new Error('Invalid response from server: missing user data');
      }
      
      if (!token) {
        console.error('Invalid token in response:', response);
        throw new Error('Invalid response from server: missing token');
      }
      
      // Store token and user data
      this.setToken(token);
      this.setUser(userData);
      
      return {
        user: userData,
        access_token: token
      };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Register user
  async register(userData: RegisterData): Promise<RegisterResponse | { success: boolean; message?: string }> {
    try {
      console.log('Registering user with data:', userData);
      const response = await api.post<any>('/auth/register', userData);
      
      console.log('Register API response:', response);
      
      // Handle different response structures
      const userResponse = response.user || response.data?.user;
      const token = response.access_token || response.data?.access_token || response.token;
      
      // Check if this is OTP flow (no user data but success message)
      if (!userResponse || !userResponse.id) {
        // OTP flow - registration successful but needs verification
        const message = response.message || response.data?.message || 'Registration successful. Please verify your email.';
        console.log('OTP flow detected:', message);
        return {
          success: true,
          message
        } as any;
      }
      
      if (!token) {
        console.error('Invalid token in response:', response);
        throw new Error('Invalid response from server: missing token');
      }
      
      // Store token and user data
      this.setToken(token);
      this.setUser(userResponse);
      
      return {
        user: userResponse,
        access_token: token
      };
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  // Logout user
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Set token
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Get user data
  getUser(): any {
    const userStr = localStorage.getItem(this.userKey);
    if (!userStr || userStr === 'undefined') {
      return null;
    }
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Set user data
  setUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Refresh token (if needed)
  async refreshToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return null;
    }

    try {
      const response: any = await api.post('/auth/refresh', { refreshToken });
      this.setToken(response.token);
      return response.token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
      return null;
    }
  }

  // Verify OTP for email verification
  async verifyOTP(email: string, otpCode: string, full_name: string, password: string, phone: string = ''): Promise<RegisterResponse> {
    try {
      console.log('Verifying OTP with data:', {
        email,
        otpCode,
        full_name,
        passwordLength: password.length,
        phone
      });
      console.log('Request endpoint: /auth/verify-otp');
      
      // Try different request formats that backend might expect
      const requestFormats = [
        // Format 1: Standard format with phone (matches backend DTO)
        { email, otpCode, full_name, password, phone },
        // Format 2: With otp instead of otpCode
        { email, otp: otpCode, full_name, password, phone },
        // Format 3: With code instead of otpCode
        { email, code: otpCode, full_name, password, phone },
        // Format 4: Minimal format
        { email, otpCode },
        // Format 5: With verification_code
        { email, verification_code: otpCode, full_name, password, phone }
      ];
      
      let lastError: any = null;
      
      for (let i = 0; i < requestFormats.length; i++) {
        const requestData = requestFormats[i];
        console.log(`🔄 Trying request format ${i + 1}/${requestFormats.length}:`, Object.keys(requestData));
        
        try {
          const response = await api.post<any>('/auth/verify-otp', requestData);
          
          console.log('✅ Verify OTP API response:', response);
          
          // Handle different response structures
          const userResponse = response.user || response.data?.user;
          const token = response.access_token || response.data?.access_token || response.token;
          
          if (!userResponse || !userResponse.id) {
            console.error('Invalid user data in response:', response);
            throw new Error('Invalid response from server: missing user data');
          }
          
          // Token is optional - backend may not return it after OTP verification
          // User can log in normally to get a token
          if (token) {
            console.log('✅ Token received, storing authentication');
            this.setToken(token);
          } else {
            console.warn('⚠️ No token in response - user verified but not authenticated');
            console.warn('User should log in to get authentication token');
          }
          
          // Store user data
          this.setUser(userResponse);
          
          console.log(`✅ Success with format ${i + 1}`);
          return {
            user: userResponse,
            access_token: token || ''  // Return empty string if no token
          };
        } catch (formatError: any) {
          console.log(`❌ Format ${i + 1} failed:`, formatError.message);
          lastError = formatError;
          
          // If it's not a 400 error, don't try other formats
          if (formatError.status && formatError.status !== 400) {
            throw formatError;
          }
        }
      }
      
      // All formats failed, throw the last error
      throw lastError;
      
    } catch (error: any) {
      console.error('OTP verification failed:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        url: error.url,
        details: error.details,
        stack: error.stack
      });
      
      // Enhance error message for better user feedback
      if (error.status === 400) {
        const enhancedMessage = this.enhanceErrorMessage(error);
        throw new Error(enhancedMessage);
      }
      
      // Re-throw with more context
      throw error;
    }
  }

  // Helper method to enhance error messages
  private enhanceErrorMessage(error: any): string {
    const baseMessage = error.message || 'OTP verification failed';
    
    // Check for specific error details
    if (error.details) {
      if (error.details.message) {
        return error.details.message;
      }
      if (error.details.error) {
        return error.details.error;
      }
      if (Array.isArray(error.details.message)) {
        return error.details.message.join(', ');
      }
    }
    
    // Provide helpful context based on error type
    if (baseMessage.includes('Bad Request')) {
      return 'Invalid OTP code or the verification link has expired. Please check your email and try again, or request a new OTP.';
    }
    
    if (baseMessage.includes('Not Found')) {
      return 'User not found. Please register again to receive a new OTP.';
    }
    
    if (baseMessage.includes('Unauthorized')) {
      return 'Authentication failed. Please try logging in again.';
    }
    
    return baseMessage;
  }

  // Resend OTP
  async resendOTP(email: string): Promise<{ message: string }> {
    try {
      console.log('Resending OTP to email:', email);
      
      const response = await api.post<any>('/auth/resend-otp', { email });
      
      console.log('Resend OTP API response:', response);
      
      return {
        message: response.message || response.data?.message || 'OTP sent successfully'
      };
    } catch (error: any) {
      console.error('Resend OTP failed:', error);
      throw error;
    }
  }
}

export default new AuthService();