// API service using fetch instead of axios to avoid dependency issues
class ApiService {
  private baseUrl: string;
  
  constructor() {
    // Use relative URL for development proxy, or environment variable for production
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
  }

  // Generic request method
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };
    
    const config: RequestInit = {
      headers,
      ...options,
    };
    
    try {
      // Log request details
      const requestBody = options.body ? JSON.parse(options.body as string) : '';
      console.log(`API Request: ${options.method || 'GET'} ${url}`, requestBody);
      console.log('Request headers:', headers);
      console.log('Full request config:', config);
      
      const response = await fetch(url, config);
      
      // Log response status and headers
      console.log(`API Response: ${response.status} ${response.statusText} for ${url}`);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, redirect to login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        
        // Try to get error details from response body
        let errorMessage = `HTTP error! status: ${response.status}`;
        let errorDetails: any = {};
        
        try {
          const errorText = await response.text();
          console.error('Error response body (raw):', errorText);
          
          // Try to parse as JSON
          try {
            const errorData = JSON.parse(errorText);
            console.error('Error response data (parsed):', errorData);
            errorDetails = errorData;
            
            if (errorData.message) {
              errorMessage = errorData.message;
            } else if (errorData.error) {
              errorMessage = errorData.error;
            } else if (errorData.detail) {
              errorMessage = errorData.detail;
            } else if (typeof errorData === 'string') {
              errorMessage = errorData;
            }
          } catch (parseError) {
            // If not JSON, use the raw text
            console.error('Could not parse error as JSON, using raw text');
            errorMessage = errorText || errorMessage;
          }
        } catch (e) {
          // If we can't read the error body, use the status message
          console.error('Could not read error response body:', e);
        }
        
        // Create error with additional details
        const error = new Error(errorMessage) as any;
        error.status = response.status;
        error.details = errorDetails;
        error.url = url;
        
        // In development mode, log as warning instead of error for 400 responses
        // (these are expected when backend is not fully implemented)
        if (import.meta.env.DEV && response.status === 400) {
          console.warn('⚠️ API returned 400 (expected in development):', {
            message: errorMessage,
            status: response.status,
            url,
            details: errorDetails,
            requestBody
          });
        } else {
          console.error('API Error:', {
            message: errorMessage,
            status: response.status,
            url,
            details: errorDetails,
            requestBody
          });
        }
        
        throw error;
      }
      
      const data = await response.json() as T;
      console.log(`API Success: ${url}`, data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      
      // If it's a network error, provide more context
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('Network error detected. Backend may not be running.');
        const networkError = new Error('Network error: Unable to connect to the server. Please check if the backend is running.') as any;
        networkError.status = 0;
        networkError.url = url;
        networkError.details = { originalError: error.message };
        throw networkError;
      }
      
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export default new ApiService();