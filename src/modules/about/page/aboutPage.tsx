import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './about.css';

const AboutPage: React.FC = () => {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Function to handle contact form submission
  const handleContact = () => {
    const btn = document.querySelector('.form-btn') as HTMLElement;
    if (btn) {
      btn.innerHTML = '<i class="fas fa-check"></i> &nbsp;Message Sent!';
      btn.style.background = 'var(--mint)';
      btn.style.color = '#000';
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> &nbsp;Send Message';
        btn.style.background = '';
        btn.style.color = '';
      }, 3000);
    }
  };

  // Function to animate stats when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsVisible(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  // Function to animate counter
  const animateCounter = (element: HTMLElement, target: number) => {
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      element.textContent = Math.round(current) + (target === 98 ? '%' : '+');
      if (current >= target) clearInterval(timer);
    }, 25);
  };

  // Reveal animation for elements
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    reveals.forEach((reveal) => observer.observe(reveal));

    return () => {
      reveals.forEach((reveal) => observer.unobserve(reveal));
    };
  }, []);

  return (
    <div className="about-page">
      {/* Navigation */}
      <nav>
        <Link to="/" className="nav-logo">
          Canteen<span>Go</span>
        </Link>
        <ul className="nav-links">
          <li><Link to="/menu">Menu</Link></li>
          <li><Link to="/orders">Order</Link></li>
          <li><Link to="/tracks">Track</Link></li>
          <li><Link to="/delivery">Delivery</Link></li>
          <li><Link to="/reports">Reports</Link></li>
          <li><Link to="/about" className="active">About</Link></li>
        </ul>
        <div className="nav-cta">
          <Link to="/login" className="btn-nav btn-outline">Login</Link>
          <Link to="/register" className="btn-nav btn-fill">Sign Up Free</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-grid"></div>
        <div className="hero-content">
          <div className="section-tag">Our Story</div>
          <h1 className="hero-title">
            Built for Canteens,<br /><span className="accent">Loved by Everyone</span>
          </h1>
          <p className="hero-sub">
            CanteenGo was born from a simple frustration: long queues, missed
            meals, and wasted time. We set out to fix that with smart technology
            that makes canteen ordering effortless for everyone.
          </p>
          <div className="hero-actions">
            <Link to="/orders" className="btn-primary">
              <i className="fas fa-utensils"></i> Try It Now
            </Link>
            <a href="#team" className="btn-secondary">
              <i className="fas fa-users"></i> Meet the Team
            </a>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission">
        <div className="mission-visual reveal">
          <div className="mission-quote">
            "Every student deserves a
            <span className="hl">fast, stress-free</span> lunch break - not a queue."
          </div>
          <div className="mission-author">
            <div className="author-avatar">A</div>
            <div>
              <div className="author-name">Ahmad Zulkifli</div>
              <div className="author-role">Co-Founder & CEO</div>
            </div>
          </div>
        </div>
        <div className="mission-text reveal">
          <div className="section-tag">Our Mission</div>
          <h2>Transforming How Campuses Eat</h2>
          <p>
            We believe that technology should work quietly in the background -
            letting people focus on what matters: great food, good company, and a
            proper break from the day.
          </p>
          <p>
            CanteenGo connects canteen operators and their customers through a
            seamless digital platform. From ordering to delivery, every step is
            designed to be faster, smarter, and more enjoyable.
          </p>
          <p>
            Today we serve thousands of students and staff across multiple
            institutions, and we are just getting started.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <div className="stats-band" ref={statsRef}>
        <div className="stat-box reveal">
          <div className="stat-num" data-count="2400">{statsVisible ? '2400+' : '0'}</div>
          <div className="stat-label">Daily Orders</div>
        </div>
        <div className="stat-box reveal">
          <div className="stat-num" data-count="12">{statsVisible ? '12' : '0'}</div>
          <div className="stat-label">Campuses Served</div>
        </div>
        <div className="stat-box reveal">
          <div className="stat-num" data-count="98">{statsVisible ? '98%' : '0'}</div>
          <div className="stat-label">Satisfaction Rate</div>
        </div>
        <div className="stat-box reveal">
          <div className="stat-num" data-count="5">{statsVisible ? '5' : '0'}</div>
          <div className="stat-label">Min Avg Wait Time</div>
        </div>
      </div>

      {/* Values Section */}
      <section className="values">
        <div className="section-tag">What Drives Us</div>
        <h2
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(2rem, 3vw, 2.8rem)',
            fontWeight: 900,
            lineHeight: 1.2,
          }}
        >
          Our Core Values
        </h2>
        <div className="values-grid">
          <div className="value-card reveal">
            <div className="value-icon">⚡</div>
            <div className="value-title">Speed First</div>
            <div className="value-desc">
              Every second counts at lunchtime. We obsess over performance to
              ensure orders are placed, processed, and fulfilled as fast as
              possible.
            </div>
          </div>
          <div className="value-card reveal">
            <div className="value-icon">🤝</div>
            <div className="value-title">People-Centred</div>
            <div className="value-desc">
              We design for real people - hungry students, busy staff, and
              hardworking canteen operators. Their experience is our north star.
            </div>
          </div>
          <div className="value-card reveal">
            <div className="value-icon">🔒</div>
            <div className="value-title">Trust & Safety</div>
            <div className="value-desc">
              Secure payments, role-based access, and encrypted data. We take our
              users privacy and safety seriously at every level.
            </div>
          </div>
          <div className="value-card reveal">
            <div className="value-icon">📊</div>
            <div className="value-title">Data-Driven</div>
            <div className="value-desc">
              Our analytics help canteen operators make smarter decisions - from
              stock planning to menu optimisation and revenue tracking.
            </div>
          </div>
          <div className="value-card reveal">
            <div className="value-icon">♻️</div>
            <div className="value-title">Sustainability</div>
            <div className="value-desc">
              By reducing food waste through smart forecasting and paperless
              receipts, we help canteens operate more responsibly.
            </div>
          </div>
          <div className="value-card reveal">
            <div className="value-icon">🚀</div>
            <div className="value-title">Constant Growth</div>
            <div className="value-desc">
              We ship updates regularly, listen to feedback, and improve our
              product every week. Good is never good enough.
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team" id="team">
        <div className="section-tag">The People Behind It</div>
        <h2
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(2rem, 3vw, 2.8rem)',
            fontWeight: 900,
          }}
        >
          Meet the Team
        </h2>
        <div className="team-grid">
          <div className="team-card reveal">
            <div
              className="team-avatar"
              style={{
                background: 'linear-gradient(135deg, var(--saffron), var(--gold))',
              }}
            >
              AZ
            </div>
            <div className="team-name">Ahmad Zulkifli</div>
            <div className="team-role">Co-Founder / CEO</div>
            <div className="team-bio">
              Computer Science graduate with a passion for building tools that
              solve everyday problems on campus.
            </div>
            <div className="team-links">
              <a href="#" className="team-link"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="team-link"><i className="fab fa-github"></i></a>
            </div>
          </div>
          <div className="team-card reveal">
            <div
              className="team-avatar"
              style={{ background: 'linear-gradient(135deg, var(--mint), #007a65)' }}
            >
              NR
            </div>
            <div className="team-name">Nurul Rashidah</div>
            <div className="team-role">Lead Designer</div>
            <div className="team-bio">
              UI/UX specialist focused on creating interfaces that feel natural
              and effortless for every type of user.
            </div>
            <div className="team-links">
              <a href="#" className="team-link"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="team-link"><i className="fab fa-dribbble"></i></a>
            </div>
          </div>
          <div className="team-card reveal">
            <div
              className="team-avatar"
              style={{ background: 'linear-gradient(135deg, #6c63ff, #3f3cbb)' }}
            >
              RS
            </div>
            <div className="team-name">Rajan Subramaniam</div>
            <div className="team-role">Backend Engineer</div>
            <div className="team-bio">
              Systems architect who built the real-time order engine and payment
              infrastructure from the ground up.
            </div>
            <div className="team-links">
              <a href="#" className="team-link"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="team-link"><i className="fab fa-github"></i></a>
            </div>
          </div>
          <div className="team-card reveal">
            <div
              className="team-avatar"
              style={{ background: 'linear-gradient(135deg, var(--gold), #c8860a)' }}
            >
              SY
            </div>
            <div className="team-name">Siti Yuhanis</div>
            <div className="team-role">Operations Lead</div>
            <div className="team-bio">
              Bridges the gap between product and canteen partners, ensuring
              smooth onboarding and daily operations.
            </div>
            <div className="team-links">
              <a href="#" className="team-link"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="team-link"><i className="fab fa-twitter"></i></a>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="section-tag">How We Got Here</div>
        <h2
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(2rem, 3vw, 2.8rem)',
            fontWeight: 900,
            textAlign: 'center',
          }}
        >
          Our Journey
        </h2>
        <div className="timeline">
          <div className="tl-item reveal">
            <div className="tl-content">
              <div className="tl-year">2022 - Q1</div>
              <div className="tl-title">The Idea</div>
              <div className="tl-desc">
                After missing too many lunches waiting in queue, Ahmad and Nurul
                sketched the first wireframes of CanteenGo on a napkin.
              </div>
            </div>
            <div className="tl-dot"></div>
            <div
              className="tl-content"
              style={{ background: 'transparent', border: 'none' }}
            ></div>
          </div>
          <div className="tl-item reveal">
            <div
              className="tl-content"
              style={{ background: 'transparent', border: 'none' }}
            ></div>
            <div className="tl-dot"></div>
            <div className="tl-content">
              <div className="tl-year">2022 - Q3</div>
              <div className="tl-title">First Prototype</div>
              <div className="tl-desc">
                A working MVP was tested at UTM canteen with 50 students. Orders
                went through, feedback came flooding in, and we knew we were onto
                something.
              </div>
            </div>
          </div>
          <div className="tl-item reveal">
            <div className="tl-content">
              <div className="tl-year">2023 - Q1</div>
              <div className="tl-title">Official Launch</div>
              <div className="tl-desc">
                CanteenGo launched publicly at 3 campus canteens. Within 30 days
                we hit 500 daily orders and gained our first paying institution.
              </div>
            </div>
            <div className="tl-dot"></div>
            <div
              className="tl-content"
              style={{ background: 'transparent', border: 'none' }}
            ></div>
          </div>
          <div className="tl-item reveal">
            <div
              className="tl-content"
              style={{ background: 'transparent', border: 'none' }}
            ></div>
            <div className="tl-dot"></div>
            <div className="tl-content">
              <div className="tl-year">2023 - Q4</div>
              <div className="tl-title">Delivery Feature</div>
              <div className="tl-desc">
                We launched on-campus delivery, solving the last-mile problem for
                busy students and staff who cannot leave their desk.
              </div>
            </div>
          </div>
          <div className="tl-item reveal">
            <div className="tl-content">
              <div className="tl-year">2024 - Present</div>
              <div className="tl-title">Scaling Up</div>
              <div className="tl-desc">
                Now serving 12 campuses with 2,400+ daily orders. Expanding to
                corporate offices and refining our analytics dashboard for
                operators.
              </div>
            </div>
            <div className="tl-dot" style={{ background: 'var(--mint)' }}></div>
            <div
              className="tl-content"
              style={{ background: 'transparent', border: 'none' }}
            ></div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="tech-stack">
        <div className="section-tag">Built With</div>
        <h2
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(2rem, 3vw, 2.8rem)',
            fontWeight: 900,
          }}
        >
          Our Tech Stack
        </h2>
        <div className="tech-grid">
          <div className="tech-item reveal">
            <span className="tech-icon">🖥️</span>
            <div className="tech-name">HTML / CSS / JS</div>
            <div className="tech-role">Frontend</div>
          </div>
          <div className="tech-item reveal">
            <span className="tech-icon">💾</span>
            <div className="tech-name">MySQL</div>
            <div className="tech-role">Database</div>
          </div>
          <div className="tech-item reveal">
            <span className="tech-icon">🐍</span>
            <div className="tech-name">PHP / Laravel</div>
            <div className="tech-role">Backend</div>
          </div>
          <div className="tech-item reveal">
            <span className="tech-icon">📱</span>
            <div className="tech-name">QR Code API</div>
            <div className="tech-role">Ordering Gateway</div>
          </div>
          <div className="tech-item reveal">
            <span className="tech-icon">💳</span>
            <div className="tech-name">Stripe</div>
            <div className="tech-role">Payments</div>
          </div>
          <div className="tech-item reveal">
            <span className="tech-icon">📡</span>
            <div className="tech-name">WebSockets</div>
            <div className="tech-role">Real-time Updates</div>
          </div>
          <div className="tech-item reveal">
            <span className="tech-icon">☁️</span>
            <div className="tech-name">AWS</div>
            <div className="tech-role">Cloud Hosting</div>
          </div>
          <div className="tech-item reveal">
            <span className="tech-icon">🛡️</span>
            <div className="tech-name">JWT Auth</div>
            <div className="tech-role">Security</div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact">
        <div className="section-tag">Get In Touch</div>
        <h2
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(2rem, 3vw, 2.8rem)',
            fontWeight: 900,
            marginBottom: '12px',
          }}
        >
          We Would Love to Hear From You
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          Interested in bringing CanteenGo to your campus or organisation? Let's
          talk.
        </p>
        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-item reveal">
              <div className="contact-icon">📞</div>
              <div className="contact-detail">
                <strong>Phone</strong><span>+60 12-345 6789</span>
              </div>
            </div>
            <div className="contact-item reveal">
              <div className="contact-icon">✉️</div>
              <div className="contact-detail">
                <strong>Email</strong><span>hello@canteengo.app</span>
              </div>
            </div>
            <div className="contact-item reveal">
              <div className="contact-icon">📍</div>
              <div className="contact-detail">
                <strong>Office</strong>
                <span>Block A, Level 1, UTM Skudai, Johor</span>
              </div>
            </div>
            <div className="contact-item reveal">
              <div className="contact-icon">⏰</div>
              <div className="contact-detail">
                <strong>Support Hours</strong>
                <span>Monday - Friday, 8AM - 6PM</span>
              </div>
            </div>
          </div>
          <div className="contact-form reveal">
            <h3>Send Us a Message</h3>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Ahmad Razif"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Organisation / Campus</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. UTM Skudai"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                className="form-input"
                placeholder="Tell us how we can help..."
              ></textarea>
            </div>
            <button className="form-btn" onClick={handleContact}>
              <i className="fas fa-paper-plane"></i> &nbsp;Send Message
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="section-tag" style={{ marginBottom: '20px' }}>
          Join the Movement
        </div>
        <h2 className="cta-title">
          Ready to Upgrade<br /><span style={{ color: 'var(--saffron)' }}>
            Your Canteen?
          </span>
        </h2>
        <p className="cta-sub">
          Set up takes under 5 minutes. No hardware required. Just smarter canteen
          ordering.
        </p>
        <div className="cta-actions">
          <Link
            to="/register"
            className="btn-primary"
            style={{ fontSize: '1rem', padding: '16px 40px' }}
          >
            <i className="fas fa-rocket"></i> Get Started Free
          </Link>
          <Link
            to="/menu"
            className="btn-secondary"
            style={{ fontSize: '1rem', padding: '16px 40px' }}
          >
            <i className="fas fa-eye"></i> View Demo
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
              <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-link"><i className="fab fa-whatsapp"></i></a>
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
            <h5>Company</h5>
            <Link to="/about">About Us</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/partners">Partners</Link>
          </div>
          <div className="footer-col">
            <h5>Contact</h5>
            <a href="tel:+60123456789">+60 12-345 6789</a>
            <a href="mailto:hello@canteengo.app">hello@canteengo.app</a>
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

export default AboutPage;