import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { POS } from './components/POS';
import { PurchaseVoucher } from './components/PurchaseVoucher';
import { Inventory } from './components/Inventory';
import { Categories } from './components/Categories';
import { Brands } from './components/Brands';
import { Expenses } from './components/Expenses';
import { Employees } from './components/Employees';
import { Reports } from './components/Reports';
import { UserManagement } from './components/UserManagement';
import { PrintInvoiceModal } from './components/PrintInvoiceModal';
import { BackupModal } from './components/BackupModal';
import { LayoutDashboard, ShoppingCart, FileText, Package, FolderPlus, Tag, Receipt, Users, TrendingUp, UserCog } from 'lucide-react';

const AppContent = ({ currentUser, onLogout }) => {
  const { lang } = useStore();
  const isBn = lang === 'bn';

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // Global Keyboard Shortcuts (F1=Dashboard, F2=POS, F4=Purchases, F8=Inventory)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F1') { e.preventDefault(); setActiveTab('dashboard'); }
      if (e.key === 'F2') { e.preventDefault(); setActiveTab('pos'); }
      if (e.key === 'F4') { e.preventDefault(); setActiveTab('purchases'); }
      if (e.key === 'F8') { e.preventDefault(); setActiveTab('inventory'); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Tab Title helper
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return { title: isBn ? 'ড্যাশবোর্ড ও ওভারভিউ' : 'Dashboard & Overview', icon: LayoutDashboard };
      case 'pos': return { title: isBn ? 'বিক্রয় ও পজ (POS Cash Memo)' : 'POS Sales Counter', icon: ShoppingCart };
      case 'purchases': return { title: isBn ? 'ক্রয় ভাউচার এন্ট্রি (Purchase Voucher)' : 'Purchase Vouchers', icon: FileText };
      case 'inventory': return { title: isBn ? 'পণ্য ও ইনভেন্টরি স্টক (Inventory)' : 'Inventory & Stock', icon: Package };
      case 'categories': return { title: isBn ? 'ক্যাটাগরি ম্যানেজমেন্ট (Category Manager)' : 'Category Manager', icon: FolderPlus };
      case 'brands': return { title: isBn ? 'ব্র্যান্ড তালিকা ম্যানেজমেন্ট (Brand Manager)' : 'Brand Manager', icon: Tag };
      case 'expenses': return { title: isBn ? 'দোকানের ব্যয় খাতা (Expense Tracker)' : 'Shop Expenses', icon: Receipt };
      case 'employees': return { title: isBn ? 'কর্মচারী ও বেতন (Payroll)' : 'Employee Payroll', icon: Users };
      case 'reports': return { title: isBn ? 'লাভ-ক্ষতি ও আর্থিক রিপোর্ট (Reports)' : 'Profit & Loss Reports', icon: TrendingUp };
      case 'users': return { title: isBn ? 'ইউজার ম্যানেজমেন্ট' : 'User Management', icon: UserCog };
      default: return { title: isBn ? 'ড্যাশবোর্ড' : 'Dashboard', icon: LayoutDashboard };
    }
  };

  const currentTabInfo = getTabTitle();
  const HeaderIcon = currentTabInfo.icon;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      
      {/* Left Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenBackup={() => setIsBackupOpen(true)}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      {/* Right Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Top Sticky Page Title Header */}
        <header style={{
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #334155',
          padding: '1rem 1.75rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
              <HeaderIcon size={22} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
              {currentTabInfo.title}
            </h2>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-green">
              {isBn ? 'স্টোর অবস্থা: লাইভ' : 'System Status: Active'}
            </span>
          </div>
        </header>

        {/* Viewport Render Screen */}
        <main className="main-content">
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === 'pos' && <POS />}
          {activeTab === 'purchases' && <PurchaseVoucher />}
          {activeTab === 'inventory' && <Inventory />}
          {activeTab === 'categories' && <Categories />}
          {activeTab === 'brands' && <Brands setActiveTab={setActiveTab} />}
          {activeTab === 'expenses' && <Expenses />}
          {activeTab === 'employees' && <Employees />}
          {activeTab === 'reports' && <Reports />}
          {activeTab === 'users' && <UserManagement />}
        </main>

        {/* Footer */}
        <footer style={{
          backgroundColor: '#0f172a',
          borderTop: '1px solid #334155',
          padding: '1rem',
          textAlign: 'center',
          fontSize: '0.825rem',
          color: '#64748b',
          marginTop: 'auto'
        }}>
          <div>
            <strong>ইলেকট্রিক্যাল শপ ম্যানেজমেন্ট সলুশন (v2.0)</strong> • সর্বস্বত্ব সংরক্ষিত © {new Date().getFullYear()}
          </div>
        </footer>
      </div>

      {/* Printable Cash Memo & Payslip Modal */}
      <PrintInvoiceModal />

      {/* Backup & Restore Modal */}
      <BackupModal isOpen={isBackupOpen} onClose={() => setIsBackupOpen(false)} />

    </div>
  );
};

export default function App() {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('estore_token'));
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('estore_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const handleLogin = (token, user) => {
    setAuthToken(token);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('estore_token');
    localStorage.removeItem('estore_user');
    setAuthToken(null);
    setCurrentUser(null);
  };

  // If no token, show login
  if (!authToken || !currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <StoreProvider authToken={authToken} onAuthError={handleLogout}>
      <AppContent currentUser={currentUser} onLogout={handleLogout} />
    </StoreProvider>
  );
}
