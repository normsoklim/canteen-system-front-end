import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCart from "../../../hooks/useCart";
import { useAuth } from "../../auth/context/AuthContext";
import orderService from "../orderService";
import paymentService from "../../payment/paymentService";
import type { KHQRResponse } from "../../payment/paymentService";
import type { Order, OrderStatus } from "../../../types/Order";
import "../order.css";

// Define types
type DeliveryType = "dine" | "takeaway" | "delivery";
type PaymentType = "card" | "khqr";
type CurrencyType = "USD" | "KHR";

const KHR_RATE = 4000; // 1 USD = 4000 KHR

const OrderPage: React.FC = () => {
  const { items: cartItems, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // State for form data
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("dine");
  const [selectedTable, setSelectedTable] = useState<number>(5);
  const [specialNotes, setSpecialNotes] = useState<string>("");
  const [paymentType, setPaymentType] = useState<PaymentType>("card");
  const [promoCode, setPromoCode] = useState<string>("");
  const [discountApplied, setDiscountApplied] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // KHQR state (only fetched after order is placed)
  const [khqrData, setKhqrData] = useState<KHQRResponse["data"] | null>(null);
  const [khqrLoading, setKhqrLoading] = useState<boolean>(false);
  const [khqrError, setKhqrError] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>("USD");
  const [placedOrderId, setPlacedOrderId] = useState<number | null>(null);
  const [placedOrderAmount, setPlacedOrderAmount] = useState<number>(0);
  const [showKHQRModal, setShowKHQRModal] = useState<boolean>(false);

  // State for user's existing orders
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);

  // Address form state (only used when delivery type is 'delivery')
  const [address, setAddress] = useState({
    block: "",
    level: "",
    room: "",
    contactName: "",
    phone: "",
    deliveryTime: "ASAP (Estimated 25 mins)",
  });

  // Card payment form state
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  // Calculate totals
  const subtotal = getTotalPrice();
  const serviceCharge = subtotal * 0.05;
  const sst = (subtotal + serviceCharge) * 0.06;
  const deliveryFee = deliveryType === "delivery" ? 3.0 : 0;
  const discount = discountApplied ? subtotal * 0.1 : 0;
  const grandTotal =
    Math.round(
      (subtotal + serviceCharge + sst + deliveryFee - discount) * 100
    ) / 100;

  // Fetch user's recent orders
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      setLoadingOrders(true);
      orderService
        .getUserOrders(Number(user.id))
        .then((orders) => setRecentOrders(orders))
        .catch((err) => console.error("Failed to fetch orders:", err))
        .finally(() => setLoadingOrders(false));
    }
  }, [isAuthenticated, user?.id]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch KHQR from API after order is placed
  const fetchKHQR = async (
    orderId: number,
    amount: number,
    currency: CurrencyType
  ) => {
    setKhqrLoading(true);
    setKhqrError(null);

    try {
      const response = await paymentService.generateKHQR({
        orderId,
        amount,
        currency,
      });
      if (response.success && response.data) {
        console.log(
          "KHQR response data:",
          JSON.stringify(response.data, null, 2)
        );
        setKhqrData(response.data);
      } else {
        setKhqrError("Failed to generate KHQR. Please try again.");
      }
    } catch (error: any) {
      console.error("Failed to fetch KHQR:", error);
      setKhqrError(
        error.message || "Failed to generate KHQR. Please try again."
      );
    } finally {
      setKhqrLoading(false);
    }
  };

  // Compute display amount based on currency
  const displayAmount =
    selectedCurrency === "KHR" ? grandTotal * KHR_RATE : grandTotal;

  const formatAmount = (amount: number, currency: CurrencyType) => {
    if (currency === "KHR") {
      return `៛ ${amount.toFixed(0)}`;
    }
    return `$ ${amount.toFixed(2)}`;
  };

  // Handle delivery type selection
  const handleDeliverySelect = (type: DeliveryType) => {
    setDeliveryType(type);
  };

  // Handle table selection
  const handleTableSelect = (tableNum: number) => {
    setSelectedTable(tableNum);
  };

  // Handle payment selection
  const handlePaymentSelect = (type: PaymentType) => {
    setPaymentType(type);
  };

  // Add note to special requests
  const addNote = (note: string) => {
    setSpecialNotes((prev) => (prev ? `${prev}, ${note}` : note));
  };

  // Apply promo code
  const applyPromo = () => {
    if (promoCode.toUpperCase() === "LUNCH10") {
      setDiscountApplied(true);
    } else {
      alert("Invalid promo code. Try LUNCH10");
    }
  };

  // Map status to display text
  const getStatusText = (status: OrderStatus): string => {
    switch (status) {
      case "PENDING":
        return "⏳ Pending";
      case "CONFIRMED":
        return "✅ Confirmed";
      case "PREPARING":
        return "🔥 Preparing";
      case "READY":
        return "✅ Ready!";
      case "DELIVERED":
        return "✔ Delivered";
      case "CANCELLED":
        return "✕ Cancelled";
      default:
        return "⏳ Pending";
    }
  };

  // Map status to CSS class
  const getStatusClass = (status: OrderStatus): string => {
    switch (status) {
      case "PENDING":
        return "status-badge status-pending";
      case "CONFIRMED":
      case "PREPARING":
        return "status-badge status-preparing";
      case "READY":
        return "status-badge status-ready";
      case "DELIVERED":
        return "status-badge status-completed";
      case "CANCELLED":
        return "status-badge status-cancelled";
      default:
        return "status-badge";
    }
  };

  // Place order using real API
  const placeOrder = async () => {
    if (!user?.id) {
      setOrderError("You must be logged in to place an order.");
      return;
    }

    if (cartItems.length === 0) {
      setOrderError("Your cart is empty.");
      return;
    }

    setIsPlacingOrder(true);
    setOrderError(null);

    try {
      const orderRequest = {
        userId: Number(user.id),
        items: cartItems.map((item) => ({
          menuItemId: item.product.id,
          quantity: item.quantity,
        })),
        paymentMethod:
          paymentType === "khqr" ? ("digital" as const) : ("digital" as const),
        notes: specialNotes || undefined,
      };

      const createdOrder = await orderService.createOrder(orderRequest);
      const orderId = createdOrder.id;
      setOrderNumber(`CG-${orderId}`);
      setPlacedOrderId(orderId);

      if (paymentType === "khqr") {
        // For KHQR: capture amount before clearing cart, then show modal and fetch QR
        const amountToPay =
          selectedCurrency === "KHR" ? grandTotal * KHR_RATE : grandTotal;
        const roundedAmount = Math.round(amountToPay * 100) / 100;
        setPlacedOrderAmount(roundedAmount);
        setShowKHQRModal(true);
        clearCart();
        await fetchKHQR(orderId, roundedAmount, selectedCurrency);
      } else {
        // For card: show success modal
        setShowSuccessModal(true);
        clearCart();
      }
    } catch (error: any) {
      console.error("Failed to place order:", error);
      setOrderError(
        error.message || "Failed to place order. Please try again."
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Close modal and navigate
  const closeModal = () => {
    setShowSuccessModal(false);
    navigate("/menu");
  };

  // Tables data
  const tables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const occupiedTables = [3, 7, 10];

  return (
    <div className="min-h-screen bg-charcoal text-white font-dm-sans">
      <nav className="nav">
        <a href="index.html" className="nav-logo">
          Canteen<span>Go</span>
        </a>
        <ul className="nav-links">
          <li>
            <Link to="/menu">Menu</Link>
          </li>
          <li>
            <Link to="/orders" className="active">
              Order
            </Link>
          </li>
          <li>
            <Link to="/tracks">Track</Link>
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
        <Link
          to="/login"
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            textDecoration: "none",
            fontSize: "0.9rem",
          }}
        >
          ← Back to Menu
        </Link>
      </nav>
      <div className="order-layout">
        {/* LEFT: ORDER FORM */}
        <div className="order-main">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-8">
            🧾 Place Your Order
          </h2>

          {/* PROGRESS */}
          <div className="progress-steps">
            <div className="prog-step active">
              <div className="num">1</div>
              <div className="label">Delivery</div>
            </div>
            <div className="prog-line" id="line1"></div>
            <div className="prog-step pending" id="step2">
              <div className="num">2</div>
              <div className="label">Details</div>
            </div>
            <div className="prog-line" id="line2"></div>
            <div className="prog-step pending" id="step3">
              <div className="num">3</div>
              <div className="label">Payment</div>
            </div>
            <div className="prog-line" id="line3"></div>
            <div className="prog-step pending" id="step4">
              <div className="num">4</div>
              <div className="label">Confirm</div>
            </div>
          </div>
          {/* SECTION 5: PAYMENT */}
          <div className="order-section">
            <div className="section-hdr">
              <h3>💳 Payment Method</h3>
            </div>
            <div className="payment-options">
              <div
                className={`pay-opt ${
                  paymentType === "card" ? "selected" : ""
                }`}
                onClick={() => handlePaymentSelect("card")}
              >
                <div className="pay-icon">💳</div>
                <div>
                  <div className="pay-name">Card</div>
                  <div className="pay-desc">Visa, Mastercard accepted</div>
                </div>
              </div>
              <div
                className={`pay-opt ${
                  paymentType === "khqr" ? "selected" : ""
                }`}
                onClick={() => handlePaymentSelect("khqr")}
              >
                <div className="pay-icon">📱</div>
                <div>
                  <div className="pay-name">KHQR</div>
                  <div className="pay-desc">Scan QR to pay instantly</div>
                </div>
              </div>
            </div>

            {/* Card Payment Form */}
            {paymentType === "card" && (
              <div className="payment-details">
                <div className="payment-details-title">Card Details</div>
                <div className="card-form">
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={(e) => {
                        const formatted = e.target.value
                          .replace(/\D/g, "")
                          .replace(/(.{4})/g, "$1 ")
                          .trim()
                          .slice(0, 19);
                        setCardDetails({
                          ...cardDetails,
                          cardNumber: formatted,
                        });
                      }}
                      maxLength={19}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cardholder Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="JOHN DOE"
                      value={cardDetails.cardName}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          cardName: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Expiry Date</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => {
                          let val = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4);
                          if (val.length >= 3)
                            val = val.slice(0, 2) + "/" + val.slice(2);
                          setCardDetails({ ...cardDetails, expiry: val });
                        }}
                        maxLength={5}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input
                        type="password"
                        className="form-input"
                        placeholder="•••"
                        value={cardDetails.cvv}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            cvv: e.target.value.replace(/\D/g, "").slice(0, 3),
                          })
                        }
                        maxLength={3}
                      />
                    </div>
                  </div>
                  <div className="card-badges">
                    <span className="card-badge">Visa</span>
                    <span className="card-badge">Mastercard</span>
                  </div>
                </div>
              </div>
            )}

            {/* KHQR Payment Section — currency selector only; QR is shown in modal after order */}
            {paymentType === "khqr" && (
              <div className="payment-details">
                <div className="payment-details-title">KHQR Payment</div>
                <div className="khqr-section">
                  {/* Currency selector */}
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      className="form-label"
                      style={{ marginBottom: "8px" }}
                    >
                      Select Currency
                    </label>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        type="button"
                        onClick={() => setSelectedCurrency("USD")}
                        style={{
                          flex: 1,
                          padding: "12px 16px",
                          borderRadius: "10px",
                          border:
                            selectedCurrency === "USD"
                              ? "2px solid var(--saffron)"
                              : "1px solid rgba(255,255,255,0.1)",
                          background:
                            selectedCurrency === "USD"
                              ? "rgba(255,107,43,0.12)"
                              : "rgba(255,255,255,0.04)",
                          color:
                            selectedCurrency === "USD"
                              ? "var(--saffron)"
                              : "rgba(255,255,255,0.6)",
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          transition: "0.3s",
                        }}
                      >
                        🇺🇸 USD — $ {grandTotal.toFixed(2)}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedCurrency("KHR")}
                        style={{
                          flex: 1,
                          padding: "12px 16px",
                          borderRadius: "10px",
                          border:
                            selectedCurrency === "KHR"
                              ? "2px solid var(--saffron)"
                              : "1px solid rgba(255,255,255,0.1)",
                          background:
                            selectedCurrency === "KHR"
                              ? "rgba(255,107,43,0.12)"
                              : "rgba(255,255,255,0.04)",
                          color:
                            selectedCurrency === "KHR"
                              ? "var(--saffron)"
                              : "rgba(255,255,255,0.6)",
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          transition: "0.3s",
                        }}
                      >
                        🇰🇭 KHR — ៛ {(grandTotal * KHR_RATE).toFixed(0)}
                      </button>
                    </div>
                  </div>

                  <div className="khqr-amount">
                    <span className="khqr-amount-label">Amount to Pay</span>
                    <span className="khqr-amount-value">
                      {formatAmount(displayAmount, selectedCurrency)}
                    </span>
                  </div>

                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: "12px",
                      marginTop: "12px",
                    }}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: "8px" }}>
                      📱
                    </div>
                    <div
                      style={{
                        fontSize: "0.88rem",
                        color: "rgba(255,255,255,0.6)",
                        marginBottom: "4px",
                      }}
                    >
                      KHQR code will be generated after you place your order
                    </div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "rgba(255,255,255,0.35)",
                      }}
                    >
                      Click "Confirm & Place Order" to proceed
                    </div>
                  </div>

                  <div className="khqr-steps" style={{ marginTop: "16px" }}>
                    <div className="khqr-step">
                      <span className="khqr-step-num">1</span>
                      <span>Place your order first</span>
                    </div>
                    <div className="khqr-step">
                      <span className="khqr-step-num">2</span>
                      <span>Scan the KHQR code with your banking app</span>
                    </div>
                    <div className="khqr-step">
                      <span className="khqr-step-num">3</span>
                      <span>
                        Confirm payment of{" "}
                        {formatAmount(displayAmount, selectedCurrency)}
                      </span>
                    </div>
                  </div>
                  <div className="khqr-supported">
                    <span className="khqr-supported-label">Supported Apps</span>
                    <div className="khqr-apps">
                      <span className="khqr-app">ABA</span>
                      <span className="khqr-app">ACLEDA</span>
                      <span className="khqr-app">Wing</span>
                      <span className="khqr-app">TrueMoney</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* SECTION 4: SPECIAL REQUESTS */}
          <div className="order-section">
            <div className="section-hdr">
              <h3>📝 Special Requests</h3>
            </div>
            <textarea
              className="notes-textarea"
              placeholder="Any allergies, extra spicy, no onions, extra sauce, etc.?"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
            ></textarea>
            <div
              style={{
                marginTop: "12px",
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              {[
                "🌶️ Extra Spicy",
                "🧅 No Onions",
                "🥜 No Peanuts",
                "🥛 Less Sugar",
                "🍦 Extra Sauce",
              ].map((note) => (
                <span
                  key={note}
                  onClick={() => addNote(note.replace(/^[^\w\s]+\s/, ""))}
                  style={{
                    padding: "6px 14px",
                    background: "rgba(255, 255, 255, 0.06)",
                    borderRadius: "50px",
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    transition: "0.3s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "rgba(255,107,43,.15)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,.06)";
                  }}
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* RECENT ORDERS */}
          {isAuthenticated && loadingOrders && (
            <div className="order-section">
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "0.88rem",
                }}
              >
                <i className="fas fa-spinner fa-spin"></i> Loading your
                orders...
              </div>
            </div>
          )}
          {isAuthenticated && !loadingOrders && recentOrders.length > 0 && (
            <div className="order-section">
              <div className="section-hdr">
                <h3>📋 Your Recent Orders</h3>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {recentOrders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      background: "rgba(255, 255, 255, 0.04)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                        Order #CG-{order.id}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "rgba(255,255,255,0.4)",
                        }}
                      >
                        {new Date(order.orderDate).toLocaleDateString()} ·{" "}
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span
                        style={{ fontSize: "0.85rem", color: "var(--gold)" }}
                      >
                        RM {order.totalAmount.toFixed(2)}
                      </span>
                      <span className={getStatusClass(order.status)}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="order-summary">
          <div className="summary-title">Order Summary</div>
          <div className="summary-items" id="summaryItems">
            {cartItems.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "24px",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "0.88rem",
                }}
              >
                Your cart is empty.{" "}
                <Link to="/menu" style={{ color: "var(--saffron)" }}>
                  Browse menu
                </Link>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div key={index} className="s-item">
                  <div className="s-item-img">
                    <img
                      src={
                        item.product.image ||
                        "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=100&h=100&fit=crop"
                      }
                      alt={item.product.name}
                    />
                  </div>
                  <div className="s-item-name">
                    {item.product.name}
                    <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                      ×{item.quantity}
                    </span>
                  </div>
                  <div className="s-item-price">
                    RM {(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="promo-row">
            <input
              type="text"
              className="promo-input"
              placeholder="Promo code (e.g. LUNCH10)"
              id="promoInput"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button className="promo-btn" onClick={applyPromo}>
              Apply
            </button>
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>RM {subtotal.toFixed(2)}</span>
          </div>
          <div
            className="summary-row"
            id="discountRow"
            style={{
              display: discountApplied ? "flex" : "none",
              color: "var(--mint)",
            }}
          >
            <span>Discount (10%)</span>
            <span>-RM {discount.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Service Charge (5%)</span>
            <span id="sc">RM {serviceCharge.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>SST (6%)</span>
            <span id="sst">RM {sst.toFixed(2)}</span>
          </div>
          <div
            className="summary-row"
            id="deliveryRow"
            style={{ display: deliveryType === "delivery" ? "flex" : "none" }}
          >
            <span>Delivery Fee</span>
            <span>RM {deliveryFee.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span id="grandTotal">RM {grandTotal.toFixed(2)}</span>
          </div>

          {/* Error message */}
          {orderError && (
            <div
              style={{
                marginTop: "12px",
                padding: "12px 16px",
                background: "rgba(255, 59, 48, 0.1)",
                border: "1px solid rgba(255, 59, 48, 0.2)",
                borderRadius: "10px",
                color: "#ff6b6b",
                fontSize: "0.85rem",
              }}
            >
              ⚠️ {orderError}
            </div>
          )}

          <button
            className="place-order-btn"
            onClick={placeOrder}
            disabled={isPlacingOrder || cartItems.length === 0}
            style={{
              opacity: isPlacingOrder || cartItems.length === 0 ? 0.6 : 1,
              cursor:
                isPlacingOrder || cartItems.length === 0
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {isPlacingOrder ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Placing Order...
              </>
            ) : (
              <>
                <i className="fas fa-check-circle"></i> Confirm & Place Order
              </>
            )}
          </button>
          <div className="secure-note">
            <i className="fas fa-shield-alt"></i> Secured by CanteenGo · SSL
            Encrypted
          </div>

          <div
            style={{
              marginTop: "24px",
              padding: "16px",
              background: "rgba(255, 184, 48, 0.08)",
              border: "1px solid rgba(255, 184, 48, 0.15)",
              borderRadius: "14px",
            }}
          >
            <div
              style={{
                fontSize: "0.8rem",
                color: "var(--gold)",
                fontWeight: "700",
                marginBottom: "6px",
              }}
            >
              📋 Order Details
            </div>
            <div
              style={{
                fontSize: "0.78rem",
                color: "rgba(255, 255, 255, 0.45)",
                lineHeight: "1.8",
              }}
            >
              {orderNumber ? `Order #${orderNumber}` : "Order pending"}
              <br />
              {deliveryType === "delivery"
                ? "Delivery"
                : `Table ${selectedTable} · Block A`}
              <br />
              <span id="deliveryTypeSummary">
                {deliveryType === "dine"
                  ? "Dine In"
                  : deliveryType === "takeaway"
                  ? "Takeaway"
                  : "Delivery"}
              </span>
              <br />
              Est. Time: ~
              {deliveryType === "delivery"
                ? "25"
                : deliveryType === "takeaway"
                ? "8"
                : "10"}{" "}
              mins
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      <div
        className="modal-overlay"
        id="successModal"
        style={{ display: showSuccessModal ? "flex" : "none" }}
      >
        <div className="success-modal">
          <div className="success-icon">🎉</div>
          <h2>Order Placed!</h2>
          <p>
            Your order has been received and is being processed. You'll be
            notified when it's ready!
          </p>
          <div className="order-id-box">
            <div className="olabel">Order ID</div>
            <div className="oid">#{orderNumber}</div>
          </div>
          <div className="modal-qr">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=canteengo://track/${orderNumber}&color=1C1C1E&bgcolor=FFFFFF`}
              alt="Track QR"
            />
          </div>
          <p
            style={{
              fontSize: "0.8rem",
              color: "rgba(255, 255, 255, 0.4)",
              marginBottom: "24px",
            }}
          >
            Scan to track your order status
          </p>
          <div className="modal-actions">
            <button
              className="modal-btn modal-btn-secondary"
              onClick={closeModal}
            >
              Back to Menu
            </button>
            <button
              className="modal-btn modal-btn-primary"
              onClick={() => navigate("/tracks")}
            >
              Track Order →
            </button>
          </div>
        </div>
      </div>

      {/* KHQR PAYMENT MODAL — shown after order is placed with KHQR payment */}
      <div
        className="modal-overlay"
        style={{ display: showKHQRModal ? "flex" : "none" }}
      >
        <div className="success-modal" style={{ maxWidth: "440px" }}>
          <div className="success-icon">📱</div>
          <h2>Scan KHQR to Pay</h2>
          <p
            style={{
              fontSize: "0.88rem",
              color: "rgba(255,255,255,0.5)",
              marginBottom: "8px",
            }}
          >
            Order{" "}
            <strong style={{ color: "var(--saffron)" }}>#{orderNumber}</strong>{" "}
            has been placed!
          </p>
          <p
            style={{
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.4)",
              marginBottom: "20px",
            }}
          >
            Please scan the QR code below with your banking app to complete
            payment.
          </p>

          {/* Amount display */}
          <div
            style={{
              textAlign: "center",
              padding: "12px 20px",
              background: "rgba(255,107,43,0.08)",
              borderRadius: "12px",
              marginBottom: "20px",
              border: "1px solid rgba(255,107,43,0.15)",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "4px",
              }}
            >
              Amount to Pay
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--saffron)",
              }}
            >
              {formatAmount(
                placedOrderAmount || displayAmount,
                selectedCurrency
              )}
            </div>
          </div>

          {/* QR Code area */}
          {khqrLoading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "200px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "16px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{ textAlign: "center", color: "rgba(255,255,255,0.5)" }}
              >
                <i
                  className="fas fa-spinner fa-spin"
                  style={{ fontSize: "2rem", marginBottom: "8px" }}
                ></i>
                <div style={{ fontSize: "0.85rem" }}>Generating KHQR...</div>
              </div>
            </div>
          ) : khqrError ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "200px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "16px",
                marginBottom: "16px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
                  ⚠️
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#ff6b6b",
                    marginBottom: "12px",
                  }}
                >
                  {khqrError}
                </div>
                <button
                  onClick={() => {
                    if (placedOrderId) {
                      fetchKHQR(
                        placedOrderId,
                        placedOrderAmount || displayAmount,
                        selectedCurrency
                      );
                    }
                  }}
                  style={{
                    padding: "8px 20px",
                    background: "var(--saffron)",
                    color: "#1C1C1E",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Retry
                </button>
              </div>
            </div>
          ) : khqrData ? (
            <div
              style={{
                textAlign: "center",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "16px",
                padding: "20px",
                marginBottom: "16px",
              }}
            >
              <img
                src={khqrData?.data?.qrImage}
                alt="KHQR"
                style={{
                  width: "100%",
                  maxWidth: "200px",
                  marginBottom: "12px",
                }}
              />
              {khqrData.reference && (
                <div
                  style={{
                    marginTop: "12px",
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  Ref: {khqrData.reference}
                </div>
              )}
              {khqrData.md5 && (
                <div
                  style={{
                    marginTop: "4px",
                    fontSize: "0.7rem",
                    color: "rgba(255,255,255,0.25)",
                    fontFamily: "monospace",
                  }}
                >
                  MD5: {khqrData.md5}
                </div>
              )}
            </div>
          ) : null}

          {/* Supported apps */}
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div
              style={{
                fontSize: "0.72rem",
                color: "rgba(255,255,255,0.3)",
                marginBottom: "8px",
              }}
            >
              Supported Apps
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              {["ABA", "ACLEDA", "Wing", "TrueMoney"].map((app) => (
                <span
                  key={app}
                  style={{
                    padding: "4px 12px",
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "20px",
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  {app}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="modal-actions">
            <button
              className="modal-btn modal-btn-secondary"
              onClick={() => {
                setShowKHQRModal(false);
                navigate("/menu");
              }}
            >
              Back to Menu
            </button>
            <button
              className="modal-btn modal-btn-primary"
              onClick={() => {
                setShowKHQRModal(false);
                navigate("/tracks");
              }}
            >
              Track Order →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
