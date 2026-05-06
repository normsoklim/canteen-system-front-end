import React, { useEffect } from 'react';

interface ToastNotificationProps {
  toasts: Array<{ id: string; title: string; subtitle: string; icon: string }>;
  onRemove: (id: string) => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, onRemove }) => {
  useEffect(() => {
    const timers: number[] = [];
    
    toasts.forEach(toast => {
      const timer = window.setTimeout(() => {
        onRemove(toast.id);
      }, 3000);
      timers.push(timer);
    });
    
    return () => {
      timers.forEach(timer => window.clearTimeout(timer));
    };
  }, [toasts, onRemove]);

  return (
    <div id="toastArea">
      {toasts.map((toast) => (
        <div
          key={toast.id}
        >
          <span>{toast.icon}</span>
          <div>
            <strong>{toast.title}</strong>
            <span>{toast.subtitle}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastNotification;