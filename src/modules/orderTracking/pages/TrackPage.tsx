import React, { useState, useEffect } from "react";
import "../TrackPage.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import trackingService from "../trackingService";
import type { Order, OrderStatus } from "../../../types/Order";

const TrackPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showRatingCard, setShowRatingCard] = useState(false);
  const [rating, setRating] = useState(0);
  const [historyFilter, setHistoryFilter] = useState("all");
  const [toasts, setToasts] = useState<any[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [searchingOrder, setSearchingOrder] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Map OrderStatus to timeline step index
  const statusToStep = (status: OrderStatus): number => {
    switch (status) {
      case "PENDING": return 0;
      case "CONFIRMED": return 1;
      case "PREPARING": return 2;
      case "READY": return 3;
      case "DELIVERED": return 4;
      case "CANCELLED": return 4;
      default: return 0;
    }
  };

  // Fetch user's order history on mount
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      setLoadingHistory(true);
      trackingService
        .getOrderHistory(Number(user.id))
        .then((orders) => setOrderHistory(orders))
        .catch((err) => {
          console.error("Failed to fetch order history:", err);
          showToast("Failed to load order history");
        })
        .finally(() => setLoadingHistory(false));
    }
  }, [isAuthenticated, user?.id]);

  // Update timeline step when active order changes
  useEffect(() => {
    if (activeOrder) {
      setCurrentStep(statusToStep(activeOrder.status));
    }
  }, [activeOrder]);

  const handleTrackOrder = async () => {
    if (!searchInput.trim()) {
      showToast("Please enter an order ID");
      return;
    }

    // Extract numeric ID from formats like "CG-2" or just "2"
    const numericId = parseInt(searchInput.replace(/^CG-/i, ""), 10);
    if (isNaN(numericId)) {
      showToast("Invalid order ID format. Use CG-XXX or just the number.");
      return;
    }

    setSearchingOrder(true);
    setSearchError(null);

    try {
      const order = await trackingService.getOrderWithUpdates(numericId);
      setActiveOrder(order);
      showToast(`Showing live status for #CG-${order.id}`);
    } catch (error: any) {
      console.error("Failed to track order:", error);
      setSearchError("Order not found. Please check the order ID and try again.");
      showToast("Order not found");
    } finally {
      setSearchingOrder(false);
    }
  };

  const showToast = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const getStatusClass = (status: string) => {
    switch (status.toUpperCase()) {
      case "PREPARING":
      case "CONFIRMED":
        return "status-badge status-preparing";
      case "READY":
        return "status-badge status-ready";
      case "PENDING":
        return "status-badge status-pending";
      case "DELIVERED":
        return "status-badge status-completed";
      case "CANCELLED":
        return "status-badge status-cancelled";
      default:
        return "status-badge";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case "PREPARING":
        return "🔥 Preparing";
      case "CONFIRMED":
        return "✅ Confirmed";
      case "READY":
        return "✅ Ready!";
      case "PENDING":
        return "⏳ Pending";
      case "DELIVERED":
        return "✔ Delivered";
      case "CANCELLED":
        return "✕ Cancelled";
      default:
        return "⏳ Pending";
    }
  };

  const getTimelineItemClass = (index: number) => {
    if (index < currentStep) return "tl-item done";
    if (index === currentStep) return "tl-item active";
    return "tl-item pending";
  };

  const getTimelineDotClass = (index: number) => {
    if (index < currentStep) return "tl-dot done";
    if (index === currentStep) return "tl-dot active";
    return "tl-dot";
  };

  const getTimelineIcon = (index: number) => {
    if (index < currentStep) return "fas fa-check";
    if (index === currentStep) return "fas fa-utensils";
    if (index === 4) return "fas fa-check-double";
    return "fas fa-bell";
  };

  const getTimelineTitle = (index: number) => {
    const titles = [
      "✅ Order Placed",
      "✅ Payment Confirmed",
      "🔥 Being Prepared",
      "⏳ Ready for Pickup",
      "⏳ Completed",
    ];
    return titles[index];
  };

  const getTimelineTime = (index: number) => {
    if (!activeOrder) return "";
    const orderDate = new Date(activeOrder.orderDate);
    const timeStr = orderDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const times = [
      timeStr,
      timeStr,
      `${timeStr} · In Progress`,
      "Pending",
      "Pending",
    ];
    return times[index];
  };

  const getTimelineDesc = (index: number) => {
    if (!activeOrder) return "";
    const descriptions = [
      `Order #CG-${activeOrder.id} confirmed and sent to the kitchen.`,
      `Payment recorded. Total: RM ${activeOrder.totalAmount.toFixed(2)}`,
      "Your order is being prepared — almost done!",
      "You'll be notified when ready at the counter.",
      "Order collected — enjoy your meal!",
    ];
    return descriptions[index];
  };

  const getTimelineChip = (index: number) => {
    if (!activeOrder) return null;
    const chips: ({ text: string; class: string } | null)[] = [
      currentStep >= 0 ? { text: "Confirmed", class: "chip-done" } : null,
      currentStep >= 1 ? { text: "Paid", class: "chip-done" } : null,
      currentStep >= 2 ? { text: "In Kitchen", class: "chip-active" } : null,
      null,
      null,
    ];
    return chips[index];
  };

  const handleRateStar = (n: number) => {
    setRating(n);
  };

  const submitRating = () => {
    if (!rating) {
      showToast("Please select a star rating first!");
      return;
    }
    showToast(`⭐ Thank you! ${rating}-star review submitted.`);
    setShowRatingCard(false);
    setRating(0);
  };

  const handleReorder = (orderId: number) => {
    showToast(`Reorder #CG-${orderId} added to cart!`);
  };

  const filteredHistory = historyFilter === "all"
    ? orderHistory
    : orderHistory.filter((o) => o.status.toLowerCase() === historyFilter);

  const progressPercentages = [0, 20, 40, 60, 80, 100];

  return (
    <div className="min-h-screen bg-[var(--tracking-dark)] text-white">
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
            <Link to="/tracks" className="active">Track</Link>
          </li>
          <li>
            <Link to="/reports">Reports</Link>
          </li>
          <li>
            <Link to="/delivery">Delivery</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
        <Link to="/login" className="nav-account">
          <i className="fas fa-user"></i> My Account
        </Link>
      </nav>

      <div className="track-container">
        <div className="page-hero">
          <h1 className="page-title">📡 Track Your Order</h1>
          <p className="page-sub">Real-time kitchen updates and order history — all in one place.</p>
        </div>

        {/* SEARCH */}
        <div className="search-card">
          <h3>🔍 Find an Order</h3>
          <div className="search-row">
            <input
              type="text"
              className="track-input"
              placeholder="Enter Order ID — e.g. CG-2"
              id="searchInput"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTrackOrder()}
            />
            <button className="track-btn" onClick={handleTrackOrder} disabled={searchingOrder}>
              {searchingOrder ? (
                <><i className="fas fa-spinner fa-spin"></i> Searching...</>
              ) : (
                <><i className="fas fa-search"></i> Track</>
              )}
            </button>
          </div>
          {searchError && (
            <div style={{ marginTop: "10px", fontSize: ".82rem", color: "#ff6b6b" }}>
              ⚠️ {searchError}
            </div>
          )}
          {isAuthenticated && orderHistory.length > 0 && (
            <>
              <div style={{ marginTop: "12px", fontSize: ".78rem", color: "rgba(255,255,255,.32)" }}>
                Recent orders:
              </div>
              <div className="quick-orders">
                {orderHistory.slice(0, 3).map((order) => (
                  <span
                    key={order.id}
                    className="quick-chip"
                    onClick={() => setSearchInput(`CG-${order.id}`)}
                  >
                    #CG-{order.id}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ACTIVE ORDER */}
        {activeOrder && (
          <div className="active-order">
            <div className="live-badge">
              <div className="live-dot"></div> LIVE
            </div>

            <div className="order-header">
              <div>
                <div style={{ fontSize: ".76rem", color: "rgba(255,255,255,.35)", marginBottom: "5px" }}>
                  Current Active Order
                </div>
                <div className="order-id-badge">#CG-{activeOrder.id}</div>
              </div>
              <div className="header-actions">
                <span className={getStatusClass(activeOrder.status)} id="statusBadge">
                  {getStatusText(activeOrder.status)}
                </span>
                <button
                  onClick={() => setShowReceiptModal(true)}
                  className="action-btn"
                >
                  <i className="fas fa-receipt"></i> Receipt
                </button>
                <button
                  onClick={() => showToast("Help request sent to staff!")}
                  className="action-btn"
                >
                  <i className="fas fa-bell"></i> Call Staff
                </button>
              </div>
            </div>

            {/* ETA */}
            <div className="eta-box">
              <div className="eta-icon">⏱</div>
              <div>
                <div className="eta-label">Order Status</div>
                <div className="eta-time" id="etaTimer">{getStatusText(activeOrder.status)}</div>
              </div>
              <div className="eta-info">
                {activeOrder.user?.fullname || "Customer"}<br/>
                Ordered: {new Date(activeOrder.orderDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                <br/>
                {new Date(activeOrder.orderDate).toLocaleDateString()}
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="progress-bar-wrap">
              <div className="prog-bar-label">
                <span>Order Progress</span>
                <span id="progressPct">{progressPercentages[currentStep]}% complete</span>
              </div>
              <div className="prog-bar-bg">
                <div
                  className="prog-bar-fill"
                  id="progressFill"
                  style={{ width: `${progressPercentages[currentStep]}%` }}
                ></div>
              </div>
            </div>

            {/* TIMELINE */}
            <div className="timeline">
              {[0, 1, 2, 3, 4].map((index) => (
                <div className={getTimelineItemClass(index)} key={index}>
                  <div className={getTimelineDotClass(index)}>
                    <i className={getTimelineIcon(index)}></i>
                  </div>
                  <div className="tl-content">
                    <div className="tl-title">
                      {getTimelineTitle(index)}
                    </div>
                    <div className="tl-time">
                      {getTimelineTime(index)}
                    </div>
                    <div className="tl-desc">
                      {getTimelineDesc(index)}
                    </div>
                    {getTimelineChip(index) && (
                      <span className={`tl-chip ${getTimelineChip(index)?.class}`}>
                        {getTimelineChip(index)?.text}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ORDER ITEMS */}
            <div className="order-items-list">
              <div className="oi-header">Items in this order</div>
              {activeOrder.items.map((item) => (
                <div className="oi-item" key={item.id}>
                  <div className="oi-img">
                    <img
                      src={item.menuItemImage || "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=100&h=100&fit=crop"}
                      alt={item.menuItemName || `Item #${item.menuItemId}`}
                    />
                  </div>
                  <div className="oi-name">{item.menuItemName || `Menu Item #${item.menuItemId}`}</div>
                  <span className={activeOrder.status === "DELIVERED" ? "oi-status oi-ready" : "oi-status oi-cooking"}>
                    {activeOrder.status === "DELIVERED" ? "Ready ✓" : "Cooking"}
                  </span>
                  <div className="oi-qty">×{item.quantity}</div>
                  <div className="oi-price">RM {item.subTotal.toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="order-footer-row">
              <button
                onClick={() => {
                  // Refresh order status from API
                  if (activeOrder) {
                    trackingService.getOrderWithUpdates(activeOrder.id).then((updated) => {
                      setActiveOrder(updated);
                      showToast("Order status refreshed!");
                    }).catch(() => {
                      showToast("Failed to refresh order status");
                    });
                  }
                }}
                className="simulate-btn"
              >
                🔄 Refresh Status
              </button>
              <button
                onClick={() => showToast("Modification request sent!")}
                className="modify-btn"
              >
                ✏️ Modify Order
              </button>
              <button
                onClick={async () => {
                  if (activeOrder) {
                    try {
                      await trackingService.getOrderWithUpdates(activeOrder.id);
                      // If order is still PENDING, we can cancel
                      showToast("Cancellation request sent to kitchen.");
                    } catch {
                      showToast("Failed to cancel order");
                    }
                  }
                }}
                className="cancel-btn"
              >
                ✕ Cancel Order
              </button>
            </div>
          </div>
        )}

        {/* RATING PROMPT */}
        {showRatingCard && (
          <div className="rate-card" id="rateCard">
            <div className="rate-title">🌟 How was your meal?</div>
            <div className="rate-sub">Your feedback helps us improve. Takes only 5 seconds!</div>
            <div className="stars-input" id="starsInput">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star-btn ${star <= rating ? "lit" : ""}`}
                  onClick={() => handleRateStar(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <button className="rate-submit" onClick={submitRating}>
              Submit Rating
            </button>
          </div>
        )}

        {/* ORDER HISTORY */}
        <div className="history-section">
          <div className="history-title">
            Order History
            <span style={{ fontSize: ".78rem", color: "rgba(255,255,255,.35)", fontFamily: "'DM Sans', sans-serif", fontWeight: "500" }}>
              {isAuthenticated ? "Your orders" : "Sign in to view your orders"}
            </span>
          </div>
          <div className="history-filter">
            <button
              className={`hist-tab ${historyFilter === "all" ? "active" : ""}`}
              onClick={() => setHistoryFilter("all")}
            >
              All
            </button>
            <button
              className={`hist-tab ${historyFilter === "delivered" ? "active" : ""}`}
              onClick={() => setHistoryFilter("delivered")}
            >
              Completed
            </button>
            <button
              className={`hist-tab ${historyFilter === "cancelled" ? "active" : ""}`}
              onClick={() => setHistoryFilter("cancelled")}
            >
              Cancelled
            </button>
          </div>
          <div id="historyList">
            {loadingHistory ? (
              <div style={{ textAlign: "center", padding: "32px", color: "rgba(255,255,255,.3)", fontSize: ".88rem" }}>
                <i className="fas fa-spinner fa-spin"></i> Loading orders...
              </div>
            ) : !isAuthenticated ? (
              <div style={{ textAlign: "center", padding: "32px", color: "rgba(255,255,255,.3)", fontSize: ".88rem" }}>
                <Link to="/login" style={{ color: "var(--saffron)" }}>Sign in</Link> to view your order history
              </div>
            ) : filteredHistory.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px", color: "rgba(255,255,255,.3)", fontSize: ".88rem" }}>
                No {historyFilter === "all" ? "" : historyFilter} orders found.
              </div>
            ) : (
              filteredHistory.map((order) => (
                <div
                  className="history-item"
                  key={order.id}
                  onClick={() => {
                    setSearchInput(`CG-${order.id}`);
                    setActiveOrder(order);
                  }}
                >
                  <div className={`h-status-dot dot-${order.status === "DELIVERED" ? "completed" : order.status === "CANCELLED" ? "cancelled" : "pending"}`}></div>
                  <div className="h-id">#CG-{order.id}</div>
                  <div className="h-items">
                    {order.items.length > 0
                      ? order.items.map((i) => i.menuItemName || `Item #${i.menuItemId}`).join(", ")
                      : "No items"}
                  </div>
                  <span className={`h-badge hb-${order.status === "DELIVERED" ? "completed" : order.status === "CANCELLED" ? "cancelled" : "pending"}`}>
                    {getStatusText(order.status)}
                  </span>
                  <div className="h-date">{new Date(order.orderDate).toLocaleDateString()}</div>
                  <div className="h-total">RM {order.totalAmount.toFixed(2)}</div>
                  {order.status === "DELIVERED" && (
                    <button
                      className="h-reorder"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReorder(order.id);
                      }}
                    >
                      Reorder
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* RECEIPT MODAL */}
      {showReceiptModal && activeOrder && (
        <div
          className="receipt-modal show"
          id="receiptModal"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowReceiptModal(false);
          }}
        >
          <div className="receipt-box">
            <div className="receipt-header">
              <div className="receipt-logo">CanteenGo</div>
              <div style={{ fontSize: ".74rem", color: "rgba(255,255,255,.35)", marginTop: "3px" }}>
                Block A · Canteen · {new Date(activeOrder.orderDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}, {new Date(activeOrder.orderDate).toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" })}
              </div>
            </div>
            <hr className="receipt-line" />
            <div className="receipt-row">
              <span>Order ID</span>
              <span style={{ color: "var(--saffron)" }}>#CG-{activeOrder.id}</span>
            </div>
            <div className="receipt-row">
              <span>Customer</span>
              <span>{activeOrder.user?.fullname || "N/A"}</span>
            </div>
            <div className="receipt-row">
              <span>Status</span>
              <span>{activeOrder.status}</span>
            </div>
            <hr className="receipt-line" />
            {activeOrder.items.map((item) => (
              <div className="receipt-row" key={item.id}>
                <span>
                  {item.menuItemName || `Item #${item.menuItemId}`} × {item.quantity}
                </span>
                <span>RM {item.subTotal.toFixed(2)}</span>
              </div>
            ))}
            <hr className="receipt-line" />
            <div className="receipt-row bold">
              <span>TOTAL</span>
              <span style={{ color: "var(--gold)" }}>
                RM {activeOrder.totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="r-qr">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=86x86&data=CG-${activeOrder.id}-receipt&color=1C1C1E&bgcolor=FFFFFF`}
                alt="Receipt QR"
              />
            </div>
            <div style={{ textAlign: "center", fontSize: ".72rem", color: "rgba(255,255,255,.28)", marginBottom: "14px" }}>
              Scan to verify this receipt
            </div>
            <div className="receipt-actions">
              <button
                className="r-btn r-secondary"
                onClick={() => showToast("Receipt sent to email!")}
              >
                <i className="fas fa-envelope"></i> Email
              </button>
              <button
                className="r-btn r-primary"
                onClick={() => setShowReceiptModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATIONS */}
      <div id="toastArea" style={{ position: "fixed", bottom: "28px", right: "28px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "10px" }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              background: "rgba(22,22,24,.96)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,107,43,.3)",
              borderRadius: "14px",
              padding: "13px 18px",
              fontSize: ".86rem",
              animation: "slideIn .4s ease",
              maxWidth: "310px",
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer style={{ background: "rgba(255,255,255,.02)", borderTop: "1px solid rgba(255,255,255,.06)", padding: "48px 5% 24px", marginTop: "64px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 900, color: "#ff6b2b", marginBottom: "10px" }}>
                CanteenGo
              </div>
              <p style={{ fontSize: ".86rem", color: "rgba(255,255,255,.42)", lineHeight: 1.8, marginBottom: "18px" }}>
                Smart canteen ordering for universities & campuses. Fast, fresh, easy.
              </p>
            </div>
            <div>
              <h5 style={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: "rgba(255,255,255,.3)", marginBottom: "14px" }}>
                Navigate
              </h5>
              <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                <Link to="/menu" style={{ color: "rgba(255,255,255,.5)", textDecoration: "none", fontSize: ".85rem" }}>Menu</Link>
                <Link to="/orders" style={{ color: "rgba(255,255,255,.5)", textDecoration: "none", fontSize: ".85rem" }}>Place Order</Link>
                <Link to="/tracks" style={{ color: "rgba(255,255,255,.5)", textDecoration: "none", fontSize: ".85rem" }}>Track Order</Link>
                <Link to="/delivery" style={{ color: "rgba(255,255,255,.5)", textDecoration: "none", fontSize: ".85rem" }}>Delivery</Link>
              </div>
            </div>
            <div>
              <h5 style={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: "rgba(255,255,255,.3)", marginBottom: "14px" }}>
                Account
              </h5>
              <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                <Link to="/login" style={{ color: "rgba(255,255,255,.5)", textDecoration: "none", fontSize: ".85rem" }}>Sign In</Link>
                <Link to="/login" style={{ color: "rgba(255,255,255,.5)", textDecoration: "none", fontSize: ".85rem" }}>Register</Link>
                <Link to="/about" style={{ color: "rgba(255,255,255,.5)", textDecoration: "none", fontSize: ".85rem" }}>About Us</Link>
                <Link to="/reports" style={{ color: "rgba(255,255,255,.5)", textDecoration: "none", fontSize: ".85rem" }}>Admin Panel</Link>
              </div>
            </div>
            <div>
              <h5 style={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: "rgba(255,255,255,.3)", marginBottom: "14px" }}>
                Contact
              </h5>
              <div style={{ display: "flex", flexDirection: "column", gap: "9px", fontSize: ".85rem", color: "rgba(255,255,255,.45)" }}>
                <span>📞 +60 12-345 6789</span>
                <span>✉️ hello@canteengo.my</span>
                <span>📍 Block A, Level 1</span>
                <span>⏰ Mon–Sun, 7AM–8PM</span>
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: "18px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", fontSize: ".74rem", color: "rgba(255,255,255,.22)" }}>
            <span>© 2026 CanteenGo. All rights reserved.</span>
            <span>Built with ❤️ for smarter campus canteens</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TrackPage;
