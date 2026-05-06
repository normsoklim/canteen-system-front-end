import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import ProtectedRoute from '../modules/auth/components/ProtectedRoute';
import HomePage from '../modules/home/pages/HomePage';
import MenuPage from '../modules/menu/pages/MenuPage';
import DailyReport from '../modules/reports/components/DailyReport';
import DeliveryPage from '../modules/Delivery/page/DeliveryPage';
import MonthlyReport from '../modules/reports/components/MonthlyReport';
import TopItems from '../modules/reports/components/TopItems';
import SystemSettings from '../modules/settings/pages/SystemSettings';
import Login from '../modules/auth/pages/Login';
import Register from '../modules/auth/pages/Register';
import VerifyOTP from '../modules/auth/pages/VerifyOTP';
import ReportPage from '../modules/reports/pages/ReportPage';
import TrackPage from '../modules/orderTracking/pages/TrackPage';
import AboutPage from '../modules/about/page/aboutPage';
import OrderPage from '../modules/order/pages/OrderPage';
import Profile from '../modules/user/pages/Profile';

const AppRoutes: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/menu" element={
              <MenuPage />
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          } />
          <Route path="/order-status" element={
            <ProtectedRoute>
              <TrackPage />
            </ProtectedRoute>
          } />
          <Route path="/order-history" element={
            <ProtectedRoute>
              <TrackPage />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ReportPage />
            </ProtectedRoute>
          } />
         {/*  <Route path="/tracks" element={
            <ProtectedRoute>
              <TrackPage />
            </ProtectedRoute>
          } /> */}
          <Route path='/tracks' element={<TrackPage />} />
          
          <Route path="/daily-report" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DailyReport />
            </ProtectedRoute>
          } />
          <Route path="/monthly-report" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <MonthlyReport />
            </ProtectedRoute>
          } />
          <Route path="/top-items" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <TopItems />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SystemSettings />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/delivery" element={
            <ProtectedRoute allowedRoles={['staff', 'admin']}>
              <DeliveryPage />
            </ProtectedRoute>
          } />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/careers" element={<Navigate to="/" />} />
          <Route path="/blog" element={<Navigate to="/" />} />
          <Route path="/partners" element={<Navigate to="/" />} />
          <Route path="/unauthorized" element={
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              backgroundColor: '#0d0d0d',
              color: 'white',
              textAlign: 'center',
              padding: '20px'
            }}>
              <div>
                <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>403 - Unauthorized</h1>
                <p>You don't have permission to access this page.</p>
                <button
                  onClick={() => window.history.back()}
                  style={{
                    marginTop: '1rem',
                    padding: '10px 20px',
                    backgroundColor: '#ff6b2b',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Go Back
                </button>
              </div>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default AppRoutes;