import React, { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js/auto';
import '../Report.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface TopItemsReportData {
  limit: number;
  items: Array<{
    id: number;
    name: string;
    category: string;
    sold: number;
    revenue: number;
    rating: number;
    image: string;
  }>;
}

const TopItems: React.FC = () => {
  const [report, setReport] = useState<TopItemsReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState<number>(10);
  const [activeDateFilter, setActiveDateFilter] = useState('today');
  const [error, setError] = useState<string | null>(null);

  // Sample data for demonstration
  const allItems: TopItemsReportData = {
    limit: 10,
    items: [
      { id: 1, name: 'Nasi Lemak Special', category: 'Rice', sold: 87, revenue: 652.50, rating: 4.8, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=80&h=80&fit=crop' },
      { id: 2, name: 'Roti Canai + Curry', category: 'Snacks', sold: 66, revenue: 231.00, rating: 4.9, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=80&h=80&fit=crop' },
      { id: 3, name: 'Teh Tarik Kaw', category: 'Drinks', sold: 59, revenue: 147.50, rating: 4.7, image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=80&h=80&fit=crop' },
      { id: 4, name: 'Mee Goreng Mamak', category: 'Noodles', sold: 50, revenue: 400.00, rating: 4.4, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=80&h=80&fit=crop' },
      { id: 5, name: 'Taro Bubble Tea', category: 'Drinks', sold: 39, revenue: 253.50, rating: 4.5, image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=80&h=80&fit=crop' },
      { id: 6, name: 'Nasi Goreng Kampung', category: 'Rice', sold: 42, revenue: 378.00, rating: 4.5, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=80&h=80&fit=crop' },
      { id: 7, name: 'Crispy Spring Rolls', category: 'Snacks', sold: 35, revenue: 140.00, rating: 4.2, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=80&h=80&fit=crop' },
      { id: 8, name: 'Nasi Ayam Hainan', category: 'Rice', sold: 31, revenue: 325.50, rating: 4.7, image: 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=80&h=80&fit=crop' },
      { id: 9, name: 'Chicken Ramen', category: 'Noodles', sold: 28, revenue: 336.00, rating: 4.8, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=80&h=80&fit=crop' },
      { id: 10, name: 'Fresh Orange Juice', category: 'Drinks', sold: 24, revenue: 120.00, rating: 4.3, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=80&h=80&fit=crop' },
      { id: 11, name: 'Laksa Sarawak', category: 'Noodles', sold: 19, revenue: 180.50, rating: 4.3, image: 'https://images.unsplash.com/photo-1576577445504-6af96477db52?w=80&h=80&fit=crop' },
      { id: 12, name: 'Cendol Deluxe', category: 'Desserts', sold: 18, revenue: 90.00, rating: 4.6, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=80&h=80&fit=crop' },
    ],
  };

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setReport({ ...allItems, limit, items: allItems.items.slice(0, limit) });
    } catch (err) {
      setError('Failed to load report. Please try again later.');
      console.error('Report error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [limit]);

  const handleDateFilterChange = (filter: string) => {
    setActiveDateFilter(filter);
    showToast(`📅 Showing data for: ${filter === 'today' ? 'Today' : filter === 'week' ? 'This Week' : 'This Month'}`);
  };

  const showToast = (message: string) => {
    const container = document.getElementById('toastContainer') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const createToastContainer = () => {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'var(--gold)';
    if (rank === 2) return '#aaa';
    if (rank === 3) return '#cd7f32';
    return 'rgba(255,255,255,.4)';
  };

  const getTrendIcon = (rank: number) => {
    if (rank <= 5) return '📈';
    if (rank <= 10) return '➡️';
    return '📉';
  };

  const categoryColors: { [key: string]: string } = {
    'Rice': '#FF6B2B',
    'Noodles': '#FFB830',
    'Snacks': '#00C9A7',
    'Drinks': '#a855f7',
    'Desserts': '#3b82f6',
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="admin-main">
          <div className="page-body">
            <div className="kpi-grid">
              {[1, 2].map((i) => (
                <div key={i} className="chart-card" style={{ opacity: 0.5 }}>
                  <div className="card-title">Loading...</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <div className="admin-main">
        <div className="page-body">
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
          </div>

          {error ? (
            <div className="alert-card danger" style={{ marginBottom: '24px' }}>
              <div className="alert-icon">❌</div>
              <div>
                <div className="alert-title">Error Loading Report</div>
                <div className="alert-desc">{error}</div>
              </div>
            </div>
          ) : report && (
            <>
              {/* CHARTS ROW */}
              <div className="charts-row">
                <div className="chart-card">
                  <div className="card-title">Orders by Item — Top 8</div>
                  <div className="card-sub">Today's bestsellers</div>
                  <Bar
                    data={{
                      labels: report.items.slice(0, 8).map(m => m.name.split(' ').slice(0, 2).join(' ')),
                      datasets: [{
                        data: report.items.slice(0, 8).map(m => m.sold),
                        backgroundColor: 'rgba(255,107,43,.75)',
                        borderRadius: 8,
                        borderSkipped: false,
                      }],
                    }}
                    options={{
                      responsive: true,
                      indexAxis: 'y' as const,
                      plugins: { legend: { display: false } },
                      scales: {
                        x: {
                          grid: { color: 'rgba(255,255,255,.04)' },
                          ticks: { color: 'rgba(255,255,255,.38)' },
                        },
                        y: {
                          grid: { display: false },
                          ticks: { color: 'rgba(255,255,255,.5)', font: { size: 11 } },
                        },
                      },
                    }}
                  />
                </div>
                <div className="chart-card">
                  <div className="card-title">Revenue Share by Category</div>
                  <div className="card-sub">Today</div>
                  <Doughnut
                    data={{
                      labels: ['Rice', 'Noodles', 'Snacks', 'Drinks', 'Desserts'],
                      datasets: [{
                        data: [35, 22, 15, 20, 8],
                        backgroundColor: ['#FF6B2B', '#FFB830', '#00C9A7', '#a855f7', '#3b82f6'],
                        borderWidth: 0,
                      }],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            color: 'rgba(255,255,255,.5)',
                            font: { size: 10 },
                          },
                        },
                      },
                      cutout: '62%',
                    }}
                  />
                </div>
              </div>

              {/* FULL RANKINGS TABLE */}
              <div className="table-card">
                <div className="table-top">
                  <div>
                    <div className="card-title">🏆 Full Item Rankings</div>
                    <div className="card-sub">All items ranked by orders</div>
                  </div>
                  <button className="btn-export" onClick={() => showToast('📊 CSV exported!')}>
                    <i className="fas fa-download"></i> Export
                  </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Item</th>
                        <th>Category</th>
                        <th>Orders</th>
                        <th>Revenue</th>
                        <th>Avg Rating</th>
                        <th>Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.items.map((item, index) => (
                        <tr key={item.id}>
                          <td style={{ fontWeight: 700, color: getRankColor(index + 1) }}>
                            #{index + 1}
                          </td>
                          <td style={{ fontWeight: 600 }}>{item.name}</td>
                          <td style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,.45)' }}>{item.category}</td>
                          <td className="t-id">{item.sold}</td>
                          <td className="t-amount">RM {item.revenue.toFixed(2)}</td>
                          <td style={{ color: 'var(--gold)' }}>{item.rating}★</td>
                          <td>{getTrendIcon(index + 1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopItems;
