import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
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
} from 'chart.js/auto';
import '../Report.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface MonthlyReportData {
  month: string;
  year: string;
  totalOrders: number;
  totalRevenue: number;
  totalItemsSold: number;
  averageOrderValue: number;
  uniqueCustomers: number;
  averageRating: number;
  popularItems: Array<{
    id: number;
    name: string;
    category: string;
    sold: number;
    revenue: number;
  }>;
  revenueByCategory: Array<{
    category: string;
    revenue: number;
    color: string;
  }>;
}

const MonthlyReport: React.FC = () => {
  const [report, setReport] = useState<MonthlyReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState<string>('03');
  const [year, setYear] = useState<string>('2026');
  const [error, setError] = useState<string | null>(null);

  // Sample data for demonstration
  const sampleData: MonthlyReportData = {
    month: '03',
    year: '2026',
    totalOrders: 6842,
    totalRevenue: 89420,
    totalItemsSold: 24580,
    averageOrderValue: 13.07,
    uniqueCustomers: 1230,
    averageRating: 4.7,
    popularItems: [
      { id: 1, name: 'Nasi Lemak Special', category: 'Rice', sold: 1245, revenue: 9337.50 },
      { id: 2, name: 'Roti Canai + Curry', category: 'Snacks', sold: 987, revenue: 3454.50 },
      { id: 3, name: 'Teh Tarik Kaw', category: 'Drinks', sold: 856, revenue: 2140.00 },
      { id: 4, name: 'Mee Goreng Mamak', category: 'Noodles', sold: 742, revenue: 5936.00 },
      { id: 5, name: 'Taro Bubble Tea', category: 'Drinks', sold: 623, revenue: 4049.50 },
    ],
    revenueByCategory: [
      { category: 'Rice', revenue: 31240, color: '#FF6B2B' },
      { category: 'Noodles', revenue: 18420, color: '#FFB830' },
      { category: 'Snacks', revenue: 14200, color: '#00C9A7' },
      { category: 'Drinks', revenue: 16800, color: '#a855f7' },
      { category: 'Desserts', revenue: 8760, color: '#3b82f6' },
    ],
  };

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
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
  }, [month, year]);

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

  const monthlyChartData = {
    labels: Array.from({ length: 20 }, (_, i) => `Mar ${i + 1}`),
    datasets: [
      {
        label: 'This Month',
        data: [3800, 3200, 4100, 3600, 4500, 3900, 4200, 3700, 4800, 4100, 3500, 4300, 3900, 4600, 3800, 4200, 4500, 3900, 4100, 4280],
        borderColor: '#FF6B2B',
        backgroundColor: 'rgba(255,107,43,.06)',
        borderWidth: 2,
        pointRadius: 3,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Last Month',
        data: [3400, 3000, 3800, 3200, 4000, 3500, 3900, 3400, 4400, 3700, 3200, 4000, 3600, 4200, 3500, 3800, 4100, 3600, 3800, 3900],
        borderColor: 'rgba(255,255,255,.2)',
        borderDash: [4, 4],
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const weekCompareData = {
    labels: ['W1', 'W2', 'W3', 'W4'],
    datasets: [
      {
        label: 'March',
        data: [18200, 22400, 24800, 24020],
        backgroundColor: 'rgba(255,107,43,.8)',
        borderRadius: 8,
      },
      {
        label: 'February',
        data: [16400, 19800, 22100, 21180],
        backgroundColor: 'rgba(255,255,255,.12)',
        borderRadius: 8,
      },
    ],
  };

  const topDaysData = {
    labels: ['Mar 7', 'Mar 14', 'Mar 13', 'Mar 6', 'Mar 20'],
    datasets: [{
      data: [5200, 4980, 4720, 4650, 4280],
      backgroundColor: ['#FFB830', '#FF6B2B', '#FF6B2B', 'rgba(255,255,255,.2)', 'rgba(255,255,255,.2)'],
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="admin-main">
          <div className="page-body">
            <div className="kpi-grid">
              {[1, 2, 3, 4].map((i) => (
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
                  <div className="kpi-label"><i className="fas fa-coins" style={{ color: 'var(--gold)' }}></i> Month Revenue</div>
                  <div className="kpi-value" style={{ color: 'var(--gold)' }}>RM {report.totalRevenue.toLocaleString()}</div>
                  <div className="kpi-change up"><i className="fas fa-arrow-up"></i> +12.4% vs Feb</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label"><i className="fas fa-receipt" style={{ color: 'var(--saffron)' }}></i> Total Orders</div>
                  <div className="kpi-value" style={{ color: 'var(--saffron)' }}>{report.totalOrders.toLocaleString()}</div>
                  <div className="kpi-change up"><i className="fas fa-arrow-up"></i> +9.1% vs Feb</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label"><i className="fas fa-user-check" style={{ color: 'var(--mint)' }}></i> Unique Customers</div>
                  <div className="kpi-value" style={{ color: 'var(--mint)' }}>{report.uniqueCustomers.toLocaleString()}</div>
                  <div className="kpi-change up"><i className="fas fa-arrow-up"></i> +7.8% vs Feb</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label"><i className="fas fa-star" style={{ color: 'var(--purple)' }}></i> Avg Rating</div>
                  <div className="kpi-value" style={{ color: 'var(--purple)' }}>{report.averageRating}★</div>
                  <div className="kpi-change up"><i className="fas fa-arrow-up"></i> +0.2 vs Feb</div>
                </div>
              </div>

              {/* MONTHLY CHART */}
              <div className="chart-card-full">
                <div className="card-title">Monthly Revenue — {monthNames[parseInt(month) - 1]} {year}</div>
                <div className="card-sub">Daily revenue over the month so far</div>
                <Line
                  data={monthlyChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: true,
                        labels: {
                          color: 'rgba(255,255,255,.5)',
                          font: { size: 11 },
                          usePointStyle: true,
                          pointStyle: 'circle',
                          padding: 20,
                        },
                      },
                      tooltip: {
                        backgroundColor: 'rgba(20, 20, 22, 0.95)',
                        titleColor: '#fff',
                        bodyColor: 'rgba(255, 255, 255, 0.8)',
                        borderColor: 'rgba(255, 107, 43, 0.3)',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                          label: (context: any) => `${context.dataset.label}: RM ${context.raw}`
                        }
                      }
                    },
                    scales: {
                      x: {
                        grid: { color: 'rgba(255,255,255,.04)' },
                        ticks: { color: 'rgba(255,255,255,.3)', maxTicksLimit: 10, font: { size: 11 } },
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

              {/* CHARTS ROW */}
              <div className="charts-row">
                <div className="chart-card">
                  <div className="card-title">Week-on-Week Comparison</div>
                  <div className="card-sub">{monthNames[parseInt(month) - 1]} vs February (weekly)</div>
                  <Bar
                    data={weekCompareData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          labels: {
                            color: 'rgba(255,255,255,.5)',
                            font: { size: 11 },
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 15,
                          },
                        },
                        tooltip: {
                          backgroundColor: 'rgba(20, 20, 22, 0.95)',
                          titleColor: '#fff',
                          bodyColor: 'rgba(255, 255, 255, 0.8)',
                          borderColor: 'rgba(255, 107, 43, 0.3)',
                          borderWidth: 1,
                          padding: 12,
                          displayColors: true,
                          callbacks: {
                            label: (context: any) => `${context.dataset.label}: RM ${context.raw}`
                          }
                        }
                      },
                      scales: {
                        x: {
                          grid: { display: false },
                          ticks: { color: 'rgba(255,255,255,.4)', font: { size: 11 } },
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
                  <div className="card-title">Top Revenue Days</div>
                  <div className="card-sub">Best performing days this month</div>
                  <Bar
                    data={topDaysData}
                    options={{
                      responsive: true,
                      indexAxis: 'y' as const,
                      plugins: { 
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: 'rgba(20, 20, 22, 0.95)',
                          titleColor: '#fff',
                          bodyColor: 'rgba(255, 255, 255, 0.8)',
                          borderColor: 'rgba(255, 107, 43, 0.3)',
                          borderWidth: 1,
                          padding: 12,
                          displayColors: false,
                          callbacks: {
                            label: (context: any) => `RM ${context.raw}`
                          }
                        }
                      },
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;
