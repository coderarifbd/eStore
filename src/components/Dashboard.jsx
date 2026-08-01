import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  TrendingUp, 
  ShoppingCart, 
  AlertTriangle, 
  Wallet, 
  Coins, 
  Package, 
  ArrowUpRight, 
  FileText,
  Printer,
  ShieldCheck,
  Building2
} from 'lucide-react';

export const Dashboard = ({ setActiveTab }) => {
  const { 
    lang, 
    sales, 
    expenses, 
    salaryTx, 
    suppliers, 
    getFlatVariants,
    setPrintDoc
  } = useStore();

  const isBn = lang === 'bn';

  const todayStr = new Date().toLocaleDateString('en-US');
  const currentMonthStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

  // 1. Today's Sales Calculation
  const todaySalesList = sales.filter(s => {
    const sDate = new Date(s.date).toLocaleDateString('en-US');
    return sDate === todayStr;
  });
  const todayTotalSales = todaySalesList.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0);
  const todayTotalProfit = todaySalesList.reduce((acc, curr) => acc + (curr.profit || 0), 0);

  // 2. Monthly Calculation
  const monthlySalesList = sales.filter(s => {
    const d = new Date(s.date);
    const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return mStr === currentMonthStr;
  });
  const monthlySalesAmount = monthlySalesList.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0);
  const monthlyGrossProfit = monthlySalesList.reduce((acc, curr) => acc + (curr.profit || 0), 0);

  const monthlyExpenses = expenses
    .filter(e => e.date && e.date.startsWith(currentMonthStr))
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const monthlySalaries = salaryTx
    .filter(st => st.date && st.date.startsWith(currentMonthStr))
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const monthlyNetProfit = monthlyGrossProfit - (monthlyExpenses + monthlySalaries);

  // 3. Stock Valuation & Low Stock items
  const flatVariants = getFlatVariants();
  const totalStockValue = flatVariants.reduce((acc, curr) => acc + (curr.stock * curr.purchasePrice), 0);
  const lowStockItems = flatVariants.filter(item => item.stock <= item.reorderLevel);

  // 4. Dues
  const totalCustomerDue = sales.reduce((acc, curr) => acc + (curr.dueAmount || 0), 0);
  const totalSupplierDue = suppliers.reduce((acc, curr) => acc + (curr.balanceDue || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Executive Quick Banner */}
      <div className="card" style={{
        backgroundColor: '#111827',
        border: '1px solid #26334d',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px', height: '42px',
            borderRadius: '8px',
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#3b82f6'
          }}>
            <Building2 size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.15rem' }}>
              {isBn ? 'ফারদিন ইলেকট্রিক্যাল স্টোর — ড্যাশবোর্ড' : 'Fardin Electrical Store Dashboard'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
              {isBn ? 'দোকানের ক্রয়, বিক্রয়, স্টক এবং আর্থিক হিসাবের সারসংক্ষেপ' : 'Real-time overview of sales, stock valuation, dues and net profit'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('pos')} className="btn btn-primary" style={{ padding: '0.55rem 1.15rem' }}>
            <ShoppingCart size={16} />
            <span>{isBn ? '+ নতুন বিক্রয় (POS)' : '+ New Sale'}</span>
          </button>
          <button onClick={() => setActiveTab('purchases')} className="btn btn-secondary" style={{ padding: '0.55rem 1.15rem' }}>
            <FileText size={16} color="#3b82f6" />
            <span>{isBn ? '+ ক্রয় ভাউচার' : '+ Purchase Voucher'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem'
      }}>
        {/* Today's Sales */}
        <div className="card" style={{ borderLeft: '3px solid #3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', color: '#9ca3af', fontWeight: 600 }}>
              {isBn ? 'আজকের বিক্রি' : "Today's Sales"}
            </span>
            <div style={{ padding: '6px', borderRadius: '6px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
              <ShoppingCart size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 700, color: '#f3f4f6' }}>
            ৳{todayTotalSales.toLocaleString('en-BD')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
            <ArrowUpRight size={13} /> {isBn ? `লাভ: ৳${todayTotalProfit.toLocaleString('en-BD')}` : `Profit: ৳${todayTotalProfit}`}
          </div>
        </div>

        {/* Monthly Net Profit */}
        <div className="card" style={{ borderLeft: `3px solid ${monthlyNetProfit >= 0 ? '#10b981' : '#ef4444'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', color: '#9ca3af', fontWeight: 600 }}>
              {isBn ? 'চলতি মাসের নিট লাভ' : 'Monthly Net Profit'}
            </span>
            <div style={{ padding: '6px', borderRadius: '6px', backgroundColor: monthlyNetProfit >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: monthlyNetProfit >= 0 ? '#10b981' : '#ef4444' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 700, color: monthlyNetProfit >= 0 ? '#34d399' : '#f87171' }}>
            ৳{monthlyNetProfit.toLocaleString('en-BD')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
            {isBn ? `মোট বিক্রি: ৳${monthlySalesAmount.toLocaleString('en-BD')}` : `Total Sales: ৳${monthlySalesAmount}`}
          </div>
        </div>

        {/* Stock Valuation */}
        <div className="card" style={{ borderLeft: '3px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', color: '#9ca3af', fontWeight: 600 }}>
              {isBn ? 'স্টক বর্তমান মূল্য' : 'Stock Valuation'}
            </span>
            <div style={{ padding: '6px', borderRadius: '6px', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
              <Package size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 700, color: '#f3f4f6' }}>
            ৳{totalStockValue.toLocaleString('en-BD')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
            {isBn ? `মোট ভেরিয়েন্ট: ${flatVariants.length} টি` : `Total Variants: ${flatVariants.length}`}
          </div>
        </div>

        {/* Customer Dues */}
        <div className="card" style={{ borderLeft: '3px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', color: '#9ca3af', fontWeight: 600 }}>
              {isBn ? 'গ্রাহকের মোট বাকি' : 'Customer Dues'}
            </span>
            <div style={{ padding: '6px', borderRadius: '6px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <Coins size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 700, color: '#fbbf24' }}>
            ৳{totalCustomerDue.toLocaleString('en-BD')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
            {isBn ? 'বিক্রয় বাকি হিসেবে জমা' : 'Receivables from sales'}
          </div>
        </div>

        {/* Supplier Dues */}
        <div className="card" style={{ borderLeft: '3px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', color: '#9ca3af', fontWeight: 600 }}>
              {isBn ? 'সাপ্লায়ার পাওনাদার' : 'Supplier Payables'}
            </span>
            <div style={{ padding: '6px', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
              <Wallet size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 700, color: '#f87171' }}>
            ৳{totalSupplierDue.toLocaleString('en-BD')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
            {isBn ? 'মহাজনের পাওনা পরিশোধযোগ্য' : 'Payables to suppliers'}
          </div>
        </div>
      </div>

      {/* Main Grid: Low Stock Alert & Recent Sales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Low Stock Alert Box */}
        <div className="card">
          <div className="card-title" style={{ color: '#f59e0b' }}>
            <AlertTriangle size={18} />
            <span>{isBn ? 'কম স্টক অ্যালার্ট' : 'Low Stock Warning'}</span>
            <span className="badge badge-amber" style={{ marginLeft: 'auto' }}>
              {lowStockItems.length} {isBn ? 'টি পণ্য' : 'Items'}
            </span>
          </div>

          {lowStockItems.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingRight: '4px' }}>
                {lowStockItems.map(item => (
                  <div key={`${item.productId}_${item.variantId}`} style={{
                    padding: '0.75rem 0.9rem',
                    backgroundColor: '#0b0f19',
                    border: '1px solid #26334d',
                    borderRadius: '8px',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#f3f4f6' }}>
                        {isBn ? item.productNameBn : item.productNameEn}
                      </div>
                      <div style={{ fontSize: '0.775rem', color: '#60a5fa', marginTop: '2px' }}>
                        {item.brand} • <strong>{item.spec}</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div className="badge badge-rose">
                        {isBn ? `স্টক: ${item.stock} ${item.unit}` : `Stock: ${item.stock}`}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '3px' }}>
                        {isBn ? `রি-অর্ডার: ${item.reorderLevel}` : `Reorder: ${item.reorderLevel}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setActiveTab('purchases')}
                className="btn btn-secondary btn-sm" 
                style={{ marginTop: '0.5rem', width: '100%', borderColor: '#f59e0b', color: '#fbbf24' }}
              >
                <FileText size={15} />
                <span>{isBn ? 'নতুন ক্রয় ভাউচার এন্ট্রি করুন' : 'Create Purchase Voucher'}</span>
              </button>
            </div>
          ) : (
            <div style={{ padding: '1.75rem', textAlign: 'center', color: '#10b981' }}>
              <ShieldCheck size={38} style={{ margin: '0 auto 0.5rem auto' }} />
              <p style={{ fontWeight: 600, fontSize: '0.925rem' }}>{isBn ? 'সকল পণ্যের পর্যাপ্ত স্টক রয়েছে!' : 'All items have sufficient stock!'}</p>
            </div>
          )}
        </div>

        {/* Recent Sales List */}
        <div className="card">
          <div className="card-title">
            <ShoppingCart size={18} color="#3b82f6" />
            <span>{isBn ? 'সর্বশেষ বিক্রয় মেমোসমূহ' : 'Recent Sales Transactions'}</span>
            <button onClick={() => setActiveTab('pos')} className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>
              {isBn ? 'সবগুলো দেখুন' : 'View All'}
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isBn ? 'ইনভয়েস নং' : 'Invoice #'}</th>
                  <th>{isBn ? 'গ্রাহক' : 'Customer'}</th>
                  <th>{isBn ? 'মোট মূল্য' : 'Total'}</th>
                  <th>{isBn ? 'বাকি' : 'Due'}</th>
                  <th>{isBn ? 'মেমো' : 'Action'}</th>
                </tr>
              </thead>
              <tbody>
                {sales.slice(0, 5).map(sale => (
                  <tr key={sale.id}>
                    <td style={{ fontWeight: 600, color: '#60a5fa' }}>{sale.id}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{sale.customerName || (isBn ? 'সাধারণ গ্রাহক' : 'Walk-in Customer')}</div>
                      <div style={{ fontSize: '0.725rem', color: '#6b7280' }}>{sale.date}</div>
                    </td>
                    <td style={{ fontWeight: 700 }}>৳{sale.grandTotal}</td>
                    <td>
                      {sale.dueAmount > 0 ? (
                        <span className="badge badge-rose">৳{sale.dueAmount} বাকি</span>
                      ) : (
                        <span className="badge badge-green">পরিশোধিত</span>
                      )}
                    </td>
                    <td>
                      <button 
                        onClick={() => setPrintDoc({ type: 'sale', data: sale })}
                        className="btn btn-secondary btn-sm"
                        title="ক্যাশ মেমো প্রিন্ট করুন"
                      >
                        <Printer size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
