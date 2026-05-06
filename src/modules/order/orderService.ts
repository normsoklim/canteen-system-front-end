import api from '../../services/api';
import type {
  Order,
  OrderRequest,
  OrderListApiResponse,
  OrderSingleApiResponse,
  OrderStatus,
} from '../../types/Order';
import { normalizeOrder, normalizeOrders } from '../../types/Order';

class OrderService {
  // Create a new order
  // Backend expects: { userId, orderItems: [{ menuItemId, quantity }] }
  async createOrder(orderRequest: OrderRequest): Promise<Order> {
    // Transform frontend request format to match backend expectations
    // Backend CreateOrderDto expects: { userId, orderItems: [{ menuItemId, quantity }], status }
    // Note: status is required by backend's @IsEnum() validator even though it's optional in the DTO
    const backendRequest = {
      userId: orderRequest.userId,
      orderItems: orderRequest.items.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
      })),
      status: 'PENDING' as const,
    };

    const response = await api.post<OrderSingleApiResponse>('/orders', backendRequest);
    // The API returns { success: true, data: OrderApiResponse }
    if (response.success && response.data) {
      return normalizeOrder(response.data);
    }
    throw new Error('Failed to create order: unexpected API response');
  }

  // Get order by ID
  async getOrderById(orderId: number): Promise<Order> {
    const response = await api.get<OrderSingleApiResponse>(`/orders/${orderId}`);
    if (response.success && response.data) {
      return normalizeOrder(response.data);
    }
    throw new Error('Failed to fetch order: unexpected API response');
  }

  // Get all orders for a user
  // The backend doesn't have /orders/user/:userId endpoint,
  // so we fetch all orders and filter by userId on the client side
  async getUserOrders(userId: number): Promise<Order[]> {
    try {
      const response = await api.get<OrderListApiResponse>('/orders');
      if (response.success && Array.isArray(response.data)) {
        const allOrders = normalizeOrders(response.data);
        return allOrders.filter((order) => order.userId === userId);
      }
      console.warn('getUserOrders: API response missing data array, returning empty');
      return [];
    } catch (error) {
      console.error('Failed to fetch user orders:', error);
      return [];
    }
  }

  // Get all orders (admin)
  async getAllOrders(): Promise<Order[]> {
    const response = await api.get<OrderListApiResponse>('/orders');
    if (response.success && Array.isArray(response.data)) {
      return normalizeOrders(response.data);
    }
    // Fallback: return empty array instead of crashing
    console.warn('getAllOrders: API response missing data array, returning empty');
    return [];
  }

  // Update order status
  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
    const response = await api.put<OrderSingleApiResponse>(`/orders/${orderId}/status`, { status });
    if (response.success && response.data) {
      return normalizeOrder(response.data);
    }
    throw new Error('Failed to update order status: unexpected API response');
  }

  // Cancel an order
  async cancelOrder(orderId: number): Promise<Order> {
    return this.updateOrderStatus(orderId, 'CANCELLED');
  }
}

export default new OrderService();
