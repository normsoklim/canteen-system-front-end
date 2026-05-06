import React, { useState } from 'react';

interface NavItem {
  id: string;
  icon: string;
  label: string;
  badge?: string | number;
  badgeColor?: string;
  badgeTextColor?: string;
  isExternal?: boolean;
}

interface Section {
  label: string;
  items: NavItem[];
}

interface AdminSidebarProps {
  activeSection?: string;
  onSectionChange?: (sectionId: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection = 'dashboard',
  onSectionChange,
}) => {
  const [activeNav, setActiveNav] = useState(activeSection);

  const handleNavClick = (sectionId: string) => {
    setActiveNav(sectionId);
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  };

  const sections: Section[] = [
    {
      label: 'Main',
      items: [
        { id: 'dashboard', icon: '📊', label: 'Dashboard' },
        { id: 'orders', icon: '🧾', label: 'Orders', badge: 5 },
        { id: 'menu-mgmt', icon: '🍽️', label: 'Menu Management' },
        { id: 'inventory', icon: '📦', label: 'Inventory', badge: 3, badgeColor: 'var(--gold)', badgeTextColor: '#000' }
      ],
    },
    {
      label: 'Reports',
      items: [
        { id: 'daily', icon: '📅', label: 'Daily Report' },
        { id: 'monthly', icon: '📆', label: 'Monthly Report' },
        { id: 'popular', icon: '🔥', label: 'Popular Items' },
        { id: 'staff', icon: '👥', label: 'Staff Performance' },
      ],
    },
    {
      label: 'System',
      items: [
        { id: 'settings', icon: '⚙️', label: 'Settings' },
        { id: 'back-to-site', icon: '🏠', label: 'Back to Site', isExternal: true },
      ],
    },
  ];

  const handleItemClick = (item: NavItem) => {
    if (item.isExternal) {
      window.location.href = 'index.html';
    } else {
      handleNavClick(item.id);
    }
  };

  return (
    <div className="admin-sidebar">
      {/* Logo */}
      <div className="admin-logo">
        Canteen<span>Go</span>
      </div>

      {/* Role Badge */}
      <div className="admin-role-badge">⚙️ Admin Panel</div>

      {/* Navigation Sections */}
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <div className="sidebar-section-label">{section.label}</div>
          <nav className="sidebar-nav">
            {section.items.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
                onClick={() => handleItemClick(item)}
              >
                <div className="ni-icon">{item.icon}</div>
                {item.label}
                {item.badge !== undefined && (
                  <span
                    className="nav-badge"
                    style={{
                      background: item.badgeColor || 'var(--saffron)',
                      color: item.badgeTextColor || '#fff',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      ))}

      {/* Profile Section */}
      <div className="admin-profile">
        <div className="profile-avatar">M</div>
        <div>
          <div className="profile-name">Mr. Muthu</div>
          <div className="profile-email">admin@canteengo.my</div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
