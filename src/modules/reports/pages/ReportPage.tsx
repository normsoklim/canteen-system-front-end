import React, { useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js/auto';
import '../Report.css';
import AdminSidebar from '../components/AdminSidebar';
import DailyReport from '../components/DailyReport';
import MonthlyReport from '../components/MonthlyReport';
import TopItems from '../components/TopItems';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ReportPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeDateFilter, setActiveDateFilter] = useState('today');
  const [startDate, setStartDate] = useState('2026-03-20');
  const [endDate, setEndDate] = useState('2026-03-20');
  const [showExportModal, setShowExportModal] = useState(false);

  // Sample data for charts
  const revenueData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'],
    datasets: [
      {
        label: 'Revenue (RM)',
        data: [3200, 2900, 3600, 3100, 4200, 3800, 4280],
        borderColor: '#FF6B2B',
        backgroundColor: 'rgba(255,107,43,0.07)',
        borderWidth: 2.5,
        pointBackgroundColor: '#FF6B2B',
        pointRadius: 5,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const categoryData = {
    labels: ['Rice', 'Noodles', 'Snacks', 'Drinks', 'Desserts'],
    datasets: [
      {
        data: [35, 22, 15, 20, 8],
        backgroundColor: [
          '#FF6B2B',
          '#FFB830',
          '#00C9A7',
          '#a855f7',
          '#3b82f6',
        ],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const hourlyData = {
    labels: [
      '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', 
      '3PM', '4PM', '5PM', '6PM', '7PM'
    ],
    datasets: [
      {
        label: 'Orders',
        data: [18, 32, 25, 28, 45, 92, 88, 70, 40, 35, 42, 30, 12],
        backgroundColor: (ctx: any) => {
          const v = ctx.raw;
          return v > 80
            ? 'rgba(255,107,43,.9)'
            : v > 50
            ? 'rgba(255,184,48,.7)'
            : 'rgba(255,255,255,.14)';
        },
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const topItems = [
    {
      rank: 1,
      name: 'Nasi Lemak Special',
      category: 'Rice · Malay',
      orders: 87,
      percentage: 100,
      revenue: 652.50,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=80&h=80&fit=crop'
    },
    {
      rank: 2,
      name: 'Roti Canai + Curry',
      category: 'Snacks · Indian',
      orders: 66,
      percentage: 76,
      revenue: 231.00,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=80&h=80&fit=crop'
    },
    {
      rank: 3,
      name: 'Teh Tarik Kaw',
      category: 'Drinks · Hot',
      orders: 59,
      percentage: 68,
      revenue: 147.50,
      image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=80&h=80&fit=crop'
    },
    {
      rank: 4,
      name: 'Mee Goreng Mamak',
      category: 'Noodles · Indian',
      orders: 50,
      percentage: 57,
      revenue: 400.00,
      image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=80&h=80&fit=crop'
    },
    {
      rank: 5,
      name: 'Taro Bubble Tea',
      category: 'Drinks · Cold',
      orders: 39,
      percentage: 45,
      revenue: 253.50,
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=80&h=80&fit=crop'
    }
  ];

  const orders = [
    {
      id: '#CG-1083',
      customer: 'Ahmad Razif',
      items: 3,
      type: 'Dine-in',
      status: 'preparing',
      amount: 44.40,
      time: '12:34 PM'
    },
    {
      id: '#CG-1082',
      customer: 'Siti Nurul',
      items: 2,
      type: 'Takeaway',
      status: 'ready',
      amount: 18.50,
      time: '12:30 PM'
    },
    {
      id: '#CG-1081',
      customer: 'Kumar Rajan',
      items: 4,
      type: 'Dine-in',
      status: 'completed',
      amount: 31.00,
      time: '12:22 PM'
    },
    {
      id: '#CG-1080',
      customer: 'Wan Sofea',
      items: 1,
      type: 'Dine-in',
      status: 'completed',
      amount: 7.50,
      time: '12:18 PM'
    },
    {
      id: '#CG-1079',
      customer: 'Room 2.14',
      items: 5,
      type: 'Delivery',
      status: 'preparing',
      amount: 62.50,
      time: '12:05 PM'
    },
    {
      id: '#CG-1078',
      customer: 'Farid Hassan',
      items: 2,
      type: 'Takeaway',
      status: 'completed',
      amount: 22.00,
      time: '11:58 AM'
    },
    {
      id: '#CG-1077',
      customer: 'Nadia Lee',
      items: 1,
      type: 'Dine-in',
      status: 'completed',
      amount: 9.00,
      time: '11:45 AM'
    },
    {
      id: '#CG-1076',
      customer: 'Room 3.08',
      items: 3,
      type: 'Delivery',
      status: 'completed',
      amount: 35.00,
      time: '11:30 AM'
    }
  ];

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    const sectionTitles: { [key: string]: string } = {
      dashboard: '📊 Dashboard',
      orders: '🧾 Orders',
      'menu-mgmt': '🍽️ Menu Management',
      inventory: '📦 Inventory',
      daily: '📅 Daily Report',
      monthly: '📆 Monthly Report',
      popular: '🔥 Popular Items',
      staff: '👥 Staff Performance',
      settings: '⚙️ Settings',
    };
    showToast(`📊 ${sectionTitles[sectionId] || sectionId}`);
  };

  const handleDateFilterChange = (filter: string) => {
    setActiveDateFilter(filter);
    const filterText =
      filter === 'today' ? 'Today' :
      filter === 'week' ? 'This Week' :
      filter === 'month' ? 'This Month' :
      'This Year';
    showToast(`📅 Showing: ${filterText}`);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending': return 's-pending';
      case 'preparing': return 's-preparing';
      case 'ready': return 's-ready';
      case 'completed': return 's-completed';
      case 'cancelled': return 's-cancelled';
      default: return 's-pending';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getActionText = (status: string, type: string) => {
    switch (status) {
      case 'pending': return 'Accept';
      case 'preparing': return type === 'Delivery' ? 'Dispatch' : 'Mark Ready';
      case 'ready': return 'Complete';
      case 'completed': return 'Receipt';
      case 'cancelled': return 'Refund';
      default: return 'Update';
    }
  };

  const getRankClass = (rank: number) => {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'bronze';
    return '';
  };

  const showToast = (message: string) => {
    const existingToast = document.querySelector('.toast-container');
    if (!existingToast) {
      const container = document.createElement('div');
      container.className = 'toast-container';
      container.id = 'toastContainer';
      document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    
    const container = document.getElementById('toastContainer');
    if (container) {
      container.appendChild(toast);
    }
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  };

  // Sparkline data for KPI cards
  const sparklineData = {
    revenue: [3200, 2900, 3600, 3100, 4200, 3800, 4280],
    orders: [280, 260, 310, 285, 320, 295, 312],
    avgOrder: [11.4, 11.2, 11.6, 10.9, 13.1, 12.9, 13.72],
    customers: [255, 240, 268, 252, 270, 261, 248],
  };

  const openExportModal = () => {
    setShowExportModal(true);
  };

  const closeExportModal = () => {
    setShowExportModal(false);
  };

  const getSectionTitle = () => {
    const titles: { [key: string]: string } = {
      dashboard: '📊 Dashboard',
      orders: '🧾 Orders',
      'menu-mgmt': '🍽️ Menu Management',
      inventory: '📦 Inventory',
      daily: '📅 Daily Report',
      monthly: '📆 Monthly Report',
      popular: '🔥 Popular Items',
      staff: '👥 Staff Performance',
      settings: '⚙️ Settings',
    };
    return titles[activeSection] || activeSection;
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <AdminSidebar activeSection={activeSection} onSectionChange={handleSectionChange} />

      {/* MAIN CONTENT */}
      <div className="admin-main">
        {/* TOP BAR */}
        <div className="top-bar">
          <div>
            <div className="top-bar-title">{getSectionTitle()}</div>
            <div className="top-bar-sub">Friday, 20 March 2026 · Canteen Block A</div>
          </div>
          <div className="top-bar-right">
            <button className="btn-icon" onClick={() => showToast('🔔 3 new notifications')}>
              <i className="fas fa-bell"></i>
              <span className="notif-dot"></span>
            </button>
            <button className="btn-icon" onClick={() => showToast('🔄 Data refreshed!')}>
              <i className="fas fa-sync-alt"></i>
            </button>
            <button className="btn-export" onClick={openExportModal}>
              <i className="fas fa-download"></i> Export
            </button>
            <button className="btn-primary-sm" onClick={() => showToast('✅ Report shared via email!')}>
              <i className="fas fa-share-alt"></i> Share
            </button>
          </div>
        </div>

        {/* PAGE BODY */}
        <div className="page-body">
          {/* DASHBOARD SECTION */}
          {activeSection === 'dashboard' && (
            <>
              {/* DATE FILTER */}
              <div className="date-bar">
                <button
                  className={`date-tab ${activeDateFilter === 'today' ? 'active' : ''}`}
                  onClick={() => handleDateFilterChange('today')}
                >
                  Today
                </button>
                <button
                  className={`date-tab ${activeDateFilter === 'week' ? 'active' : ''}`}
                  onClick={() => handleDateFilterChange('week')}
                >
                  This Week
                </button>
                <button
                  className={`date-tab ${activeDateFilter === 'month' ? 'active' : ''}`}
                  onClick={() => handleDateFilterChange('month')}
                >
                  This Month
                </button>
                <button
                  className={`date-tab ${activeDateFilter === 'year' ? 'active' : ''}`}
                  onClick={() => handleDateFilterChange('year')}
                >
                  This Year
                </button>
                <input
                  type="date"
                  className="date-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>→</span>
                <input
                  type="date"
                  className="date-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

          {/* KPI CARDS */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-glow" style={{ background: 'var(--saffron)' }}></div>
              <div className="kpi-label">
                <i className="fas fa-coins" style={{ color: 'var(--saffron)' }}></i>
                Total Revenue
              </div>
              <div className="kpi-value" style={{ color: 'var(--gold)' }}>RM 4,280</div>
              <div className="kpi-change up">
                <i className="fas fa-arrow-up"></i> +18.5% vs yesterday
              </div>
              <Line
                data={{
                  labels: sparklineData.revenue.map((_, i) => i),
                  datasets: [{
                    data: sparklineData.revenue,
                    borderColor: '#FFB830',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false,
                    tension: 0.4,
                  }],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: { x: { display: false }, y: { display: false } },
                  animation: { duration: 800 },
                }}
                className="kpi-sparkline"
              />
            </div>
            <div className="kpi-card">
              <div className="kpi-glow" style={{ background: 'var(--saffron)' }}></div>
              <div className="kpi-label">
                <i className="fas fa-receipt" style={{ color: 'var(--gold)' }}></i>
                Total Orders
              </div>
              <div className="kpi-value" style={{ color: 'var(--saffron)' }}>312</div>
              <div className="kpi-change up">
                <i className="fas fa-arrow-up"></i> +8.2% vs yesterday
              </div>
              <Line
                data={{
                  labels: sparklineData.orders.map((_, i) => i),
                  datasets: [{
                    data: sparklineData.orders,
                    borderColor: '#FF6B2B',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false,
                    tension: 0.4,
                  }],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: { x: { display: false }, y: { display: false } },
                  animation: { duration: 800 },
                }}
                className="kpi-sparkline"
              />
            </div>
            <div className="kpi-card">
              <div className="kpi-glow" style={{ background: 'var(--mint)' }}></div>
              <div className="kpi-label">
                <i className="fas fa-shopping-basket" style={{ color: 'var(--mint)' }}></i>
                Avg Order Value
              </div>
              <div className="kpi-value" style={{ color: 'var(--mint)' }}>RM 13.72</div>
              <div className="kpi-change up">
                <i className="fas fa-arrow-up"></i> +4.1% vs yesterday
              </div>
              <Line
                data={{
                  labels: sparklineData.avgOrder.map((_, i) => i),
                  datasets: [{
                    data: sparklineData.avgOrder,
                    borderColor: '#00C9A7',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false,
                    tension: 0.4,
                  }],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: { x: { display: false }, y: { display: false } },
                  animation: { duration: 800 },
                }}
                className="kpi-sparkline"
              />
            </div>
            <div className="kpi-card">
              <div className="kpi-glow" style={{ background: 'var(--purple)' }}></div>
              <div className="kpi-label">
                <i className="fas fa-users" style={{ color: 'var(--purple)' }}></i>
                Active Customers
              </div>
              <div className="kpi-value" style={{ color: 'var(--purple)' }}>248</div>
              <div className="kpi-change down">
                <i className="fas fa-arrow-down"></i> -2.3% vs yesterday
              </div>
              <Line
                data={{
                  labels: sparklineData.customers.map((_, i) => i),
                  datasets: [{
                    data: sparklineData.customers,
                    borderColor: '#a855f7',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false,
                    tension: 0.4,
                  }],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: { x: { display: false }, y: { display: false } },
                  animation: { duration: 800 },
                }}
                className="kpi-sparkline"
              />
            </div>
          </div>

          {/* ALERTS */}
          <div className="alert-grid">
            <div className="alert-card warn">
              <div className="alert-icon">⚠️</div>
              <div>
                <div className="alert-title">Low Inventory: 3 items</div>
                <div className="alert-desc">Coconut milk, ikan bilis and teh tarik powder are below reorder level.</div>
              </div>
            </div>
            <div className="alert-card success">
              <div className="alert-icon">🎉</div>
              <div>
                <div className="alert-title">Sales Target Achieved!</div>
                <div className="alert-desc">Today's revenue surpassed the RM 4,000 daily target at 1:45 PM.</div>
              </div>
            </div>
            <div className="alert-card info">
              <div className="alert-icon">📦</div>
              <div>
                <div className="alert-title">New Delivery Scheduled</div>
                <div className="alert-desc">Supplier delivery confirmed for tomorrow 8:00 AM — 12 items.</div>
              </div>
            </div>
          </div>

          {/* CHARTS ROW */}
          <div className="charts-row">
            <div className="chart-card">
              <div className="card-title">Revenue Trend</div>
              <div className="card-sub">Last 7 days · RM</div>
              <Line
                data={revenueData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: {
                      grid: { color: 'rgba(255,255,255,.04)' },
                      ticks: { color: 'rgba(255,255,255,.38)', font: { size: 11 } },
                    },
                    y: {
                      grid: { color: 'rgba(255,255,255,.04)' },
                      ticks: {
                        color: 'rgba(255,255,255,.38)',
                        font: { size: 11 },
                        callback: function(v: any) { return 'RM ' + v; },
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="chart-card">
              <div className="card-title">Orders by Category</div>
              <div className="card-sub">Today's breakdown</div>
              <Doughnut 
                data={categoryData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: 'rgba(255,255,255,.55)',
                        padding: 10,
                        font: { size: 11 },
                      },
                    },
                  },
                  cutout: '65%',
                }} 
              />
            </div>
          </div>

          {/* CHARTS ROW 3 */}
          <div className="charts-row-3">
            <div className="chart-card">
              <div className="card-title">Hourly Orders</div>
              <div className="card-sub">Peak: 12PM–2PM</div>
              <Bar
                data={hourlyData}
                options={{
                  plugins: { legend: { display: false } },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: { color: 'rgba(255,255,255,.38)' },
                    },
                    y: {
                      grid: { color: 'rgba(255,255,255,.04)' },
                      ticks: { color: 'rgba(255,255,255,.38)' },
                    },
                  },
                }}
              />
            </div>
            <div className="chart-card">
              <div className="card-title">Payment Methods</div>
              <div className="card-sub">Today</div>
              <Doughnut 
                data={{
                  labels: ['Cash', 'QR Pay', 'Credit Card', 'eWallet'],
                  datasets: [{
                    data: [28, 42, 18, 12],
                    backgroundColor: ['#FFB830', '#00C9A7', '#a855f7', '#3b82f6'],
                    borderWidth: 0,
                    hoverOffset: 6,
                  }],
                }}
                options={{
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: 'rgba(255,255,255,.55)',
                        padding: 8,
                        font: { size: 10 },
                      },
                    },
                  },
                  cutout: '60%',
                }}
              />
            </div>
            <div className="chart-card">
              <div className="card-title">Order Types</div>
              <div className="card-sub">Dine-in vs Takeaway vs Delivery</div>
              <Doughnut 
                data={{
                  labels: ['Dine-In', 'Takeaway', 'Delivery'],
                  datasets: [{
                    data: [55, 30, 15],
                    backgroundColor: ['#FF6B2B', '#FFB830', '#00C9A7'],
                    borderWidth: 0,
                    hoverOffset: 6,
                  }],
                }}
                options={{
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: 'rgba(255,255,255,.55)',
                        padding: 8,
                        font: { size: 10 },
                      },
                    },
                  },
                  cutout: '60%',
                }}
              />
            </div>
          </div>

          {/* TOP ITEMS */}
          <div className="top-items">
            <div className="table-top">
              <div>
                <div className="card-title">🔥 Most Ordered Items</div>
                <div className="card-sub">Today's top 5 performers</div>
              </div>
              <button className="btn-export" onClick={() => showToast('Top items exported!')}>
                <i className="fas fa-download"></i> Export
              </button>
            </div>
            {topItems.map((item, index) => (
              <div key={index} className="top-item">
                <div className={`top-rank ${getRankClass(item.rank)}`}>
                  #{item.rank}
                </div>
                <div className="top-img">
                  <img src={item.image} alt={item.name} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="top-name">{item.name}</div>
                  <div className="top-cat">{item.category}</div>
                </div>
                <div className="top-bar-wrap">
                  <div className="top-bar-bg">
                    <div
                      className="top-bar-fill"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="top-count">{item.orders} orders</div>
                <div className="top-rev">RM {item.revenue.toFixed(0)}</div>
              </div>
            ))}
          </div>

          {/* ORDERS TABLE */}
          <div className="table-card">
            <div className="table-top">
              <div>
                <div className="card-title">Recent Transactions</div>
                <div className="card-sub">Latest orders today</div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input 
                  className="search-inline" 
                  placeholder="🔍 Search orders..."
                />
                <button className="btn-primary-sm" onClick={() => showToast('Navigating to new order page!')}>
                  <i className="fas fa-plus"></i> New Order
                </button>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={index}>
                      <td className="t-id">{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.items} item{order.items > 1 ? 's' : ''}</td>
                      <td style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,.5)' }}>{order.type}</td>
                      <td>
                        <span className={`t-status ${getStatusClass(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="t-amount">RM {order.amount.toFixed(2)}</td>
                      <td style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,.5)' }}>{order.time}</td>
                      <td>
                        <button
                          className="t-action"
                          onClick={() => showToast(`✅ ${getActionText(order.status, order.type)}!`)}
                        >
                          {getActionText(order.status, order.type)}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <span>Showing 1–{orders.length} of 20 orders</span>
              <div className="page-btns">
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn"><i className="fas fa-chevron-right"></i></button>
              </div>
            </div>
          </div>
            </>
          )}

          {/* ORDERS SECTION */}
          {activeSection === 'orders' && (
            <>
              <div className="date-bar">
                <button
                  className={`date-tab ${activeDateFilter === 'today' ? 'active' : ''}`}
                  onClick={() => handleDateFilterChange('today')}
                >
                  Today
                </button>
                <button
                  className={`date-tab ${activeDateFilter === 'week' ? 'active' : ''}`}
                  onClick={() => handleDateFilterChange('week')}
                >
                  This Week
                </button>
                <input
                  type="date"
                  className="date-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="kpi-card">
                  <div className="kpi-label">
                    <i className="fas fa-receipt" style={{ color: 'var(--saffron)' }}></i>
                    Total Orders
                  </div>
                  <div className="kpi-value" style={{ color: 'var(--saffron)' }}>312</div>
                  <div className="kpi-change up">
                    <i className="fas fa-arrow-up"></i> +8.2%
                  </div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">
                    <i className="fas fa-check-circle" style={{ color: 'var(--mint)' }}></i>
                    Completed
                  </div>
                  <div className="kpi-value" style={{ color: 'var(--mint)' }}>287</div>
                  <div className="kpi-change up">92% completion rate</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">
                    <i className="fas fa-times-circle" style={{ color: 'var(--red)' }}></i>
                    Cancelled
                  </div>
                  <div className="kpi-value" style={{ color: 'var(--red)' }}>12</div>
                  <div className="kpi-change down">
                    <i className="fas fa-arrow-up"></i> +2 vs yesterday
                  </div>
                </div>
              </div>
              <div className="table-card">
                <div className="table-top">
                  <div>
                    <div className="card-title">All Orders</div>
                    <div className="card-sub">Full order log for today</div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <select className="date-input" style={{ width: 'auto' }}>
                      <option>All Status</option>
                      <option>Pending</option>
                      <option>Preparing</option>
                      <option>Ready</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                    <input className="search-inline" placeholder="🔍 Search..." />
                    <button className="btn-export" onClick={() => showToast('Orders exported!')}>
                      <i className="fas fa-download"></i> Export
                    </button>
                  </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Time</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <tr key={index}>
                          <td className="t-id">{order.id}</td>
                          <td>{order.customer}</td>
                          <td>{order.items} item{order.items > 1 ? 's' : ''}</td>
                          <td style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,.5)' }}>{order.type}</td>
                          <td>
                            <span className={`t-status ${getStatusClass(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </td>
                          <td className="t-amount">RM {order.amount.toFixed(2)}</td>
                          <td style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,.5)' }}>{order.time}</td>
                          <td>
                            <button
                              className="t-action"
                              onClick={() => showToast(`✅ ${getActionText(order.status, order.type)}!`)}
                            >
                              {getActionText(order.status, order.type)}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="pagination">
                  <span>Showing 1–{orders.length} of 312 orders</span>
                  <div className="page-btns">
                    <button className="page-btn active">1</button>
                    <button className="page-btn">2</button>
                    <button className="page-btn">3</button>
                    <button className="page-btn">...</button>
                    <button className="page-btn">32</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* DAILY REPORT SECTION */}
          {activeSection === 'daily' && <DailyReport />}

          {/* MONTHLY REPORT SECTION */}
          {activeSection === 'monthly' && <MonthlyReport />}

          {/* POPULAR ITEMS SECTION */}
          {activeSection === 'popular' && <TopItems />}

          {/* STAFF PERFORMANCE SECTION */}
          {activeSection === 'staff' && (
            <>
              <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="kpi-card">
                  <div className="kpi-label">
                    <i className="fas fa-users" style={{ color: 'var(--mint)' }}></i>
                    Staff On Duty
                  </div>
                  <div className="kpi-value" style={{ color: 'var(--mint)' }}>8</div>
                  <div className="kpi-change up">All stations covered</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">
                    <i className="fas fa-star" style={{ color: 'var(--gold)' }}></i>
                    Avg Performance
                  </div>
                  <div className="kpi-value" style={{ color: 'var(--gold)' }}>87%</div>
                  <div className="kpi-change up">
                    <i className="fas fa-arrow-up"></i> +3% this week
                  </div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">
                    <i className="fas fa-clock" style={{ color: 'var(--saffron)' }}></i>
                    Avg Fulfillment
                  </div>
                  <div className="kpi-value" style={{ color: 'var(--saffron)' }}>8.4m</div>
                  <div className="kpi-change up">
                    <i className="fas fa-arrow-down"></i> 1.2m faster
                  </div>
                </div>
              </div>
              <div className="staff-grid">
                {[
                  { name: 'Muthu', role: 'Head Chef', color: 'var(--saffron)', initial: 'M', orders: 112, rating: 4.9, perf: 95 },
                  { name: 'Aisha', role: 'Counter Staff', color: 'var(--mint)', initial: 'A', orders: 98, rating: 4.7, perf: 88 },
                  { name: 'Rajesh', role: 'Cook', color: 'var(--gold)', initial: 'R', orders: 87, rating: 4.6, perf: 82 },
                  { name: 'Lina', role: 'Cashier', color: 'var(--purple)', initial: 'L', orders: 103, rating: 4.8, perf: 91 },
                  { name: 'Hafiz', role: 'Delivery', color: 'var(--blue)', initial: 'H', orders: 54, rating: 4.5, perf: 79 },
                ].map((staff, index) => (
                  <div key={index} className="staff-card">
                    <div className="staff-avatar" style={{ background: `${staff.color}20`, color: staff.color }}>
                      {staff.initial}
                    </div>
                    <div className="staff-name">{staff.name}</div>
                    <div className="staff-role">{staff.role}</div>
                    <div className="staff-stat">
                      <div>
                        <div className="sstat-val">{staff.orders}</div>
                        <div className="sstat-label">Orders</div>
                      </div>
                      <div>
                        <div className="sstat-val" style={{ color: 'var(--mint)' }}>{staff.rating}★</div>
                        <div className="sstat-label">Rating</div>
                      </div>
                    </div>
                    <div className="perf-bar">
                      <div className="perf-fill" style={{ width: `${staff.perf}%` }}></div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.7rem', color: 'rgba(255,255,255,.35)', marginTop: '4px' }}>
                      {staff.perf}% performance
                    </div>
                  </div>
                ))}
              </div>
              <div className="chart-card-full">
                <div className="card-title">Staff Orders Fulfilled Today</div>
                <div className="card-sub">Per staff member</div>
                <Bar
                  data={{
                    labels: ['Muthu', 'Aisha', 'Rajesh', 'Lina', 'Hafiz'],
                    datasets: [{
                      data: [112, 98, 87, 103, 54],
                      backgroundColor: [
                        'rgba(255,107,43,.8)',
                        'rgba(0,201,167,.8)',
                        'rgba(255,184,48,.8)',
                        'rgba(168,85,247,.8)',
                        'rgba(59,130,246,.8)'
                      ],
                      borderRadius: 10,
                      borderSkipped: false,
                    }],
                  }}
                  options={{
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,.5)' } },
                      y: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: 'rgba(255,255,255,.38)' } },
                    },
                  }}
                  style={{ maxHeight: '220px' }}
                />
              </div>
            </>
          )}

          {/* INVENTORY SECTION */}
          {activeSection === 'inventory' && (
            <>
              <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="kpi-card">
                  <div className="kpi-label">
                    <i className="fas fa-boxes" style={{ color: 'var(--mint)' }}></i>
                    Items Tracked
                  </div>
                  <div className="kpi-value" style={{ color: 'var(--mint)' }}>42</div>
                  <div className="kpi-change up">All categories</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">
                    <i className="fas fa-exclamation-triangle" style={{ color: 'var(--gold)' }}></i>
                    Low Stock
                  </div>
                  <div className="kpi-value" style={{ color: 'var(--gold)' }}>3</div>
                  <div className="kpi-change down">Need restocking soon</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">
                    <i className="fas fa-times-circle" style={{ color: 'var(--red)' }}></i>
                    Critical / Out
                  </div>
                  <div className="kpi-value" style={{ color: 'var(--red)' }}>1</div>
                  <div className="kpi-change down">Curry puff pastry — 0 units</div>
                </div>
              </div>
              <div className="table-card">
                <div className="table-top">
                  <div>
                    <div className="card-title">📦 Stock Levels</div>
                    <div className="card-sub">Current inventory status</div>
                  </div>
                  <button className="btn-primary-sm" onClick={() => showToast('📦 Reorder request sent!')}>
                    <i className="fas fa-truck"></i> Reorder All Low
                  </button>
                </div>
                {[
                  { icon: '🥥', name: 'Coconut Milk', unit: 'Tins', stock: 8, max: 50, status: 'critical' },
                  { icon: '🐟', name: 'Ikan Bilis (Anchovies)', unit: 'kg', stock: 1.2, max: 5, status: 'low' },
                  { icon: '🍚', name: 'Jasmine Rice', unit: 'kg', stock: 42, max: 60, status: 'ok' },
                  { icon: '🌶️', name: 'Dried Chili', unit: 'kg', stock: 3.5, max: 10, status: 'low' },
                  { icon: '🥜', name: 'Roasted Peanuts', unit: 'kg', stock: 8, max: 15, status: 'ok' },
                  { icon: '🥚', name: 'Eggs', unit: 'trays', stock: 12, max: 20, status: 'ok' },
                  { icon: '🍜', name: 'Yellow Noodles', unit: 'kg', stock: 18, max: 25, status: 'ok' },
                  { icon: '🧋', name: 'Teh Tarik Powder', unit: 'kg', stock: 0.8, max: 5, status: 'critical' },
                  { icon: '🫙', name: 'Palm Sugar', unit: 'kg', stock: 4, max: 8, status: 'low' },
                  { icon: '🌿', name: 'Pandan Leaves', unit: 'bundles', stock: 22, max: 30, status: 'ok' },
                ].map((item, index) => {
                  const pct = Math.round((item.stock / item.max) * 100);
                  const cls = item.status === 'ok' ? 'inv-fill-ok' : item.status === 'low' ? 'inv-fill-low' : 'inv-fill-critical';
                  const bdg = item.status === 'ok' ? 'inv-ok' : item.status === 'low' ? 'inv-low' : 'inv-critical';
                  const txt = item.status === 'ok' ? 'In Stock' : item.status === 'low' ? 'Low Stock' : 'Critical';
                  const col = item.status === 'ok' ? 'var(--mint)' : item.status === 'low' ? 'var(--gold)' : 'var(--red)';
                  return (
                    <div key={index} className="inv-item">
                      <div className="inv-icon" style={{ background: 'rgba(255,255,255,.05)' }}>{item.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div className="inv-name">{item.name}</div>
                        <div className="inv-stock">{item.stock} / {item.max} {item.unit}</div>
                      </div>
                      <div className="inv-bar-wrap">
                        <div className="inv-bar-bg">
                          <div className={`inv-bar-fill ${cls}`} style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                      <div className="inv-pct" style={{ color: col }}>{pct}%</div>
                      <span className={`inv-badge ${bdg}`}>{txt}</span>
                      <button className="t-action" style={{ marginLeft: '8px' }} onClick={() => showToast(`📦 Reorder: ${item.name}`)}>
                        Reorder
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* MENU MANAGEMENT SECTION */}
          {activeSection === 'menu-mgmt' && (
            <>
              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-label">Total Items</div>
                  <div className="kpi-value" style={{ color: 'var(--saffron)' }}>16</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">Available</div>
                  <div className="kpi-value" style={{ color: 'var(--mint)' }}>15</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">Sold Out</div>
                  <div className="kpi-value" style={{ color: 'var(--red)' }}>1</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">New This Week</div>
                  <div className="kpi-value" style={{ color: 'var(--gold)' }}>3</div>
                </div>
              </div>
              <div className="table-card">
                <div className="table-top">
                  <div>
                    <div className="card-title">Menu Items</div>
                    <div className="card-sub">Manage availability and pricing</div>
                  </div>
                  <button className="btn-primary-sm" onClick={() => showToast('➕ Add item form coming soon!')}>
                    <i className="fas fa-plus"></i> Add Item
                  </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Today's Orders</th>
                        <th>Rating</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Nasi Lemak Special', cat: 'Rice', price: 7.50, status: 'available', orders: 87, rating: 4.8 },
                        { name: 'Nasi Goreng Kampung', cat: 'Rice', price: 9.00, status: 'available', orders: 42, rating: 4.5 },
                        { name: 'Nasi Ayam Hainan', cat: 'Rice', price: 10.50, status: 'available', orders: 31, rating: 4.7 },
                        { name: 'Nasi Briyani Kambing', cat: 'Rice', price: 13.00, status: 'available', orders: 22, rating: 4.6 },
                        { name: 'Mee Goreng Mamak', cat: 'Noodles', price: 8.00, status: 'available', orders: 50, rating: 4.4 },
                        { name: 'Chicken Ramen', cat: 'Noodles', price: 12.00, status: 'available', orders: 28, rating: 4.8 },
                        { name: 'Laksa Sarawak', cat: 'Noodles', price: 9.50, status: 'available', orders: 19, rating: 4.3 },
                        { name: 'Crispy Spring Rolls', cat: 'Snacks', price: 4.00, status: 'available', orders: 35, rating: 4.2 },
                        { name: 'Roti Canai + Curry', cat: 'Snacks', price: 3.50, status: 'available', orders: 66, rating: 4.9 },
                        { name: 'Curry Puff', cat: 'Snacks', price: 2.50, status: 'sold-out', orders: 0, rating: 4.1 },
                        { name: 'Teh Tarik Kaw', cat: 'Drinks', price: 2.50, status: 'available', orders: 59, rating: 4.7 },
                        { name: 'Taro Bubble Tea', cat: 'Drinks', price: 6.50, status: 'available', orders: 39, rating: 4.5 },
                        { name: 'Fresh Orange Juice', cat: 'Drinks', price: 5.00, status: 'available', orders: 24, rating: 4.3 },
                        { name: 'Cendol Deluxe', cat: 'Desserts', price: 5.00, status: 'available', orders: 18, rating: 4.6 },
                        { name: 'Ais Kacang', cat: 'Desserts', price: 4.50, status: 'available', orders: 14, rating: 4.4 },
                        { name: 'Kuih Lapis', cat: 'Desserts', price: 3.00, status: 'available', orders: 11, rating: 4.5 },
                      ].map((item, index) => (
                        <tr key={index}>
                          <td style={{ fontWeight: 600 }}>{item.name}</td>
                          <td style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,.45)' }}>{item.cat}</td>
                          <td className="t-amount">RM {item.price.toFixed(2)}</td>
                          <td>
                            <span className={`t-status ${item.status === 'available' ? 's-ready' : 's-cancelled'}`}>
                              {item.status === 'available' ? 'Available' : 'Sold Out'}
                            </span>
                          </td>
                          <td style={{ fontFamily: "'Space Mono', monospace", color: 'var(--saffron)', fontSize: '0.82rem' }}>{item.orders}</td>
                          <td style={{ color: 'var(--gold)' }}>{item.rating}★</td>
                          <td style={{ display: 'flex', gap: '6px' }}>
                            <button className="t-action" onClick={() => showToast(`✏️ Edit: ${item.name}`)}>Edit</button>
                            <button className="t-action" onClick={() => showToast(`🔄 Toggled!`)}>
                              {item.status === 'available' ? 'Disable' : 'Enable'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* SETTINGS SECTION */}
          {activeSection === 'settings' && (
            <>
              <div className="table-card">
                <div className="card-title" style={{ marginBottom: '4px' }}>⚙️ System Settings</div>
                <div className="card-sub" style={{ marginBottom: '24px' }}>Canteen configuration & preferences</div>
                <div className="settings-grid">
                  <div>
                    <div className="setting-group">
                      <label className="setting-label">Canteen Name</label>
                      <input className="setting-input" defaultValue="CanteenGo — Block A" />
                    </div>
                    <div className="setting-group">
                      <label className="setting-label">Location</label>
                      <input className="setting-input" defaultValue="Block A, Level 1, Faculty Building" />
                    </div>
                    <div className="setting-group">
                      <label className="setting-label">Contact Phone</label>
                      <input className="setting-input" defaultValue="+60 12-345 6789" />
                    </div>
                    <div className="setting-group">
                      <label className="setting-label">Opening Time</label>
                      <input className="setting-input" type="time" defaultValue="07:00" />
                    </div>
                    <div className="setting-group">
                      <label className="setting-label">Closing Time</label>
                      <input className="setting-input" type="time" defaultValue="20:00" />
                    </div>
                    <div className="setting-group">
                      <label className="setting-label">Admin Email</label>
                      <input className="setting-input" defaultValue="admin@canteengo.my" />
                    </div>
                  </div>
                  <div>
                    <div className="setting-group">
                      <label className="setting-label">Service Charge (%)</label>
                      <input className="setting-input" type="number" defaultValue={5} />
                    </div>
                    <div className="setting-group">
                      <label className="setting-label">SST Tax (%)</label>
                      <input className="setting-input" type="number" defaultValue={6} />
                    </div>
                    <div className="setting-group">
                      <label className="setting-label">Delivery Fee (RM)</label>
                      <input className="setting-input" type="number" defaultValue={3.00} />
                    </div>
                    <div className="setting-group">
                      <label className="setting-label">Daily Revenue Target (RM)</label>
                      <input className="setting-input" type="number" defaultValue={4000} />
                    </div>
                    <div style={{ marginTop: '16px' }}>
                      <div className="toggle-row">
                        <span>Enable Online Ordering</span>
                        <label className="sw">
                          <input type="checkbox" defaultChecked />
                          <div className="sw-slider"></div>
                        </label>
                      </div>
                      <div className="toggle-row">
                        <span>Enable Delivery Service</span>
                        <label className="sw">
                          <input type="checkbox" defaultChecked />
                          <div className="sw-slider"></div>
                        </label>
                      </div>
                      <div className="toggle-row">
                        <span>Digital Payment (QR/eWallet)</span>
                        <label className="sw">
                          <input type="checkbox" defaultChecked />
                          <div className="sw-slider"></div>
                        </label>
                      </div>
                      <div className="toggle-row">
                        <span>Auto-Print Receipts</span>
                        <label className="sw">
                          <input type="checkbox" />
                          <div className="sw-slider"></div>
                        </label>
                      </div>
                      <div className="toggle-row">
                        <span>Low Stock Alerts</span>
                        <label className="sw">
                          <input type="checkbox" defaultChecked />
                          <div className="sw-slider"></div>
                        </label>
                      </div>
                      <div className="toggle-row">
                        <span>Daily Report Email</span>
                        <label className="sw">
                          <input type="checkbox" defaultChecked />
                          <div className="sw-slider"></div>
                        </label>
                      </div>
                    </div>
                    <button
                      className="btn-primary-sm"
                      style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}
                      onClick={() => showToast('✅ Settings saved!')}
                    >
                      <i className="fas fa-save"></i> Save Settings
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* EXPORT MODAL */}
      {showExportModal && (
        <div className="modal-overlay open" onClick={closeExportModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">📥 Export Report</div>
            <div className="modal-sub">Choose your preferred format</div>
            <div
              className="export-option"
              onClick={() => {
                showToast('📄 PDF exported!');
                closeExportModal();
              }}
            >
              <div className="export-icon" style={{ background: 'rgba(239,68,68,.12)' }}>📄</div>
              <div>
                <div className="export-label">PDF Report</div>
                <div className="export-desc">Full formatted report with charts</div>
              </div>
              <i className="fas fa-chevron-right" style={{ marginLeft: 'auto', color: 'rgba(255,255,255,.3)' }}></i>
            </div>
            <div
              className="export-option"
              onClick={() => {
                showToast('📊 Excel exported!');
                closeExportModal();
              }}
            >
              <div className="export-icon" style={{ background: 'rgba(0,201,167,.12)' }}>📊</div>
              <div>
                <div className="export-label">Excel / CSV</div>
                <div className="export-desc">Raw data for further analysis</div>
              </div>
              <i className="fas fa-chevron-right" style={{ marginLeft: 'auto', color: 'rgba(255,255,255,.3)' }}></i>
            </div>
            <div
              className="export-option"
              onClick={() => {
                showToast('📧 Sent to admin@canteengo.my!');
                closeExportModal();
              }}
            >
              <div className="export-icon" style={{ background: 'rgba(59,130,246,.12)' }}>📧</div>
              <div>
                <div className="export-label">Email Report</div>
                <div className="export-desc">Send directly to your inbox</div>
              </div>
              <i className="fas fa-chevron-right" style={{ marginLeft: 'auto', color: 'rgba(255,255,255,.3)' }}></i>
            </div>
            <div style={{ marginTop: '18px', textAlign: 'right' }}>
              <button className="modal-close" onClick={closeExportModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
