import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import Navbar from '../../../components/common/Navbar/Page/Navbar';
import './profile.css';

interface Toast {
  id: number;
  title: string;
  message: string;
}

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    student_id: '',
    department: '',
    dietary: 'No Restrictions',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [notifSettings, setNotifSettings] = useState({
    orderUpdates: true,
    promotions: true,
    paymentReceipts: true,
    loyaltyPoints: false,
    announcements: true,
  });
  const toastIdRef = useRef(0);
  const revealRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize form data from user
  useEffect(() => {
    if (user) {
      const nameParts = (user.full_name || '').split(' ');
      setFormData(prev => ({
        ...prev,
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        student_id: user.id || '',
      }));
    }
  }, [user]);

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    revealRefs.current.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Auto-remove toasts
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts(prev => prev.slice(1));
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  const showToast = (title: string, message: string) => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, title, message }]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      showToast('Edit Mode', 'You can now edit your personal information.');
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    showToast('Profile Updated', 'Your changes have been saved successfully.');
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      const nameParts = (user.full_name || '').split(' ');
      setFormData(prev => ({
        ...prev,
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: prev.phone,
        student_id: user.id || '',
      }));
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNotifToggle = (key: keyof typeof notifSettings) => {
    setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }));
    showToast('Preference Saved', 'Notification preferences updated.');
  };

  if (!user) {
    return (
      <div className="profile-not-logged-in">
        <div className="profile-not-logged-in-card">
          <div className="profile-not-logged-in-icon">
            <i className="fas fa-user-slash"></i>
          </div>
          <h1>Please login to view your profile</h1>
          <Link to="/login" className="nav-btn">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const userInitial = user.full_name?.charAt(0).toUpperCase() || 'U';
  const userRole = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Customer';

  const sidebarItems = [
    { id: 'personal', icon: 'fas fa-user', label: 'Personal Info' },
    { id: 'orders', icon: 'fas fa-receipt', label: 'Order History' },
    { id: 'addresses', icon: 'fas fa-map-marker-alt', label: 'Saved Addresses' },
    { id: 'payment', icon: 'fas fa-credit-card', label: 'Payment Methods' },
    { id: 'notifications', icon: 'fas fa-bell', label: 'Notifications' },
    { id: 'security', icon: 'fas fa-shield-alt', label: 'Security' },
  ];

  return (
    <div className="profile-page">
      <Navbar />

      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <Link to="/">Home</Link>
        <i className="fas fa-chevron-right" style={{ fontSize: '0.6rem' }}></i>
        <span style={{ color: 'rgba(255,255,255,0.65)' }}>My Profile</span>
      </div>

      {/* Main Layout */}
      <div className="profile-layout">
        {/* Left Sidebar */}
        <aside className="profile-sidebar">
          {/* Avatar Card */}
          <div className="avatar-card reveal" ref={el => { revealRefs.current[0] = el; }}>
            <div
              className="avatar-ring"
              onClick={() => showToast('Upload Photo', 'Select an image to update your avatar.')}
            >
              {userInitial}
              <div className="avatar-edit-btn">
                <i className="fas fa-camera"></i>
              </div>
            </div>
            <div className="profile-name">{user.full_name || 'User'}</div>
            <div className="profile-role">
              <span className="online-dot"></span> {userRole}
            </div>
            <div className="profile-email">{user.email || ''}</div>
            <div className="profile-stats-row">
              <div className="profile-stat">
                <span className="num">0</span>
                <span className="lbl">Orders</span>
              </div>
              <div className="profile-stat">
                <span className="num">RM 0</span>
                <span className="lbl">Spent</span>
              </div>
              <div className="profile-stat">
                <span className="num">—</span>
                <span className="lbl">Rating</span>
              </div>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <div className="sidebar-nav reveal" ref={el => { revealRefs.current[1] = el; }}>
            {sidebarItems.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`sidebar-nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}
              >
                <div className="sn-icon"><i className={item.icon}></i></div>
                {item.label}
                <i className="fas fa-chevron-right sn-arrow"></i>
              </a>
            ))}
          </div>

          {/* Loyalty Card */}
          <div className="loyalty-card reveal" ref={el => { revealRefs.current[2] = el; }}>
            <div className="loyalty-header">
              <div className="loyalty-title">🏆 Loyalty Points</div>
              <div className="loyalty-badge">NEW</div>
            </div>
            <div className="loyalty-points">0</div>
            <div className="loyalty-sub">pts · Redeem for discounts</div>
            <div className="loyalty-bar-wrap">
              <div className="loyalty-bar" style={{ width: '0%' }}></div>
            </div>
            <div className="loyalty-info">
              <span>0 / 2,000 pts</span>
              <span>2,000 pts to Gold</span>
            </div>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="profile-main">
          {/* Personal Information */}
          <div className="section-card reveal" id="personal" ref={el => { revealRefs.current[3] = el; }}>
            <div className="section-hdr">
              <h3><i className="fas fa-user hdr-icon"></i> Personal Information</h3>
              {!isEditing ? (
                <a className="edit-link" onClick={handleToggleEdit}>
                  <i className="fas fa-pen"></i> Edit
                </a>
              ) : null}
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  className="form-input"
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  placeholder="First name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  className="form-input"
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  placeholder="Last name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  placeholder="Email address"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  className="form-input"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  placeholder="+60 XX-XXX XXXX"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Student / Staff ID</label>
                <input
                  className="form-input"
                  type="text"
                  value={formData.student_id}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label">Department / Faculty</label>
                <input
                  className="form-input"
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  placeholder="e.g. Faculty of Engineering"
                />
              </div>
              <div className="form-group full">
                <label className="form-label">Dietary Preferences</label>
                <select
                  className="form-select"
                  name="dietary"
                  value={formData.dietary}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option>No Restrictions</option>
                  <option>Vegetarian</option>
                  <option>Vegan</option>
                  <option>Halal Only</option>
                  <option>Gluten-Free</option>
                </select>
              </div>
            </div>
            {isEditing && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button className="btn-primary" onClick={handleSave}>
                  <i className="fas fa-save"></i> Save Changes
                </button>
                <button className="btn-ghost" onClick={handleCancel}>
                  <i className="fas fa-times"></i> Cancel
                </button>
              </div>
            )}
          </div>

          {/* Order History */}
          <div className="section-card reveal" id="orders" ref={el => { revealRefs.current[4] = el; }}>
            <div className="section-hdr">
              <h3><i className="fas fa-receipt hdr-icon"></i> Recent Orders</h3>
              <Link to="/orders" className="edit-link">
                <i className="fas fa-arrow-right"></i> View All
              </Link>
            </div>
            <div className="order-list">
              <div className="order-row">
                <div className="order-icon">🍽️</div>
                <div className="order-meta">
                  <div className="order-id">No orders yet</div>
                  <div className="order-items">Start ordering to see your history here</div>
                </div>
              </div>
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="section-card reveal" id="addresses" ref={el => { revealRefs.current[5] = el; }}>
            <div className="section-hdr">
              <h3><i className="fas fa-map-marker-alt hdr-icon"></i> Saved Addresses</h3>
              <a className="edit-link" onClick={() => showToast('Add Address', 'Open the address form to add a new location.')}>
                <i className="fas fa-plus"></i> Add New
              </a>
            </div>
            <div className="addr-grid">
              <div className="addr-card default">
                <div className="addr-default-badge">Default</div>
                <div className="addr-type"><span>🏛️</span> Faculty Block A</div>
                <div className="addr-detail">
                  Level 2, Room 204<br />
                  Faculty of Engineering<br />
                  Near Main Canteen
                </div>
              </div>
              <div className="addr-add" onClick={() => showToast('Add Address', 'New address form will open here.')}>
                <i className="fas fa-plus-circle"></i> Add New Address
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="section-card reveal" id="payment" ref={el => { revealRefs.current[6] = el; }}>
            <div className="section-hdr">
              <h3><i className="fas fa-credit-card hdr-icon"></i> Payment Methods</h3>
              <a className="edit-link" onClick={() => showToast('Add Payment', 'Link a new card or e-wallet.')}>
                <i className="fas fa-plus"></i> Add Method
              </a>
            </div>
            <div className="payment-list">
              <div className="payment-item primary-card">
                <div className="payment-logo visa">VISA</div>
                <div className="payment-info">
                  <div className="payment-name">Visa Debit •••• 4892</div>
                  <div className="payment-detail">Expires 09/27</div>
                </div>
                <span className="payment-primary-tag">Primary</span>
                <i className="fas fa-ellipsis-v payment-remove"></i>
              </div>
              <div className="payment-item">
                <div className="payment-logo grab">GrabPay</div>
                <div className="payment-info">
                  <div className="payment-name">GrabPay Wallet</div>
                  <div className="payment-detail">Balance: RM 48.20</div>
                </div>
                <i className="fas fa-trash payment-remove" onClick={() => showToast('Remove Wallet', 'GrabPay unlinked from your account.')}></i>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="section-card reveal" id="notifications" ref={el => { revealRefs.current[7] = el; }}>
            <div className="section-hdr">
              <h3><i className="fas fa-bell hdr-icon"></i> Notification Preferences</h3>
            </div>
            <div className="notif-list">
              <div className="notif-row">
                <div className="notif-info">
                  <span className="notif-icon">🛒</span>
                  <div>
                    <div className="notif-label">Order Updates</div>
                    <div className="notif-sub">Get notified when your order status changes</div>
                  </div>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={notifSettings.orderUpdates}
                    onChange={() => handleNotifToggle('orderUpdates')}
                  />
                  <div className="toggle-slider"></div>
                </label>
              </div>
              <div className="notif-row">
                <div className="notif-info">
                  <span className="notif-icon">🎁</span>
                  <div>
                    <div className="notif-label">Promotions & Offers</div>
                    <div className="notif-sub">Daily specials, discounts and new menu items</div>
                  </div>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={notifSettings.promotions}
                    onChange={() => handleNotifToggle('promotions')}
                  />
                  <div className="toggle-slider"></div>
                </label>
              </div>
              <div className="notif-row">
                <div className="notif-info">
                  <span className="notif-icon">💳</span>
                  <div>
                    <div className="notif-label">Payment Receipts</div>
                    <div className="notif-sub">Email receipt after every successful payment</div>
                  </div>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={notifSettings.paymentReceipts}
                    onChange={() => handleNotifToggle('paymentReceipts')}
                  />
                  <div className="toggle-slider"></div>
                </label>
              </div>
              <div className="notif-row">
                <div className="notif-info">
                  <span className="notif-icon">⭐</span>
                  <div>
                    <div className="notif-label">Loyalty Points</div>
                    <div className="notif-sub">Alerts when you earn or reach a new tier</div>
                  </div>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={notifSettings.loyaltyPoints}
                    onChange={() => handleNotifToggle('loyaltyPoints')}
                  />
                  <div className="toggle-slider"></div>
                </label>
              </div>
              <div className="notif-row">
                <div className="notif-info">
                  <span className="notif-icon">📣</span>
                  <div>
                    <div className="notif-label">Canteen Announcements</div>
                    <div className="notif-sub">Canteen closures, holiday hours and more</div>
                  </div>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={notifSettings.announcements}
                    onChange={() => handleNotifToggle('announcements')}
                  />
                  <div className="toggle-slider"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="section-card reveal" id="security" ref={el => { revealRefs.current[8] = el; }}>
            <div className="section-hdr">
              <h3><i className="fas fa-shield-alt hdr-icon"></i> Security Settings</h3>
            </div>
            <div className="security-list">
              <div className="security-item">
                <div className="security-icon ok"><i className="fas fa-lock"></i></div>
                <div className="security-text">
                  <div className="security-label">Password</div>
                  <div className="security-sub">Last changed recently</div>
                </div>
                <a className="security-action" onClick={() => showToast('Change Password', 'A password reset link will be sent to your email.')}>Change</a>
              </div>
              <div className="security-item">
                <div className="security-icon warn"><i className="fas fa-mobile-alt"></i></div>
                <div className="security-text">
                  <div className="security-label">Two-Factor Authentication</div>
                  <div className="security-sub">Not enabled — we recommend turning this on</div>
                </div>
                <a className="security-action" onClick={() => showToast('Enable 2FA', 'Two-factor authentication setup will begin.')}>Enable</a>
              </div>
              <div className="security-item">
                <div className="security-icon ok"><i className="fas fa-envelope"></i></div>
                <div className="security-text">
                  <div className="security-label">Email Verified</div>
                  <div className="security-sub">{user.email || ''}</div>
                </div>
                <span style={{ color: 'var(--mint)', fontSize: '0.8rem', fontWeight: 700 }}>
                  <i className="fas fa-check-circle"></i> Verified
                </span>
              </div>
              <div className="security-item">
                <div className="security-icon off"><i className="fas fa-fingerprint"></i></div>
                <div className="security-text">
                  <div className="security-label">Biometric Login</div>
                  <div className="security-sub">Use fingerprint or Face ID to log in faster</div>
                </div>
                <a className="security-action" onClick={() => showToast('Biometric Setup', 'Biometric login available on the mobile app.')}>Set Up</a>
              </div>
              <div className="security-item">
                <div className="security-icon ok"><i className="fas fa-history"></i></div>
                <div className="security-text">
                  <div className="security-label">Login History</div>
                  <div className="security-sub">View your recent login sessions</div>
                </div>
                <a className="security-action" onClick={() => showToast('Login History', 'Viewing all recent login sessions.')}>View All</a>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="danger-zone reveal" ref={el => { revealRefs.current[9] = el; }}>
            <div className="section-tag" style={{ color: '#ff6b6b' }}>Danger Zone</div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>Account Actions</h3>
            <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.45)', marginBottom: '20px', lineHeight: 1.7 }}>
              Deactivating or deleting your account is permanent. All your order history, saved addresses, and loyalty points will be lost. Please proceed with caution.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn-ghost" onClick={() => showToast('Account Deactivated', 'Your account has been deactivated. Contact support to reactivate.')}>
                <i className="fas fa-pause-circle"></i> Deactivate Account
              </button>
              <button className="btn-danger" onClick={() => showToast('Delete Account', 'A confirmation email has been sent to proceed with deletion.')}>
                <i className="fas fa-trash-alt"></i> Delete Account
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className="toast">
            <div className="t-icon">✅</div>
            <div className="t-text">
              <strong>{toast.title}</strong>
              <span>{toast.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
