import React from 'react';
import type { PaymentMethod } from '../../types/Payment';

interface CashPaymentProps {
  paymentData: PaymentMethod;
  onChange: (data: PaymentMethod) => void;
  onSubmit: () => void;
}

const CashPayment: React.FC<CashPaymentProps> = ({ paymentData, onChange, onSubmit }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Cash Payment</h3>
        <p className="text-gray-600">Please pay the exact amount to the cashier</p>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="font-semibold">Total Amount: ₹{paymentData.amount?.toFixed(2)}</p>
        <p className="text-sm text-gray-600">Please have exact change if possible</p>
      </div>
      
      <div className="flex space-x-3">
        <button
          onClick={onSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Confirm Cash Payment
        </button>
      </div>
    </div>
  );
};

export default CashPayment;