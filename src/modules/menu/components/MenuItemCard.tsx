import React, { useState } from 'react';
import type { Product, Category } from '../../../types/Product';
import { useCartContext } from '../../../context/CartContext';

interface MenuItemCardProps {
  product: Product;
  isListView?: boolean;
  onAddToCart: (product: Product) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  product, 
  isListView = false,
  onAddToCart 
}) => {
  const { items } = useCartContext();
  const cartItem = items.find(item => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  
  const [isFavorite, setIsFavorite] = useState(false);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 0) {
      // Update cart with new quantity
      if (newQuantity === 0) {
        // Remove from cart if quantity is 0
        onAddToCart(product);
      } else {
        // Add to cart with new quantity
        for (let i = 0; i < Math.abs(delta); i++) {
          onAddToCart(product);
        }
      }
    }
  };

  const formatPrice = (price: number) => {
    // Assuming the price is in RM (Malaysian Ringgit)
    return `RM ${price.toFixed(2)}`;
  };

  // Determine category display name
  const getCategoryDisplayName = (category: Category) => {
    const categoryMap: Record<string, string> = {
      'rice': 'Rice Dishes',
      'noodle': 'Noodles',
      'snack': 'Snacks',
      'drink': 'Drinks',
      'dessert': 'Desserts',
      'burgers': 'Burgers',
      'pizzas': 'Pizzas',
      'fast food': 'Fast Food',
      'sandwiches': 'Sandwiches'
    };
    
    const normalizedCategory = category.name.toLowerCase();
    return categoryMap[normalizedCategory] || category.name;
  };

  return (
    <div className={`item-card ${isListView ? 'list-view' : ''}`} data-cat={product.category.name}>
      <div className="item-img">
        {product.image ? (
          <img src={product.image} alt={product.name} loading="lazy" />
        ) : (
          <div className="placeholder-img">
            <span>No Image</span>
          </div>
        )}
        <div className="item-tags">
          {product.tag === 'popular' && (
            <span className="tag tag-popular">Popular</span>
          )}
          {product.tag === 'new' && (
            <span className="tag tag-new">New</span>
          )}
          {!product.isAvailable && (
            <span className="tag tag-sold">Sold Out</span>
          )}
        </div>
        <button
          className={`fav-btn ${isFavorite ? 'active' : ''}`}
          onClick={() => setIsFavorite(!isFavorite)}
          title="Favourite"
        >
          <i className="fas fa-heart"></i>
        </button>
      </div>
      <div className="item-info">
        <div className="item-name">{product.name}</div>
        <div className="item-cat">{getCategoryDisplayName(product.category)}</div>
        <div className="item-desc">{product.description}</div>
        <div className="item-meta">
          <span className="item-price">{formatPrice(product.price)}</span>
          <div className="item-actions">
            {product.isAvailable ? (
              <div className="qty-control">
                <button
                  className="qty-btn"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 0}
                >
                  <i className="fas fa-minus"></i>
                </button>
                <span className="qty-num" id={`qty-${product.id}`}>
                  {quantity}
                </span>
                <button
                  className="qty-btn"
                  onClick={() => handleQuantityChange(1)}
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            ) : (
              <span style={{ color: 'rgba(255,255,255,.3)', fontSize: '.8rem' }}>
                Unavailable
              </span>
            )}
            {product.isAvailable && (
              <button
                className="add-to-cart"
                onClick={() => onAddToCart(product)}
              >
                <i className="fas fa-cart-plus"></i> Add
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;