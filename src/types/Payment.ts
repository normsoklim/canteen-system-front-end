export interface PaymentMethod {
  id?: number;
  type: 'card' | 'khqr' | 'upi' | 'digital_wallet';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  paymentDate?: string;
  referenceNumber?: string;
}

export interface PaymentDetails {
  method: 'card' | 'khqr' | 'upi' | 'digital_wallet';
  amount: number;
  transactionId?: string;
  reference?: string;
}