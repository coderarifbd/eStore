import React from 'react';
import { AlertTriangle, Trash2, HelpCircle, X, Check } from 'lucide-react';

export const ConfirmModal = ({ confirmState, onClose }) => {
  if (!confirmState || !confirmState.isOpen) return null;

  const { title, message, type = 'danger', confirmText, cancelText, resolveFn } = confirmState;

  const handleAction = (result) => {
    if (resolveFn) resolveFn(result);
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <Trash2 size={28} color="#ef4444" />;
      case 'warning':
        return <AlertTriangle size={28} color="#f59e0b" />;
      default:
        return <HelpCircle size={28} color="#06b6d4" />;
    }
  };

  const getHeaderBg = () => {
    switch (type) {
      case 'danger':
        return 'rgba(239, 68, 68, 0.12)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.12)';
      default:
        return 'rgba(6, 182, 212, 0.12)';
    }
  };

  const getBtnBg = () => {
    switch (type) {
      case 'danger':
        return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      case 'warning':
        return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      default:
        return 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)';
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 9999, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)' }}>
      <div 
        className="modal-content animate-scale-up" 
        style={{ 
          maxWidth: '440px', 
          backgroundColor: '#0f172a', 
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 30px rgba(6, 182, 212, 0.15)',
          overflow: 'hidden',
          padding: 0
        }}
      >
        {/* Header */}
        <div style={{ 
          padding: '1.25rem 1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          backgroundColor: getHeaderBg(),
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            {getIcon()}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
              {title}
            </h3>
          </div>
          <button 
            onClick={() => handleAction(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Message Body */}
        <div style={{ padding: '1.5rem', fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.6' }}>
          {message}
        </div>

        {/* Action Buttons */}
        <div style={{ 
          padding: '1rem 1.5rem 1.25rem', 
          display: 'flex', 
          gap: '0.75rem', 
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <button
            type="button"
            onClick={() => handleAction(false)}
            className="btn"
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              color: '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {cancelText || 'বাতিল'}
          </button>
          
          <button
            type="button"
            onClick={() => handleAction(true)}
            className="btn"
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              background: getBtnBg(),
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: type === 'danger' ? '0 4px 14px rgba(239, 68, 68, 0.4)' : '0 4px 14px rgba(6, 182, 212, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            {type === 'danger' ? <Trash2 size={16} /> : <Check size={16} />}
            <span>{confirmText || 'হ্যাঁ, নিশ্চিত করুন'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
