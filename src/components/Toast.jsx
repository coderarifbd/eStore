import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const bgColors = {
    success: 'rgba(16, 185, 129, 0.95)',
    error: 'rgba(244, 63, 94, 0.95)',
    info: 'rgba(6, 182, 212, 0.95)',
    warning: 'rgba(245, 158, 11, 0.95)'
  };

  const Icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle
  };

  const IconComponent = Icons[type] || CheckCircle2;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 999999,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.85rem 1.25rem',
      backgroundColor: bgColors[type],
      color: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(6, 182, 212, 0.3)',
      backdropFilter: 'blur(10px)',
      fontWeight: 600,
      fontSize: '0.925rem',
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      maxWidth: '380px'
    }}>
      <IconComponent size={20} />
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            opacity: 0.8
          }}
        >
          <X size={16} />
        </button>
      )}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};
