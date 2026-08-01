import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { AutocompleteSearch } from './AutocompleteSearch';
import { 
  FileText, 
  Truck, 
  Trash2, 
  CheckCircle, 
  PackagePlus,
  Coins,
  Sliders,
  Plus,
  History,
  Search,
  Eye,
  Edit3,
  ChevronDown,
  X
} from 'lucide-react';

const SearchableSelectDropdown = ({ options = [], value, onChange, disabled, isBn, placeholder, searchPlaceholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  const filteredOptions = options.filter(o => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (o.label && o.label.toLowerCase().includes(q)) ||
      (o.displaySpec && o.displaySpec.toLowerCase().includes(q)) ||
      (o.brand && o.brand.toLowerCase().includes(q))
    );
  });

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Control Box */}
      <div
        onClick={() => {
          if (!disabled) setIsOpen(prev => !prev);
        }}
        style={{
          width: '100%',
          padding: '0.5rem 0.75rem',
          backgroundColor: disabled ? '#1e293b' : '#0f172a',
          border: isOpen ? '1px solid #06b6d4' : '1px solid #334155',
          borderRadius: '8px',
          color: selectedOption ? '#f8fafc' : '#94a3b8',
          fontSize: '0.875rem',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          boxSizing: 'border-box',
          opacity: disabled ? 0.6 : 1,
          minHeight: '38px'
        }}
      >
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {selectedOption
            ? selectedOption.label
            : (placeholder || (isBn ? '-- নির্বাচন করুন --' : '-- Select --'))}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
          {selectedOption && !disabled && (
            <X
              size={15}
              color="#94a3b8"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
                setSearch('');
              }}
              style={{ cursor: 'pointer' }}
            />
          )}
          <ChevronDown size={16} color="#94a3b8" />
        </div>
      </div>

      {/* Dropdown Menu with Search Field */}
      {isOpen && !disabled && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            backgroundColor: '#0f172a',
            border: '1px solid #06b6d4',
            borderRadius: '8px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(6, 182, 212, 0.2)',
            zIndex: 9999,
            overflow: 'hidden'
          }}
        >
          {/* Search Input */}
          <div style={{ padding: '0.5rem', borderBottom: '1px solid #1e293b', backgroundColor: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Search size={15} color="#06b6d4" />
            <input
              type="text"
              autoFocus
              placeholder={searchPlaceholder || (isBn ? 'টাইপ করে খুঁজুন...' : 'Type to search...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                color: '#f8fafc',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            {search && (
              <X size={14} color="#94a3b8" onClick={() => setSearch('')} style={{ cursor: 'pointer' }} />
            )}
          </div>

          {/* Options List */}
          <div style={{ maxHeight: '220px', overflowY: 'auto', padding: '0.25rem' }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    style={{
                      padding: '0.55rem 0.75rem',
                      fontSize: '0.875rem',
                      color: isSelected ? '#06b6d4' : '#e2e8f0',
                      backgroundColor: isSelected ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '2px',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{opt.displaySpec || opt.label}</span>
                    {opt.subText && (
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: '0.5rem' }}>
                        {opt.subText}
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center' }}>
                {isBn ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No matching item found'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const PurchaseVoucher = () => {
  const { lang, products, categories, suppliers, purchases, addPurchaseVoucher, updatePurchaseVoucher, deletePurchaseVoucher, addProduct, showConfirm } = useStore();
  const isBn = lang === 'bn';

  // Screen View Switcher: 'voucher' (New Voucher Entry) vs 'history' (Past Purchase Invoices Archive)
  const [purchaseTab, setPurchaseTab] = useState('voucher');

  // Voucher state
  const [voucherItems, setVoucherItems] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [customSupplierName, setCustomSupplierName] = useState('');
  const [customSupplierPhone, setCustomSupplierPhone] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [voucherNotes, setVoucherNotes] = useState('');
  const [voucherDate, setVoucherDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Explicit Hierarchical Product -> Variant Selection state
  const [selectedProdId, setSelectedProdId] = useState('');
  const [selectedVarId, setSelectedVarId] = useState('');
  const [purchaseQty, setPurchaseQty] = useState(1);
  const [purchaseRate, setPurchaseRate] = useState('');
  const [sellingRate, setSellingRate] = useState('');

  // Search & Filter for Past Purchases History
  const [historySearchQuery, setHistorySearchQuery] = useState('');

  // Quick New Product Modal toggle state (Only Name, Brand, Category, Unit, Spec - NO stock/rates required!)
  const [showAddProdModal, setShowAddProdModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newBrand, setNewBrand] = useState('BRB Cables');
  const [newCategory, setNewCategory] = useState('cat_cables');
  const [newUnit, setNewUnit] = useState('Coil');
  const [newSpec, setNewSpec] = useState('1.5 rm');

  // Selected Voucher View Details & Edit States
  const [viewingVoucher, setViewingVoucher] = useState(null);
  const [editingVoucher, setEditingVoucher] = useState(null);

  // Selector state for adding a NEW item INSIDE Edit Modal
  const [editModalProdId, setEditModalProdId] = useState('');
  const [editModalVarId, setEditModalVarId] = useState('');
  const [editModalQty, setEditModalQty] = useState(1);
  const [editModalRate, setEditModalRate] = useState('');
  const [editModalSellingRate, setEditModalSellingRate] = useState('');

  // Add Item to Voucher from Autocomplete Search
  const handleSelectVariantFromAutocomplete = (variantItem) => {
    addItemToVoucher(variantItem);
  };

  const addItemToVoucher = (variantObj) => {
    setVoucherItems(prev => {
      const existingIdx = prev.findIndex(item => item.variantId === variantObj.variantId);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += (variantObj.quantity || 1);
        if (variantObj.unitPrice) updated[existingIdx].unitPrice = variantObj.unitPrice;
        if (variantObj.sellingPrice) updated[existingIdx].sellingPrice = variantObj.sellingPrice;
        return updated;
      } else {
        return [...prev, {
          productId: variantObj.productId,
          variantId: variantObj.variantId,
          productNameBn: variantObj.productNameBn,
          productNameEn: variantObj.productNameEn,
          brand: variantObj.brand,
          spec: variantObj.spec,
          unit: variantObj.unit,
          unitPrice: variantObj.purchasePrice || variantObj.unitPrice || 0,
          sellingPrice: variantObj.sellingPrice || 0,
          quantity: variantObj.quantity || 1
        }];
      }
    });
  };

  const handleAddFromDropdown = () => {
    if (!selectedProdId || !selectedVarId) return;

    const prod = products.find(p => p.id === selectedProdId);
    if (!prod) return;

    let realVarId = selectedVarId;
    let selectedBrandName = prod.brand;

    if (selectedVarId.includes('__BRAND__')) {
      const parts = selectedVarId.split('__BRAND__');
      realVarId = parts[0];
      selectedBrandName = parts[1];
    }

    const variant = prod.variants.find(v => v.id === realVarId);
    if (!variant) return;

    addItemToVoucher({
      productId: prod.id,
      variantId: selectedVarId.includes('__BRAND__') ? `${variant.id}_${selectedBrandName}` : variant.id,
      productNameBn: prod.nameBn,
      productNameEn: prod.nameEn,
      brand: selectedBrandName,
      spec: variant.spec,
      unit: prod.unit,
      purchasePrice: Number(purchaseRate || variant.purchasePrice || 0),
      sellingPrice: Number(sellingRate || variant.sellingPrice || 0),
      quantity: Number(purchaseQty || 1)
    });

    setSelectedVarId('');
    setPurchaseQty(1);
    setPurchaseRate('');
    setSellingRate('');
  };

  const updateItemQty = (variantId, qty) => {
    setVoucherItems(prev => prev.map(i => i.variantId === variantId ? { ...i, quantity: Math.max(1, Number(qty) || 1) } : i));
  };

  const updateItemPrice = (variantId, price) => {
    setVoucherItems(prev => prev.map(i => i.variantId === variantId ? { ...i, unitPrice: Number(price) || 0 } : i));
  };

  const updateItemSellingPrice = (variantId, sPrice) => {
    setVoucherItems(prev => prev.map(i => i.variantId === variantId ? { ...i, sellingPrice: Number(sPrice) || 0 } : i));
  };

  const removeItem = (variantId) => {
    setVoucherItems(prev => prev.filter(i => i.variantId !== variantId));
  };

  const grandTotal = voucherItems.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0);
  const numericPaid = paidAmount === '' ? grandTotal : Number(paidAmount);
  const dueAmount = Math.max(0, grandTotal - numericPaid);

  const handleSaveVoucher = (e) => {
    e.preventDefault();

    if (voucherItems.length === 0) {
      alert(isBn ? 'অনুগ্রহ করে ভাউচারে অন্তত একটি ক্রয়কৃত পণ্য যোগ করুন!' : 'Please add at least one item to purchase voucher!');
      return;
    }

    let supName = customSupplierName;
    if (selectedSupplierId) {
      const foundSup = suppliers.find(s => s.id === selectedSupplierId);
      if (foundSup) supName = foundSup.name;
    }

    const payload = {
      date: voucherDate,
      supplierId: selectedSupplierId || null,
      supplierName: supName || (isBn ? 'সাধারণ মহাজন/সাপ্লায়ার' : 'General Supplier'),
      items: voucherItems.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        productName: isBn ? item.productNameBn : item.productNameEn,
        brand: item.brand,
        spec: item.spec,
        unit: item.unit,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        sellingPrice: item.sellingPrice || item.unitPrice,
        totalPrice: item.quantity * item.unitPrice
      })),
      grandTotal,
      paidAmount: numericPaid,
      dueAmount,
      notes: voucherNotes
    };

    const createdVoucher = addPurchaseVoucher(payload);
    alert(isBn ? `ক্রয় ভাউচার ${createdVoucher.id} সফলভাবে সংরক্ষিত এবং স্টক ও দাম আপডেট হয়েছে!` : `Purchase voucher ${createdVoucher.id} saved & stock/prices updated!`);

    setVoucherItems([]);
    setSelectedSupplierId('');
    setCustomSupplierName('');
    setCustomSupplierPhone('');
    setPaidAmount('');
    setVoucherNotes('');
  };

  // Add Item to Voucher INSIDE Edit Modal
  const handleAddItemInsideEditModal = () => {
    if (!editModalProdId || !editModalVarId || !editingVoucher) return;

    const prod = products.find(p => p.id === editModalProdId);
    if (!prod) return;

    let realVarId = editModalVarId;
    let selectedBrandName = prod.brand;

    if (editModalVarId.includes('__BRAND__')) {
      const parts = editModalVarId.split('__BRAND__');
      realVarId = parts[0];
      selectedBrandName = parts[1];
    }

    const variant = prod.variants.find(v => v.id === realVarId);
    if (!variant) return;

    const qty = Number(editModalQty || 1);
    const rate = Number(editModalRate || variant.purchasePrice || 0);
    const sRate = Number(editModalSellingRate || variant.sellingPrice || 0);

    const newItem = {
      productId: prod.id,
      variantId: editModalVarId.includes('__BRAND__') ? `${variant.id}_${selectedBrandName}` : variant.id,
      productName: isBn ? prod.nameBn : prod.nameEn,
      brand: selectedBrandName,
      spec: variant.spec,
      unit: prod.unit,
      quantity: qty,
      unitPrice: rate,
      sellingPrice: sRate,
      totalPrice: qty * rate
    };

    setEditingVoucher(prev => {
      const updatedItems = [...prev.items, newItem];
      const newGrand = updatedItems.reduce((acc, i) => acc + i.totalPrice, 0);
      const paidVal = Number(prev.paidAmount || 0);
      return {
        ...prev,
        items: updatedItems,
        grandTotal: newGrand,
        dueAmount: Math.max(0, newGrand - paidVal)
      };
    });

    setEditModalProdId('');
    setEditModalVarId('');
    setEditModalQty(1);
    setEditModalRate('');
    setEditModalSellingRate('');
  };

  // Full Voucher Edit Mode Handlers
  const handleEditVoucherItemQty = (index, newQty) => {
    setEditingVoucher(prev => {
      const newItems = [...prev.items];
      const val = Math.max(1, Number(newQty) || 1);
      newItems[index] = {
        ...newItems[index],
        quantity: val,
        totalPrice: val * newItems[index].unitPrice
      };
      const newGrand = newItems.reduce((acc, i) => acc + i.totalPrice, 0);
      const paidVal = Number(prev.paidAmount || 0);
      return {
        ...prev,
        items: newItems,
        grandTotal: newGrand,
        dueAmount: Math.max(0, newGrand - paidVal)
      };
    });
  };

  const handleEditVoucherItemRate = (index, newRate) => {
    setEditingVoucher(prev => {
      const newItems = [...prev.items];
      const val = Math.max(0, Number(newRate) || 0);
      newItems[index] = {
        ...newItems[index],
        unitPrice: val,
        totalPrice: newItems[index].quantity * val
      };
      const newGrand = newItems.reduce((acc, i) => acc + i.totalPrice, 0);
      const paidVal = Number(prev.paidAmount || 0);
      return {
        ...prev,
        items: newItems,
        grandTotal: newGrand,
        dueAmount: Math.max(0, newGrand - paidVal)
      };
    });
  };

  const handleEditVoucherItemSellingRate = (index, newSellingRate) => {
    setEditingVoucher(prev => {
      const newItems = [...prev.items];
      const val = Math.max(0, Number(newSellingRate) || 0);
      newItems[index] = {
        ...newItems[index],
        sellingPrice: val
      };
      return {
        ...prev,
        items: newItems
      };
    });
  };

  const handleEditPaidAmountChange = (newPaid) => {
    setEditingVoucher(prev => {
      const paidVal = Number(newPaid) || 0;
      const currentGrand = prev.items.reduce((acc, i) => acc + i.totalPrice, 0);
      return {
        ...prev,
        paidAmount: newPaid,
        dueAmount: Math.max(0, currentGrand - paidVal)
      };
    });
  };

  const handleRemoveItemFromEdit = (index) => {
    if (editingVoucher.items.length <= 1) {
      alert(isBn ? 'ভাউচারে অন্তত একটি আইটেম থাকতে হবে!' : 'Voucher must have at least 1 item!');
      return;
    }
    setEditingVoucher(prev => {
      const newItems = prev.items.filter((_, idx) => idx !== index);
      const newGrand = newItems.reduce((acc, i) => acc + i.totalPrice, 0);
      const paidVal = Number(prev.paidAmount || 0);
      return {
        ...prev,
        items: newItems,
        grandTotal: newGrand,
        dueAmount: Math.max(0, newGrand - paidVal)
      };
    });
  };

  // Save Edit Purchase Voucher Handler
  const handleSaveVoucherEdit = (e) => {
    e.preventDefault();
    if (!editingVoucher) return;

    const newGrand = editingVoucher.items.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0);
    const newPaid = Number(editingVoucher.paidAmount || 0);
    const newDue = Math.max(0, newGrand - newPaid);

    updatePurchaseVoucher(editingVoucher.id, {
      date: editingVoucher.date,
      supplierName: editingVoucher.supplierName,
      items: editingVoucher.items,
      grandTotal: newGrand,
      paidAmount: newPaid,
      dueAmount: newDue,
      notes: editingVoucher.notes
    });

    alert(isBn ? `ক্রয় ভাউচার ${editingVoucher.id} সফলভাবে আপডেট করা হয়েছে!` : 'Purchase voucher updated!');
    setEditingVoucher(null);
  };

  // Quick Product Variant Creation (Just Name, Brand, Unit, Spec - NO stock/rates!)
  const handleAddNewProductOnFly = (e) => {
    e.preventDefault();
    if (!newProdName) return;

    const newProd = {
      nameBn: newProdName,
      nameEn: newProdName,
      categoryId: newCategory,
      brand: newBrand,
      unit: newUnit,
      variants: [
        {
          spec: newSpec,
          sku: `${newBrand.substring(0, 3)}-${newSpec.replace(/\s+/g, '')}`,
          purchasePrice: 0,
          sellingPrice: 0,
          stock: 0,
          reorderLevel: 5
        }
      ]
    };

    addProduct(newProd);
    alert(isBn ? 'নতুন পণ্য তৈরি হয়েছে! পরবর্তীতে মালামাল কিনার সময় ভাউচার এন্ট্রি দিলে দাম ও স্টক যুক্ত হবে।' : 'Product created without stock/rates!');
    setShowAddProdModal(false);
    setNewProdName('');
  };

  // Filter Past Purchases History
  const filteredPurchasesHistory = purchases.filter(p => {
    const q = historySearchQuery.toLowerCase();
    return !q || (
      p.id.toLowerCase().includes(q) ||
      (p.supplierName && p.supplierName.toLowerCase().includes(q)) ||
      (p.date && p.date.toLowerCase().includes(q))
    );
  });

  const activeProduct = products.find(p => p.id === selectedProdId);
  const activeEditModalProduct = products.find(p => p.id === editModalProdId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Banner & Tab Navigation Switcher */}
      <div className="card" style={{ padding: '0.85rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setPurchaseTab('voucher')}
              className={`btn btn-sm ${purchaseTab === 'voucher' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontWeight: 700 }}
            >
              <FileText size={16} />
              <span>{isBn ? '🚚 নতুন ক্রয় ভাউচার এন্ট্রি' : 'New Purchase Voucher'}</span>
            </button>

            <button
              onClick={() => setPurchaseTab('history')}
              className={`btn btn-sm ${purchaseTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontWeight: 700 }}
            >
              <History size={16} color={purchaseTab === 'history' ? '#0f172a' : '#8b5cf6'} />
              <span>{isBn ? '📜 পুরানো ভাউচার (View, Edit & Delete)' : 'View & Edit Past Vouchers'}</span>
              <span className="badge badge-purple" style={{ marginLeft: '4px', fontSize: '0.75rem' }}>
                {purchases.length}
              </span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              onClick={() => setShowAddProdModal(true)}
              className="btn btn-primary btn-sm"
            >
              <PackagePlus size={15} />
              <span>{isBn ? '+ নতুন পণ্য টাইটেল তৈরি (No Stock)' : '+ Create Product'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: New Purchase Voucher Entry Form */}
      {purchaseTab === 'voucher' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          
          {/* Left Column: Autocomplete Search + Explicit Variant Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Method A: Search Autocomplete */}
            <div className="card" style={{ position: 'relative', zIndex: 100 }}>
              <div className="card-title" style={{ color: '#8b5cf6' }}>
                <Truck size={20} />
                <span>{isBn ? '১. দ্রুত সার্চের মাধ্যমে ভেরিয়েন্ট যোগ (Fast Search)' : '1. Fast Search Variant'}</span>
              </div>

              <AutocompleteSearch
                onSelectVariant={handleSelectVariantFromAutocomplete}
                placeholder={isBn ? 'পণ্য বা ভেরিয়েন্ট নাম টাইপ করুন (যেমন: BRB 2.5rm, 9W Bulb)...' : 'Type to search item variant...'}
                showPurchasePrice={true}
              />
            </div>

            {/* Method B: Direct Hierarchical Product & Variation Select */}
            <div className="card" style={{ backgroundColor: '#0f172a', border: '1px solid #8b5cf6' }}>
              <div className="card-title" style={{ color: '#06b6d4' }}>
                <Sliders size={20} />
                <span>{isBn ? '২. ড্রপডাউন থেকে পণ্য ও ভেরিয়েন্ট সিলেক্টর' : '2. Select Product & Variant Dropdown'}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                
                {/* Product Select */}
                <div className="form-group">
                  <label className="form-label">{isBn ? 'পণ্য নির্বাচন করুন' : 'Select Product'}</label>
                  <SearchableSelectDropdown
                    options={products.map(p => ({
                      value: p.id,
                      label: p.nameBn,
                      subText: p.brand ? `(${p.brand})` : ''
                    }))}
                    value={selectedProdId}
                    isBn={isBn}
                    placeholder={isBn ? '-- পণ্য নির্বাচন করুন --' : '-- Select Product --'}
                    searchPlaceholder={isBn ? 'টাইপ করে পণ্য খুঁজুন (যেমন: ক্যাবল, সুইচ, বাল্ব)...' : 'Type to search product...'}
                    onChange={(val) => {
                      setSelectedProdId(val);
                      setSelectedVarId('');
                    }}
                  />
                </div>

                {/* Variant Select */}
                <div className="form-group">
                  <label className="form-label">{isBn ? 'সুনির্দিষ্ট ভেরিয়েন্ট (সাইজ / ওয়াট)' : 'Select Variation'}</label>
                  <SearchableSelectDropdown
                    options={(() => {
                      if (!activeProduct || !activeProduct.variants) return [];
                      const brandList = activeProduct.brand
                        ? activeProduct.brand.split(',').map(b => b.trim()).filter(Boolean)
                        : [];

                      const options = [];
                      if (brandList.length > 0) {
                        brandList.forEach(b => {
                          activeProduct.variants.forEach(v => {
                            const hasBrandInSpec = v.spec.toLowerCase().includes(b.toLowerCase());
                            const displaySpec = hasBrandInSpec ? v.spec : `${v.spec} (${b})`;
                            const optionValue = hasBrandInSpec ? v.id : `${v.id}__BRAND__${b}`;
                            options.push({
                              value: optionValue,
                              id: v.id,
                              brand: b,
                              spec: v.spec,
                              displaySpec,
                              label: `${displaySpec} (কিনা: ৳${v.purchasePrice || 0} • বিক্রি: ৳${v.sellingPrice || 0})`,
                              subText: `(কিনা: ৳${v.purchasePrice || 0} • বিক্রি: ৳${v.sellingPrice || 0})`
                            });
                          });
                        });
                      } else {
                        activeProduct.variants.forEach(v => {
                          options.push({
                            value: v.id,
                            id: v.id,
                            brand: '',
                            spec: v.spec,
                            displaySpec: v.spec,
                            label: `${v.spec} (কিনা: ৳${v.purchasePrice || 0} • বিক্রি: ৳${v.sellingPrice || 0})`,
                            subText: `(কিনা: ৳${v.purchasePrice || 0} • বিক্রি: ৳${v.sellingPrice || 0})`
                          });
                        });
                      }
                      return options;
                    })()}
                    value={selectedVarId}
                    disabled={!selectedProdId}
                    isBn={isBn}
                    placeholder={isBn ? '-- ভেরিয়েন্ট নির্বাচন করুন --' : '-- Select Variant Spec --'}
                    searchPlaceholder={isBn ? 'টাইপ করে ভেরিয়েন্ট খুঁজুন (যেমন: Switch, ERICSON)...' : 'Type to search variation...'}
                    onChange={(val) => {
                      setSelectedVarId(val);
                      let realVarId = val;
                      if (val.includes('__BRAND__')) {
                        realVarId = val.split('__BRAND__')[0];
                      }
                      const v = activeProduct?.variants.find(varObj => varObj.id === realVarId);
                      if (v) {
                        setPurchaseRate(v.purchasePrice || '');
                        setSellingRate(v.sellingPrice || '');
                      }
                    }}
                  />
                </div>

                {/* Qty */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">{isBn ? 'ক্রয় পরিমাণ (Qty)' : 'Purchase Quantity'}</label>
                  <input
                    type="number"
                    className="input-control"
                    value={purchaseQty}
                    onChange={(e) => setPurchaseQty(e.target.value)}
                  />
                </div>

                {/* Purchase Rate & Selling Rate */}
                <div className="form-group">
                  <label className="form-label" style={{ color: '#f59e0b', fontWeight: 600 }}>
                    {isBn ? 'একক কিনা দাম (ক্রয়মূল্য ৳)' : 'Purchase Rate ৳'}
                  </label>
                  <input
                    type="number"
                    className="input-control"
                    value={purchaseRate}
                    onChange={(e) => setPurchaseRate(e.target.value)}
                    placeholder="0"
                    style={{ borderColor: '#f59e0b' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#10b981', fontWeight: 600 }}>
                    {isBn ? 'একক বিক্রি দাম (বিক্রয়মূল্য ৳)' : 'Selling Rate ৳'}
                  </label>
                  <input
                    type="number"
                    className="input-control"
                    value={sellingRate}
                    onChange={(e) => setSellingRate(e.target.value)}
                    placeholder="0"
                    style={{ borderColor: '#10b981' }}
                  />
                </div>
              </div>

              <button
                onClick={handleAddFromDropdown}
                disabled={!selectedProdId || !selectedVarId}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.25rem' }}
              >
                <Plus size={16} />
                <span>{isBn ? 'ভাউচারে ভেরিয়েন্টটি যুক্ত করুন' : 'Add Selected Variant to Voucher'}</span>
              </button>
            </div>

            {/* Voucher Item Table */}
            <div className="card" style={{ flex: 1 }}>
              <div className="card-title">
                <span>{isBn ? 'ভাউচারে যুক্তকৃত আইটেম তালিকা' : 'Voucher Items'}</span>
                <span className="badge badge-purple" style={{ marginLeft: 'auto' }}>
                  {voucherItems.length} {isBn ? 'টি আইটেম' : 'Items'}
                </span>
              </div>

              {voucherItems.length > 0 ? (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>{isBn ? 'পণ্য ও সাইজ' : 'Product & Spec'}</th>
                        <th>{isBn ? 'পরিমাণ' : 'Qty'}</th>
                        <th style={{ color: '#f59e0b' }}>{isBn ? 'কিনা দাম' : 'Purchase Rate'}</th>
                        <th style={{ color: '#10b981' }}>{isBn ? 'বিক্রি দাম' : 'Selling Rate'}</th>
                        <th>{isBn ? 'মোট' : 'Total'}</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {voucherItems.map(item => (
                        <tr key={item.variantId}>
                          <td>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                              {isBn ? item.productNameBn : item.productNameEn}
                            </div>
                            <div style={{ fontSize: '0.775rem', color: '#8b5cf6' }}>
                              {item.brand} • <strong style={{ color: '#06b6d4' }}>{item.spec}</strong>
                            </div>
                          </td>

                          <td>
                            <input
                              type="number"
                              className="input-control"
                              value={item.quantity}
                              onChange={(e) => updateItemQty(item.variantId, e.target.value)}
                              style={{ width: '65px', padding: '0.3rem', fontSize: '0.875rem' }}
                            />
                          </td>

                          <td>
                            <input
                              type="number"
                              className="input-control"
                              value={item.unitPrice}
                              onChange={(e) => updateItemPrice(item.variantId, e.target.value)}
                              style={{ width: '80px', padding: '0.3rem', fontSize: '0.875rem', borderColor: '#f59e0b' }}
                            />
                          </td>

                          <td>
                            <input
                              type="number"
                              className="input-control"
                              value={item.sellingPrice}
                              onChange={(e) => updateItemSellingPrice(item.variantId, e.target.value)}
                              style={{ width: '80px', padding: '0.3rem', fontSize: '0.875rem', borderColor: '#10b981' }}
                            />
                          </td>

                          <td style={{ fontWeight: 700, color: '#8b5cf6' }}>
                            ৳{(item.quantity * item.unitPrice).toLocaleString('en-BD')}
                          </td>

                          <td>
                            <button
                              onClick={() => removeItem(item.variantId)}
                              style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}
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
                <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#64748b' }}>
                  <FileText size={38} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
                  <p>{isBn ? 'ভাউচারে কোনো ভেরিয়েন্ট যোগ করা হয়নি। উপরে সিলেক্ট বা সার্চ করুন।' : 'No items added. Select or search above.'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Supplier Info & Payment Settlement */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card">
              <div className="card-title">
                <Truck size={20} color="#06b6d4" />
                <span>{isBn ? 'সাপ্লায়ার ও মহাজন তথ্য (Supplier Info)' : 'Supplier Info'}</span>
              </div>

              <div className="form-group">
                <label className="form-label">{isBn ? 'সংরক্ষিত সাপ্লায়ার সিলেক্ট করুন' : 'Select Existing Supplier'}</label>
                <select
                  className="select-control"
                  value={selectedSupplierId}
                  onChange={(e) => {
                    setSelectedSupplierId(e.target.value);
                    if (e.target.value) setCustomSupplierName('');
                  }}
                >
                  <option value="">{isBn ? '-- সাপ্লায়ার নির্বাচন করুন --' : '-- Select Supplier --'}</option>
                  {suppliers.map(sup => (
                    <option key={sup.id} value={sup.id}>
                      {sup.name} (বাকি: ৳{sup.balanceDue})
                    </option>
                  ))}
                </select>
              </div>

              {!selectedSupplierId && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">{isBn ? 'নতুন সাপ্লায়ার নাম' : 'Supplier Name'}</label>
                    <input
                      type="text"
                      className="input-control"
                      placeholder="M/S agency name"
                      value={customSupplierName}
                      onChange={(e) => setCustomSupplierName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{isBn ? 'মোবাইল নম্বর' : 'Phone'}</label>
                    <input
                      type="text"
                      className="input-control"
                      placeholder="017........"
                      value={customSupplierPhone}
                      onChange={(e) => setCustomSupplierPhone(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="card" style={{ backgroundColor: '#0f172a', border: '1px solid #8b5cf6' }}>
              <div className="card-title" style={{ color: '#8b5cf6', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
                <Coins size={20} />
                <span>{isBn ? 'ভাউচার পেমেন্ট হিসাব (Voucher Summary)' : 'Voucher Summary'}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '1rem 0' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#06b6d4', fontWeight: 600 }}>
                    {isBn ? 'চালানের তারিখ (Voucher Date)' : 'Voucher Date'}
                  </label>
                  <input
                    type="date"
                    className="input-control"
                    value={voucherDate}
                    onChange={(e) => setVoucherDate(e.target.value)}
                    onClick={(e) => { try { e.target.showPicker(); } catch(err){} }}
                    style={{ borderColor: '#06b6d4', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700 }}>
                  <span>{isBn ? 'মোট ক্রয়মূল্য (Grand Total):' : 'Total Purchase:'}</span>
                  <span style={{ color: '#8b5cf6' }}>৳{grandTotal.toLocaleString('en-BD')}</span>
                </div>

                <div className="form-group">
                  <label className="form-label">{isBn ? 'সাপ্লায়ারকে পরিশোধকৃত টাকা (Paid Amount)' : 'Paid Amount'}</label>
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
                    <span>{isBn ? 'সাপ্লায়ার বাকি (Supplier Payable):' : 'Supplier Due:'}</span>
                    <span>৳{dueAmount.toLocaleString('en-BD')}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">{isBn ? 'ভাউচার নোট / মন্তব্য (Optional)' : 'Notes'}</label>
                  <input
                    type="text"
                    className="input-control"
                    placeholder={isBn ? 'যেমন: চালানের সাথে ১ কয়েল স্পেশাল ক্যাবল ফ্রি' : 'Notes'}
                    value={voucherNotes}
                    onChange={(e) => setVoucherNotes(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={handleSaveVoucher}
                disabled={voucherItems.length === 0}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', backgroundColor: '#8b5cf6', color: '#ffffff' }}
              >
                <CheckCircle size={20} />
                <span>{isBn ? 'ভাউচার সেভ ও স্টক আপডেট করুন' : 'Save Voucher & Update Stock'}</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* VIEW 2: Past Purchase Invoices Archive with View, Edit & Delete Actions */}
      {purchaseTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Search Bar */}
          <div className="card">
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                className="input-control"
                placeholder={isBn ? 'ভাউচার আইডি (যেমন VOUCH-2026..), সাপ্লায়ার নাম বা তারিখ দিয়ে খুঁজুন...' : 'Search voucher ID, supplier name or date...'}
                value={historySearchQuery}
                onChange={(e) => setHistorySearchQuery(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Purchases History Table */}
          <div className="card">
            <div className="card-title">
              <History size={20} color="#8b5cf6" />
              <span>{isBn ? 'সংরক্ষিত পুরানো ক্রয় ভাউচারসমূহ (View, Edit & Delete)' : 'Past Purchase Invoices'}</span>
              <span className="badge badge-purple" style={{ marginLeft: 'auto' }}>
                {filteredPurchasesHistory.length} {isBn ? 'টি ভাউচার' : 'Vouchers'}
              </span>
            </div>

            {filteredPurchasesHistory.length > 0 ? (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{isBn ? 'ভাউচার আইডি' : 'Voucher ID'}</th>
                      <th>{isBn ? 'তারিখ' : 'Date'}</th>
                      <th>{isBn ? 'সাপ্লায়ার / মহাজন' : 'Supplier'}</th>
                      <th>{isBn ? 'আইটেম সংখ্যা' : 'Items'}</th>
                      <th style={{ color: '#8b5cf6' }}>{isBn ? 'সর্বমোট ক্রয়মূল্য' : 'Total Purchase'}</th>
                      <th style={{ color: '#10b981' }}>{isBn ? 'পরিশোধিত টাকা' : 'Paid'}</th>
                      <th style={{ color: '#f43f5e' }}>{isBn ? 'সাপ্লায়ার বাকি' : 'Payable Due'}</th>
                      <th style={{ textAlign: 'right' }}>{isBn ? 'ভাউচার অ্যাকশনসমূহ' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPurchasesHistory.map(vouch => (
                      <tr key={vouch.id}>
                        <td style={{ fontWeight: 700, color: '#8b5cf6' }}>
                          {vouch.id}
                        </td>
                        <td style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
                          {vouch.date}
                        </td>
                        <td style={{ fontWeight: 600 }}>
                          {vouch.supplierName}
                        </td>
                        <td>
                          {vouch.items?.length || 0} {isBn ? 'টি আইটেম' : 'Items'}
                        </td>
                        <td style={{ fontWeight: 700, color: '#8b5cf6' }}>
                          ৳{vouch.grandTotal?.toLocaleString('en-BD')}
                        </td>
                        <td style={{ fontWeight: 600, color: '#10b981' }}>
                          ৳{vouch.paidAmount?.toLocaleString('en-BD')}
                        </td>
                        <td>
                          {vouch.dueAmount > 0 ? (
                            <span className="badge badge-rose">
                              ৳{vouch.dueAmount?.toLocaleString('en-BD')} বাকি
                            </span>
                          ) : (
                            <span className="badge badge-green">
                              {isBn ? 'পরিশোধিত' : 'Paid'}
                            </span>
                          )}
                        </td>

                        {/* View, Edit & Delete Action Buttons */}
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '4px' }}>
                            {/* View Voucher Items Details */}
                            <button
                              onClick={() => setViewingVoucher(vouch)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.35rem 0.55rem', color: '#06b6d4' }}
                              title={isBn ? 'ভাউচারের বিস্তারিত বিবরণ দেখুন' : 'View Details'}
                            >
                              <Eye size={15} />
                              <span>{isBn ? 'বিবরণ' : 'View'}</span>
                            </button>

                            {/* Edit Voucher Info */}
                            <button
                              onClick={() => setEditingVoucher({ ...vouch, items: JSON.parse(JSON.stringify(vouch.items || [])) })}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.35rem 0.55rem', color: '#f59e0b' }}
                              title={isBn ? 'ভাউচারের আইটেম, তারিখ, পরিমাণ ও কিনা দাম এডিট করুন' : 'Edit Voucher'}
                            >
                              <Edit3 size={15} />
                            </button>

                            {/* Delete Voucher & Revert Stock */}
                            <button
                              onClick={async () => {
                                const confirmed = await showConfirm({
                                  title: isBn ? 'ক্রয় ভাউচার মুছে ফেলা' : 'Delete Purchase Voucher',
                                  message: isBn ? `আপনি কি নিশ্চিত যে ক্রয় ভাউচার ${vouch.id} মুছে ফেলতে চান? ইনভেন্টরি থেকে পণ্যের স্টক স্বয়ংক্রিয়ভাবে কমে যাবে।` : `Delete purchase voucher ${vouch.id} and revert stock?`,
                                  type: 'danger',
                                  confirmText: isBn ? 'হ্যাঁ, ডিলিট করুন' : 'Delete'
                                });
                                if (confirmed) {
                                  deletePurchaseVoucher(vouch.id);
                                }
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.35rem 0.55rem', color: '#f43f5e' }}
                              title={isBn ? 'ভাউচার ডিলিট ও স্টক মাইনাস' : 'Delete Voucher'}
                            >
                              <Trash2 size={15} />
                            </button>
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
                <p>{isBn ? 'কোনো পুরানো ক্রয় ভাউচার পাওয়া যায়নি!' : 'No past purchase vouchers found!'}</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Modal: View Voucher Details (With Right-Aligned Close Icon) */}
      {viewingVoucher && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>{isBn ? `ক্রয় ভাউচার বিবরণ (${viewingVoucher.id})` : `Purchase Voucher (${viewingVoucher.id})`}</h3>
              <button onClick={() => setViewingVoucher(null)} className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>✕</button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', backgroundColor: '#0f172a', padding: '0.85rem', borderRadius: '6px' }}>
                <div>
                  <div><strong>সাপ্লায়ার:</strong> {viewingVoucher.supplierName}</div>
                  <div><strong>তারিখ:</strong> {viewingVoucher.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div><strong>মোট বিল:</strong> <span style={{ color: '#8b5cf6', fontWeight: 700 }}>৳{viewingVoucher.grandTotal}</span></div>
                  <div><strong>জমা:</strong> ৳{viewingVoucher.paidAmount} | <strong>বাকি:</strong> <span style={{ color: '#f43f5e' }}>৳{viewingVoucher.dueAmount}</span></div>
                </div>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>{isBn ? 'পণ্য ও সাইজ' : 'Item & Spec'}</th>
                      <th>{isBn ? 'পরিমাণ' : 'Qty'}</th>
                      <th>{isBn ? 'একক কিনা দাম' : 'Rate'}</th>
                      <th>{isBn ? 'মোট' : 'Total'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingVoucher.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td style={{ fontWeight: 600 }}>
                          {item.productName} - {item.spec} ({item.brand})
                        </td>
                        <td>{item.quantity} {item.unit === 'Goj' ? 'গজ' : item.unit}</td>
                        <td>৳{item.unitPrice}</td>
                        <td style={{ fontWeight: 700, color: '#8b5cf6' }}>৳{item.totalPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {viewingVoucher.notes && (
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>
                  মন্তব্য: {viewingVoucher.notes}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={() => setViewingVoucher(null)} className="btn btn-primary">
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Past Purchase Voucher FULL DETAILS (HTML5 Date Picker & Live Auto Due Calculation) */}
      {editingVoucher && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '820px' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>{isBn ? `ক্রয় ভাউচার সম্পাদন/এডিট (${editingVoucher.id})` : `Edit Purchase Voucher (${editingVoucher.id})`}</h3>
              <button onClick={() => setEditingVoucher(null)} className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>✕</button>
            </div>

            <form onSubmit={handleSaveVoucherEdit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Editable Supplier Name & Native HTML5 Date Picker Input */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">{isBn ? 'সাপ্লায়ার / মহাজনের নাম' : 'Supplier Name'}</label>
                    <input
                      type="text"
                      className="input-control"
                      value={editingVoucher.supplierName || ''}
                      onChange={(e) => setEditingVoucher({ ...editingVoucher, supplierName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ color: '#06b6d4', fontWeight: 600 }}>
                      {isBn ? 'চালানের তারিখ (Voucher Date Calendar)' : 'Voucher Date'}
                    </label>
                    <input
                      type="date"
                      className="input-control"
                      value={editingVoucher.date || ''}
                      onChange={(e) => setEditingVoucher({ ...editingVoucher, date: e.target.value })}
                      onClick={(e) => { try { e.target.showPicker(); } catch(err){} }}
                      style={{ borderColor: '#06b6d4', cursor: 'pointer' }}
                    />
                  </div>
                </div>

                {/* Add New Item Selector inside Edit Modal */}
                <div style={{ backgroundColor: '#0f172a', padding: '0.85rem', borderRadius: '8px', border: '1px dashed #06b6d4' }}>
                  <label className="form-label" style={{ color: '#06b6d4', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Plus size={16} />
                    <span>{isBn ? '+ এই ভাউচারে নতুন পণ্য/ভেরিয়েন্ট যুক্ত করুন:' : '+ Add New Item to this Voucher:'}</span>
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 75px 90px 90px auto', gap: '0.4rem', alignItems: 'center' }}>
                    <SearchableSelectDropdown
                      options={products.map(p => ({
                        value: p.id,
                        label: p.nameBn,
                        subText: p.brand ? `(${p.brand})` : ''
                      }))}
                      value={editModalProdId}
                      isBn={isBn}
                      placeholder={isBn ? '-- পণ্য --' : '-- Product --'}
                      searchPlaceholder={isBn ? 'পণ্য খুঁজুন...' : 'Search product...'}
                      onChange={(val) => {
                        setEditModalProdId(val);
                        setEditModalVarId('');
                      }}
                    />

                    <SearchableSelectDropdown
                      options={(() => {
                        if (!activeEditModalProduct || !activeEditModalProduct.variants) return [];
                        const brandList = activeEditModalProduct.brand
                          ? activeEditModalProduct.brand.split(',').map(b => b.trim()).filter(Boolean)
                          : [];

                        const options = [];
                        if (brandList.length > 0) {
                          brandList.forEach(b => {
                            activeEditModalProduct.variants.forEach(v => {
                              const hasBrandInSpec = v.spec.toLowerCase().includes(b.toLowerCase());
                              const displaySpec = hasBrandInSpec ? v.spec : `${v.spec} (${b})`;
                              const optionValue = hasBrandInSpec ? v.id : `${v.id}__BRAND__${b}`;
                              options.push({
                                value: optionValue,
                                id: v.id,
                                brand: b,
                                spec: v.spec,
                                displaySpec,
                                label: `${displaySpec} (৳${v.purchasePrice})`,
                                subText: `(৳${v.purchasePrice})`
                              });
                            });
                          });
                        } else {
                          activeEditModalProduct.variants.forEach(v => {
                            options.push({
                              value: v.id,
                              id: v.id,
                              brand: '',
                              spec: v.spec,
                              displaySpec: v.spec,
                              label: `${v.spec} (৳${v.purchasePrice})`,
                              subText: `(৳${v.purchasePrice})`
                            });
                          });
                        }
                        return options;
                      })()}
                      value={editModalVarId}
                      disabled={!editModalProdId}
                      isBn={isBn}
                      placeholder={isBn ? '-- ভেরিয়েন্ট সাইজ --' : '-- Spec --'}
                      onChange={(val) => {
                        setEditModalVarId(val);
                        let realVarId = val;
                        if (val.includes('__BRAND__')) {
                          realVarId = val.split('__BRAND__')[0];
                        }
                        const v = activeEditModalProduct?.variants.find(varObj => varObj.id === realVarId);
                        if (v) {
                          setEditModalRate(v.purchasePrice || '');
                          setEditModalSellingRate(v.sellingPrice || '');
                        }
                      }}
                    />

                    <input
                      type="number"
                      className="input-control"
                      placeholder="Qty"
                      value={editModalQty}
                      onChange={(e) => setEditModalQty(e.target.value)}
                      style={{ padding: '0.4rem', fontSize: '0.85rem' }}
                    />

                    <input
                      type="number"
                      className="input-control"
                      placeholder="কিনা ৳"
                      value={editModalRate}
                      onChange={(e) => setEditModalRate(e.target.value)}
                      style={{ padding: '0.4rem', fontSize: '0.85rem', borderColor: '#f59e0b' }}
                    />

                    <input
                      type="number"
                      className="input-control"
                      placeholder="বিক্রি ৳"
                      value={editModalSellingRate}
                      onChange={(e) => setEditModalSellingRate(e.target.value)}
                      style={{ padding: '0.4rem', fontSize: '0.85rem', borderColor: '#10b981' }}
                    />

                    <button
                      type="button"
                      onClick={handleAddItemInsideEditModal}
                      disabled={!editModalProdId || !editModalVarId}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.4rem 0.65rem' }}
                    >
                      <Plus size={15} />
                      <span>{isBn ? 'যোগ' : 'Add'}</span>
                    </button>
                  </div>
                </div>

                {/* Editable Items Table (Qty, Purchase Rate, Spec) */}
                <div style={{ backgroundColor: '#0f172a', padding: '0.85rem', borderRadius: '8px', border: '1px solid #8b5cf6' }}>
                  <label className="form-label" style={{ color: '#8b5cf6', fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>
                    {isBn ? 'ভাউচারের আইটেম, পরিমাণ, কিনা ও বিক্রি দাম এডিট করুন:' : 'Edit Items, Quantity, Purchase & Selling Rates:'}
                  </label>

                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>{isBn ? 'পণ্য ও সাইজ বিবরণ' : 'Product & Spec'}</th>
                          <th>{isBn ? 'ক্রয় পরিমাণ' : 'Qty'}</th>
                          <th style={{ color: '#f59e0b' }}>{isBn ? 'একক কিনা দাম (৳)' : 'Purchase Rate (৳)'}</th>
                          <th style={{ color: '#10b981' }}>{isBn ? 'একক বিক্রি দাম (৳)' : 'Selling Rate (৳)'}</th>
                          <th>{isBn ? 'মোট (৳)' : 'Total'}</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {editingVoucher.items?.map((item, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>
                              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                {item.productName}
                              </div>
                              <div style={{ fontSize: '0.775rem', color: '#06b6d4' }}>
                                {item.spec} ({item.brand})
                              </div>
                            </td>

                            <td>
                              <input
                                type="number"
                                className="input-control"
                                value={item.quantity}
                                onChange={(e) => handleEditVoucherItemQty(idx, e.target.value)}
                                style={{ width: '75px', padding: '0.3rem', fontWeight: 700 }}
                              />
                            </td>

                            <td>
                              <input
                                type="number"
                                className="input-control"
                                value={item.unitPrice}
                                onChange={(e) => handleEditVoucherItemRate(idx, e.target.value)}
                                style={{ width: '90px', padding: '0.3rem', fontWeight: 700, color: '#f59e0b', borderColor: '#f59e0b' }}
                              />
                            </td>

                            <td>
                              <input
                                type="number"
                                className="input-control"
                                value={item.sellingPrice || 0}
                                onChange={(e) => handleEditVoucherItemSellingRate(idx, e.target.value)}
                                style={{ width: '90px', padding: '0.3rem', fontWeight: 700, color: '#10b981', borderColor: '#10b981' }}
                              />
                            </td>

                            <td style={{ fontWeight: 700, color: '#8b5cf6' }}>
                              ৳{(item.quantity * item.unitPrice).toLocaleString('en-BD')}
                            </td>

                            <td>
                              <button
                                type="button"
                                onClick={() => handleRemoveItemFromEdit(idx)}
                                style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}
                                title="আইটেমটি সরান"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Grand Total & Real-time Settlement (Live Auto Due Amount calculation) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', backgroundColor: '#0f172a', padding: '0.85rem', borderRadius: '8px' }}>
                  <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700 }}>
                    <span>{isBn ? 'সর্বমোট নতুন বিল:' : 'New Grand Total:'}</span>
                    <span style={{ color: '#8b5cf6' }}>৳{editingVoucher.grandTotal?.toLocaleString('en-BD')}</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ color: '#10b981', fontWeight: 600 }}>
                      {isBn ? 'পরিশোধিত/জমা টাকা (Paid Amount)' : 'Paid Amount'}
                    </label>
                    <input
                      type="number"
                      className="input-control"
                      value={editingVoucher.paidAmount}
                      onChange={(e) => handleEditPaidAmountChange(e.target.value)}
                      style={{ borderColor: '#10b981', fontWeight: 700 }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ color: '#f43f5e', fontWeight: 600 }}>
                      {isBn ? 'সাপ্লায়ার বাকি (Supplier Due)' : 'Supplier Due'}
                    </label>
                    <input
                      type="number"
                      className="input-control"
                      disabled
                      value={editingVoucher.dueAmount}
                      style={{ borderColor: '#f43f5e', color: '#f43f5e', fontWeight: 800, backgroundColor: 'rgba(244, 63, 94, 0.1)' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{isBn ? 'মন্তব্য / নোট (Notes)' : 'Notes'}</label>
                  <input
                    type="text"
                    className="input-control"
                    value={editingVoucher.notes || ''}
                    onChange={(e) => setEditingVoucher({ ...editingVoucher, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setEditingVoucher(null)} className="btn btn-secondary">
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button type="submit" className="btn btn-primary">
                  {isBn ? 'ভাউচার আপডেট করুন' : 'Update Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Quick Add Product Variant (Name, Brand, Unit & Spec ONLY - No Stock/Rates required!) */}
      {showAddProdModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '550px' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                {isBn ? 'নতুন ইলেকট্রিক্যাল পণ্য তৈরি করুন (No Stock Needed)' : 'Create New Product Title'}
              </h3>
              <button onClick={() => setShowAddProdModal(false)} className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>✕</button>
            </div>

            <form onSubmit={handleAddNewProductOnFly}>
              <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                
                <div style={{ gridColumn: 'span 2', backgroundColor: '#0f172a', padding: '0.75rem', borderRadius: '6px', fontSize: '0.825rem', color: '#06b6d4' }}>
                  💡 <strong>টিপস:</strong> এখানে শুধুমাত্র পণ্যের নাম ও সাইজ তৈরি করুন। মালামাল কেনার সময় <strong>'ক্রয় ভাউচার (Purchase Voucher)'</strong> দিলে কিনা দাম, বিক্রি দাম এবং স্টক স্বয়ংক্রিয়ভাবে ইনভেন্টরিতে যুক্ত হয়ে যাবে।
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">{isBn ? 'পণ্য নাম (Product Name)' : 'Product Name'}</label>
                  <input
                    type="text"
                    required
                    className="input-control"
                    placeholder={isBn ? 'যেমন: ওয়ালটন এলইডি বাল্ব / বিআরবি সিঙ্গেল কোর তার' : 'Product name'}
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{isBn ? 'ব্র্যান্ড' : 'Brand'}</label>
                  <input
                    type="text"
                    className="input-control"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{isBn ? 'স্পেসিফিকেশন / ভেরিয়েন্ট সাইজ' : 'Variant Spec / Watt'}</label>
                  <input
                    type="text"
                    required
                    className="input-control"
                    placeholder={isBn ? 'যেমন: 9 Watt / 2.5 rm / 1-Gang' : 'e.g. 9W / 2.5rm'}
                    value={newSpec}
                    onChange={(e) => setNewSpec(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">{isBn ? 'একক (Unit)' : 'Unit'}</label>
                  <select className="select-control" value={newUnit} onChange={(e) => setNewUnit(e.target.value)}>
                    <option value="Pcs">পিস (Pcs)</option>
                    <option value="Coil">কয়েল (Coil)</option>
                    <option value="Goj">গজ (Yard/Goj)</option>
                    <option value="Meter">মিটার (Meter)</option>
                    <option value="Box">বক্স (Box)</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddProdModal(false)} className="btn btn-secondary">
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button type="submit" className="btn btn-primary">
                  {isBn ? 'পণ্য তৈরি করুন' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
