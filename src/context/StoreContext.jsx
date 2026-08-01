import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_PRODUCTS,
  INITIAL_SUPPLIERS,
  INITIAL_EMPLOYEES,
  INITIAL_SALARY_TRANSACTIONS,
  INITIAL_EXPENSES,
  INITIAL_SALES,
  INITIAL_PURCHASE_VOUCHERS
} from '../data/demoData';

const StoreContext = createContext();

export const INITIAL_PRESETS = [
  {
    id: 'p_wire_yard',
    title: '🔌 তারের সাইজ - খুচরা গজে বিক্রি (1.0, 1.3, 2.0, 14/76)',
    productName: 'ক্যাবল ও ওয়ার (Retail Wire by Yard)',
    categoryId: 'cat_cables',
    unit: 'Goj', // গজ (Yard)
    variationTypeName: 'তারের সাইজ (Cable Size)',
    options: [
      { spec: '1.0 rm' },
      { spec: '1.3 rm' },
      { spec: '2.0 rm' },
      { spec: '14/76 (Twin Flexible)' }
    ]
  },
  {
    id: 'p_holder',
    title: '💡 বাটন হোল্ডার (Pin & Thread)',
    productName: 'বাটন / লটকন হোল্ডার (Button Holder)',
    categoryId: 'cat_switches',
    unit: 'Pcs',
    variationTypeName: 'হোল্ডার টাইপ (Holder Type)',
    options: [
      { spec: 'Pin Type (পিন / B22)' },
      { spec: 'Thread Type (প্যাচ / E27)' }
    ]
  },
  {
    id: 'p_switch',
    title: '🔳 গ্যাং সুইচ (1G, 2G, Dimmer, Socket)',
    productName: 'গ্যাং সুইচ ও সকেট সিরিজ',
    categoryId: 'cat_switches',
    unit: 'Pcs',
    variationTypeName: 'গ্যাং টাইপ (Gang Type)',
    options: [
      { spec: '1-Gang Switch' },
      { spec: '2-Gang Switch' },
      { spec: '3-Gang Switch' },
      { spec: 'Fan Dimmer' },
      { spec: '2-Pin Multi Socket' }
    ]
  },
  {
    id: 'p_bulb',
    title: '💡 এলইড বাল্ব (3W, 7W, 12W, 18W)',
    productName: 'এলইড টি লাইট / বাল্ব',
    categoryId: 'cat_lights',
    unit: 'Pcs',
    variationTypeName: 'ওয়াট (Wattage)',
    options: [
      { spec: '3 Watt (Cool Daylight)' },
      { spec: '7 Watt (Cool Daylight)' },
      { spec: '12 Watt (Cool Daylight)' },
      { spec: '18 Watt (Warm Light)' }
    ]
  }
];

export const StoreProvider = ({ children, authToken, onAuthError }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('elec_lang') || 'bn');

  const [products, _setProductsRaw] = useState(() => {
    try {
      const saved = localStorage.getItem('elec_products');
      const loadedProducts = saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
      return loadedProducts.map(p => ({
        ...p,
        variants: (p.variants || []).map(v => {
          if (!v.batches || v.batches.length === 0) {
            return {
              ...v,
              batches: [{
                id: `b_init_${v.id}`,
                purchaseVoucherId: 'initial',
                quantity: v.stock || 0,
                remainingQuantity: v.stock || 0,
                purchasePrice: v.purchasePrice || 0,
                sellingPrice: v.sellingPrice || 0,
                date: '2026-07-30'
              }]
            };
          }
          return v;
        })
      }));
    } catch (e) {
      localStorage.removeItem('elec_products');
      return INITIAL_PRODUCTS;
    }
  });

  // Safe setter: always ensures every product has a variants array
  const setProducts = (valueOrFn) => {
    _setProductsRaw(prev => {
      const nextVal = typeof valueOrFn === 'function' ? valueOrFn(prev) : valueOrFn;
      return (nextVal || []).map(p => ({
        ...p,
        variants: p.variants || []
      }));
    });
  };

  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('elec_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch { return INITIAL_CATEGORIES; }
  });

  const cleanBrandList = (brandArray = []) => {
    const uniqueSet = new Set();
    (brandArray || []).forEach(item => {
      if (typeof item === 'string') {
        item.split(',').forEach(b => {
          const trimmed = b.trim();
          if (trimmed) uniqueSet.add(trimmed);
        });
      }
    });
    return Array.from(uniqueSet);
  };

  const [brands, _setBrandsRaw] = useState(() => {
    try {
      const saved = localStorage.getItem('elec_brands');
      const loaded = saved ? JSON.parse(saved) : INITIAL_BRANDS;
      return cleanBrandList(loaded);
    } catch { return cleanBrandList(INITIAL_BRANDS); }
  });

  const setBrands = (valueOrFn) => {
    _setBrandsRaw(prev => {
      const nextVal = typeof valueOrFn === 'function' ? valueOrFn(prev) : valueOrFn;
      return cleanBrandList(nextVal);
    });
  };

  const [presets, setPresets] = useState(() => {
    try {
      const saved = localStorage.getItem('elec_presets');
      return saved ? JSON.parse(saved) : INITIAL_PRESETS;
    } catch { return INITIAL_PRESETS; }
  });

  const [suppliers, setSuppliers] = useState(() => {
    try {
      const saved = localStorage.getItem('elec_suppliers');
      return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
    } catch { return INITIAL_SUPPLIERS; }
  });

  const [sales, setSales] = useState(() => {
    try {
      const saved = localStorage.getItem('elec_sales');
      return saved ? JSON.parse(saved) : INITIAL_SALES;
    } catch { return INITIAL_SALES; }
  });

  const [purchases, setPurchases] = useState(() => {
    try {
      const saved = localStorage.getItem('elec_purchases');
      return saved ? JSON.parse(saved) : INITIAL_PURCHASE_VOUCHERS;
    } catch { return INITIAL_PURCHASE_VOUCHERS; }
  });

  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('elec_expenses');
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch { return INITIAL_EXPENSES; }
  });

  const [employees, setEmployees] = useState(() => {
    try {
      const saved = localStorage.getItem('elec_employees');
      return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
    } catch { return INITIAL_EMPLOYEES; }
  });

  const [salaryTx, setSalaryTx] = useState(() => {
    try {
      const saved = localStorage.getItem('elec_salary_tx');
      return saved ? JSON.parse(saved) : INITIAL_SALARY_TRANSACTIONS;
    } catch { return INITIAL_SALARY_TRANSACTIONS; }
  });

  const [printDoc, setPrintDoc] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'danger',
    confirmText: '',
    cancelText: '',
    resolveFn: null
  });

  const showConfirm = ({ title, message, type = 'danger', confirmText, cancelText }) => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        title: title || (lang === 'bn' ? 'নিশ্চিতকরণ' : 'Confirm Action'),
        message: message || '',
        type,
        confirmText: confirmText || (lang === 'bn' ? 'হ্যাঁ, ডিলিট করুন' : 'Confirm'),
        cancelText: cancelText || (lang === 'bn' ? 'বাতিল' : 'Cancel'),
        resolveFn: resolve
      });
    });
  };

  const closeConfirm = () => {
    setConfirmState(prev => ({ ...prev, isOpen: false, resolveFn: null }));
  };

  // Load store state from Neon Postgres — DB is the single source of truth
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch('/api/data', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (response.status === 401) { onAuthError?.(); return; }
        if (response.ok) {
          try {
            const data = await response.json();
            if (data && !data.error) {
              if (Array.isArray(data.products)) setProducts(data.products);
              if (Array.isArray(data.suppliers)) setSuppliers(data.suppliers);
              if (Array.isArray(data.sales)) setSales(data.sales);
              if (Array.isArray(data.purchases)) setPurchases(data.purchases);
              if (Array.isArray(data.expenses)) setExpenses(data.expenses);
              if (Array.isArray(data.employees)) setEmployees(data.employees);
              if (Array.isArray(data.salaryTx)) setSalaryTx(data.salaryTx);
              if (Array.isArray(data.categories) && data.categories.length > 0) setCategories(data.categories);
              if (Array.isArray(data.brands) && data.brands.length > 0) setBrands(data.brands);
            }
          } catch (jsonErr) {
            console.warn("API response was not valid JSON, using cached data.");
          }
        }
      } catch (err) {
        console.warn("DB unavailable, using local cache:", err);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchInitialData();
  }, []);

  // Sync with LocalStorage & Neon Database
  useEffect(() => {
    localStorage.setItem('elec_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('elec_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('elec_brands', JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    localStorage.setItem('elec_presets', JSON.stringify(presets));
  }, [presets]);

  // Auto-Sync full state to Neon Postgres on any change
  useEffect(() => {
    if (!isLoaded) return;

    // Always cache locally first
    localStorage.setItem('elec_products', JSON.stringify(products));
    localStorage.setItem('elec_categories', JSON.stringify(categories));
    localStorage.setItem('elec_brands', JSON.stringify(brands));
    localStorage.setItem('elec_suppliers', JSON.stringify(suppliers));
    localStorage.setItem('elec_sales', JSON.stringify(sales));
    localStorage.setItem('elec_purchases', JSON.stringify(purchases));
    localStorage.setItem('elec_expenses', JSON.stringify(expenses));
    localStorage.setItem('elec_employees', JSON.stringify(employees));
    localStorage.setItem('elec_salary_tx', JSON.stringify(salaryTx));

    const syncData = async () => {
      try {
        const res = await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
          body: JSON.stringify({ products, sales, expenses, suppliers, salaryTx, employees, purchases, categories, brands })
        });
        if (res.status === 401) { onAuthError?.(); return; }
      } catch (err) {
        // Silently fail - local cache is always the fallback
      }
    };

    const delay = setTimeout(syncData, 800);
    return () => clearTimeout(delay);
  }, [isLoaded, products, sales, expenses, suppliers, salaryTx, employees, purchases, categories, brands]);

  const addCustomPreset = (newPresetData) => {
    const newPreset = {
      id: `preset_${Date.now()}`,
      isCustom: true,
      ...newPresetData
    };
    setPresets(prev => [newPreset, ...prev]);
    return newPreset;
  };

  const deleteCustomPreset = (presetId) => {
    setPresets(prev => prev.filter(p => p.id !== presetId));
  };

  const addCategory = (catData) => {
    const newCat = {
      id: `cat_${Date.now()}`,
      nameBn: catData.nameBn,
      nameEn: catData.nameEn || catData.nameBn,
      icon: catData.icon || 'Box'
    };
    setCategories(prev => [...prev, newCat]);
    return newCat;
  };

  const deleteCategory = (catId) => {
    setCategories(prev => prev.filter(c => c.id !== catId));
  };

  const updateCategory = (catId, updatedFields) => {
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, ...updatedFields } : c));
  };

  const addBrand = (newBrandName) => {
    const trimmed = newBrandName.trim();
    if (trimmed) {
      const individualBrands = trimmed.split(',').map(b => b.trim()).filter(Boolean);
      let addedAny = false;
      setBrands(prev => {
        const next = [...prev];
        individualBrands.forEach(b => {
          if (!next.includes(b)) {
            next.push(b);
            addedAny = true;
          }
        });
        return next;
      });
      return addedAny;
    }
    return false;
  };

  const deleteBrand = (brandName) => {
    setBrands(prev => prev.filter(b => b !== brandName));
  };

  const updateBrand = (oldName, newName) => {
    const trimmed = newName.trim();
    if (!trimmed || brands.includes(trimmed)) return false;

    setBrands(prev => prev.map(b => b === oldName ? trimmed : b));
    setProducts(prev => prev.map(p => p.brand === oldName ? { ...p, brand: trimmed } : p));
    return true;
  };

  const duplicateProductToBrand = (productId, newBrandName) => {
    const existingProd = products.find(p => p.id === productId);
    if (!existingProd) return;

    if (newBrandName && !brands.includes(newBrandName)) {
      addBrand(newBrandName);
    }

    const newProd = {
      ...existingProd,
      id: `prod_${Date.now()}`,
      brand: newBrandName,
      variants: existingProd.variants.map((v, idx) => ({
        ...v,
        id: `v_${Date.now()}_${idx}`,
        sku: `${newBrandName.substring(0, 3)}-${v.spec.replace(/\s+/g, '')}`
      }))
    };

    setProducts(prev => [newProd, ...prev]);
    return newProd;
  };

  const getFlatVariants = () => {
    const list = [];
    products.forEach(p => {
      const cat = categories.find(c => c.id === p.categoryId);
      const bList = p.brand
        ? p.brand.split(',').map(b => b.trim()).filter(Boolean)
        : ['Unbranded'];

      (p.variants || []).forEach(v => {
        const attrStr = v.attributes && v.attributes.length > 0
          ? v.attributes.map(a => `${a.label}: ${a.value}`).join(', ')
          : '';

        const rawSpec = v.spec || '';
        const isStandardSpec = !rawSpec || ['standard', 'default', 'base'].includes(rawSpec.trim().toLowerCase());
        const cleanSpec = isStandardSpec ? '' : rawSpec.trim();

        if (bList.length > 1) {
          bList.forEach(b => {
            const specSegment = cleanSpec ? ` - ${cleanSpec}` : '';
            const brandSegment = b ? ` (${b})` : '';

            list.push({
              productId: p.id,
              variantId: `${v.id}_${b}`,
              rawVariantId: v.id,
              productNameBn: p.nameBn,
              productNameEn: p.nameEn,
              brand: b,
              categoryNameBn: cat ? cat.nameBn : '',
              unit: p.unit,
              spec: cleanSpec,
              attributes: v.attributes || [],
              attrStr,
              sku: v.sku,
              purchasePrice: v.purchasePrice || 0,
              sellingPrice: v.sellingPrice || 0,
              stock: v.stock || 0,
              reorderLevel: v.reorderLevel || 5,
              batches: v.batches || [],
              displayName: `${p.nameBn}${specSegment}${brandSegment}${attrStr ? ` (${attrStr})` : ''}`
            });
          });
        } else {
          const specSegment = cleanSpec ? ` - ${cleanSpec}` : '';
          const brandSegment = (bList[0] && bList[0] !== 'Unbranded') ? ` (${bList[0]})` : '';

          list.push({
            productId: p.id,
            variantId: v.id,
            rawVariantId: v.id,
            productNameBn: p.nameBn,
            productNameEn: p.nameEn,
            brand: bList[0] || p.brand || '',
            categoryNameBn: cat ? cat.nameBn : '',
            unit: p.unit,
            spec: cleanSpec,
            attributes: v.attributes || [],
            attrStr,
            sku: v.sku,
            purchasePrice: v.purchasePrice || 0,
            sellingPrice: v.sellingPrice || 0,
            stock: v.stock || 0,
            reorderLevel: v.reorderLevel || 5,
            batches: v.batches || [],
            displayName: `${p.nameBn}${specSegment}${brandSegment}${attrStr ? ` (${attrStr})` : ''}`
          });
        }
      });
    });
    return list;
  };

  const addSale = (saleData) => {
    const saleId = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const saleDate = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

    // Map each cart item directly 1-to-1 to calculate cost & batch deduction without duplication
    const resolvedSaleItems = (saleData.items || []).map(cartItem => {
      let totalCostOfDeducted = 0;
      const batchesDeducted = [];
      let quantityToDeduct = cartItem.quantity || 1;

      const prod = products.find(p => p.id === cartItem.productId);
      if (prod) {
        const varItem = (prod.variants || []).find(v => 
          v.id === cartItem.variantId || 
          (cartItem.variantId && cartItem.variantId.startsWith(`${v.id}_`)) ||
          v.spec === cartItem.spec
        );

        if (varItem) {
          const sortedBatches = [...(varItem.batches || [])].sort((a, b) => new Date(a.date) - new Date(b.date));
          for (const batch of sortedBatches) {
            if (quantityToDeduct <= 0) break;
            if (batch.remainingQuantity > 0) {
              const deductQty = Math.min(quantityToDeduct, batch.remainingQuantity);
              quantityToDeduct -= deductQty;
              totalCostOfDeducted += deductQty * (batch.purchasePrice || 0);
              batchesDeducted.push({
                batchId: batch.id,
                purchaseVoucherId: batch.purchaseVoucherId,
                quantity: deductQty,
                purchasePrice: batch.purchasePrice || 0
              });
            }
          }
          if (quantityToDeduct > 0 && sortedBatches.length > 0) {
            const lastBatch = sortedBatches[sortedBatches.length - 1];
            totalCostOfDeducted += quantityToDeduct * (lastBatch.purchasePrice || 0);
          }
        }
      }

      const unitP = cartItem.unitPrice || cartItem.sellingPrice || 0;
      const calculatedAverageCost = cartItem.quantity > 0 ? (totalCostOfDeducted / cartItem.quantity) : (cartItem.purchasePrice || 0);

      return {
        ...cartItem,
        productName: cartItem.productName || cartItem.productNameBn || cartItem.productNameEn || '',
        unitPrice: unitP,
        totalPrice: unitP * (cartItem.quantity || 1),
        purchasePrice: calculatedAverageCost,
        batchesDeducted
      };
    });

    setProducts(prevProducts => {
      return prevProducts.map(prod => {
        const matchingCartItems = (saleData.items || []).filter(item => item.productId === prod.id);
        if (matchingCartItems.length === 0) return prod;

        const updatedVariants = prod.variants.map(varItem => {
          const matchingItems = matchingCartItems.filter(item => 
            item.variantId === varItem.id || 
            (item.variantId && item.variantId.startsWith(`${varItem.id}_`)) ||
            item.spec === varItem.spec
          );

          if (matchingItems.length === 0) return varItem;

          let quantityToDeduct = matchingItems.reduce((sum, i) => sum + (i.quantity || 1), 0);
          const updatedBatches = [];
          const sortedBatches = [...(varItem.batches || [])].sort((a, b) => new Date(a.date) - new Date(b.date));

          for (const batch of sortedBatches) {
            if (quantityToDeduct <= 0) {
              updatedBatches.push(batch);
              continue;
            }

            if (batch.remainingQuantity > 0) {
              const deductQty = Math.min(quantityToDeduct, batch.remainingQuantity);
              quantityToDeduct -= deductQty;
              updatedBatches.push({
                ...batch,
                remainingQuantity: batch.remainingQuantity - deductQty
              });
            } else {
              updatedBatches.push(batch);
            }
          }

          if (quantityToDeduct > 0 && updatedBatches.length > 0) {
            const lastBatchIdx = updatedBatches.length - 1;
            updatedBatches[lastBatchIdx] = {
              ...updatedBatches[lastBatchIdx],
              remainingQuantity: updatedBatches[lastBatchIdx].remainingQuantity - quantityToDeduct
            };
          }

          const updatedStock = updatedBatches.reduce((sum, b) => sum + b.remainingQuantity, 0);

          return {
            ...varItem,
            batches: updatedBatches,
            stock: Math.max(0, updatedStock)
          };
        });

        return { ...prod, variants: updatedVariants };
      });
    });

    const newSale = {
      id: saleId,
      date: saleDate,
      ...saleData,
      items: resolvedSaleItems
    };

    setSales(prev => [newSale, ...prev]);
    return newSale;
  };

  const updateSale = (invoiceId, updatedFields) => {
    setSales(prev => prev.map(s => {
      if (s.id === invoiceId) {
        return {
          ...s,
          ...updatedFields
        };
      }
      return s;
    }));
  };

  const deleteSale = (invoiceId) => {
    const targetSale = sales.find(s => s.id === invoiceId);
    if (!targetSale) return;

    if (targetSale.items && targetSale.items.length > 0) {
      setProducts(prevProducts => {
        return prevProducts.map(prod => {
          const matchingItems = targetSale.items.filter(item => item.productId === prod.id);
          if (matchingItems.length === 0) return prod;

          const updatedVariants = prod.variants.map(varItem => {
            const matchedItem = matchingItems.find(item => item.variantId === varItem.id || item.spec === varItem.spec);
            if (matchedItem && matchedItem.batchesDeducted) {
              const updatedBatches = (varItem.batches || []).map(batch => {
                const deduction = matchedItem.batchesDeducted.find(d => d.batchId === batch.id);
                if (deduction) {
                  return {
                    ...batch,
                    remainingQuantity: batch.remainingQuantity + deduction.quantity
                  };
                }
                return batch;
              });

              const updatedStock = updatedBatches.reduce((sum, b) => sum + b.remainingQuantity, 0);

              return {
                ...varItem,
                batches: updatedBatches,
                stock: updatedStock
              };
            } else if (matchedItem) {
              const updatedBatches = [...(varItem.batches || [])];
              if (updatedBatches.length > 0) {
                updatedBatches[0] = {
                  ...updatedBatches[0],
                  remainingQuantity: updatedBatches[0].remainingQuantity + matchedItem.quantity
                };
              }
              const updatedStock = updatedBatches.reduce((sum, b) => sum + b.remainingQuantity, 0);
              return {
                ...varItem,
                batches: updatedBatches,
                stock: updatedStock
              };
            }
            return varItem;
          });

          return { ...prod, variants: updatedVariants };
        });
      });
    }

    setSales(prev => prev.filter(s => s.id !== invoiceId));
  };

  // Add Purchase Voucher & update stock AND both Purchase/Selling rates!
  const addPurchaseVoucher = (voucherData) => {
    const newVoucher = {
      id: `VOUCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: voucherData.date || new Date().toISOString().split('T')[0],
      ...voucherData
    };

    setProducts(prevProducts => {
      return prevProducts.map(prod => {
        const matchingItems = voucherData.items.filter(item => item.productId === prod.id);
        if (matchingItems.length === 0) return prod;

        const updatedVariants = prod.variants.map(varItem => {
          const matchedVoucherItem = matchingItems.find(item => item.variantId === varItem.id || item.spec === varItem.spec);
          if (matchedVoucherItem) {
            const newBatch = {
              id: `b_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
              purchaseVoucherId: newVoucher.id,
              quantity: matchedVoucherItem.quantity,
              remainingQuantity: matchedVoucherItem.quantity,
              purchasePrice: Number(matchedVoucherItem.unitPrice || 0),
              sellingPrice: Number(matchedVoucherItem.sellingPrice || 0),
              date: newVoucher.date
            };
            const updatedBatches = [...(varItem.batches || []), newBatch];
            const updatedStock = updatedBatches.reduce((sum, b) => sum + b.remainingQuantity, 0);

            return {
              ...varItem,
              batches: updatedBatches,
              stock: updatedStock,
              purchasePrice: Number(matchedVoucherItem.unitPrice || varItem.purchasePrice),
              sellingPrice: Number(matchedVoucherItem.sellingPrice || varItem.sellingPrice)
            };
          }
          return varItem;
        });

        return { ...prod, variants: updatedVariants };
      });
    });

    if (voucherData.supplierId && voucherData.dueAmount > 0) {
      setSuppliers(prev => prev.map(s => {
        if (s.id === voucherData.supplierId) {
          return { ...s, balanceDue: (s.balanceDue || 0) + voucherData.dueAmount };
        }
        return s;
      }));
    }

    setPurchases(prev => [newVoucher, ...prev]);
    return newVoucher;
  };

  const updatePurchaseVoucher = (voucherId, updatedFields) => {
    const oldVoucher = purchases.find(v => v.id === voucherId);
    if (!oldVoucher) return;

    setPurchases(prev => prev.map(v => {
      if (v.id === voucherId) {
        return {
          ...v,
          ...updatedFields
        };
      }
      return v;
    }));

    setProducts(prevProducts => {
      return prevProducts.map(prod => {
        const oldMatching = oldVoucher.items.filter(item => item.productId === prod.id);
        const newMatching = (updatedFields.items || []).filter(item => item.productId === prod.id);

        if (oldMatching.length === 0 && newMatching.length === 0) return prod;

        const updatedVariants = prod.variants.map(varItem => {
          const oldItem = oldMatching.find(item => item.variantId === varItem.id || item.spec === varItem.spec);
          const newItem = newMatching.find(item => item.variantId === varItem.id || item.spec === varItem.spec);

          let updatedBatches = [...(varItem.batches || [])];

          // If it was in the old voucher, remove its batch
          if (oldItem) {
            updatedBatches = updatedBatches.filter(b => b.purchaseVoucherId !== voucherId);
          }

          // If it is in the new voucher, add the new batch
          if (newItem) {
            const newBatch = {
              id: `b_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
              purchaseVoucherId: voucherId,
              quantity: newItem.quantity,
              remainingQuantity: newItem.quantity,
              purchasePrice: Number(newItem.unitPrice || 0),
              sellingPrice: Number(newItem.sellingPrice || 0),
              date: updatedFields.date || oldVoucher.date
            };
            updatedBatches.push(newBatch);
          }

          const updatedStock = updatedBatches.reduce((sum, b) => sum + b.remainingQuantity, 0);

          let latestPurchasePrice = varItem.purchasePrice;
          let latestSellingPrice = varItem.sellingPrice;
          if (newItem) {
            latestPurchasePrice = Number(newItem.unitPrice || latestPurchasePrice);
            latestSellingPrice = Number(newItem.sellingPrice || latestSellingPrice);
          }

          return {
            ...varItem,
            batches: updatedBatches,
            stock: updatedStock,
            purchasePrice: latestPurchasePrice,
            sellingPrice: latestSellingPrice
          };
        });

        return { ...prod, variants: updatedVariants };
      });
    });
  };

  const deletePurchaseVoucher = (voucherId) => {
    const targetVoucher = purchases.find(v => v.id === voucherId);
    if (!targetVoucher) return;

    if (targetVoucher.items && targetVoucher.items.length > 0) {
      setProducts(prevProducts => {
        return prevProducts.map(prod => {
          const matchingItems = targetVoucher.items.filter(item => item.productId === prod.id);
          if (matchingItems.length === 0) return prod;

          const updatedVariants = prod.variants.map(varItem => {
            const matchedItem = matchingItems.find(item => item.variantId === varItem.id || item.spec === varItem.spec);
            if (matchedItem) {
              const updatedBatches = (varItem.batches || []).filter(b => b.purchaseVoucherId !== voucherId);
              const updatedStock = updatedBatches.reduce((sum, b) => sum + b.remainingQuantity, 0);

              return {
                ...varItem,
                batches: updatedBatches,
                stock: updatedStock
              };
            }
            return varItem;
          });

          return { ...prod, variants: updatedVariants };
        });
      });
    }

    setPurchases(prev => prev.filter(v => v.id !== voucherId));
  };

  const addProduct = (newProd) => {
    const prodId = `prod_${Date.now()}`;
    const formatted = {
      id: prodId,
      ...newProd,
      variants: newProd.variants.map((v, idx) => ({
        id: `v_${Date.now()}_${idx}`,
        ...v,
        attributes: v.attributes || [],
        stock: Number(v.stock || 0),
        purchasePrice: Number(v.purchasePrice || 0),
        sellingPrice: Number(v.sellingPrice || 0),
        reorderLevel: Number(v.reorderLevel || 5)
      }))
    };

    if (newProd.brand && !brands.includes(newProd.brand)) {
      setBrands(b => [...b, newProd.brand]);
    }

    setProducts(prev => [formatted, ...prev]);
  };

  const updateProduct = (productId, updatedProductData) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          nameBn: updatedProductData.nameBn,
          nameEn: updatedProductData.nameEn || updatedProductData.nameBn,
          categoryId: updatedProductData.categoryId,
          brand: updatedProductData.brand,
          unit: updatedProductData.unit,
          variationTypeName: updatedProductData.variationTypeName,
          variants: updatedProductData.variants.map((v, idx) => ({
            id: v.id || `v_${Date.now()}_${idx}`,
            spec: v.spec,
            sku: v.sku || `${updatedProductData.brand.substring(0, 3)}-${v.spec.replace(/\s+/g, '')}`,
            purchasePrice: Number(v.purchasePrice || 0),
            sellingPrice: Number(v.sellingPrice || 0),
            stock: Number(v.stock || 0),
            reorderLevel: Number(v.reorderLevel || 5)
          }))
        };
      }
      return p;
    }));
  };

  const addVariantToProduct = (productId, variant) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newVar = {
          id: `v_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          ...variant,
          attributes: variant.attributes || [],
          stock: Number(variant.stock || 0),
          purchasePrice: Number(variant.purchasePrice || 0),
          sellingPrice: Number(variant.sellingPrice || 0),
          reorderLevel: Number(variant.reorderLevel || 5)
        };
        return { ...p, variants: [...p.variants, newVar] };
      }
      return p;
    }));
  };

  const updateVariantDetails = (productId, variantId, updatedFields) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          variants: p.variants.map(v => v.id === variantId ? { ...v, ...updatedFields } : v)
        };
      }
      return p;
    }));
  };

  const deleteVariantFromProduct = (productId, variantId) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          variants: p.variants.filter(v => v.id !== variantId)
        };
      }
      return p;
    }));
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const addExpense = (expData) => {
    const newExp = {
      id: `exp_${Date.now()}`,
      date: expData.date || new Date().toISOString().split('T')[0],
      ...expData,
      amount: Number(expData.amount)
    };
    setExpenses(prev => [newExp, ...prev]);
  };

  const addEmployee = (empData) => {
    const newEmp = {
      id: `emp_${Date.now()}`,
      ...empData,
      monthlySalary: Number(empData.monthlySalary || 0),
      status: 'Active'
    };
    setEmployees(prev => [...prev, newEmp]);
  };

  const updateEmployee = (employeeId, updatedFields) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === employeeId) {
        return {
          ...emp,
          ...updatedFields,
          monthlySalary: Number(updatedFields.monthlySalary || emp.monthlySalary)
        };
      }
      return emp;
    }));
  };

  const deleteEmployee = (employeeId) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
  };

  const addSalaryTransaction = (salData) => {
    const newSal = {
      id: `sal_${Date.now()}`,
      date: salData.date || new Date().toISOString().split('T')[0],
      ...salData,
      amount: Number(salData.amount)
    };
    setSalaryTx(prev => [newSal, ...prev]);
    return newSal;
  };

  const updateSupplierPayment = (supplierId, paidAmount) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id === supplierId) {
        return { ...s, balanceDue: Math.max(0, (s.balanceDue || 0) - paidAmount) };
      }
      return s;
    }));
  };

  const resetToDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setBrands(INITIAL_BRANDS);
    setPresets(INITIAL_PRESETS);
    setSuppliers(INITIAL_SUPPLIERS);
    setSales(INITIAL_SALES);
    setPurchases(INITIAL_PURCHASE_VOUCHERS);
    setExpenses(INITIAL_EXPENSES);
    setEmployees(INITIAL_EMPLOYEES);
    setSalaryTx(INITIAL_SALARY_TRANSACTIONS);
    localStorage.clear();
  };

  const clearAllData = () => {
    setProducts([]);
    setCategories([]);
    setBrands([]);
    setSuppliers([]);
    setSales([]);
    setPurchases([]);
    setExpenses([]);
    setEmployees([]);
    setSalaryTx([]);
    localStorage.clear();
  };

  const exportDataJSON = () => {
    const data = {
      products, categories, brands, presets, suppliers, sales, purchases, expenses, employees, salaryTx,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `electrical_store_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importDataJSON = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.products) setProducts(data.products);
      if (data.categories) setCategories(data.categories);
      if (data.brands) setBrands(data.brands);
      if (data.presets) setPresets(data.presets);
      if (data.suppliers) setSuppliers(data.suppliers);
      if (data.sales) setSales(data.sales);
      if (data.purchases) setPurchases(data.purchases);
      if (data.expenses) setExpenses(data.expenses);
      if (data.employees) setEmployees(data.employees);
      if (data.salaryTx) setSalaryTx(data.salaryTx);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return (
    <StoreContext.Provider value={{
      lang, setLang,
      products, setProducts,
      categories, setCategories,
      addCategory, deleteCategory, updateCategory,
      brands, setBrands,
      addBrand, deleteBrand, updateBrand,
      presets, setPresets,
      addCustomPreset, deleteCustomPreset,
      suppliers, setSuppliers,
      sales, setSales,
      addSale, updateSale, deleteSale,
      purchases, setPurchases,
      addPurchaseVoucher, updatePurchaseVoucher, deletePurchaseVoucher,
      expenses, setExpenses,
      employees, setEmployees,
      salaryTx, setSalaryTx,
      getFlatVariants,
      addProduct,
      updateProduct,
      addVariantToProduct,
      duplicateProductToBrand,
      updateVariantDetails,
      deleteVariantFromProduct,
      deleteProduct,
      addExpense,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      addSalaryTransaction,
      updateSupplierPayment,
      resetToDemoData,
      clearAllData,
      exportDataJSON,
      importDataJSON,
      printDoc, setPrintDoc,
      confirmState, showConfirm, closeConfirm
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
