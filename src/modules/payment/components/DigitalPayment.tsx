import React, { useState } from 'react';
import type { PaymentDetails } from '../../../types/Payment';

interface DigitalPaymentProps {
  paymentData: PaymentDetails;
  onChange: (data: PaymentDetails) => void;
  onSubmit: () => void;
}

const DigitalPayment: React.FC<DigitalPaymentProps> = ({ paymentData, onChange, onSubmit }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentDetails['method']>('khqr');
  
  const handleMethodChange = (method: PaymentDetails['method']) => {
    setSelectedMethod(method);
    onChange({
      ...paymentData,
      method
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...paymentData,
      [name]: value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Digital Payment</h3>
        <p className="text-gray-600">Select your preferred payment method</p>
      </div>
      
      <div className="space-y-3">
        <div className="flex space-x-4">
          {(['khqr', 'card', 'upi', 'digital_wallet'] as const).map(method => (
            <button
              key={method}
              type="button"
              className={`px-4 py-2 rounded-md border ${
                selectedMethod === method
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 text-gray-700'
              }`}
              onClick={() => handleMethodChange(method)}
            >
              {method === 'khqr' && 'KHQR'}
              {method === 'upi' && 'UPI'}
              {method === 'card' && 'Card'}
              {method === 'digital_wallet' && 'Digital Wallet'}
            </button>
          ))}
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="font-semibold">Amount to pay: ₹{paymentData.amount?.toFixed(2)}</p>
      </div>
      
      {selectedMethod === 'khqr' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">KHQR Reference</label>
          <input
            type="text"
            name="reference"
            value={paymentData.reference || ''}
            onChange={handleInputChange}
            placeholder="Enter KHQR reference"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
          />
        </div>
      )}

      {selectedMethod === 'upi' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
          <input
            type="text"
            name="reference"
            value={paymentData.reference || ''}
            onChange={handleInputChange}
            placeholder="example@upi"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
          />
        </div>
      )}
      
      {selectedMethod === 'card' && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <input
              type="text"
              name="reference"
              value={paymentData.reference || ''}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input
                type="password"
                placeholder="123"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}
      
      {selectedMethod === 'digital_wallet' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Wallet ID</label>
          <input
            type="text"
            name="reference"
            value={paymentData.reference || ''}
            onChange={handleInputChange}
            placeholder="Enter wallet ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
          />
        </div>
      )}
      
      <button
        onClick={onSubmit}
        className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
      >
        Pay Now
      </button>
    </div>
  );
};

export default DigitalPayment;