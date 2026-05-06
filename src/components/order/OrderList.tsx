import React from 'react';
import type { Order } from '../../types/Order';

interface OrderListProps {
  orders: Order[];
}

const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">Order #{order.id}</h3>
              <p className="text-gray-600">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
              <p className="text-gray-600">Status: <span className="font-medium">{order.status}</span></p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">RM {order.totalAmount.toFixed(2)}</p>
              <p className="text-sm text-gray-500">{order.items?.length || 0} items</p>
            </div>
          </div>
          
          {order.items && order.items.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <h4 className="font-medium mb-2">Items:</h4>
              <ul className="space-y-1">
                {order.items.map((item, index) => (
                  <li key={index} className="flex justify-between text-sm">
                    <span>
                      {item.menuItemName || `Menu Item #${item.menuItemId}`} × {item.quantity}
                    </span>
                    <span>RM {item.subTotal.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderList;
