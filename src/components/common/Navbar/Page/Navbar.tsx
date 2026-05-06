import React, { useState } from 'react';
import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../modules/auth/context/AuthContext';
import { useCartContext } from '../../../../context/CartContext';

interface NavbarProps {
  onCartToggle?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCartContext();
  const location = useLocation();
  const isMenuPage = location.pathname === '/menu';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        Canteen<span>Go</span>
      </Link>
      <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {isMenuOpen ? (
            <path d="M18 6L6 18M6 6l12 12"/>
          ) : (
            <>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </>
          )}
        </svg>
      </button>
      <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <li><Link to="/menu" onClick={() => setIsMenuOpen(false)}>Menu</Link></li>
        <li><Link to="/orders" onClick={() => setIsMenuOpen(false)}>Order</Link></li>
        <li><Link to="/tracks" onClick={() => setIsMenuOpen(false)}>Track</Link></li>
        {user?.role === 'admin' && (
          <li><Link to="/reports" onClick={() => setIsMenuOpen(false)}>Reports</Link></li>
        )}
        <li><Link to="/delivery" onClick={() => setIsMenuOpen(false)}>Delivery</Link></li>
        <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
        
        {!isAuthenticated && (
          <>
            <li className="mobile-only">
              <Link to="/login" className="btn-nav btn-outline" onClick={() => setIsMenuOpen(false)}>Login</Link>
            </li>
            <li className="mobile-only">
              <Link to="/register" className="btn-nav btn-fill" onClick={() => setIsMenuOpen(false)}>Sign Up Free</Link>
            </li>
          </>
        )}
      </ul>
      <div className="nav-cta">
        {isMenuPage && (
          <button className="cart-btn" onClick={onCartToggle}>
            <i className="fas fa-shopping-cart"></i> My Cart
            <span className="cart-count">{getTotalItems()}</span>
          </button>
        )}
        {isAuthenticated && user ? (
          <div className="profile-container">
            <button 
              className="profile-button" 
              onClick={toggleProfileDropdown}
            >
              <div className="profile-avatar">
                {user.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="profile-name">
                {user.full_name || 'User'}
              </span>
              <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {isProfileDropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    {user.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="dropdown-user-info">
                    <p className="dropdown-name">{user.full_name || 'User'}</p>
                    <p className="dropdown-email">{user.email || ''}</p>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <Link 
                  to="/profile" 
                  className="dropdown-item"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    setIsMenuOpen(false);
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  View Profile
                </Link>
                <button 
                  className="dropdown-item dropdown-logout"
                  onClick={handleLogout}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="btn-nav btn-outline" onClick={() => setIsMenuOpen(false)}>Login</Link>
            <Link to="/register" className="btn-nav btn-fill" onClick={() => setIsMenuOpen(false)}>Sign Up Free</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;