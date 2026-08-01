import React, { useState } from 'react';
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
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Tag,
  FolderPlus,
  UserCog,
  LogOut,
  ShieldCheck,
  Shield
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, onOpenBackup, currentUser, onLogout }) => {
  const { lang, setLang, resetToDemoData, showConfirm } = useStore();
  const isBn = lang === 'bn';
  const isAdmin = currentUser?.role === 'admin';

  const [isCollapsed, setIsCollapsed] = useState(false);

  const allNavItems = [
    { id: 'dashboard', labelBn: 'ড্যাশবোর্ড', labelEn: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'staff'] },
    { id: 'pos', labelBn: 'বিক্রয় ও পজ (POS)', labelEn: 'POS Sales', icon: ShoppingCart, roles: ['admin', 'staff'] },
    { id: 'purchases', labelBn: 'ক্রয় ভাউচার', labelEn: 'Purchases', icon: FileText, roles: ['admin', 'staff'] },
    { id: 'inventory', labelBn: 'পণ্য ও স্টক', labelEn: 'Inventory', icon: Package, roles: ['admin', 'staff'] },
    { id: 'categories', labelBn: 'ক্যাটাগরি তালিকা', labelEn: 'Categories', icon: FolderPlus, roles: ['admin'] },
    { id: 'brands', labelBn: 'ব্র্যান্ড তালিকা', labelEn: 'Brands List', icon: Tag, roles: ['admin'] },
    { id: 'expenses', labelBn: 'দোকানের ব্যয়', labelEn: 'Expenses', icon: Receipt, roles: ['admin'] },
    { id: 'employees', labelBn: 'কর্মচারী ও বেতন', labelEn: 'Payroll', icon: Users, roles: ['admin'] },
    { id: 'reports', labelBn: 'লাভ-ক্ষতি ও রিপোর্ট', labelEn: 'Reports', icon: TrendingUp, roles: ['admin'] },
    { id: 'users', labelBn: 'ইউজার ম্যানেজমেন্ট', labelEn: 'User Management', icon: UserCog, roles: ['admin'] },
  ];

  // Filter nav items by user role
  const navItems = allNavItems.filter(item => item.roles.includes(currentUser?.role || 'staff'));

  return (
    <aside className="desktop-sidebar" style={{
      width: isCollapsed ? '80px' : '260px',
      minWidth: isCollapsed ? '80px' : '260px',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      justify: 'space-between',
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      userSelect: 'none'
    }}>
      {/* Top Header & Branding */}
      <div>
        <div style={{
          padding: isCollapsed ? '1rem 0.5rem' : '1.25rem 1rem',
          borderBottom: '1px solid rgba(51, 65, 85, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justify: isCollapsed ? 'center' : 'space-between',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <div style={{
              width: '40px',
              height: '40px',
              minWidth: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
            }}>
              <Zap size={22} color="#0f172a" strokeWidth={2.5} />
            </div>

            {!isCollapsed && (
              <div>
                <h1 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.2, color: '#f8fafc', whiteSpace: 'nowrap' }}>
                  {isBn ? 'ফারদিন ইলেকট্রিক স্টোর' : 'Fardin Electrical Store'}
                </h1>
                <p style={{ fontSize: '0.725rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                  {isBn ? 'পুনট বাজার, কালাই, জয়পুরহাট' : 'Punot Bazar, Kalai, Joypurhat'}
                </p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
              title="সাইডবার গুটিয়ে নিন"
            >
              <ChevronLeft size={20} />
            </button>
          )}
        </div>

        {/* Navigation Menu Links */}
        <nav style={{ padding: '1rem 0.65rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
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
                  gap: '0.85rem',
                  padding: isCollapsed ? '0.75rem 0' : '0.75rem 1rem',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  backgroundColor: isActive ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                  borderLeft: isActive ? '4px solid #06b6d4' : '4px solid transparent',
                  borderRadius: isCollapsed ? '8px' : '0 8px 8px 0',
                  color: isActive ? '#06b6d4' : '#94a3b8',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.925rem',
                  cursor: 'pointer',
                  borderTop: 'none',
                  borderRight: 'none',
                  borderBottom: 'none',
                  transition: 'all 0.15s ease',
                  width: '100%'
                }}
                title={isCollapsed ? (isBn ? item.labelBn : item.labelEn) : undefined}
              >
                <Icon size={20} color={isActive ? '#06b6d4' : '#64748b'} />
                {!isCollapsed && (
                  <span style={{ whiteSpace: 'nowrap' }}>{isBn ? item.labelBn : item.labelEn}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {isCollapsed && (
        <div style={{ textAlign: 'center', padding: '0.5rem' }}>
          <button
            onClick={() => setIsCollapsed(false)}
            style={{
              background: 'rgba(51, 65, 85, 0.5)',
              border: 'none',
              color: '#06b6d4',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'inline-flex'
            }}
            title="সাইডবার প্রসারিত করুন"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Bottom Actions Footer */}
      <div style={{
        padding: isCollapsed ? '1rem 0.5rem' : '1rem',
        borderTop: '1px solid rgba(51, 65, 85, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        {/* Current User Info */}
        {!isCollapsed && currentUser && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.6rem 0.75rem',
            backgroundColor: 'rgba(6, 182, 212, 0.06)',
            borderRadius: '8px',
            marginBottom: '0.25rem'
          }}>
            <div style={{
              width: '32px', height: '32px', minWidth: '32px',
              borderRadius: '8px',
              background: isAdmin ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)' : 'rgba(100, 116, 139, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {isAdmin ? <ShieldCheck size={16} color="#fff" /> : <Shield size={16} color="#94a3b8" />}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {currentUser.name || currentUser.username}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                {isAdmin ? 'মালিক' : 'কর্মচারী'}
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', justifyContent: isCollapsed ? 'center' : 'flex-start' }}
          title="ভাষা পরিবর্তন / Switch Language"
        >
          <Globe size={16} color="#06b6d4" />
          {!isCollapsed && <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>}
        </button>

        {isAdmin && (
          <button 
            onClick={onOpenBackup}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: isCollapsed ? 'center' : 'flex-start' }}
            title="ডাটা ব্যাকআপ"
          >
            <Database size={16} color="#8b5cf6" />
            {!isCollapsed && <span>{isBn ? 'ব্যাকআপ' : 'Backup'}</span>}
          </button>
        )}

        <button 
          onClick={async () => {
            const confirmed = await showConfirm({
              title: isBn ? 'লগআউট নিশ্চিতকরণ' : 'Logout Confirmation',
              message: isBn ? 'আপনি কি নিশ্চিত যে অ্যাকাউন্ট থেকে লগআউট করতে চান?' : 'Are you sure you want to log out?',
              type: 'warning',
              confirmText: isBn ? 'হ্যাঁ, লগআউট' : 'Logout'
            });
            if (confirmed) {
              onLogout?.();
            }
          }}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', justifyContent: isCollapsed ? 'center' : 'flex-start', color: '#f43f5e' }}
          title="লগআউট"
        >
          <LogOut size={16} />
          {!isCollapsed && <span>{isBn ? 'লগআউট' : 'Logout'}</span>}
        </button>
      </div>

    </aside>
  );
};
