// Mock API service for report operations
class ReportService {
  // Get daily sales report
  async getDailyReport(date: string) {
    // In a real app, this would make an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const report = {
          date,
          totalOrders: 42,
          totalRevenue: 12560,
          totalItemsSold: 86,
          popularItems: [
            { id: 1, name: 'Veg Burger', sold: 15 },
            { id: 2, name: 'Chicken Pizza', sold: 12 },
            { id: 3, name: 'French Fries', sold: 10 }
          ],
          revenueByCategory: [
            { category: 'Burgers', revenue: 4200 },
            { category: 'Pizzas', revenue: 5250 },
            { category: 'Fast Food', revenue: 3110 }
          ]
        };
        resolve(report);
      }, 500);
    });
  }

  // Get monthly sales report
  async getMonthlyReport(month: string, year: string) {
    // In a real app, this would make an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const report = {
          month,
          year,
          totalOrders: 842,
          totalRevenue: 256420,
          totalItemsSold: 1720,
          averageOrderValue: 304.5,
          popularItems: [
            { id: 1, name: 'Veg Burger', sold: 285 },
            { id: 2, name: 'Chicken Pizza', sold: 242 },
            { id: 3, name: 'French Fries', sold: 198 }
          ],
          revenueByCategory: [
            { category: 'Burgers', revenue: 85200 },
            { category: 'Pizzas', revenue: 104520 },
            { category: 'Fast Food', revenue: 66700 }
          ]
        };
        resolve(report);
      }, 500);
    });
  }

  // Get top selling items report
  async getTopItemsReport(limit: number = 10) {
    // In a real app, this would make an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const report = {
          limit,
          items: [
            { id: 1, name: 'Veg Burger', sold: 1250, revenue: 100000 },
            { id: 2, name: 'Chicken Pizza', sold: 980, revenue: 245000 },
            { id: 3, name: 'French Fries', sold: 870, revenue: 52200 },
            { id: 4, name: 'Veg Sandwich', sold: 750, revenue: 52500 },
            { id: 5, name: 'Cold Coffee', sold: 680, revenue: 34000 }
          ]
        };
        resolve(report);
      }, 500);
    });
  }
}

export default new ReportService();