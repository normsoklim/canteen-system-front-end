import React, { useEffect } from "react";
import "./Delivery.css";
import { Link } from "react-router-dom";

const DeliveryPage: React.FC = () => {
  // Intersection Observer for reveal animations
  useEffect(() => {
    const initObserver = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
            }
          });
        },
        { threshold: 0.12 }
      );

      // Find all reveal elements and observe them
      const reveals = document.querySelectorAll(".reveal");
      reveals.forEach((reveal) => observer.observe(reveal));

      // Store observer instance to allow cleanup
      (window as any).__deliveryPageObserver = observer;

      return () => {
        reveals.forEach((reveal) => observer.unobserve(reveal));
        observer.disconnect();
      };
    };

    // Initialize observer after a small delay to ensure DOM is ready
    const timer = setTimeout(initObserver, 100);

    return () => {
      clearTimeout(timer);
      // Clean up any existing observer
      if ((window as any).__deliveryPageObserver) {
        (window as any).__deliveryPageObserver.disconnect();
        delete (window as any).__deliveryPageObserver;
      }
    };
  }, []);
  return (
    <div className="delivery-page">
      <nav>
        <Link to="/" className="nav-logo">
          Canteen<span>Go</span>
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/menu">Menu</Link>
          </li>
          <li>
            <Link to="/orders">Order</Link>
          </li>
          <li>
            <Link to="/tracks">Track</Link>
          </li>
          <li>
            <Link to="/delivery" className="active">
              Delivery
            </Link>
          </li>
          <li>
            <Link to="/reports">Reports</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
        <div className="nav-cta">
          <Link to="/login" className="btn-nav btn-outline">
            Login
          </Link>
          <Link to="/register" className="btn-nav btn-fill">
            Sign Up Free
          </Link>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="delivery-hero">
        <div className="hero-grid"></div>
        <div className="hero-inner">
          <div>
            <div className="section-tag">Campus Delivery</div>
            <h1 className="hero-title">
              Food Delivered
              <br />
              <span className="hero-title-accent">Right to You</span>
            </h1>
            <p className="hero-sub">
              Order from the canteen and get your meal delivered anywhere on
              campus - classrooms, offices, or dorms. No more missed lunches.
            </p>
            <div className="hero-actions">
              <Link to="/orders" className="btn-primary">
                <i className="fas fa-motorcycle"></i> Order Delivery
              </Link>
              <a href="#zones" className="btn-secondary">
                <i className="fas fa-map-marker-alt"></i> Check Coverage
              </a>
            </div>
          </div>
          <div className="status-visual">
            <div className="float-badge">
              <span className="pulse-dot"></span> 3 riders active now
            </div>
            <div className="delivery-card">
              <div className="dc-label">Live Delivery Status</div>
              <div className="rider-row">
                <div className="rider-avatar">🏎️</div>
                <div className="rider-info">
                  <strong>Hafiz Rahman</strong>
                  <span>Your rider - On the way</span>
                </div>
                <div className="rider-rating">
                  <i className="fas fa-star"></i> 4.9
                </div>
              </div>
              <div className="map-placeholder">
                <div className="map-dots"></div>
                <div className="map-route"></div>
                <div className="map-pin start">🏪</div>
                <div className="map-pin end">📍</div>
                <div className="map-label">
                  Canteen Block A to Block D, Level 2
                </div>
              </div>
              <div className="dc-stats">
                <div className="dc-stat">
                  <div className="dc-stat-val">8 min</div>
                  <div className="dc-stat-lbl">ETA</div>
                </div>
                <div className="dc-stat">
                  <div className="dc-stat-val">0.6 km</div>
                  <div className="dc-stat-lbl">Distance</div>
                </div>
                <div className="dc-stat">
                  <div className="dc-stat-val">RM 1.50</div>
                  <div className="dc-stat-lbl">Delivery Fee</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="delivery-option">
        <div className="section-tag">Choose Your Plan</div>
        <h2 className="how-delivery-title">
          Delivery Options
          <br />
          That Fit Your Day
        </h2>
        <div className="options-grid">
          <div className="option-card reveal">
            <div className="option-icon">⚡</div>
            <div className="option-title">Express Delivery</div>
            <div className="option-desc">
              Fastest option available. Your order is prioritised and a
              dedicated rider is assigned immediately. Ideal for tight
              schedules.
            </div>
            <div className="option-price">RM 2.50</div>
            <div className="option-time">
              <i className="fas fa-clock"></i> &nbsp;Arrives in 10-15 min
            </div>
          </div>
          <div className="option-card featured reveal">
            <div className="option-badge">Most Popular</div>
            <div className="option-icon">🛴</div>
            <div className="option-title">Standard Delivery</div>
            <div className="option-desc">
              The best balance of speed and value. Riders are pooled for nearby
              orders and delivery is still quick and reliable.
            </div>
            <div className="option-price">RM 1.50</div>
            <div className="option-time">
              <i className="fas fa-clock"></i> &nbsp;Arrives in 15-25 min
            </div>
          </div>
          <div className="option-card reveal">
            <div className="option-icon">📅</div>
            <div className="option-title">Scheduled Delivery</div>
            <div className="option-desc">
              Plan ahead - order up to 2 hours in advance and choose your
              preferred delivery window. Perfect for lunch meetings.
            </div>
            <div className="option-price">RM 1.50</div>
            <div className="option-time">
              <i className="fas fa-clock"></i> &nbsp;Choose your time slot
            </div>
          </div>
        </div>
      </section>

      {/* How Delivery Works */}
      <section className="how-delivery">
        <div className="section-tag">Simple Process</div>
        <h2 className="how-delivery-title">How Delivery Works</h2>
        <div className="steps-row">
          <div className="step reveal">
            <div className="step-num">1</div>
            <div className="step-title">Place Your Order</div>
            <div className="step-desc">
              Browse the menu and add items to your cart. Select Delivery at
              checkout.
            </div>
          </div>
          <div className="step reveal">
            <div className="step-num">2</div>
            <div className="step-title">Set Drop Location</div>
            <div className="step-desc">
              Enter your block, room, or choose from saved campus locations.
            </div>
          </div>
          <div className="step reveal">
            <div className="step-num">3</div>
            <div className="step-title">Rider Assigned</div>
            <div className="step-desc">
              A nearby rider picks up your fresh order from the canteen.
            </div>
          </div>
          <div className="step reveal">
            <div className="step-num">4</div>
            <div className="step-title">Live Tracking</div>
            <div className="step-desc">
              Watch your rider in real-time and get push notifications.
            </div>
          </div>
          <div className="step reveal">
            <div className="step-num">5</div>
            <div className="step-title">Delivered!</div>
            <div className="step-desc">
              Receive your meal, enjoy, and rate your rider.
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Zones */}
      <section className="zones" id="zones">
        <div className="section-tag">Coverage Area</div>
        <h2 className="zones-title">Where We Deliver</h2>
        <p className="zones-subtitle">
          All campus buildings covered during canteen operating hours.
        </p>
        <div className="zones-grid">
          <div className="zone-list">
            <div className="zone-item reveal">
              <div className="zone-icon green">🏫</div>
              <div className="zone-info">
                <strong>Academic Blocks (A-F)</strong>
                <span>Classrooms, labs, lecture halls</span>
              </div>
              <div className="zone-status active"></div>
              <div className="zone-eta">~10 min</div>
            </div>
            <div className="zone-item reveal">
              <div className="zone-icon green">🏢</div>
              <div className="zone-info">
                <strong>Admin & Staff Offices</strong>
                <span>All office levels and wings</span>
              </div>
              <div className="zone-status active"></div>
              <div className="zone-eta">~12 min</div>
            </div>
            <div className="zone-item reveal">
              <div className="zone-icon orange">🏠</div>
              <div className="zone-info">
                <strong>Student Dormitories</strong>
                <span>Blocks Dahlia, Erica, Frangipani</span>
              </div>
              <div className="zone-status busy"></div>
              <div className="zone-eta">~18 min</div>
            </div>
            <div className="zone-item reveal">
              <div className="zone-icon green">📚</div>
              <div className="zone-info">
                <strong>Library & Study Halls</strong>
                <span>Main library, resource centre</span>
              </div>
              <div className="zone-status active"></div>
              <div className="zone-eta">~8 min</div>
            </div>
            <div className="zone-item reveal">
              <div className="zone-icon orange">🏋️</div>
              <div className="zone-info">
                <strong>Sports Complex</strong>
                <span>Courts, gym, swimming pool area</span>
              </div>
              <div className="zone-status busy"></div>
              <div className="zone-eta">~20 min</div>
            </div>
            <div className="zone-item reveal">
              <div className="zone-icon green">🔬</div>
              <div className="zone-info">
                <strong>Research Centre</strong>
                <span>Labs, innovation hub, maker space</span>
              </div>
              <div className="zone-status active"></div>
              <div className="zone-eta">~14 min</div>
            </div>
          </div>
          <div className="map-visual reveal">
            <h4 className="map-visual-title">Campus Coverage Map</h4>
            <div className="map-visual-inner">
              <div className="map-bg"></div>
              <div className="coverage-ring"></div>
              <div className="coverage-ring"></div>
              <div className="coverage-ring"></div>
              <div className="map-center">
                <span className="map-center-icon">🏪</span>
                <div className="map-center-text">Canteen Block A</div>
              </div>
            </div>
            <div className="map-legend">
              <div className="map-legend-item">
                <div className="map-legend-color map-legend-color--mint"></div>
                Zone 1 (Active)
              </div>
              <div className="map-legend-item">
                <div className="map-legend-color map-legend-color--gold"></div>
                Zone 2 (Busy)
              </div>
              <div className="map-legend-item">
                <div className="map-legend-color map-legend-color--saffron"></div>
                Zone 3 (Extended)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Schedule */}
      <section className="schedule">
        <div className="section-tag">Operating Hours</div>
        <h2 className="schedule-title">Delivery Schedule</h2>
        <div className="schedule-grid">
          <div className="sched-card reveal">
            <div className="sched-time">07:00 - 10:00</div>
            <div className="sched-name">Breakfast Rush</div>
            <div className="sched-desc">
              Hot breakfast items, sandwiches, and drinks. Schedule ahead for a
              guaranteed slot during peak hours.
            </div>
            <div className="sched-tags">
              <span className="sched-tag">Nasi Lemak</span>
              <span className="sched-tag">Toast Set</span>
              <span className="sched-tag">Teh Tarik</span>
            </div>
          </div>
          <div className="sched-card reveal">
            <div className="sched-time">11:00 - 14:00</div>
            <div className="sched-name">Lunch Window</div>
            <div className="sched-desc">
              Full menu available. Rice, noodles, grills, and beverages. Our
              busiest delivery period of the day.
            </div>
            <div className="sched-tags">
              <span className="sched-tag">Full Menu</span>
              <span className="sched-tag">Combo Deals</span>
              <span className="sched-tag">Set Lunch</span>
            </div>
          </div>
          <div className="sched-card reveal">
            <div className="sched-time">15:00 - 20:00</div>
            <div className="sched-name">Evening Delivery</div>
            <div className="sched-desc">
              Snacks, light meals, and drinks for study sessions. Dorm
              deliveries most active during this window.
            </div>
            <div className="sched-tags">
              <span className="sched-tag">Snacks</span>
              <span className="sched-tag">Desserts</span>
              <span className="sched-tag">Cold Drinks</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="section-tag cta-tag">Ready to Order?</div>
        <h2 className="cta-title">
          Get Your Meal
          <br />
          <span className="cta-accent">Delivered Today</span>
        </h2>
        <p className="cta-sub">
          No app download required. Just scan, order, and we'll bring it to you.
        </p>
        <div className="cta-actions">
          <Link to="/orders" className="btn-primary btn-primary-large">
            <i className="fas fa-motorcycle"></i> Order Now
          </Link>
          <Link to="/menu" className="btn-secondary btn-secondary-large">
            <i className="fas fa-utensils"></i> Browse Menu
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-grid">
          <div>
            <div className="footer-brand">CanteenGo</div>
            <p className="footer-desc">
              Smart canteen ordering system built for schools, universities, and
              offices. Fast, reliable, and easy to use.
            </p>
            <div className="social-links">
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
            <Link to="/delivery">Delivery</Link>
            <Link to="/reports">Reports</Link>
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
            <a href="#">+60 12-345 6789</a>
            <a href="#">hello@canteengo.app</a>
            <a href="#">Block A, Level 1</a>
            <a href="#">7AM - 8PM Daily</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>2024 CanteenGo. All rights reserved.</span>
          <span>Built with love for smarter canteens</span>
        </div>
      </footer>
    </div>
  );
};

export default DeliveryPage;
