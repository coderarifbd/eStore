import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, AlertTriangle } from 'lucide-react';

export const AutocompleteSearch = ({ onSelectVariant, placeholder, showPurchasePrice = false, selectedBrand = 'ALL' }) => {
  const { lang, getFlatVariants } = useStore();
  const isBn = lang === 'bn';

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const wrapperRef = useRef(null);

  const allVariants = getFlatVariants();

  // Filter items matching query across name, brand, spec, SKU and custom attributes
  const filteredItems = query.trim() === '' ? [] : allVariants.filter(item => {
    // 1. Filter by selectedBrand if specified
    if (selectedBrand && selectedBrand !== 'ALL') {
      const itemBrand = (item.brand || '').toLowerCase();
      const targetBrand = selectedBrand.toLowerCase();
      const brandList = itemBrand.split(',').map(b => b.trim());
      if (itemBrand !== targetBrand && !brandList.includes(targetBrand)) {
        return false;
      }
    }

    // 2. Search query filter
    const q = query.toLowerCase();
    return (
      item.productNameBn.toLowerCase().includes(q) ||
      item.productNameEn.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      item.spec.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      (item.attrStr && item.attrStr.toLowerCase().includes(q))
    );
  }).slice(0, 10);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen || filteredItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (item) => {
    onSelectVariant(item);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="autocomplete-wrapper" ref={wrapperRef} style={{ width: '100%', position: 'relative', boxSizing: 'border-box' }}>
      <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
        <input
          type="text"
          className="input-control"
          placeholder={placeholder || (isBn ? 'পণ্যের নাম, ওয়াট, সাইজ, কাস্টম বৈশিষ্ট্য বা ব্র্যান্ড লিখে খুজুন... (যেমন: BRB, 9W, Warm White)' : 'Search product by name, watt, size, attribute or brand...')}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            paddingLeft: '2.5rem',
            borderColor: isOpen && filteredItems.length > 0 ? '#06b6d4' : undefined,
            backgroundColor: '#0f172a',
            boxSizing: 'border-box'
          }}
        />
        <Search
          size={18}
          color="#94a3b8"
          style={{
            position: 'absolute',
            left: '0.85rem',
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        />
      </div>

      {/* Autocomplete Dropdown List - 100% Full Width & Edge-to-Edge Row Alignment */}
      {isOpen && query.trim().length > 0 && (
        <div className="autocomplete-dropdown" style={{ width: '100%', left: 0, right: 0, boxSizing: 'border-box' }}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const isLowStock = item.stock <= item.reorderLevel;

              return (
                <div
                  key={`${item.productId}_${item.variantId}`}
                  className={`autocomplete-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    padding: '0.85rem 1rem',
                    cursor: 'pointer'
                  }}
                >
                  {/* Left Column: Product Title, Brand, Specs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1, minWidth: 0, paddingRight: '1rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span>{isBn ? item.productNameBn : item.productNameEn}</span>
                      <span className="badge badge-purple">
                        {item.brand}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.825rem', color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span>স্পেক: <strong>{item.spec}</strong></span>
                      {item.attrStr && <span>({item.attrStr})</span>}
                      <span>•</span>
                      <span>একক: {item.unit === 'Goj' ? 'গজ' : item.unit}</span>
                    </div>
                  </div>

                  {/* Right Column: Price and Stock Badge - Anchored to Far Right Edge */}
                  <div style={{
                    textAlign: 'right',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justify: 'center',
                    gap: '0.25rem',
                    marginLeft: 'auto',
                    flexShrink: 0
                  }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981' }}>
                      ৳{showPurchasePrice ? item.purchasePrice : item.sellingPrice}
                      {showPurchasePrice && <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '3px' }}>(ক্রয়)</span>}
                    </div>
                    <div>
                      {isLowStock ? (
                        <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                          <AlertTriangle size={12} /> স্টক: {item.stock} {item.unit === 'Goj' ? 'গজ' : item.unit}
                        </span>
                      ) : (
                        <span className="badge badge-cyan">
                          স্টক: {item.stock} {item.unit === 'Goj' ? 'গজ' : item.unit}
                        </span>
                      )}
                    </div>
                    {item.batches && item.batches.filter(b => b.remainingQuantity > 0).length > 1 && (
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'right', marginTop: '2px', lineHeight: '1.2' }}>
                        {item.batches.filter(b => b.remainingQuantity > 0).map((b, bIdx) => (
                          <div key={bIdx} style={{ whiteSpace: 'nowrap' }}>
                            ৳{showPurchasePrice ? b.purchasePrice : b.sellingPrice} • {b.remainingQuantity} {item.unit === 'Goj' ? 'গজ' : item.unit} ({b.purchaseVoucherId === 'initial' ? (isBn ? 'ওপেনিং' : 'Init') : b.purchaseVoucherId})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: '1.25rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
              {isBn ? 'কোনো পণ্য বা ভেরিয়েন্ট পাওয়া যায়নি!' : 'No matching products or variants found!'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
