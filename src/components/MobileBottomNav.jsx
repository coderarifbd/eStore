import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  FileText, 
  Package, 
  MoreHorizontal,
  FolderPlus,
  Tag,
  Receipt,
  Users,
  TrendingUp,
  UserCog,
  Database,
  LogOut,
  X,
  Shield,
  ShieldCheck
} from 'lucide-react';

export const MobileBottomNav = ({ activeTab, setActiveTab, onOpenBackup, currentUser, onLogout }) => {
  const { lang } = useStore();
  const isBn = lang === 'bn';
  const isAdmin = currentUser?.role === 'admin';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mainTabs = [
    { id: 'dashboard', labelBn: 'হোম', labelEn: 'Home', icon: LayoutDashboard },
    { id: 'pos', labelBn: 'বিক্রি (POS)', labelEn: 'POS', icon: ShoppingCart },
    { id: 'purchases', labelBn: 'ক্রয়', labelEn: 'Purchases', icon: FileText },
    { id: 'inventory', labelBn: 'স্টক', labelEn: 'Stock', icon: Package },
  ];

  const moreMenuItems = [
    { id: 'categories', labelBn: 'ক্যাটাগরি', labelEn: 'Categories', icon: FolderPlus, adminOnly: true },
    { id: 'brands', labelBn: 'ব্র্যান্ড তালিকা', labelEn: 'Brands', icon: Tag, adminOnly: true },
    { id: 'expenses', labelBn: 'দোকানের ব্যয়', labelEn: 'Expenses', icon: Receipt, adminOnly: true },
    { id: 'employees', labelBn: 'কর্মচারী ও বেতন', labelEn: 'Payroll', icon: Users, adminOnly: true },
    { id: 'reports', labelBn: 'লাভ-ক্ষতি ও রিপোর্ট', labelEn: 'Reports', icon: TrendingUp, adminOnly: true },
    { id: 'users', labelBn: 'ইউজার ম্যানেজমেন্ট', labelEn: 'Users', icon: UserCog, adminOnly: true },
  ];

  const handleTabClick = (id) => {
    setActiveTab(id);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Bottom Navigation Bar (Visible only on screens <= 768px) */}
      <div className="mobile-bottom-nav">
        {mainTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id && !isMenuOpen;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{isBn ? tab.labelBn : tab.labelEn}</span>
            </button>
          );
        })}

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`mobile-nav-item ${isMenuOpen || ['categories','brands','expenses','employees','reports','users'].includes(activeTab) ? 'active' : ''}`}
        >
          <MoreHorizontal size={20} />
          <span>{isBn ? 'মেনু' : 'Menu'}</span>
        </button>
      </div>

      {/* More Menu Bottom Sheet Drawer */}
      {isMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setIsMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={e => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: isAdmin ? 'linear-gradient(135deg, #2563eb, #8b5cf6)' : '#374151',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {isAdmin ? <ShieldCheck size={18} color="#fff" /> : <Shield size={18} color="#9ca3af" />}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f3f4f6' }}>
                    {currentUser?.name || currentUser?.username}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: '#9ca3af' }}>
                    {isAdmin ? 'মালিক (Admin)' : 'কর্মচারী (Staff)'}
                  </div>
                </div>
              </div>

              <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            <div className="mobile-drawer-body">
              {moreMenuItems
                .filter(item => !item.adminOnly || isAdmin)
                .map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`mobile-drawer-item ${isActive ? 'active' : ''}`}
                    >
                      <Icon size={18} color={isActive ? '#3b82f6' : '#9ca3af'} />
                      <span>{isBn ? item.labelBn : item.labelEn}</span>
                    </button>
                  );
                })}

              {isAdmin && (
                <button onClick={() => { onOpenBackup(); setIsMenuOpen(false); }} className="mobile-drawer-item">
                  <Database size={18} color="#8b5cf6" />
                  <span>{isBn ? 'ডাটা ব্যাকআপ' : 'Backup'}</span>
                </button>
              )}

              <button onClick={() => { setIsMenuOpen(false); onLogout?.(); }} className="mobile-drawer-item danger">
                <LogOut size={18} />
                <span>{isBn ? 'লগআউট' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
