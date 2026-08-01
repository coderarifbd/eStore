import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  TrendingUp, 
  DollarSign, 
  Wallet, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  ShoppingBag, 
  Archive, 
  Percent 
} from 'lucide-react';

export const Reports = () => {
  const { lang, sales, expenses, salaryTx, suppliers, purchases, updateSupplierPayment } = useStore();
  const isBn = lang === 'bn';

  // Date Filter State
  const [filterType, setFilterType] = useState('preset'); // 'preset' | 'day' | 'month' | 'range'
  const [preset, setPreset] = useState('thisMonth'); // 'today' | 'yesterday' | 'thisWeek' | 'thisMonth' | 'lastMonth' | 'allTime'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedDay, setSelectedDay] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  const [paySupId, setPaySupId] = useState(null);
  const [supPayAmount, setSupPayAmount] = useState('');

  // Get start and end date objects based on selected filter
  const getFilterDates = () => {
    const today = new Date();
    let start = null;
    let end = null;

    if (filterType === 'day') {
      if (selectedDay) {
        const [yr, mo, dy] = selectedDay.split('-');
        start = new Date(Number(yr), Number(mo) - 1, Number(dy));
        end = new Date(Number(yr), Number(mo) - 1, Number(dy), 23, 59, 59, 999);
      }
    } else if (filterType === 'preset') {
      if (preset === 'today') {
        start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
      } else if (preset === 'yesterday') {
        const yest = new Date();
        yest.setDate(today.getDate() - 1);
        start = new Date(yest.getFullYear(), yest.getMonth(), yest.getDate());
        end = new Date(yest.getFullYear(), yest.getMonth(), yest.getDate(), 23, 59, 59, 999);
      } else if (preset === 'thisWeek') {
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        start = new Date(today.setDate(diff));
        start.setHours(0, 0, 0, 0);
        end = new Date();
        end.setHours(23, 59, 59, 999);
      } else if (preset === 'thisMonth') {
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
      } else if (preset === 'lastMonth') {
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);
      }
    } else if (filterType === 'month') {
      if (selectedMonth) {
        const [yr, mo] = selectedMonth.split('-');
        start = new Date(Number(yr), Number(mo) - 1, 1);
        end = new Date(Number(yr), Number(mo), 0, 23, 59, 59, 999);
      }
    } else if (filterType === 'range') {
      if (startDate) {
        start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
      }
      if (endDate) {
        end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
      }
    }
    return { start, end };
  };

  const { start, end } = getFilterDates();

  const filterByDate = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    if (start && d < start) return false;
    if (end && d > end) return false;
    return true;
  };

  // Filter lists
  const filteredSales = sales.filter(s => filterByDate(s.date));
  const filteredExpenses = expenses.filter(e => filterByDate(e.date));
  const filteredSalaries = salaryTx.filter(st => filterByDate(st.date));
  const filteredPurchases = (purchases || []).filter(p => filterByDate(p.date));

  // Calculations
  const totalRevenue = filteredSales.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0);
  const totalCostOfGoods = filteredSales.reduce((acc, curr) => acc + (curr.totalCostPrice || 0), 0);
  const grossProfit = totalRevenue - totalCostOfGoods;

  const totalShopExpenses = filteredExpenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalStaffSalaries = filteredSalaries.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalOperatingCosts = totalShopExpenses + totalStaffSalaries;

  const netProfit = grossProfit - totalOperatingCosts;
  const totalPurchases = filteredPurchases.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0);

  // Group Expenses by Category
  const expensesByCategory = {};
  filteredExpenses.forEach(exp => {
    const cat = exp.category || (isBn ? 'অন্যান্য' : 'Others');
    expensesByCategory[cat] = (expensesByCategory[cat] || 0) + exp.amount;
  });
  const expenseBreakdown = Object.entries(expensesByCategory)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  // Calculate Product Sales & Profitability Metrics
  const productSalesMap = {};
  filteredSales.forEach(sale => {
    if (sale.items) {
      sale.items.forEach(item => {
        const key = `${item.productId}_${item.variantId}`;
        if (!productSalesMap[key]) {
          productSalesMap[key] = {
            productId: item.productId,
            variantId: item.variantId,
            productName: item.productName || (isBn ? item.productNameBn : item.productNameEn),
            spec: item.spec,
            brand: item.brand,
            quantity: 0,
            revenue: 0,
            cost: 0
          };
        }
        const qty = Number(item.quantity || 0);
        const itemRevenue = qty * Number(item.unitPrice || 0);
        const itemCost = qty * Number(item.purchasePrice || 0);

        productSalesMap[key].quantity += qty;
        productSalesMap[key].revenue += itemRevenue;
        productSalesMap[key].cost += itemCost;
      });
    }
  });

  const flatProductMetrics = Object.values(productSalesMap).map(p => ({
    ...p,
    profit: p.revenue - p.cost
  }));

  const topSellingProducts = [...flatProductMetrics]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const mostProfitableProducts = [...flatProductMetrics]
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5);

  const handlePaySupplier = (e) => {
    e.preventDefault();
    if (!paySupId || !supPayAmount) return;

    updateSupplierPayment(paySupId, Number(supPayAmount));
    alert(isBn ? 'সাপ্লায়ারকে পাওনা টাকা সফলভাবে পরিশোধ করা হয়েছে!' : 'Supplier due payment recorded!');
    setPaySupId(null);
    setSupPayAmount('');
  };

  // Helper to format filter display string
  const getFilterDisplayLabel = () => {
    if (filterType === 'day') {
      return selectedDay ? `${isBn ? 'আর্থিক বিবরণী - ' : 'Day: '}${selectedDay}` : (isBn ? 'সকল হিসাব' : 'All Time');
    } else if (filterType === 'preset') {
      const labels = {
        today: isBn ? 'আজকের হিসাব' : 'Today',
        yesterday: isBn ? 'গতকালের হিসাব' : 'Yesterday',
        thisWeek: isBn ? 'চলতি সপ্তাহের হিসাব' : 'This Week',
        thisMonth: isBn ? 'চলতি মাসের হিসাব' : 'This Month',
        lastMonth: isBn ? 'গত মাসের হিসাব' : 'Last Month',
        allTime: isBn ? 'সর্বকালের হিসাব' : 'All Time'
      };
      return labels[preset] || '';
    } else if (filterType === 'month') {
      return selectedMonth ? `${isBn ? 'আর্থিক বিবরণী - ' : 'Month: '}${selectedMonth}` : (isBn ? 'সকল হিসাব' : 'All Time');
    } else {
      return `${startDate || '...'} ${isBn ? 'হতে' : 'to'} ${endDate || '...'}`;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Dynamic Date Filter Bar */}
      <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp color="#10b981" />
              <span>{isBn ? 'আর্থিক ড্যাশবোর্ড ও লাভ-ক্ষতি রিপোর্ট' : 'Financial Reports Dashboard'}</span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              {isBn ? 'তারিখ ফিল্টার করে মোট আয়, ক্রয় ও নিট লাভ-ক্ষতির বিবরণী দেখুন' : 'Filter dates to analyze sales, purchases, and net profit margins'}
            </p>
          </div>

          {/* Filter Type Tabs */}
          <div style={{ display: 'flex', backgroundColor: '#0f172a', padding: '0.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
            <button 
              onClick={() => setFilterType('preset')} 
              className="btn btn-sm" 
              style={{ backgroundColor: filterType === 'preset' ? '#334155' : 'transparent', color: '#f8fafc', padding: '0.35rem 0.65rem', border: 'none' }}
            >
              {isBn ? 'প্রিসেট' : 'Presets'}
            </button>
            <button 
              onClick={() => setFilterType('day')} 
              className="btn btn-sm" 
              style={{ backgroundColor: filterType === 'day' ? '#334155' : 'transparent', color: '#f8fafc', padding: '0.35rem 0.65rem', border: 'none' }}
            >
              {isBn ? 'নির্দিষ্ট দিন' : 'Day'}
            </button>
            <button 
              onClick={() => setFilterType('month')} 
              className="btn btn-sm" 
              style={{ backgroundColor: filterType === 'month' ? '#334155' : 'transparent', color: '#f8fafc', padding: '0.35rem 0.65rem', border: 'none' }}
            >
              {isBn ? 'নির্দিষ্ট মাস' : 'Month'}
            </button>
            <button 
              onClick={() => setFilterType('range')} 
              className="btn btn-sm" 
              style={{ backgroundColor: filterType === 'range' ? '#334155' : 'transparent', color: '#f8fafc', padding: '0.35rem 0.65rem', border: 'none' }}
            >
              {isBn ? 'তারিখ সীমা' : 'Custom Range'}
            </button>
          </div>
        </div>

        {/* Filter Input Controls */}
        <div style={{ padding: '0.5rem', backgroundColor: '#0f172a', borderRadius: '8px', border: '1px dashed #334155' }}>
          {filterType === 'preset' && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { id: 'today', bn: 'আজ', en: 'Today' },
                { id: 'yesterday', bn: 'গতকাল', en: 'Yesterday' },
                { id: 'thisWeek', bn: 'চলতি সপ্তাহ', en: 'This Week' },
                { id: 'thisMonth', bn: 'চলতি মাস', en: 'This Month' },
                { id: 'lastMonth', bn: 'গত মাস', en: 'Last Month' },
                { id: 'allTime', bn: 'সব সময়', en: 'All Time' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setPreset(p.id)}
                  className={`btn btn-sm ${preset === p.id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                >
                  {isBn ? p.bn : p.en}
                </button>
              ))}
            </div>
          )}

          {filterType === 'day' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <label style={{ fontSize: '0.825rem', color: '#94a3b8' }}>{isBn ? 'দিন নির্বাচন করুন:' : 'Select Day:'}</label>
              <input
                type="date"
                className="input-control"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                onClick={(e) => { try { e.target.showPicker(); } catch(err){} }}
                style={{ width: 'auto', padding: '0.35rem', cursor: 'pointer' }}
              />
            </div>
          )}

          {filterType === 'month' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <label style={{ fontSize: '0.825rem', color: '#94a3b8' }}>{isBn ? 'মাস নির্বাচন করুন:' : 'Select Month:'}</label>
              <input
                type="month"
                className="input-control"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                onClick={(e) => { try { e.target.showPicker(); } catch(err){} }}
                style={{ width: 'auto', padding: '0.35rem', cursor: 'pointer' }}
              />
            </div>
          )}

          {filterType === 'range' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.825rem', color: '#94a3b8' }}>{isBn ? 'হতে:' : 'From:'}</span>
                <input 
                  type="date" 
                  className="input-control" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  onClick={(e) => { try { e.target.showPicker(); } catch(err){} }}
                  style={{ width: 'auto', padding: '0.35rem', cursor: 'pointer' }} 
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.825rem', color: '#94a3b8' }}>{isBn ? 'পর্যন্ত:' : 'To:'}</span>
                <input 
                  type="date" 
                  className="input-control" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                  onClick={(e) => { try { e.target.showPicker(); } catch(err){} }}
                  style={{ width: 'auto', padding: '0.35rem', cursor: 'pointer' }} 
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KPI 4-Column Summary Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {/* KPI 1: Sales */}
        <div className="card" style={{ padding: '1rem', borderLeft: '4px solid #06b6d4', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: 'rgba(6, 182, 212, 0.15)' }}>
            <DollarSign size={24} color="#06b6d4" />
          </div>
          <div>
            <div style={{ fontSize: '0.775rem', color: '#94a3b8' }}>{isBn ? 'মোট বিক্রয় (Total Revenue)' : 'Total Sales'}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>৳{totalRevenue.toLocaleString('en-BD')}</div>
          </div>
        </div>

        {/* KPI 2: Purchases */}
        <div className="card" style={{ padding: '1rem', borderLeft: '4px solid #f59e0b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: 'rgba(245, 158, 11, 0.15)' }}>
            <Wallet size={24} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: '0.775rem', color: '#94a3b8' }}>{isBn ? 'মোট ক্রয় (Total Purchases)' : 'Total Purchases'}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>৳{totalPurchases.toLocaleString('en-BD')}</div>
          </div>
        </div>

        {/* KPI 3: Shop Costs */}
        <div className="card" style={{ padding: '1rem', borderLeft: '4px solid #f43f5e', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: 'rgba(244, 63, 94, 0.15)' }}>
            <TrendingUp size={24} color="#f43f5e" />
          </div>
          <div>
            <div style={{ fontSize: '0.775rem', color: '#94a3b8' }}>{isBn ? 'মোট পরিচালন ব্যয়' : 'Total Operating Costs'}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>৳{totalOperatingCosts.toLocaleString('en-BD')}</div>
          </div>
        </div>

        {/* KPI 4: Net Profit/Loss */}
        <div className="card" style={{ 
          padding: '1rem', 
          borderLeft: `4px solid ${netProfit >= 0 ? '#10b981' : '#f43f5e'}`, 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          backgroundColor: netProfit >= 0 ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)'
        }}>
          <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: netProfit >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)' }}>
            {netProfit >= 0 ? <ArrowUpRight size={24} color="#10b981" /> : <ArrowDownRight size={24} color="#f43f5e" />}
          </div>
          <div>
            <div style={{ fontSize: '0.775rem', color: '#94a3b8' }}>{isBn ? 'নিট লাভ / ক্ষতি' : 'Net Profit / Loss'}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: netProfit >= 0 ? '#10b981' : '#f43f5e' }}>৳{netProfit.toLocaleString('en-BD')}</div>
          </div>
        </div>
      </div>

      {/* Main Analysis Dashboard Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        
        {/* Detailed Financial Statement with Progress breakdown */}
        <div className="card" style={{ border: '1px solid #10b981', backgroundColor: '#0f172a' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>{isBn ? 'আর্থিক বিবরণী বিবরণ (P&L Sheet)' : 'Financial Summary'}</span>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>{getFilterDisplayLabel()}</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Sales Revenue */}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px dashed #334155' }}>
              <span style={{ color: '#f8fafc' }}>(+) {isBn ? 'মোট বিক্রয় আয় (Sales)' : 'Sales Revenue'}</span>
              <span style={{ fontWeight: 700, color: '#06b6d4' }}>৳{totalRevenue.toLocaleString('en-BD')}</span>
            </div>

            {/* Cost of Goods Sold */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>(-) {isBn ? 'বিক্রীত পণ্যের ক্রয়মূল্য (COGS)' : 'Cost of Goods Sold'}</span>
                <span style={{ fontWeight: 600, color: '#f43f5e' }}>৳{totalCostOfGoods.toLocaleString('en-BD')}</span>
              </div>
              {totalRevenue > 0 && (
                <div style={{ width: '100%', height: '5px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (totalCostOfGoods / totalRevenue) * 100)}%`, height: '100%', backgroundColor: '#f43f5e' }}></div>
                </div>
              )}
            </div>

            {/* Gross Profit */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', backgroundColor: 'rgba(6, 182, 212, 0.08)', borderRadius: '6px' }}>
              <span style={{ fontWeight: 600, color: '#06b6d4' }}>(=) {isBn ? 'মোট বিক্রয় লাভ (Gross Profit)' : 'Gross Profit'}</span>
              <span style={{ fontWeight: 700, color: '#06b6d4' }}>৳{grossProfit.toLocaleString('en-BD')}</span>
            </div>

            {/* Shop Expenses */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>(-) {isBn ? 'দোকান ও অন্যান্য পরিচালনা ব্যয়' : 'Operating Expenses'}</span>
                <span style={{ fontWeight: 600, color: '#f43f5e' }}>৳{totalShopExpenses.toLocaleString('en-BD')}</span>
              </div>
              {totalRevenue > 0 && (
                <div style={{ width: '100%', height: '5px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (totalShopExpenses / totalRevenue) * 100)}%`, height: '100%', backgroundColor: '#f59e0b' }}></div>
                </div>
              )}
            </div>

            {/* Salaries */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>(-) {isBn ? 'কর্মচারীদের মোট বেতন প্রদান' : 'Staff Salary Payments'}</span>
                <span style={{ fontWeight: 600, color: '#f43f5e' }}>৳{totalStaffSalaries.toLocaleString('en-BD')}</span>
              </div>
              {totalRevenue > 0 && (
                <div style={{ width: '100%', height: '5px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (totalStaffSalaries / totalRevenue) * 100)}%`, height: '100%', backgroundColor: '#a855f7' }}></div>
                </div>
              )}
            </div>

            {/* Net Profit Final */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem',
              backgroundColor: netProfit >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              border: `1px solid ${netProfit >= 0 ? '#10b981' : '#f43f5e'}`,
              borderRadius: '8px',
              marginTop: '0.35rem',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                  (=) {netProfit >= 0 ? (isBn ? 'নিট লাভ (Net Profit)' : 'Net Profit') : (isBn ? 'নিট ক্ষতি (Net Loss)' : 'Net Loss')}
                </div>
                <div style={{ fontSize: '0.725rem', color: '#94a3b8', marginTop: '2px' }}>
                  {totalRevenue > 0 ? `${(isBn ? 'মার্জিন: ' : 'Margin: ')}${((netProfit / totalRevenue) * 100).toFixed(1)}%` : ''}
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: netProfit >= 0 ? '#10b981' : '#f43f5e', textAlign: 'right', marginLeft: 'auto' }}>
                ৳{netProfit.toLocaleString('en-BD')}
              </div>
            </div>
          </div>
        </div>

        {/* Operating Expense Breakdown Category-wise */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Archive size={18} color="#f59e0b" />
            <span>{isBn ? 'পরিচালন খরচের খাতসমূহ' : 'Operating Expense Breakdown'}</span>
          </h3>

          {expenseBreakdown.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {expenseBreakdown.map((item, idx) => {
                const percent = totalShopExpenses > 0 ? ((item.amount / totalShopExpenses) * 100).toFixed(1) : '0';
                return (
                  <div key={idx} style={{ fontSize: '0.825rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f8fafc', marginBottom: '3px' }}>
                      <span style={{ fontWeight: 600 }}>{item.category}</span>
                      <span>৳{item.amount.toLocaleString('en-BD')} ({percent}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '5px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${percent}%`, height: '100%', backgroundColor: '#f59e0b' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
              {isBn ? 'এই সময়সীমার মধ্যে কোনো অতিরিক্ত খরচ নেই' : 'No expenses recorded in this period'}
            </div>
          )}
        </div>
      </div>

      {/* Product Analytics Row: Top Selling and Most Profitable */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        
        {/* Top 5 Best-Selling */}
        <div className="card">
          <div className="card-title" style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>
            <ShoppingBag size={18} color="#06b6d4" />
            <span>{isBn ? 'সেরা বিক্রিত পণ্যসমূহ (Top Selling)' : 'Top Selling Products'}</span>
          </div>
          {topSellingProducts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {topSellingProducts.map((p, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem', padding: '0.35rem 0', borderBottom: '1px solid #1e293b' }}>
                  <div style={{ minWidth: 0, flex: 1, paddingRight: '0.5rem' }}>
                    <div style={{ fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.productName}</div>
                    <div style={{ fontSize: '0.725rem', color: '#06b6d4' }}>{p.spec} ({p.brand})</div>
                  </div>
                  <span className="badge badge-cyan" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                    {p.quantity} Pcs
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>
              {isBn ? 'কোনো পণ্য বিক্রির রেকর্ড নেই' : 'No sales records for this period'}
            </div>
          )}
        </div>

        {/* Top 5 Most Profitable */}
        <div className="card">
          <div className="card-title" style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>
            <Percent size={18} color="#10b981" />
            <span>{isBn ? 'সবচেয়ে লাভজনক পণ্য (Top Profit)' : 'Most Profitable'}</span>
          </div>
          {mostProfitableProducts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {mostProfitableProducts.map((p, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem', padding: '0.35rem 0', borderBottom: '1px solid #1e293b' }}>
                  <div style={{ minWidth: 0, flex: 1, paddingRight: '0.5rem' }}>
                    <div style={{ fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.productName}</div>
                    <div style={{ fontSize: '0.725rem', color: '#06b6d4' }}>{p.spec} ({p.brand})</div>
                  </div>
                  <span style={{ fontWeight: 700, color: '#10b981' }}>
                    +৳{p.profit.toLocaleString('en-BD')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>
              {isBn ? 'কোনো পণ্য বিক্রির রেকর্ড নেই' : 'No sales records for this period'}
            </div>
          )}
        </div>

      </div>

      {/* Supplier Payable Ledger */}
      <div className="card">
        <div className="card-title">
          <Wallet size={20} color="#f43f5e" />
          <span>{isBn ? 'সাপ্লায়ার বাকি পরিশোধের খাতা (Supplier Dues Ledger)' : 'Supplier Dues Ledger'}</span>
          <span className="badge badge-rose" style={{ marginLeft: 'auto' }}>
            {suppliers.filter(s => (s.balanceDue || 0) > 0).length} {isBn ? 'জন বাকিদার' : 'Pending'}
          </span>
        </div>

        {suppliers.filter(s => (s.balanceDue || 0) > 0).length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isBn ? 'সাপ্লায়ারের নাম' : 'Supplier Name'}</th>
                  <th>{isBn ? 'ফোন নম্বর' : 'Phone'}</th>
                  <th>{isBn ? 'ঠিকানা' : 'Address'}</th>
                  <th>{isBn ? 'পাওনা টাকা (Due Balance)' : 'Due Balance'}</th>
                  <th style={{ textAlign: 'right' }}>{isBn ? 'অ্যাকশন' : 'Action'}</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.filter(s => (s.balanceDue || 0) > 0).map(sup => (
                  <tr key={sup.id}>
                    <td style={{ fontWeight: 600 }}>{sup.name}</td>
                    <td>{sup.phone}</td>
                    <td style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{sup.address}</td>
                    <td>
                      <span className="badge badge-rose">৳{sup.balanceDue.toLocaleString('en-BD')} বাকি</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          setPaySupId(sup.id);
                          setSupPayAmount(sup.balanceDue);
                        }}
                        className="btn btn-primary btn-sm"
                      >
                        {isBn ? 'বাকি পরিশোধ' : 'Pay Due'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#10b981' }}>
            <p style={{ fontWeight: 600, fontSize: '0.925rem' }}>
              {isBn ? 'বর্তমানে কোনো সাপ্লায়ারের বকেয়া পাওনা বাকি নেই!' : 'No supplier dues pending!'}
            </p>
          </div>
        )}
      </div>

      {/* Pay Supplier Modal */}
      {paySupId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{isBn ? 'সাপ্লায়ারের বাকি পরিশোধ করুন' : 'Pay Supplier Due'}</h3>
              <button onClick={() => setPaySupId(null)} className="btn btn-secondary btn-sm">✕</button>
            </div>
            <form onSubmit={handlePaySupplier}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="form-group">
                  <label className="form-label">{isBn ? 'পরিশোধের পরিমাণ (৳)' : 'Payment Amount ৳'}</label>
                  <input
                    type="number"
                    required
                    className="input-control"
                    value={supPayAmount}
                    onChange={(e) => setSupPayAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setPaySupId(null)} className="btn btn-secondary">{isBn ? 'বাতিল' : 'Cancel'}</button>
                <button type="submit" className="btn btn-primary">{isBn ? 'পরিশোধ সেভ' : 'Save Payment'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
