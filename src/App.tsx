import React from 'react';
import { AuthProvider } from './modules/auth/context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import './index.css';

// Add font links to the document head
if (typeof document !== 'undefined') {
  const link1 = document.createElement('link');
  link1.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap';
  link1.rel = 'stylesheet';
  document.head.appendChild(link1);
  
  const link2 = document.createElement('link');
  link2.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
  link2.rel = 'stylesheet';
  document.head.appendChild(link2);
}

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
