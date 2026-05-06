import React from 'react';
import type { Product } from '../../types/Product';

interface OrderSummaryProps {
  items: {
    product: Product;
    quantity: number;
  }[];
  subtotal: number;
  tax?: number;
  total: number;
  serviceCharge?: number;
  sst?: number;
  discount?: number;
  deliveryFee?: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  tax = 0,
  total,
  serviceCharge = 0,
  sst = 0,
  discount = 0,
  deliveryFee = 0
}) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-7 sticky top-24 h-fit">
      <div className="summary-title text-xl font-bold font-playfair mb-6">Order Summary</div>
      
      <div className="summary-items border-b border-gray-700 pb-5 mb-5 max-h-80 overflow-y-auto">
        {items.map((item, index) => (
          <div key={index} className="s-item flex gap-3 items-center py-2.5 border-b border-gray-800/50 last:border-0">
            <div className="s-item-img w-12.5 h-12.5 rounded-2 bg-gray-700 overflow-hidden flex-shrink-0">
              <img
                src={item.product.image || "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=100&h=100&fit=crop"}
                alt={item.product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="s-item-name text-sm font-bold flex-1">
              {item.product.name}
              <span className="text-gray-400"> ×{item.quantity}</span>
            </div>
            <div className="s-item-price text-sm text-amber-400 font-space-mono">
              ₹{(item.product.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="summary-row flex justify-between text-sm text-gray-400 mb-2.5">
        <span>Subtotal</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>
      
      {discount > 0 && (
        <div className="summary-row flex justify-between text-sm text-teal-500 mb-2.5">
          <span>Discount</span>
          <span>-₹{discount.toFixed(2)}</span>
        </div>
      )}
      
      <div className="summary-row flex justify-between text-sm text-gray-400 mb-2.5">
        <span>Service Charge (5%)</span>
        <span>₹{serviceCharge.toFixed(2)}</span>
      </div>
      
      <div className="summary-row flex justify-between text-sm text-gray-400 mb-2.5">
        <span>SST (6%)</span>
        <span>₹{sst.toFixed(2)}</span>
      </div>
      
      {deliveryFee > 0 && (
        <div className="summary-row flex justify-between text-sm text-gray-400 mb-2.5">
          <span>Delivery Fee</span>
          <span>₹{deliveryFee.toFixed(2)}</span>
        </div>
      )}
      
      <div className="summary-row total flex justify-between font-bold text-lg border-t border-gray-700 pt-3.5 mt-1.5">
        <span>Total</span>
        <span className="text-amber-400 font-space-mono">₹{total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;