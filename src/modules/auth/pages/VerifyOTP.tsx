import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./auth.css";

interface LocationState {
  email?: string;
  full_name?: string;
  password?: string;
  phone?: string;
  role?: string;
}

const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const { verifyOTP, resendOTP, isAuthenticated } = useAuth();

  const email = state?.email || "";
  const full_name = state?.full_name || "";
  const password = state?.password || "";
  const phone = state?.phone || "";

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer: number;
    if (countdown > 0 && !canResend) {
      timer = window.setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => window.clearTimeout(timer);
  }, [countdown, canResend]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      pastedData.split("").forEach((char, index) => {
        if (index < 6) {
          newOtp[index] = char;
        }
      });
      setOtp(newOtp);
      
      const lastIndex = Math.min(pastedData.length - 1, 5);
      const nextInput = document.getElementById(`otp-${lastIndex}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
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

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit OTP code");
      showToast("⚠️", "Please enter the complete 6-digit OTP code", "#FF6B2B");
      return;
    }

    if (!email || !full_name || !password) {
      setError("Missing required information. Please register again.");
      showToast("⚠️", "Missing required information", "#FF6B2B");
      setTimeout(() => {
        navigate("/register");
      }, 2000);
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log('Sending OTP verification with:', {
        email,
        otpCode,
        full_name,
        passwordLength: password.length,
        phone
      });
      
      await verifyOTP(email, otpCode, full_name, password, phone);
      showToast("🎉", "Email verified successfully!", "#00C9A7");
      
      // Check if user is authenticated (has token)
      if (isAuthenticated) {
        // User is authenticated, redirect to menu
        setTimeout(() => {
          navigate("/menu");
        }, 1500);
      } else {
        // User is verified but not authenticated, redirect to login
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err: any) {
      console.error('OTP verification error:', err);
      
      let errorMessage = "OTP verification failed. Please try again.";
      
      // Check if it's a network error
      if (err.message && err.message.includes('Network error')) {
        errorMessage = "Unable to connect to the server. Please check your internet connection and try again. If the problem persists, the backend server may not be running.";
        console.warn('Network error detected - backend may be unavailable');
      }
      // Check if it's a backend endpoint issue with detailed error
      else if (err.message) {
        // Use the actual error message from the backend
        errorMessage = err.message;
        
        // If it's a generic "Bad Request" error, provide more context
        if (err.message.includes('Bad Request')) {
          if (err.details && err.details.message) {
            errorMessage = err.details.message;
          } else {
            // Provide helpful troubleshooting steps
            errorMessage = "Invalid OTP code or verification failed. Please check your email and try again. If the problem persists, the OTP may have expired.";
          }
        }
        
        // Handle mock mode specific messages
        if (err.message.includes('mock')) {
          errorMessage = "Development mode: Using mock verification. Any 6-digit code will work.";
        }
        
        // Handle backend not implemented error
        if (err.message.includes('Backend verification failed')) {
          errorMessage = "The backend OTP verification endpoint is not properly implemented. Please contact the development team or use development mode for testing.";
        }
      }
      
      // Log the full error for debugging
      console.error('Full error object:', {
        message: err.message,
        status: err.status,
        url: err.url,
        details: err.details
      });
      
      setError(errorMessage);
      showToast("❌", errorMessage, "#FF6B2B");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setResendLoading(true);
    setError("");

    try {
      await resendOTP(email);
      showToast("📧", "New OTP sent to your email", "#00C9A7");
      setCountdown(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      
      const firstInput = document.getElementById("otp-0");
      if (firstInput) {
        (firstInput as HTMLInputElement).focus();
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP. Please try again.");
      showToast("❌", err.message || "Failed to resend OTP", "#FF6B2B");
    } finally {
      setResendLoading(false);
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
            Verify Your
            <br />
            <span className="line2">Email Address</span>
          </h2>
          <p className="auth-sub">
            We've sent a 6-digit verification code to your email. Enter it below
            to complete your registration.
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

      {/* Right side with OTP verification form */}
      <div className="auth-right">
        <div className="auth-box">
          <div className="section-title">Verify Email</div>
          <div className="section-sub">
            Enter the 6-digit code sent to{" "}
            <span style={{ fontWeight: 600, color: "var(--saffron)" }}>
              {email}
            </span>
          </div>

          <form onSubmit={handleVerify}>
            <div className="otp-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  className="otp-input"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  required
                />
              ))}
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
                  <i className="fas fa-spinner fa-spin"></i> Verifying...
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle"></i> Verify Email
                </>
              )}
            </button>

            <div className="resend-section">
              <p className="resend-text">
                Didn't receive the code?{" "}
                {canResend ? (
                  <button
                    type="button"
                    className="resend-link"
                    onClick={handleResendOTP}
                    disabled={resendLoading}
                  >
                    {resendLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Sending...
                      </>
                    ) : (
                      "Resend OTP"
                    )}
                  </button>
                ) : (
                  <span className="resend-timer">
                    Resend in {countdown}s
                  </span>
                )}
              </p>
            </div>

            <div className="switch-mode">
              Wrong email?{" "}
              <a href="#" onClick={() => navigate("/register")}>
                Go back to register
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
