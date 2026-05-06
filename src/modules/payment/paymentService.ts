import api from '../../services/api';
import type { PaymentMethod } from '../../types/Payment';

// KHQR API request type
export interface KHQRRequest {
  orderId: number;
  amount: number;
  currency: "USD" | "KHR";
}

// KHQR API response type
export interface KHQRResponse {
  success: boolean;
  data: {
    qrImage?: string;     // Base64-encoded QR image or URL to QR image
    qrCode?: string;      // Base64-encoded QR image or URL to QR image
    qr?: string;          // Alternative field name used by some backends
    md5?: string;         // MD5 hash of the QR for verification
    amount: number;       // Amount in the QR
    currency?: string;    // Currency code (e.g., "USD" or "KHR")
    reference?: string;   // Transaction reference
  };
}

// Mock API service for payment operations
class PaymentService {
  // Generate a KHQR code for payment (called after order is placed)
  async generateKHQR(request: KHQRRequest): Promise<KHQRResponse> {
    const response = await api.post<KHQRResponse>('/payments/khqr/generate', request);
    return response;
  }

  // Process a payment
  async processPayment(paymentData: Omit<PaymentMethod, 'id' | 'status'>): Promise<PaymentMethod> {
    // In a real app, this would make an API call to a payment gateway
    return new Promise((resolve) => {
      setTimeout(() => {
        const processedPayment: PaymentMethod = {
          ...paymentData,
          id: Date.now(), // Mock ID
          status: 'completed',
          transactionId: `TXN${Date.now()}`,
          paymentDate: new Date().toISOString()
        };
        resolve(processedPayment);
      }, 1000); // Simulate processing time
    });
  }

  // Get payment by ID
  async getPaymentById(paymentId: number): Promise<PaymentMethod> {
    // In a real app, this would make an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (paymentId > 0) {
          const payment: PaymentMethod = {
            id: paymentId,
            type: 'khqr',
            amount: 500,
            status: 'completed',
            transactionId: `TXN${paymentId}`,
            paymentDate: new Date().toISOString()
          };
          resolve(payment);
        } else {
          reject(new Error('Payment not found'));
        }
      }, 300);
    });
  }

  // Refund a payment
  async refundPayment(paymentId: number): Promise<PaymentMethod> {
    // In a real app, this would make an API call to initiate a refund
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (paymentId > 0) {
          // Get the existing payment and update its status
          this.getPaymentById(paymentId).then(payment => {
            resolve({
              ...payment,
              status: 'refunded'
            });
          }).catch(reject);
        } else {
          reject(new Error('Payment not found'));
        }
      }, 500);
    });
  }
}

export default new PaymentService();

