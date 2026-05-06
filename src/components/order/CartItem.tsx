import React from 'react';
import type { Product } from '../../types/Product';

interface CartItemProps {
  item: {
    product: Product;
    quantity: number;
  };
  onRemove: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onUpdateQuantity }) => {
  const { product, quantity } = item;
  const totalPrice = product.price * quantity;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      onUpdateQuantity(product.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
      <div className="flex-1">
        <h4 className="font-bold text-white">{product.name}</h4>
        <p className="text-gray-400 text-sm">{product.description}</p>
      </div>
      <div className="flex items-center space-x-3 ml-3">
        <div className="flex items-center border border-gray-700 rounded-lg">
          <button
            className="px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-l-lg"
            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
            disabled={quantity <= 1}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-12 text-center bg-transparent border-y border-gray-700 py-2 text-white"
          />
          <button
            className="px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-r-lg"
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
          >
            +
          </button>
        </div>
        <span className="font-bold text-amber-400 font-space-mono w-20 text-right">₹{totalPrice.toFixed(2)}</span>
        <button
          onClick={() => onRemove(product.id)}
          className="text-red-500 hover:text-red-300 text-sm"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;