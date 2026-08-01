import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Zap, 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  FileText, 
  Receipt, 
  Users, 
  TrendingUp, 
  Globe, 
  Database,
  RotateCcw
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onOpenBackup }) => {
  const { lang, setLang, resetToDemoData, showConfirm } = useStore();

  const isBn = lang === 'bn';

  const navItems = [
    { id: 'dashboard', labelBn: 'ড্যাশবোর্ড', labelEn: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos', labelBn: 'বিক্রয় ও পজ (POS)', labelEn: 'POS Sales', icon: ShoppingCart },
    { id: 'purchases', labelBn: 'ক্রয় ভাউচার', labelEn: 'Purchases', icon: FileText },
    { id: 'inventory', labelBn: 'পণ্য ও স্টক', labelEn: 'Inventory', icon: Package },
    { id: 'expenses', labelBn: 'দোকানের ব্যয়', labelEn: 'Expenses', icon: Receipt },
    { id: 'employees', labelBn: 'কর্মচারী ও বেতন', labelEn: 'Payroll', icon: Users },
    { id: 'reports', labelBn: 'লাভ-ক্ষতি ও রিপোর্ট', labelEn: 'Reports', icon: TrendingUp },
  ];

  return (
    <header style={{
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #334155',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Store Title & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
          }}>
            <Zap size={24} color="#0f172a" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.2, color: '#f8fafc' }}>
              {isBn ? 'ইলেকট্রিক্যাল শপ সমাধান' : 'Electrical Store Solution'}
            </h1>
            <p style={{ fontSize: '0.775rem', color: '#94a3b8' }}>
              {isBn ? 'ইনভেন্টরি, পজ, ব্যয় ও বেতন ম্যানেজমেন্ট' : 'Inventory, POS, Expenses & Payroll'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Language Switcher */}
          <button 
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="btn btn-secondary btn-sm"
            title="ভাষা পরিবর্তন করুন / Switch Language"
          >
            <Globe size={15} color="#06b6d4" />
            <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

          {/* Backup Modal Toggle */}
          <button 
            onClick={onOpenBackup}
            className="btn btn-secondary btn-sm"
            title="ডাটা ব্যাকআপ / ডাটা রিস্টোর"
          >
            <Database size={15} color="#8b5cf6" />
            <span>{isBn ? 'ব্যাকআপ' : 'Backup'}</span>
          </button>

          {/* Reset Demo Data */}
          <button 
            onClick={async () => {
              const confirmed = await showConfirm({
                title: isBn ? 'ডেমো রিসেট' : 'Reset Demo Data',
                message: isBn ? 'আপনি কি নিশ্চিত যে সমস্ত টেস্ট ডাটা মূল ডেমো ডাটায় রিসেট করতে চান?' : 'Reset to default demo data?',
                type: 'danger',
                confirmText: isBn ? 'হ্যাঁ, রিসেট করুন' : 'Reset'
              });
              if (confirmed) {
                resetToDemoData();
              }
            }}
            className="btn btn-secondary btn-sm"
            style={{ color: '#f43f5e' }}
            title="ডেমো ডাটায় রিসেট"
          >
            <RotateCcw size={15} />
            <span>{isBn ? 'রিসেট' : 'Reset'}</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <nav style={{
        borderTop: '1px solid rgba(51, 65, 85, 0.6)',
        backgroundColor: '#0f172a',
        overflowX: 'auto'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          gap: '0.5rem'
        }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.75rem 1rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #06b6d4' : '3px solid transparent',
                  color: isActive ? '#06b6d4' : '#94a3b8',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={17} color={isActive ? '#06b6d4' : '#64748b'} />
                <span>{isBn ? item.labelBn : item.labelEn}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
