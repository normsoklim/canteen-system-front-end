import React from 'react';
import type { Product } from '../../../types/Product';
import Button from '../../../components/common/Button';

interface FoodCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      {product.image && (
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{product.description}</p>
          </div>
          {!product.isAvailable && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              Unavailable
            </span>
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
          <Button 
            onClick={() => onAddToCart(product)}
            disabled={!product.isAvailable}
            variant={product.isAvailable ? 'primary' : 'secondary'}
          >
            {product.isAvailable ? 'Add to Cart' : 'Unavailable'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;