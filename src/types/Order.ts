/** Raw order-item shape returned by the API (prices are strings) */
export interface OrderItemApiResponse {
  id: number;
  orderId: number;
  menuItemId: number;
  quantity: number;
  unitPrice: string;
  subTotal: string;
  menuItemName?: string;
  menuItemImage?: string;
}

/** Raw user shape nested inside an order from the API */
export interface OrderUserApiResponse {
  id: number;
  fullname: string;
  email: string;
  role: string;
  phone: string | null;
}

/** Raw order shape returned by the API */
export interface OrderApiResponse {
  id: number;
  userId: number;
  orderDate: string;
  totalAmount: string;
  status: string;
  user?: OrderUserApiResponse;
  orderItemsList?: OrderItemApiResponse[];
}

/** Top-level wrapper returned by order list endpoints */
export interface OrderListApiResponse {
  success: boolean;
  data: OrderApiResponse[];
}

/** Single-order wrapper returned by the API */
export interface OrderSingleApiResponse {
  success: boolean;
  data: OrderApiResponse;
}

// ──────────────────────────────────────────────────────────
// Normalised (frontend-friendly) types
// ──────────────────────────────────────────────────────────

export interface OrderItem {
  id: number;
  menuItemId: number;
  quantity: number;
  unitPrice: number;
  subTotal: number;
  menuItemName?: string;
  menuItemImage?: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderUser {
  id: number;
  fullname: string;
  email: string;
  role: string;
  phone: string | null;
}

export interface Order {
  id: number;
  userId: number;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
  user: OrderUser | null;
  items: OrderItem[];
}

export interface OrderRequest {
  userId: number;
  items: {
    menuItemId: number;
    quantity: number;
  }[];
  paymentMethod?: 'cash' | 'digital';
  notes?: string;
}

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────

/** Normalise a single raw order from the API into the frontend Order shape */
export function normalizeOrder(raw: OrderApiResponse): Order {
  return {
    id: raw.id,
    userId: raw.userId,
    orderDate: raw.orderDate,
    totalAmount: parseFloat(raw.totalAmount) || 0,
    status: (raw.status?.toUpperCase() || 'PENDING') as OrderStatus,
    user: raw.user
      ? {
          id: raw.user.id,
          fullname: raw.user.fullname,
          email: raw.user.email,
          role: raw.user.role,
          phone: raw.user.phone,
        }
      : null,
    items: (raw.orderItemsList || []).map((oi) => ({
      id: oi.id,
      menuItemId: oi.menuItemId,
      quantity: oi.quantity,
      unitPrice: parseFloat(oi.unitPrice) || 0,
      subTotal: parseFloat(oi.subTotal) || 0,
      menuItemName: oi.menuItemName,
      menuItemImage: oi.menuItemImage,
    })),
  };
}

/** Normalise an array of raw orders */
export function normalizeOrders(raw: OrderApiResponse[]): Order[] {
  return raw.map(normalizeOrder);
}
