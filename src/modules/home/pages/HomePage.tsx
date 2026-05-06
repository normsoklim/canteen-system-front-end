import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../homepage.css";
import Navbar from "../../../components/common/Navbar/Page/Navbar";
import { fetchMenu, extractCategories } from "../../menu/menuService";
import type { Product, Category } from "../../../types/Product";
import { useAuth } from "../../auth/context/AuthContext";

const CATEGORY_ICONS: Record<string, string> = {
  rice: "🍚",
  noodle: "🍜",
  snack: "🥐",
  drink: "🥤",
  dessert: "🍮",
  soup: "🍲",
  default: "🍴",
};

function getCategoryIcon(name: string): string {
  const key = name.toLowerCase();
  for (const [pattern, icon] of Object.entries(CATEGORY_ICONS)) {
    if (pattern !== "default" && key.includes(pattern)) return icon;
  }
  return CATEGORY_ICONS.default;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [menuItems, setMenuItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [toasts, setToasts] = useState<
    { id: number; title: string; message: string }[]
  >([]);
  const toastId = useRef(0);

  // Fetch menu from the real API
  const loadMenu = useCallback(async () => {
    try {
      setMenuLoading(true);
      const data = await fetchMenu();
      setMenuItems(data);
      setCategories(extractCategories(data));
    } catch (err) {
      console.error("Failed to fetch menu for homepage:", err);
    } finally {
      setMenuLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  // Scroll reveal functionality
  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Count up animation for stats
  useEffect(() => {
    const countUp = (el: HTMLElement, target: number) => {
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent =
          Math.round(current) + (target === 98 ? "%" : target === 5 ? "" : "+");
        if (current >= target) clearInterval(timer);
      }, 25);
    };

    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = parseInt(
              entry.target.getAttribute("data-count") || "0"
            );
            countUp(entry.target as HTMLElement, target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll("[data-count]").forEach((el) => {
      statObserver.observe(el);
    });

    return () => {
      document.querySelectorAll("[data-count]").forEach((el) => {
        statObserver.unobserve(el);
      });
    };
  }, []);

  const addToCart = (name: string, price: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const newToast = {
      id: toastId.current++,
      title: "Added to Cart",
      message: `${name} · RM ${price.toFixed(2)}`,
    };

    setToasts((prev) => [...prev, newToast]);

    // Remove toast after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 3500);
  };

  const filterMenu = (category: string) => {
    setActiveTab(category);
  };

  const filteredMenuItems =
    activeTab === "all"
      ? menuItems
      : menuItems.filter((item) => item.category.name.toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <div className="app">
    <Navbar />

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-bg"></div>
        <div className="hero-grid"></div>
        <div className="hero-content-home">
          <div className="hero-badge">
            <span className="dot"></span> Now Live — Order in seconds
          </div>
          <h1 className="hero-title">
            Smart Canteen<span className="accent">Ordering Made</span>Delicious
          </h1>
          <p className="hero-sub">
            Skip the queue. Scan, order, pay — your meal is ready when you are.
            The fastest way to enjoy canteen food without the wait.
          </p>
          <div className="hero-actions">
            <Link to="/menu" className="btn-hero-primary">
              <i className="fas fa-utensils"></i> Browse Menu
            </Link>
            <Link to="/orders" className="btn-hero-secondary">
              <i className="fas fa-qrcode"></i> Scan & Order
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card-stack">
            <div className="food-card">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop"
                alt="Healthy Bowl"
              />
            </div>
            <div className="food-card">
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop"
                alt="Pizza"
              />
            </div>
            <div className="food-card">
              <img
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop"
                alt="Salad"
              />
            </div>
            <div className="order-pill">
              <div className="icon">✅</div>
              <div className="text">
                <strong>Order #1082 Ready!</strong>
                <span>Chicken Rice · RM 8.50</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats">
        <div className="stat-item reveal">
          <div className="stat-num" data-count="2400">
            0
          </div>
          <div className="stat-label">Orders / Day</div>
        </div>
        <div className="stat-item reveal">
          <div className="stat-num" data-count="150">
            0
          </div>
          <div className="stat-label">Menu Items</div>
        </div>
        <div className="stat-item reveal">
          <div className="stat-num" data-count="98">
            0
          </div>
          <div className="stat-label">% Satisfaction</div>
        </div>
        <div className="stat-item reveal">
          <div className="stat-num" data-count="5">
            0
          </div>
          <div className="stat-label">Min Avg Wait Time</div>
        </div>
      </div>

       {/* MENU PREVIEW */}
       <section className="menu-preview" id="menu">
        <div className="section-tag">Today's Selection</div>
        <h2 className="section-title">Popular Menu Items</h2>
        <div className="menu-tabs">
          <button
            className={`menu-tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => filterMenu("all")}
          >
            All Items
          </button>
          {categories.map((cat) => {
            const key = cat.name.toLowerCase();
            return (
              <button
                key={cat.id}
                className={`menu-tab ${activeTab === key ? "active" : ""}`}
                onClick={() => filterMenu(key)}
              >
                {getCategoryIcon(cat.name)} {cat.name}
              </button>
            );
          })}
        </div>
        <div className="menu-grid" id="menuGrid">
          {menuLoading ? (
            <p style={{ color: "rgba(255,255,255,.5)", textAlign: "center", padding: "40px" }}>
              Loading menu items…
            </p>
          ) : filteredMenuItems.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,.5)", textAlign: "center", padding: "40px" }}>
              No items found.
            </p>
          ) : (
            filteredMenuItems.map((item) => (
              <div className="menu-item" key={item.id} data-cat={item.category.name}>
                <div className="menu-img">
                  {item.image ? (
                    <img src={item.image} alt={item.name} loading="lazy" />
                  ) : (
                    <div className="placeholder-img"><span>No Image</span></div>
                  )}
                  {item.tag && <span className="menu-badge">{item.tag === "popular" ? "Popular" : item.tag === "new" ? "New" : item.tag}</span>}
                  {!item.isAvailable && <span className="menu-badge" style={{ background: "rgba(255,0,0,.7)" }}>Sold Out</span>}
                </div>
                <div className="menu-info">
                  <div className="menu-name">{item.name}</div>
                  <div className="menu-cat">{item.category.name}</div>
                  <div className="menu-footer">
                    <span className="menu-price">RM {item.price.toFixed(2)}</span>
                    {item.isAvailable && (
                      <button
                        className="add-btn"
                        onClick={() => addToCart(item.name, item.price)}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <Link
            to="/menu"
            className="btn-hero-primary"
            style={{ display: "inline-flex" }}
          >
            <i className="fas fa-th-large"></i> View Full Menu
          </Link>
        </div>
      </section>
      
      {/* FEATURES */}
      <section className="features" id="features">
        <div className="section-tag">Why CanteenGo</div>
        <h2 className="section-title">
          Everything You Need,
          <br />
          Nothing You Don't
        </h2>
        <div className="features-grid">
          <div className="feat-card reveal">
            <div className="feat-icon">🔐</div>
            <div className="feat-title">Secure Login & Roles</div>
            <div className="feat-desc">
              Admin, Staff, and Customer roles with protected access. Your data
              stays safe and organized.
            </div>
          </div>
          <div className="feat-card reveal">
            <div className="feat-icon">📱</div>
            <div className="feat-title">QR Code Ordering</div>
            <div className="feat-desc">
              Scan the table QR code, browse the menu, add to cart and checkout
              — all from your phone.
            </div>
          </div>
          <div className="feat-card reveal">
            <div className="feat-icon">🛒</div>
            <div className="feat-title">Smart Cart System</div>
            <div className="feat-desc">
              Add, remove, update quantities. Auto-calculated totals with tax
              and service charge included.
            </div>
          </div>
          <div className="feat-card reveal">
            <div className="feat-icon">💳</div>
            <div className="feat-title">Flexible Payments</div>
            <div className="feat-desc">
              Pay with cash or digital methods. Instant receipt generation with
              payment status tracking.
            </div>
          </div>
          <div className="feat-card reveal">
            <div className="feat-icon">📊</div>
            <div className="feat-title">Powerful Reports</div>
            <div className="feat-desc">
              Daily and monthly sales reports, top menu items, exportable data —
              for smarter decisions.
            </div>
          </div>
          <div className="feat-card reveal">
            <div className="feat-icon">🚀</div>
            <div className="feat-title">Real-Time Tracking</div>
            <div className="feat-desc">
              Live order status updates from Pending → Preparing → Ready. Always
              know where your food is.
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how" id="how-it-works">
        <div className="section-tag">Simple Process</div>
        <h2 className="section-title">Order in 4 Easy Steps</h2>
        <div className="steps">
          <div className="step reveal">
            <div className="step-num">1</div>
            <div className="step-title">Scan QR Code</div>
            <div className="step-desc">
              Scan the QR code at your table or counter to open the menu
              instantly.
            </div>
          </div>
          <div className="step reveal">
            <div className="step-num">2</div>
            <div className="step-title">Choose Your Meal</div>
            <div className="step-desc">
              Browse categories, view details, add favorites to your cart.
            </div>
          </div>
          <div className="step reveal">
            <div className="step-num">3</div>
            <div className="step-title">Pay Securely</div>
            <div className="step-desc">
              Cash or digital. Confirm order and get your receipt instantly.
            </div>
          </div>
          <div className="step reveal">
            <div className="step-num">4</div>
            <div className="step-title">Pick Up & Enjoy</div>
            <div className="step-desc">
              Get notified when ready. Pick up your order and enjoy your meal!
            </div>
          </div>
        </div>
      </section>
      {/* QR SECTION */}
      <section className="qr-section" id="qr-section">
        <div className="qr-inner">
          <div>
            <div className="section-tag">Quick Access</div>
            <h2 className="section-title">
              Order from Anywhere
              <br />
              with a Simple Scan
            </h2>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.55)",
                lineHeight: "1.8",
                marginBottom: "32px",
              }}
            >
              Each table has its own unique QR code. Students and staff can scan
              and order without needing to queue. Available 24/7 during canteen
              operating hours.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Link to="/orders" className="btn-hero-primary">
                <i className="fas fa-qrcode"></i> Generate My QR
              </Link>
              <Link to="/menu" className="btn-hero-secondary">
                <i className="fas fa-list"></i> Browse Menu First
              </Link>
            </div>
          </div>
          <div className="qr-box reveal">
            <div className="qr-title">Table QR Code</div>
            <p
              style={{
                fontSize: "0.8rem",
                color: "rgba(255, 255, 255, 0.4)",
                marginBottom: "20px",
              }}
            >
              Scan to order from Table 5
            </p>
            <div className="qr-code-display">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://canteengo.app/order?table=5&color=1C1C1E&bgcolor=FFFFFF"
                alt="QR Code Table 5"
              />
            </div>
            <div className="qr-label">📍 Canteen Block A · Table 5</div>
            <div
              style={{
                marginTop: "20px",
                padding: "12px 20px",
                background: "rgba(0, 201, 167, 0.1)",
                border: "1px solid rgba(0, 201, 167, 0.2)",
                borderRadius: "12px",
                fontSize: "0.85rem",
                color: "var(--mint)",
              }}
            >
              <i className="fas fa-clock"></i> Operating: 7:00 AM – 8:00 PM
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials" id="testimonials">
        <div className="section-tag">What People Say</div>
        <h2 className="section-title">Loved by Students & Staff</h2>
        <div className="test-grid">
          <div className="test-card reveal">
            <div className="stars">★★★★★</div>
            <p className="test-text">
              "No more long queues during lunch hour! I scan, order, and my food
              is ready when I get there. Absolute game changer for busy
              students."
            </p>
            <div className="test-author">
              <div className="test-avatar">A</div>
              <div>
                <div className="test-name">Ahmad Razif</div>
                <div className="test-role">Engineering Student</div>
              </div>
            </div>
          </div>
          <div className="test-card reveal">
            <div className="stars">★★★★★</div>
            <p className="test-text">
              "As a canteen staff, managing orders is so much easier. The system
              updates automatically and we never miss an order. Staff love it!"
            </p>
            <div className="test-author">
              <div className="test-avatar">S</div>
              <div>
                <div className="test-name">Siti Aminah</div>
                <div className="test-role">Canteen Staff</div>
              </div>
            </div>
          </div>
          <div className="test-card reveal">
            <div className="stars">★★★★☆</div>
            <p className="test-text">
              "The reports feature helps me track which items sell best each
              day. I can plan stock better and reduce waste. Very useful
              system."
            </p>
            <div className="test-author">
              <div className="test-avatar">M</div>
              <div>
                <div className="test-name">Mr. Muthu</div>
                <div className="test-role">Canteen Admin</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta" id="cta">
        <div className="section-tag" style={{ marginBottom: "24px" }}>
          Get Started Today
        </div>
        <h2 className="cta-title">
          Ready to Transform
          <br />
          Your
          <span style={{ color: "var(--saffron)" }}>Canteen Experience?</span>
        </h2>
        <p className="cta-sub">
          Join thousands of satisfied users. Set up takes less than 5 minutes.
        </p>
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
            position: "relative",
          }}
        >
          <Link
            to="/login"
            className="btn-hero-primary"
            style={{ fontSize: "1.1rem", padding: "18px 48px" }}
          >
            <i className="fas fa-rocket"></i> Get Started Free
          </Link>
          <Link
            to="/orders"
            className="btn-hero-secondary"
            style={{ fontSize: "1.1rem", padding: "18px 48px" }}
          >
            <i className="fas fa-play-circle"></i> See Live Demo
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div>
            <div className="footer-brand">CanteenGo</div>
            <p className="footer-desc">
              Smart canteen ordering system built for schools, universities, and
              offices. Fast, reliable, and easy to use.
            </p>
            <div className="social-links" style={{ marginTop: "24px" }}>
              <a href="#" className="social-link">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h5>Navigation</h5>
            <Link to="/menu">Menu</Link>
            <Link to="/orders">Place Order</Link>
            <Link to="/tracks">Track Order</Link>
            <Link to="/reports">Reports</Link>
            <Link to="/about">About</Link>
          </div>
          <div className="footer-col">
            <h5>Account</h5>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/settings">Settings</Link>
          </div>
          <div className="footer-col">
            <h5>Contact</h5>
            <a href="tel:+60123456789">📞 +60 12-345 6789</a>
            <a href="mailto:hello@canteengo.my">✉️ hello@canteengo.my</a>
            <a href="#">📍 Block A, Level 1</a>
            <a href="#">⏰ 7AM – 8PM Daily</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2024 CanteenGo. All rights reserved.</span>
          <span>Built with ❤️ for smarter canteens</span>
        </div>
      </footer>

      {/* TOAST CONTAINER */}
      <div className="toast-container" id="toastContainer">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            <div className="t-icon">🛒</div>
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

export default HomePage;
