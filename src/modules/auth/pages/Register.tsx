import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./auth.css";

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [activeTab, setActiveTab] = useState("register");
  const [currentRole, setCurrentRole] = useState("customer");
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length > 5) strength++;
    if (password.length > 8) strength++;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);

    // Update the password strength bars
    setTimeout(() => {
      const bars = [
        document.getElementById("bar1"),
        document.getElementById("bar2"),
        document.getElementById("bar3"),
        document.getElementById("bar4"),
      ];

      bars.forEach((bar, index) => {
        if (bar) {
          bar.className = "pw-bar";
          if (index < strength) {
            if (index === 0) bar.classList.add("weak");
            else if (index === 1) bar.classList.add("weak");
            else if (index === 2) bar.classList.add("medium");
            else bar.classList.add("active");
          }
        }
      });
    }, 0);
  };

  const handleRoleSelect = (
    role: string,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    // Update role selection UI
    const roleTabs = document.querySelectorAll(".role-tab");
    roleTabs.forEach((tab) => tab.classList.remove("active"));
    (event.currentTarget as HTMLElement).classList.add("active");
    setCurrentRole(role);
  };

  const showToast = (icon: string, msg: string, color: string) => {
    const toastArea = document.createElement("div");
    toastArea.id = "toastArea";
    toastArea.style.cssText =
      "position:fixed;bottom:30px;right:30px;z-index:9999;display:flex;flex-direction:column;gap:12px;";

    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.style.cssText = `background:rgba(28,28,30,.95);backdrop-filter:blur(20px);border:1px solid ${color}55;border-radius:14px;padding:16px 20px;display:flex;align-items:center;gap:12px;min-width:280px;animation:slideIn .4s ease;font-size:.9rem;`;
    toast.innerHTML = `<span style="font-size:1.3rem">${icon}</span> ${msg}`;

    toastArea.appendChild(toast);
    document.body.appendChild(toastArea);

    setTimeout(() => {
      toast.remove();
      if (toastArea.children.length === 0) {
        toastArea.remove();
      }
    }, 3000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if terms are accepted
    const termsCheckbox = document.getElementById("terms") as HTMLInputElement;
    if (!termsCheckbox.checked) {
      showToast("⚠️", "Please accept the terms first.", "#FF6B2B");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await register(full_name, email, password, phone, currentRole);

      // Show success message
      showToast("🎉", "Registration successful! Check your email for OTP.", "#00C9A7");

      // Navigate to OTP verification page after successful registration
      setTimeout(() => {
        navigate("/verify-otp", {
          state: {
            email: email,
            full_name: full_name,
            password: password,
            phone: phone,
            role: currentRole
          }
        });
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      showToast(
        "❌",
        err.message || "Registration failed. Please try again.",
        "#FF6B2B"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left side with branding and visuals */}
      <div className="auth-left">
        <Link to="/" className="auth-brand">
          Canteen<span>Go</span>
        </Link>
        <div className="auth-visual">
          <h2 className="auth-big-text">
            Your Meal,
            <br />
            <span className="line2">Your Way,</span>
            <br />
            Right Now.
          </h2>
          <p className="auth-sub">
            Sign in to access your personalized canteen experience. Order
            smarter, eat better.
          </p>
          <div className="auth-food-imgs">
            <div className="auth-food-img">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop"
                alt="Food"
              />
            </div>
            <div className="auth-food-img">
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop"
                alt="Food"
              />
            </div>
            <div className="auth-food-img">
              <img
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop"
                alt="Food"
              />
            </div>
            <div className="auth-food-img">
              <img
                src="https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop"
                alt="Food"
              />
            </div>
          </div>
        </div>
        <div className="auth-left-footer">
          © 2024 CanteenGo · All rights reserved
        </div>
      </div>

      {/* Right side with register form */}
      <div className="auth-right">
        <div className="auth-box">
          <div className="section-title">Create Account</div>
          <div className="section-sub">Join CanteenGo today</div>
          {/* Register Tab */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </button>
            <button
              className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
              onClick={() => {
                // Don't do anything here since we're already on the register page
              }}
            >
              Register
            </button>
          </div>

          {/* Register Form */}
          <form onSubmit={handleRegister}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-icon">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    className="form-control-custom"
                    placeholder="John Doe"
                    value={full_name}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  className="form-control-custom"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control-custom"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    checkPasswordStrength(e.target.value);
                  }}
                  required
                />
                <i
                  className={`fas ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  } toggle-pw`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>
              <div className="pw-strength">
                <div className="pw-bar" id="bar1"></div>
                <div className="pw-bar" id="bar2"></div>
                <div className="pw-bar" id="bar3"></div>
                <div className="pw-bar" id="bar4"></div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="input-icon">
                <i className="fas fa-phone"></i>
                <input
                  type="tel"
                  className="form-control-custom"
                  placeholder="+60 12-345 6789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="check-row" style={{ marginBottom: "20px" }}>
              <input
                type="checkbox"
                id="terms"
                style={{ accentColor: "var(--saffron)" }}
              />
              <label htmlFor="terms">
                I agree to the <a href="#">Terms of Service</a> and
                <a href="#">Privacy Policy</a>
              </label>
            </div>
            {error && (
              <div
                className="error-message"
                style={{
                  color: "#ff4444",
                  fontSize: "0.85rem",
                  marginBottom: "12px",
                  padding: "8px",
                  backgroundColor: "rgba(255, 68, 68, 0.1)",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 68, 68, 0.3)",
                }}
              >
                {error}
              </div>
            )}
            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Creating account...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus"></i> Create My Account
                </>
              )}
            </button>
            <div className="switch-mode">
              Already have an account?{" "}
              <a href="#" onClick={() => navigate("/login")}>
                Log in
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
