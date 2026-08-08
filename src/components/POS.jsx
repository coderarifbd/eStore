import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { AutocompleteSearch } from './AutocompleteSearch';
import { 
  ShoppingCart, 
  Trash2, 
  Receipt, 
  Printer, 
  UserCheck,
  CheckCircle,
  History,
  Search,
  FileText,
  Edit3,
  Eye,
  Save,
  ChevronDown,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SearchableBrandSelect = ({ brands = [], value, onChange, isBn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredBrands = brands.filter(b => {
    if (!search.trim()) return true;
    return b.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div ref={dropdownRef} style={{ position: 'relative', minWidth: '170px' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '0.4rem 0.75rem',
          backgroundColor: value !== 'ALL' ? 'rgba(139, 92, 246, 0.2)' : '#0f172a',
          border: value !== 'ALL' ? '1px solid #8b5cf6' : '1px solid #334155',
          borderRadius: '8px',
          color: value !== 'ALL' ? '#c084fc' : '#f8fafc',
          fontWeight: value !== 'ALL' ? 700 : 500,
          fontSize: '0.85rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          gap: '0.5rem'
        }}
      >
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
          {value === 'ALL' ? (isBn ? '-- সকল ব্র্যান্ড --' : '-- All Brands --') : value}
        </span>
        <ChevronDown size={16} color="#94a3b8" />
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            right: 0,
            width: '220px',
            backgroundColor: '#0f172a',
            border: '1px solid #8b5cf6',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6)',
            zIndex: 9999,
            padding: '6px'
          }}
        >
          {/* Search Bar inside Brand Selector */}
          <div style={{ padding: '4px 6px 8px 6px', borderBottom: '1px solid #1e293b', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Search size={14} color="#8b5cf6" />
            <input
              type="text"
              autoFocus
              placeholder={isBn ? 'ব্র্যান্ড খুঁজুন...' : 'Search brand...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', background: 'none', border: 'none', color: '#f8fafc', fontSize: '0.825rem', outline: 'none' }}
            />
            {search && <X size={14} color="#94a3b8" onClick={() => setSearch('')} style={{ cursor: 'pointer' }} />}
          </div>

          <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div
              onClick={() => { onChange('ALL'); setIsOpen(false); }}
              style={{
                padding: '6px 10px',
                borderRadius: '5px',
                cursor: 'pointer',
                backgroundColor: value === 'ALL' ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
                color: value === 'ALL' ? '#c084fc' : '#94a3b8',
                fontSize: '0.85rem',
                fontWeight: value === 'ALL' ? 700 : 500
              }}
            >
              {isBn ? '-- সকল ব্র্যান্ড --' : '-- All Brands --'}
            </div>

            {filteredBrands.map(b => (
              <div
                key={b}
                onClick={() => { onChange(b); setIsOpen(false); }}
                style={{
                  padding: '6px 10px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  backgroundColor: value === b ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
                  color: value === b ? '#c084fc' : '#e2e8f0',
                  fontSize: '0.85rem',
                  fontWeight: value === b ? 700 : 500
                }}
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const POS = () => {
  const { lang, sales, brands, addSale, updateSale, deleteSale, setPrintDoc, showConfirm, isAdmin } = useStore();
  const isBn = lang === 'bn';

  // Screen View Switcher: 'pos' (New Sale) vs 'history' (Old Invoices Archive)
  const [posTab, setPosTab] = useState('pos');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('ALL');

  // POS State
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [discountType, setDiscountType] = useState('flat');
  const [discountValue, setDiscountValue] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paidAmount, setPaidAmount] = useState('');
  const [notes, setNotes] = useState('');

  // Old Invoices Search Query & Filters
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyDueFilter, setHistoryDueFilter] = useState('ALL');

  // Edit Invoice Modal State
  const [editingSale, setEditingSale] = useState(null);

  // Add Item to POS Cart from Autocomplete
  const handleSelectVariant = (variantItem) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.variantId === variantItem.variantId);

      if (existingIndex >= 0) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + 1;
        if (newQty <= variantItem.stock) {
          updated[existingIndex].quantity = newQty;
        } else {
          alert(isBn ? `স্টক সীমিত! মাত্র ${variantItem.stock}টি অ্যাভেইলএবল।` : `Stock limit reached! Only ${variantItem.stock} available.`);
        }
        return updated;
      } else {
        if (variantItem.stock < 1) {
          alert(isBn ? 'এই পণ্যটি স্টকে নেই (Stock Out)!' : 'Item is out of stock!');
          return prevCart;
        }
        return [...prevCart, {
          productId: variantItem.productId,
          variantId: variantItem.variantId,
          productNameBn: variantItem.productNameBn,
          productNameEn: variantItem.productNameEn,
          brand: variantItem.brand,
          spec: variantItem.spec,
          unit: variantItem.unit,
          purchasePrice: variantItem.purchasePrice,
          unitPrice: variantItem.sellingPrice,
          quantity: 1,
          maxStock: variantItem.stock,
          batches: variantItem.batches || []
        }];
      }
    });
  };

  const getFifoDeductionBreakdown = (item) => {
    let quantityToDeduct = item.quantity;
    const breakdown = [];
    const sortedBatches = [...(item.batches || [])].sort((a, b) => new Date(a.date) - new Date(b.date));

    for (const batch of sortedBatches) {
      if (quantityToDeduct <= 0) break;

      if (batch.remainingQuantity > 0) {
        const deductFromThisBatch = Math.min(quantityToDeduct, batch.remainingQuantity);
        quantityToDeduct -= deductFromThisBatch;
        breakdown.push({
          voucherId: batch.purchaseVoucherId,
          qty: deductFromThisBatch,
          price: batch.sellingPrice
        });
      }
    }

    if (quantityToDeduct > 0 && sortedBatches.length > 0) {
      breakdown.push({
        voucherId: 'Oversold / ঘাটতি',
        qty: quantityToDeduct,
        price: item.unitPrice
      });
    }

    return breakdown;
  };

  const updateQuantity = (variantId, newQty) => {
    setCart(prev => prev.map(item => {
      if (item.variantId === variantId) {
        const val = Math.max(0.1, Number(newQty) || 0.1);
        if (val > item.maxStock) {
          alert(isBn ? `স্টকে মাত্র ${item.maxStock} ${item.unit} রয়েছে!` : `Only ${item.maxStock} ${item.unit} in stock!`);
          return { ...item, quantity: item.maxStock };
        }
        return { ...item, quantity: val };
      }
      return item;
    }));
  };

  const updateRate = (variantId, newRate) => {
    setCart(prev => prev.map(item => {
      if (item.variantId === variantId) {
        const val = Math.max(0, Number(newRate) || 0);
        return { ...item, unitPrice: val };
      }
      return item;
    }));
  };

  const removeFromCart = (variantId) => {
    setCart(prev => prev.filter(item => item.variantId !== variantId));
  };

  // Calculations
  const subtotal = cart.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0);
  
  let calculatedDiscount = 0;
  if (discountType === 'flat') {
    calculatedDiscount = Math.min(subtotal, Number(discountValue) || 0);
  } else {
    calculatedDiscount = (subtotal * (Math.min(100, Number(discountValue) || 0))) / 100;
  }

  const grandTotal = Math.max(0, subtotal - calculatedDiscount);
  const numericPaid = paidAmount === '' ? grandTotal : Number(paidAmount);
  const dueAmount = Math.max(0, grandTotal - numericPaid);

  const totalCostPrice = cart.reduce((acc, i) => acc + (i.quantity * i.purchasePrice), 0);
  const estimatedProfit = grandTotal - totalCostPrice;

  // Checkout Handler
  const handleCheckout = (shouldPrint = false) => {
    if (cart.length === 0) return;

    const salePayload = {
      customerName: customerName.trim() || (isBn ? 'নগদ কাস্টমার' : 'Walk-in Customer'),
      customerPhone: customerPhone.trim() || 'N/A',
      items: cart.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        productName: isBn ? item.productNameBn : item.productNameEn,
        brand: item.brand,
        spec: item.spec,
        unit: item.unit,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.quantity * item.unitPrice,
        purchasePrice: item.purchasePrice
      })),
      subtotal,
      discount: calculatedDiscount,
      grandTotal,
      paidAmount: numericPaid,
      dueAmount,
      paymentMethod,
      estimatedProfit,
      notes
    };

    const createdSale = addSale(salePayload);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 }
    });

    if (shouldPrint) {
      setPrintDoc({ type: 'INVOICE', data: createdSale });
    } else {
      alert(isBn ? `ক্যাশ মেমো ${createdSale.id} সফলভাবে সেভ করা হয়েছে!` : `Invoice ${createdSale.id} saved successfully!`);
    }

    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setDiscountValue(0);
    setPaidAmount('');
    setNotes('');
  };

  // Save Edit Invoice Form Handler
  const handleSaveInvoiceEdit = (e) => {
    e.preventDefault();
    if (!editingSale) return;

    const newGrand = Number(editingSale.grandTotal);
    const newPaid = Number(editingSale.paidAmount);
    const newDue = Math.max(0, newGrand - newPaid);

    updateSale(editingSale.id, {
      customerName: editingSale.customerName,
      customerPhone: editingSale.customerPhone,
      paidAmount: newPaid,
      dueAmount: newDue,
      paymentMethod: editingSale.paymentMethod,
      notes: editingSale.notes
    });

    alert(isBn ? `ইনভয়েস ${editingSale.id} আপডেট করা হয়েছে!` : 'Invoice updated!');
    setEditingSale(null);
  };

  // Filter Old Past Invoices
  const filteredSalesHistory = sales.filter(s => {
    const q = historySearchQuery.toLowerCase();
    const matchesSearch = !q || (
      s.id.toLowerCase().includes(q) ||
      (s.customerName && s.customerName.toLowerCase().includes(q)) ||
      (s.customerPhone && s.customerPhone.includes(q)) ||
      (s.date && s.date.toLowerCase().includes(q))
    );

    const matchesDue = historyDueFilter === 'ALL' || (historyDueFilter === 'DUE' ? s.dueAmount > 0 : s.dueAmount <= 0);

    return matchesSearch && matchesDue;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Navigation Switcher */}
      <div className="card" style={{ padding: '0.75rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setPosTab('pos')}
              className={`btn btn-sm ${posTab === 'pos' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontWeight: 700 }}
            >
              <ShoppingCart size={16} />
              <span>{isBn ? '🛒 নতুন বিক্রয় কাউন্টার (New Sale)' : 'New POS Sale'}</span>
            </button>

            <button
              onClick={() => setPosTab('history')}
              className={`btn btn-sm ${posTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontWeight: 700 }}
            >
              <History size={16} color={posTab === 'history' ? '#0f172a' : '#8b5cf6'} />
              <span>{isBn ? '📜 পুরানো মেমো (View, Edit & Print Invoices)' : 'View & Edit Past Invoices'}</span>
              <span className="badge badge-purple" style={{ marginLeft: '4px', fontSize: '0.75rem' }}>
                {sales.length}
              </span>
            </button>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            {isBn ? `মোট ক্যাশ মেমো সংরক্ষিত: ${sales.length} টি` : `Total Invoices Saved: ${sales.length}`}
          </div>
        </div>
      </div>

      {/* POS VIEW 1: New Counter */}
      {posTab === 'pos' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
          
          {/* Left Column: Search & Cart */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div className="card" style={{ position: 'relative', zIndex: 100 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div className="card-title" style={{ color: '#06b6d4', marginBottom: 0 }}>
                  <ShoppingCart size={22} />
                  <span>{isBn ? 'খুচরা বিক্রয় সার্চ কাউন্টার (POS Counter)' : 'Retail POS Counter'}</span>
                </div>

                {/* Brand Filter Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                    {isBn ? 'ব্র্যান্ড সিলেক্ট:' : 'Select Brand:'}
                  </label>
                  <SearchableBrandSelect
                    brands={brands}
                    value={selectedBrandFilter}
                    onChange={setSelectedBrandFilter}
                    isBn={isBn}
                  />
                </div>
              </div>

              <AutocompleteSearch
                onSelectVariant={handleSelectVariant}
                selectedBrand={selectedBrandFilter}
                placeholder={
                  selectedBrandFilter !== 'ALL'
                    ? (isBn ? `"${selectedBrandFilter}" ব্র্যান্ডের পণ্য সার্চ করুন...` : `Search ${selectedBrandFilter} products...`)
                    : (isBn ? 'পণ্যের নাম, ওয়াট, সাইজ বা ব্র্যান্ড লিখে সার্চ করুন...' : 'Search products by name, brand, spec...')
                }
              />
            </div>

            {/* Cart Items Table */}
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', zIndex: 10 }}>
              <div className="card-title">
                <span>{isBn ? 'কাস্টমার কার্ট থলে' : 'Shopping Cart'}</span>
                <span className="badge badge-cyan" style={{ marginLeft: 'auto' }}>
                  {cart.length} {isBn ? 'টি পণ্য' : 'Items'}
                </span>
              </div>

              {cart.length > 0 ? (
                <div className="table-container" style={{ flex: 1 }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>{isBn ? 'পণ্য ও বিবরণ' : 'Item'}</th>
                        <th>{isBn ? 'বিক্রয় পরিমাণ' : 'Qty'}</th>
                        <th style={{ color: '#10b981' }}>{isBn ? 'একক বিক্রি দাম (Rate)' : 'Selling Rate'}</th>
                        <th>{isBn ? 'মোট' : 'Total'}</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map(item => (
                        <tr key={item.variantId}>
                          <td>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                              {isBn ? item.productNameBn : item.productNameEn}
                            </div>
                            <div style={{ fontSize: '0.775rem', color: '#06b6d4' }}>
                              {item.brand} • <strong>{item.spec}</strong>
                            </div>
                            {item.batches && item.batches.filter(b => b.remainingQuantity > 0).length > 1 && (
                              <div style={{ marginTop: '4px', fontSize: '0.725rem', color: '#94a3b8', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                <span style={{ color: '#f59e0b', fontWeight: 600 }}>{isBn ? 'চালান ব্রেকডাউন:' : 'Batch FIFO:'}</span>
                                {getFifoDeductionBreakdown(item).map((d, dIdx) => (
                                  <span key={dIdx} style={{ whiteSpace: 'nowrap' }}>
                                    • {d.qty} Pcs @ ৳{d.price} ({d.voucherId === 'initial' ? (isBn ? 'ওপেনিং' : 'Init') : d.voucherId})
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>

                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <input
                                type="number"
                                step="any"
                                min="0.1"
                                className="input-control"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.variantId, e.target.value)}
                                style={{ width: '70px', padding: '0.35rem 0.4rem', textAlign: 'center', fontWeight: 700 }}
                              />
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                {item.unit === 'Goj' ? (isBn ? 'গজ' : 'Yard') : item.unit}
                              </span>
                            </div>
                          </td>

                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                              <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>৳</span>
                              <input
                                type="number"
                                min="0"
                                className="input-control"
                                value={item.unitPrice}
                                onChange={(e) => updateRate(item.variantId, e.target.value)}
                                style={{ 
                                  width: '80px', 
                                  padding: '0.35rem 0.4rem', 
                                  fontWeight: 700, 
                                  color: '#10b981', 
                                  borderColor: '#10b981' 
                                }}
                                title={isBn ? 'দামাদামি অনুযায়ী বিক্রি দাম ম্যানুয়ালি পরিবর্তন করুন' : 'Manually change rate'}
                              />
                            </div>
                          </td>

                          <td style={{ fontWeight: 700, color: '#10b981' }}>
                            ৳{(item.quantity * item.unitPrice).toLocaleString('en-BD')}
                          </td>

                          <td>
                            <button
                              onClick={() => removeFromCart(item.variantId)}
                              style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}
                              title="কার্ট থেকে সরান"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748b' }}>
                  <ShoppingCart size={48} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
                  <p>{isBn ? 'কার্ট ফাঁকা। পণ্য সিলেক্ট করতে উপরে সার্চ করুন।' : 'Cart is empty. Search products above.'}</p>
                </div>
              )}

              {cart.length > 0 && (
                <div style={{
                  marginTop: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #334155',
                  display: 'flex',
                  justify: 'space-between',
                  fontSize: '0.85rem',
                  color: '#94a3b8'
                }}>
                  <span>{isBn ? 'দামাদামির পর আনুমানিক লাভ (Est. Profit):' : 'Estimated Profit:'}</span>
                  <span style={{ color: estimatedProfit >= 0 ? '#10b981' : '#f43f5e', fontWeight: 700 }}>
                    ৳{estimatedProfit.toLocaleString('en-BD')}
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Customer Info & Checkout */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card">
              <div className="card-title">
                <UserCheck size={20} color="#8b5cf6" />
                <span>{isBn ? 'কাস্টমার তথ্য (Customer Details)' : 'Customer Details'}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">{isBn ? 'কাস্টমারের নাম' : 'Customer Name'}</label>
                  <input
                    type="text"
                    className="input-control"
                    placeholder={isBn ? 'নগদ কাস্টমার' : 'Walk-in Customer'}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{isBn ? 'মোবাইল নম্বর' : 'Phone Number'}</label>
                  <input
                    type="text"
                    className="input-control"
                    placeholder="017........"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="card" style={{ backgroundColor: '#0f172a', border: '1px solid #06b6d4' }}>
              <div className="card-title" style={{ borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
                <Receipt size={20} color="#06b6d4" />
                <span>{isBn ? 'ক্যাশ মেমো বিল হিসাব (Bill Summary)' : 'Bill Summary'}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '1rem 0' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', color: '#94a3b8' }}>
                  <span>{isBn ? 'পণ্যের সমষ্টি (Subtotal):' : 'Subtotal:'}</span>
                  <span style={{ fontWeight: 600, color: '#f8fafc' }}>৳{subtotal.toLocaleString('en-BD')}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>{isBn ? 'ছাড় (Discount)' : 'Discount'}</label>
                    <input
                      type="number"
                      className="input-control"
                      placeholder="0"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                    />
                  </div>

                  <div style={{ width: '110px' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>{isBn ? 'টাইপ' : 'Type'}</label>
                    <select
                      className="select-control"
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value)}
                    >
                      <option value="flat">৳ Flat</option>
                      <option value="percent">% Percent</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.35rem', fontWeight: 700, padding: '0.5rem 0', borderTop: '1px dashed #334155' }}>
                  <span>{isBn ? 'সর্বমোট প্রদেয় (Grand Total):' : 'Grand Total:'}</span>
                  <span style={{ color: '#06b6d4' }}>৳{grandTotal.toLocaleString('en-BD')}</span>
                </div>

                <div className="form-group">
                  <label className="form-label">{isBn ? 'পেমেন্ট মাধ্যম (Payment Method)' : 'Payment Method'}</label>
                  <select
                    className="select-control"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="Cash">💵 ক্যাশ/নগদ (Cash)</option>
                    <option value="bKash">📱 বিকাশ (bKash)</option>
                    <option value="Nagad">📱 নগদ (Nagad)</option>
                    <option value="Bank">🏦 ব্যাংক ট্রান্সফার (Bank)</option>
                    <option value="Due">⏳ সম্পূর্ণ বাকি (Due)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{isBn ? 'জমা দেওয়া টাকা (Paid Amount)' : 'Paid Amount'}</label>
                  <input
                    type="number"
                    className="input-control"
                    placeholder={`৳${grandTotal}`}
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                  />
                </div>

                {dueAmount > 0 && (
                  <div style={{
                    backgroundColor: 'rgba(244, 63, 94, 0.15)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    color: '#f43f5e',
                    fontWeight: 600,
                    display: 'flex',
                    justify: 'space-between',
                    fontSize: '0.9rem'
                  }}>
                    <span>{isBn ? 'কাস্টমার বাকি (Due Amount):' : 'Due Amount:'}</span>
                    <span>৳{dueAmount.toLocaleString('en-BD')}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  onClick={() => handleCheckout(false)}
                  disabled={cart.length === 0}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                >
                  <Save size={18} />
                  <span>{isBn ? 'শুধু সেভ করুন' : 'Save Only'}</span>
                </button>

                <button
                  onClick={() => handleCheckout(true)}
                  disabled={cart.length === 0}
                  className="btn btn-success btn-lg"
                  style={{ width: '100%' }}
                >
                  <Printer size={18} />
                  <span>{isBn ? 'সেভ ও প্রিন্ট' : 'Save & Print'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* POS VIEW 2: Past Invoices Archive with View, Edit & Delete Actions */}
      {posTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Search & Filter Bar */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    type="text"
                    className="input-control"
                    placeholder={isBn ? 'মেমো নম্বর (যেমন INV-2026..), কাস্টমার নাম বা মোবাইল দিয়ে খুঁজুন...' : 'Search invoice #, customer name or phone...'}
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <select
                  className="select-control"
                  value={historyDueFilter}
                  onChange={(e) => setHistoryDueFilter(e.target.value)}
                  style={{ width: 'auto' }}
                >
                  <option value="ALL">{isBn ? 'সকল মেমো' : 'All Invoices'}</option>
                  <option value="DUE">{isBn ? 'শুধু বাকি মেমো (Customer Dues)' : 'Dues Only'}</option>
                  <option value="PAID">{isBn ? 'পরিশোধিত মেমো (Paid Only)' : 'Paid Only'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Past Invoices Table */}
          <div className="card">
            <div className="card-title">
              <History size={20} color="#8b5cf6" />
              <span>{isBn ? 'সংরক্ষিত পুরানো ক্যাশ মেমোসমূহ (View, Edit & Print)' : 'Past Cash Memos'}</span>
              <span className="badge badge-purple" style={{ marginLeft: 'auto' }}>
                {filteredSalesHistory.length} {isBn ? 'টি মেমো' : 'Invoices'}
              </span>
            </div>

            {filteredSalesHistory.length > 0 ? (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{isBn ? 'মেমো নম্বর' : 'Invoice #'}</th>
                      <th>{isBn ? 'তারিখ ও সময়' : 'Date'}</th>
                      <th>{isBn ? 'কাস্টমার তথ্য' : 'Customer'}</th>
                      <th>{isBn ? 'আইটেম সংখ্যা' : 'Items'}</th>
                      <th style={{ color: '#06b6d4' }}>{isBn ? 'সর্বমোট প্রদেয়' : 'Grand Total'}</th>
                      <th style={{ color: '#10b981' }}>{isBn ? 'জমা টাকা' : 'Paid'}</th>
                      <th style={{ color: '#f43f5e' }}>{isBn ? 'বাকি' : 'Due'}</th>
                      <th style={{ textAlign: 'right' }}>{isBn ? 'মেমো অ্যাকশনসমূহ' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSalesHistory.map(sale => (
                      <tr key={sale.id}>
                        <td style={{ fontWeight: 700, color: '#06b6d4' }}>
                          {sale.id}
                        </td>
                        <td style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
                          {sale.date}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{sale.customerName || (isBn ? 'নগদ কাস্টমার' : 'Walk-in Customer')}</div>
                          {sale.customerPhone && sale.customerPhone !== 'N/A' && (
                            <div style={{ fontSize: '0.775rem', color: '#8b5cf6' }}>📱 {sale.customerPhone}</div>
                          )}
                        </td>
                        <td style={{ fontSize: '0.875rem' }}>
                          {sale.items?.length || 0} {isBn ? 'টি আইটেম' : 'Items'}
                        </td>
                        <td style={{ fontWeight: 700, color: '#06b6d4' }}>
                          ৳{sale.grandTotal.toLocaleString('en-BD')}
                        </td>
                        <td style={{ fontWeight: 600, color: '#10b981' }}>
                          ৳{sale.paidAmount.toLocaleString('en-BD')}
                        </td>
                        <td>
                          {sale.dueAmount > 0 ? (
                            <span className="badge badge-rose">
                              ৳{sale.dueAmount.toLocaleString('en-BD')} বাকি
                            </span>
                          ) : (
                            <span className="badge badge-green">
                              {isBn ? 'পরিশোধিত' : 'Paid'}
                            </span>
                          )}
                        </td>

                        {/* View, Edit, Print & Delete Action Buttons */}
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '4px' }}>
                            {/* View / Print Memo */}
                            <button
                              onClick={() => setPrintDoc({ type: 'sale', data: sale })}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.3rem 0.5rem', color: '#06b6d4' }}
                              title={isBn ? 'ক্যাশ মেমো দেখুন ও প্রিন্ট করুন (View/Print Invoice)' : 'View & Print'}
                            >
                              <Eye size={15} />
                              <span>{isBn ? 'দেখুন' : 'View'}</span>
                            </button>

                            {/* Edit Invoice (Admin Only) */}
                            {isAdmin && (
                              <button
                                onClick={() => setEditingSale({ ...sale })}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.3rem 0.5rem', color: '#f59e0b' }}
                                title={isBn ? 'মেমোর কাস্টমার ও জমার তথ্য এডিট করুন' : 'Edit Invoice'}
                              >
                                <Edit3 size={15} />
                              </button>
                            )}

                            {/* Delete Invoice & Refund Stock (Admin Only) */}
                            {isAdmin && (
                              <button
                                onClick={async () => {
                                  const confirmed = await showConfirm({
                                    title: isBn ? 'মেমো মুছে ফেলা' : 'Delete Invoice',
                                    message: isBn ? `আপনি কি নিশ্চিত যে ক্যাশ মেমো ${sale.id} মুছে ফেলতে চান? পণ্যের স্টক স্বয়ংক্রিয়ভাবে ফেরত যাবে।` : `Delete invoice ${sale.id} and refund stock?`,
                                    type: 'danger',
                                    confirmText: isBn ? 'হ্যাঁ, ডিলিট করুন' : 'Delete'
                                  });
                                  if (confirmed) {
                                    deleteSale(sale.id);
                                  }
                                }}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.3rem 0.5rem', color: '#f43f5e' }}
                                title={isBn ? 'মেমো ডিলিট ও স্টক ফেরত' : 'Delete Invoice'}
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                <FileText size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.4 }} />
                <p>{isBn ? 'কোনো পুরানো ক্যাশ মেমো পাওয়া যায়নি!' : 'No past invoices found!'}</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Modal: Edit Past Invoice Details */}
      {editingSale && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h3>{isBn ? `ক্যাশ মেমো এডিট (${editingSale.id})` : `Edit Invoice (${editingSale.id})`}</h3>
              <button onClick={() => setEditingSale(null)} className="btn btn-secondary btn-sm">✕</button>
            </div>

            <form onSubmit={handleSaveInvoiceEdit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                
                <div style={{ backgroundColor: '#0f172a', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem' }}>
                  মেমোর সর্বমোট মূল্য: <strong style={{ color: '#06b6d4' }}>৳{editingSale.grandTotal}</strong> (মেমো তৈরি: {editingSale.date})
                </div>

                <div className="form-group">
                  <label className="form-label">{isBn ? 'কাস্টমারের নাম' : 'Customer Name'}</label>
                  <input
                    type="text"
                    className="input-control"
                    value={editingSale.customerName || ''}
                    onChange={(e) => setEditingSale({ ...editingSale, customerName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{isBn ? 'মোবাইল নম্বর' : 'Phone Number'}</label>
                  <input
                    type="text"
                    className="input-control"
                    value={editingSale.customerPhone || ''}
                    onChange={(e) => setEditingSale({ ...editingSale, customerPhone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#10b981', fontWeight: 600 }}>
                    {isBn ? 'পরিশোধিত/জমা টাকা (Paid Amount)' : 'Paid Amount'}
                  </label>
                  <input
                    type="number"
                    className="input-control"
                    value={editingSale.paidAmount}
                    onChange={(e) => setEditingSale({ ...editingSale, paidAmount: e.target.value })}
                    style={{ borderColor: '#10b981' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{isBn ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}</label>
                  <select
                    className="select-control"
                    value={editingSale.paymentMethod}
                    onChange={(e) => setEditingSale({ ...editingSale, paymentMethod: e.target.value })}
                  >
                    <option value="Cash">💵 ক্যাশ/নগদ (Cash)</option>
                    <option value="bKash">📱 বিকাশ (bKash)</option>
                    <option value="Nagad">📱 নগদ (Nagad)</option>
                    <option value="Bank">🏦 ব্যাংক ট্রান্সফার (Bank)</option>
                    <option value="Due">⏳ সম্পূর্ণ বাকি (Due)</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setEditingSale(null)} className="btn btn-secondary">
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button type="submit" className="btn btn-primary">
                  {isBn ? 'মেমো আপডেট করুন' : 'Update Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
