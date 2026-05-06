import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js/auto';
import '../Report.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DailyReportData {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  totalItemsSold: number;
  popularItems: Array<{
    id: number;
    name: string;
    category: string;
    sold: number;
    revenue: number;
    unitPrice: number;
  }>;
  revenueByCategory: Array<{
    category: string;
    revenue: number;
    color: string;
  }>;
}

const DailyReport: React.FC = () => {
  const [report, setReport] = useState<DailyReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);

  // Sample data for demonstration
  const sampleData: DailyReportData = {
    date: '2026-03-20',
    totalOrders: 312,
    totalRevenue: 4280,
    totalItemsSold: 1248,
    popularItems: [
      { id: 1, name: 'Nasi Lemak Special', category: 'Rice', sold: 87, revenue: 652.50, unitPrice: 7.50 },
      { id: 2, name: 'Roti Canai + Curry', category: 'Snacks', sold: 66, revenue: 231.00, unitPrice: 3.50 },
      { id: 3, name: 'Teh Tarik Kaw', category: 'Drinks', sold: 59, revenue: 147.50, unitPrice: 2.50 },
      { id: 4, name: 'Mee Goreng Mamak', category: 'Noodles', sold: 50, revenue: 400.00, unitPrice: 8.00 },
      { id: 5, name: 'Taro Bubble Tea', category: 'Drinks', sold: 39, revenue: 253.50, unitPrice: 6.50 },
    ],
    revenueByCategory: [
      { category: 'Rice', revenue: 1440, color: '#FF6B2B' },
      { category: 'Noodles', revenue: 820, color: '#FFB830' },
      { category: 'Snacks', revenue: 620, color: '#00C9A7' },
      { category: 'Drinks', revenue: 680, color: '#a855f7' },
      { category: 'Desserts', revenue: 320, color: '#3b82f6' },
    ],
  };

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setReport(sampleData);
    } catch (err) {
      setError('Failed to load report. Please try again later.');
      console.error('Report error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [date]);

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

  const hourlyData = {
    labels: ['7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM'],
    datasets: [{
      label: 'Revenue',
      data: [142, 258, 195, 220, 360, 748, 712, 540, 310, 280, 330, 230, 95],
      backgroundColor: 'rgba(255,107,43,.75)',
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="admin-main">
          <div className="page-body">
            <div className="kpi-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="kpi-card" style={{ opacity: 0.5 }}>
                  <div className="kpi-label">Loading...</div>
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
              {/* KPI GRID */}
              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-label"><i className="fas fa-coins" style={{ color: 'var(--gold)' }}></i> Today's Revenue</div>
                  <div className="kpi-value" style={{ color: 'var(--gold)' }}>RM {report.totalRevenue.toLocaleString()}</div>
                  <div className="kpi-change up"><i className="fas fa-arrow-up"></i> +18.5% vs yesterday</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label"><i className="fas fa-receipt" style={{ color: 'var(--saffron)' }}></i> Total Orders</div>
                  <div className="kpi-value" style={{ color: 'var(--saffron)' }}>{report.totalOrders}</div>
                  <div className="kpi-change up"><i className="fas fa-arrow-up"></i> +12.3% vs yesterday</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label"><i className="fas fa-shopping-basket" style={{ color: 'var(--mint)' }}></i> Items Sold</div>
                  <div className="kpi-value" style={{ color: 'var(--mint)' }}>{report.totalItemsSold}</div>
                  <div className="kpi-change up"><i className="fas fa-arrow-up"></i> +8.7% vs yesterday</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label"><i className="fas fa-clock" style={{ color: 'var(--purple)' }}></i> Peak Hour</div>
                  <div className="kpi-value" style={{ color: 'var(--purple)' }}>12:30 PM</div>
                  <div className="kpi-change">Busiest time</div>
                </div>
              </div>

              {/* CHARTS ROW */}
              <div className="charts-row">
                <div className="chart-card">
                  <div className="card-title">Revenue by Hour</div>
                  <div className="card-sub">Today · Every hour</div>
                  <Bar
                    data={hourlyData}
                    options={{
                      responsive: true,
                      plugins: { legend: { display: false } },
                      scales: {
                        x: {
                          grid: { display: false },
                          ticks: { color: 'rgba(255,255,255,.38)', font: { size: 11 } },
                        },
                        y: {
                          grid: { color: 'rgba(255,255,255,.04)' },
                          ticks: {
                            color: 'rgba(255,255,255,.38)',
                            font: { size: 11 },
                            callback: (v: any) => 'RM ' + v,
                          },
                        },
                      },
                    }}
                  />
                </div>
                <div className="chart-card">
                  <div className="card-title">Revenue by Category</div>
                  <div className="card-sub">Today's split</div>
                  <Bar
                    data={{
                      labels: report.revenueByCategory.map(c => c.category),
                      datasets: [{
                        data: report.revenueByCategory.map(c => c.revenue),
                        backgroundColor: report.revenueByCategory.map(c => c.color),
                        borderRadius: 8,
                        borderSkipped: false,
                      }],
                    }}
                    options={{
                      responsive: true,
                      indexAxis: 'y',
                      plugins: { legend: { display: false } },
                      scales: {
                        x: {
                          grid: { color: 'rgba(255,255,255,.04)' },
                          ticks: {
                            color: 'rgba(255,255,255,.38)',
                            font: { size: 11 },
                            callback: (v: any) => 'RM ' + v,
                          },
                        },
                        y: {
                          grid: { display: false },
                          ticks: { color: 'rgba(255,255,255,.5)', font: { size: 12 } },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* DAILY BREAKDOWN TABLE */}
              <div className="table-card">
                <div className="table-top">
                  <div>
                    <div className="card-title">Daily Breakdown by Item</div>
                    <div className="card-sub">All items sold today with revenue</div>
                  </div>
                  <button className="btn-export" onClick={() => showToast('📊 CSV exported!')}>
                    <i className="fas fa-download"></i> Export CSV
                  </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Category</th>
                        <th>Qty Sold</th>
                        <th>Unit Price</th>
                        <th>Revenue</th>
                        <th>% of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.popularItems.map((item, index) => (
                        <tr key={item.id}>
                          <td style={{ fontWeight: 600 }}>{item.name}</td>
                          <td style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,.45)' }}>{item.category}</td>
                          <td className="t-id">{item.sold}</td>
                          <td className="t-amount">RM {item.unitPrice.toFixed(2)}</td>
                          <td className="t-amount">RM {item.revenue.toFixed(2)}</td>
                          <td style={{ color: 'rgba(255,255,255,.5)', fontSize: '0.8rem' }}>
                            {((item.revenue / report.totalRevenue) * 100).toFixed(1)}%
                          </td>
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

export default DailyReport;
