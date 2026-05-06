import React from 'react';
import { useCartContext } from '../../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartPanel: React.FC<CartPanelProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCartContext();
  
  const subtotal = getTotalPrice();
  const serviceCharge = subtotal * 0.05; // 5% service charge
  const tax = subtotal * 0.06; // 6% tax
  const totalPrice = subtotal + serviceCharge + tax;

  const handleQuantityChange = (productId: number, delta: number) => {
    const item = items.find(i => i.product.id === productId);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity <= 0) {
        removeFromCart(productId);
      } else {
        updateQuantity(productId, newQuantity);
      }
    }
  };

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'show' : ''}`} id="cartOverlay" onClick={onClose}></div>
      <div className={`cart-panel ${isOpen ? 'open' : ''}`} id="cartPanel">
        <div className="cart-header">
          <h3>🛒 My Cart</h3>
          <button className="close-cart" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="cart-items" id="cartItems">
          {items.length === 0 ? (
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.4)',
                fontSize: '0.9rem',
                textAlign: 'center',
                padding: '40px 0',
              }}
            >
              Your cart is empty.<br />Add some delicious items!
            </p>
          ) : (
            items.map((cartItem) => (
              <div key={cartItem.product.id} className="cart-item">
                <div className="cart-item-img">
                  {cartItem.product.image ? (
                    <img src={cartItem.product.image} alt={cartItem.product.name} />
                  ) : (
                    <div className="placeholder-img">
                      <span>No Image</span>
                    </div>
                  )}
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{cartItem.product.name}</div>
                  <div className="cart-item-price">
                    RM {(cartItem.product.price * cartItem.quantity).toFixed(2)}
                  </div>
                  <div className="cart-item-qty">
                    <button
                      className="c-qty-btn"
                      onClick={() => handleQuantityChange(cartItem.product.id, -1)}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <span>{cartItem.quantity}</span>
                    <button
                      className="c-qty-btn"
                      onClick={() => handleQuantityChange(cartItem.product.id, 1)}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                    <button
                      className="remove-item"
                      onClick={() => removeFromCart(cartItem.product.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <div className="cart-summary">
            <div className="cart-row">
              <span>Subtotal</span>
              <span id="subtotal">RM {subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-row">
              <span>Service Charge (5%)</span>
              <span id="serviceCharge">RM {serviceCharge.toFixed(2)}</span>
            </div>
            <div className="cart-row">
              <span>Tax (6% SST)</span>
              <span id="tax">RM {tax.toFixed(2)}</span>
            </div>
            <div className="cart-row total">
              <span>Total</span>
              <span id="totalPrice">RM {totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <button
            className="checkout-btn"
            onClick={() => {
              if (!isAuthenticated) {
                onClose();
                navigate('/login');
                return;
              }
              navigate('/orders');
            }}
          >
            <i className="fas fa-lock"></i> Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default CartPanel;