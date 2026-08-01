import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Download, Upload, Database, CheckCircle, AlertTriangle } from 'lucide-react';

export const BackupModal = ({ isOpen, onClose }) => {
  const { lang, exportDataJSON, importDataJSON, clearAllData, showConfirm } = useStore();
  const isBn = lang === 'bn';

  const [importText, setImportText] = useState('');
  const [statusMsg, setStatusMsg] = useState(null);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        setImportText(content);
      };
      reader.readAsText(file);
    }
  };

  const handleRestore = () => {
    if (!importText.trim()) return;

    const success = importDataJSON(importText);
    if (success) {
      setStatusMsg({ type: 'success', text: isBn ? 'ডাটা সফলভাবে রিস্টোর হয়েছে!' : 'Data restored successfully!' });
      setTimeout(() => {
        onClose();
        setStatusMsg(null);
        setImportText('');
      }, 1500);
    } else {
      setStatusMsg({ type: 'error', text: isBn ? 'ভুল JSON ফাইল! রিস্টোর করা সম্ভব হয়নি।' : 'Invalid JSON file structure!' });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '550px' }}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database color="#8b5cf6" />
            <span>{isBn ? 'ডাটা ব্যাকআপ ও রিস্টোর (Data Backup & Restore)' : 'Data Backup & Restore'}</span>
          </h3>
          <button onClick={onClose} className="btn btn-secondary btn-sm">✕</button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Section 1: Export */}
          <div style={{ padding: '1rem', backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.35rem', color: '#06b6d4' }}>
              ১. ব্যাকআপ ডাউনলোড (Export Backup File)
            </h4>
            <p style={{ fontSize: '0.825rem', color: '#94a3b8', marginBottom: '0.85rem' }}>
              {isBn ? 'আপনার কম্পিউটার বা মোবাইলে দোকান ডাটাবেসের সম্পূর্ণ ব্যাকআপ ফাইল (JSON) ডাউনলোড করে নিরাপদ স্থানে রাখুন।' : 'Download full store backup JSON file'}
            </p>
            <button onClick={exportDataJSON} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
              <Download size={16} />
              <span>{isBn ? 'ডাউনলোড ব্যাকআপ JSON ফাইল' : 'Download Backup File'}</span>
            </button>
          </div>

          {/* Section 2: Import */}
          <div style={{ padding: '1rem', backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.35rem', color: '#8b5cf6' }}>
              ২. ব্যাকআপ ডাটা রিস্টোর (Restore from JSON)
            </h4>
            <p style={{ fontSize: '0.825rem', color: '#94a3b8', marginBottom: '0.85rem' }}>
              {isBn ? 'আগের সেভ করা JSON ব্যাকআপ ফাইল সিলেক্ট করে ডাটা পুনঃরুদ্ধার করুন:' : 'Select previously saved JSON backup file to restore:'}
            </p>

            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="input-control"
              style={{ marginBottom: '0.75rem' }}
            />

            {importText && (
              <button onClick={handleRestore} className="btn btn-amber btn-sm" style={{ width: '100%' }}>
                <Upload size={16} />
                <span>{isBn ? 'ডাটা রিস্টোর করুন' : 'Confirm Restore'}</span>
              </button>
            )}

            {statusMsg && (
              <div style={{
                marginTop: '0.75rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 600,
                backgroundColor: statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                color: statusMsg.type === 'success' ? '#10b981' : '#f43f5e'
              }}>
                {statusMsg.text}
              </div>
            )}
          </div>

          {/* Section 3: Reset / Wipe database */}
          <div style={{ padding: '1rem', backgroundColor: '#1e1b4b', borderRadius: '8px', border: '1px solid #dc2626' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.35rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <AlertTriangle size={16} />
              <span>৩. ডাটাবেজ ও ডেমো ডাটা রিসেট (Wipe & Reset Database)</span>
            </h4>
            <p style={{ fontSize: '0.825rem', color: '#cbd5e1', marginBottom: '0.85rem' }}>
              {isBn ? 'দোকানের সমস্ত ডেমো ডাটা এবং ডাটাবেস সম্পূর্ণ খালি করতে চান? এই কাজ করার পর ডাটা ফিরে পাওয়া যাবে না।' : 'Wipe all items and reset database to completely empty.'}
            </p>
            <button 
              onClick={async () => {
                const confirmed = await showConfirm({
                  title: isBn ? 'ডাটাবেজ সম্পূর্ণ রিসেট' : 'Wipe & Reset Database',
                  message: isBn ? 'আপনি কি নিশ্চিতভাবে দোকানের সমস্ত ডাটা মুছে ডাটাবেজটি সম্পূর্ণ খালি করতে চান? এই কাজ করার পর ডাটা পুনরায় ফিরে পাওয়া যাবে না।' : 'Are you sure you want to completely wipe all store data? This action cannot be undone.',
                  type: 'danger',
                  confirmText: isBn ? 'হ্যাঁ, ডাটা মুছে ফেলুন' : 'Wipe Data'
                });
                if (confirmed) {
                  clearAllData();
                  setStatusMsg({ type: 'success', text: isBn ? 'ডাটাবেজ সম্পূর্ণ রিসেট হয়েছে!' : 'Database wiped successfully!' });
                  setTimeout(() => {
                    onClose();
                    setStatusMsg(null);
                  }, 1500);
                }
              }} 
              className="btn btn-danger btn-sm" 
              style={{ width: '100%', backgroundColor: '#dc2626', color: '#fff' }}
            >
              <span>{isBn ? 'ডেমো ডাটা মুছুন ও ডাটাবেস খালি করুন' : 'Wipe All Data & Start Fresh'}</span>
            </button>
          </div>

        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">{isBn ? 'বন্ধ করুন' : 'Close'}</button>
        </div>
      </div>
    </div>
  );
};
