import api from '../../services/api';
import type {
  Order,
  OrderStatus,
  OrderListApiResponse,
  OrderSingleApiResponse,
} from '../../types/Order';
import { normalizeOrder, normalizeOrders } from '../../types/Order';

class TrackingService {
  // Get order status by ID
  async getOrderStatus(orderId: number): Promise<OrderStatus> {
    const response = await api.get<OrderSingleApiResponse>(`/orders/${orderId}`);
    if (response.success && response.data) {
      return (response.data.status?.toUpperCase() || 'PENDING') as OrderStatus;
    }
    throw new Error('Failed to fetch order status: unexpected API response');
  }

  // Get order details with status updates
  async getOrderWithUpdates(orderId: number): Promise<Order> {
    const response = await api.get<OrderSingleApiResponse>(`/orders/${orderId}`);
    if (response.success && response.data) {
      return normalizeOrder(response.data);
    }
    throw new Error('Failed to fetch order details: unexpected API response');
  }

  // Get order history for a user
  // The backend doesn't have /orders/user/:userId endpoint,
  // so we fetch all orders and filter by userId on the client side
  async getOrderHistory(userId: number): Promise<Order[]> {
    try {
      const response = await api.get<OrderListApiResponse>('/orders');
      if (response.success && Array.isArray(response.data)) {
        const allOrders = normalizeOrders(response.data);
        return allOrders.filter((order) => order.userId === userId);
      }
      console.warn('getOrderHistory: API response missing data array, returning empty');
      return [];
    } catch (error) {
      console.error('Failed to fetch order history:', error);
      return [];
    }
  }

  // Get all orders (for admin/general tracking)
  async getAllOrders(): Promise<Order[]> {
    const response = await api.get<OrderListApiResponse>('/orders');
    if (response.success && Array.isArray(response.data)) {
      return normalizeOrders(response.data);
    }
    console.warn('getAllOrders: API response missing data array, returning empty');
    return [];
  }
}

export default new TrackingService();
