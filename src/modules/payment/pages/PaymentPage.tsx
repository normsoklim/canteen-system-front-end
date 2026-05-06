import React, { useState } from 'react';
import CashPayment from '../components/CashPayment';
import DigitalPayment from '../components/DigitalPayment';
import type { PaymentDetails } from '../../../types/Payment';
import paymentService from '../paymentService';

interface PaymentPageProps {
  amount: number;
  onPaymentSuccess: (paymentId: number) => void;
  onPaymentCancel: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ amount, onPaymentSuccess, onPaymentCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'digital'>('digital');
  const [paymentData, setPaymentData] = useState<PaymentDetails>({
    method: 'card',
    amount: amount,
    reference: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handlePaymentDataChange = (data: PaymentDetails) => {
    setPaymentData(data);
  };

  const handlePaymentSubmit = async () => {
    setError(null);
    
    try {
      // In a real app, we would process the payment through the service
      const result = await paymentService.processPayment({
        type: paymentData.method,
        amount: paymentData.amount
      });
      
      onPaymentSuccess(result.id!);
    } catch (err) {
      setError('Payment failed. Please try again.');
      console.error('Payment error:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-8">Complete Your Payment</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              paymentMethod === 'digital'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500'
            }`}
            onClick={() => setPaymentMethod('digital')}
          >
            Digital Payment
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              paymentMethod === 'cash'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500'
            }`}
            onClick={() => setPaymentMethod('cash')}
          >
            Cash
          </button>
        </div>
        
        <div className="mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-semibold">Amount to pay: ₹{amount.toFixed(2)}</p>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {paymentMethod === 'cash' ? (
          <CashPayment
            paymentData={{ type: 'cash', amount: paymentData.amount } as any}
            onChange={(data: any) => handlePaymentDataChange({ ...paymentData, ...data })}
            onSubmit={handlePaymentSubmit}
          />
        ) : (
          <DigitalPayment
            paymentData={paymentData}
            onChange={handlePaymentDataChange}
            onSubmit={handlePaymentSubmit}
          />
        )}

        <div className="mt-6">
          <button
            onClick={onPaymentCancel}
            className="w-full py-3 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;