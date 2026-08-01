import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Package, 
  Search, 
  PlusCircle, 
  Edit3, 
  AlertTriangle,
  Plus,
  Trash2,
  Sliders,
  Copy,
  Zap,
  BookmarkPlus,
  X,
  ChevronDown,
  ChevronRight,
  ListFilter,
  LayoutGrid
} from 'lucide-react';

const MultiSelectBrandDropdown = ({ brands = [], selectedBrands = [], onChange, isBn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleBrand = (bName) => {
    if (selectedBrands.includes(bName)) {
      onChange(selectedBrands.filter(b => b !== bName));
    } else {
      onChange([...selectedBrands, bName]);
    }
  };

  const handleSelectAll = () => {
    if (selectedBrands.length === brands.length) {
      onChange([]);
    } else {
      onChange([...brands]);
    }
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          minHeight: '42px',
          padding: '6px 12px',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          border: isOpen ? '1px solid #06b6d4' : '1px solid #334155',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          transition: 'border-color 0.2s',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', flex: 1, minWidth: 0 }}>
          {selectedBrands.length === 0 ? (
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
              {isBn ? 'ব্র্যান্ড সিলেক্ট করুন...' : 'Select Brands...'}
            </span>
          ) : (
            selectedBrands.map(b => (
              <span
                key={b}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(6, 182, 212, 0.18)',
                  color: '#06b6d4',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '0.825rem',
                  fontWeight: 600
                }}
              >
                {b}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBrand(b);
                  }}
                  style={{
                    cursor: 'pointer',
                    fontSize: '11px',
                    lineHeight: 1,
                    marginLeft: '3px',
                    color: '#f87171',
                    fontWeight: 700
                  }}
                  title={isBn ? 'রিমুভ' : 'Remove'}
                >
                  ✕
                </span>
              </span>
            ))
          )}
        </div>
        <ChevronDown size={18} style={{ color: '#94a3b8', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 9999,
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '10px',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
            padding: '8px',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {/* Header Action */}
          <div style={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            padding: '4px 6px 8px 6px',
            borderBottom: '1px solid #334155',
            marginBottom: '6px',
            fontSize: '0.8rem'
          }}>
            <button
              type="button"
              onClick={handleSelectAll}
              style={{ background: 'none', border: 'none', color: '#06b6d4', cursor: 'pointer', fontWeight: 600, padding: 0 }}
            >
              {selectedBrands.length === brands.length
                ? (isBn ? 'সব ডিলিট' : 'Clear All')
                : (isBn ? 'সব সিলেক্ট' : 'Select All')}
            </button>
            <span style={{ color: '#64748b' }}>
              {selectedBrands.length} / {brands.length} {isBn ? 'বাছাই' : 'selected'}
            </span>
          </div>

          {/* Brand Items Scrollable List */}
          <div style={{
            maxHeight: '180px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            paddingRight: '2px'
          }}>
            {brands.length === 0 ? (
              <div style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                {isBn ? 'ব্র্যান্ড মেনু থেকে ব্র্যান্ড যোগ করুন' : 'No brands available in Brand Menu'}
              </div>
            ) : (
              brands.map(b => {
                const isSelected = selectedBrands.includes(b);
                return (
                  <div
                    key={b}
                    onClick={() => toggleBrand(b)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                      color: isSelected ? '#38bdf8' : '#f8fafc',
                      fontSize: '0.875rem',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <span style={{ fontWeight: isSelected ? 600 : 400, flex: 1, textAlign: 'left' }}>
                      {b}
                    </span>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '5px',
                      border: isSelected ? '1.5px solid #06b6d4' : '1.5px solid #475569',
                      backgroundColor: isSelected ? '#06b6d4' : 'rgba(15, 23, 42, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginLeft: '12px',
                      flexShrink: 0,
                      transition: 'all 0.15s ease'
                    }}>
                      {isSelected ? '✓' : ''}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const Inventory = () => {
  const { 
    lang, 
    products, 
    categories, 
    brands, 
    presets,
    addCustomPreset,
    deleteCustomPreset,
    addBrand,
    addProduct,
    updateProduct,
    addVariantToProduct,
    duplicateProductToBrand,
    updateVariantDetails,
    deleteVariantFromProduct,
    deleteProduct,
    showConfirm
  } = useStore();

  const isBn = lang === 'bn';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedBrand, setSelectedBrand] = useState('ALL');

  // Compact View Mode & Accordion Expand States
  const [viewDensity, setViewDensity] = useState('compact');
  const [expandedProductIds, setExpandedProductIds] = useState({});

  const toggleExpandProduct = (prodId) => {
    setExpandedProductIds(prev => ({
      ...prev,
      [prodId]: !prev[prodId]
    }));
  };

  // Modals state
  const [showAddProdModal, setShowAddProdModal] = useState(false);
  const [showEditProdModal, setShowEditProdModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [showAddVariantModal, setShowAddVariantModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [targetProduct, setTargetProduct] = useState(null);
  const [duplicateTargetBrand, setDuplicateTargetBrand] = useState(brands[0] || 'Super Star');

  // Edit single variant modal state
  const [editingVariant, setEditingVariant] = useState(null);

  // Form states for Product Add/Edit
  const [prodNameBn, setProdNameBn] = useState('');
  const [prodBrands, setProdBrands] = useState(brands[0] ? [brands[0]] : []);
  const [prodCategory, setProdCategory] = useState(categories[0]?.id || 'cat_cables');
  const [prodUnit, setProdUnit] = useState('Goj');
  
  // Multi-Group Variation Architecture
  const [variationGroups, setVariationGroups] = useState([
    { id: 1, name: 'তারের সাইজ (Cable Size)', values: '1.0 rm, 1.3 rm, 2.0 rm, 14/76' },
    { id: 2, name: 'রং (Color)', values: 'লাল, কালো' }
  ]);

  // Options List
  const [variationOptions, setVariationOptions] = useState([
    { spec: '1.0 rm - লাল', purchasePrice: 18, sellingPrice: 25, stock: 500, reorderLevel: 50 },
    { spec: '1.0 rm - কালো', purchasePrice: 18, sellingPrice: 25, stock: 500, reorderLevel: 50 }
  ]);

  const addVariationGroup = () => {
    setVariationGroups(prev => [
      ...prev,
      { id: Date.now(), name: isBn ? `ভেরিয়েশন টাইপ #${prev.length + 1}` : `Group #${prev.length + 1}`, values: '' }
    ]);
  };

  const updateVariationGroup = (id, field, val) => {
    setVariationGroups(prev => prev.map(g => g.id === id ? { ...g, [field]: val } : g));
  };

  const removeVariationGroup = (id) => {
    if (variationGroups.length <= 1) return;
    setVariationGroups(prev => prev.filter(g => g.id !== id));
  };

  // MIXER FUNCTION
  const runVariationMixer = () => {
    const validGroups = variationGroups
      .map(g => ({
        name: g.name.trim(),
        vals: g.values.split(',').map(s => s.trim()).filter(Boolean)
      }))
      .filter(g => g.vals.length > 0);

    if (validGroups.length === 0) {
      alert(isBn ? 'অনুগ্রহ করে অন্তত একটি ভেরিয়েশন গ্রুপে মান লিখুন!' : 'Please enter values in at least 1 group!');
      return;
    }

    let allGroups = [...validGroups];
    if (prodBrands.length > 1) {
      const hasBrandGroup = validGroups.some(g => g.name.toLowerCase().includes('brand') || g.name.toLowerCase().includes('ব্র্যান্ড'));
      if (!hasBrandGroup) {
        allGroups = [
          { name: isBn ? 'ব্র্যান্ড' : 'Brand', vals: prodBrands },
          ...validGroups
        ];
      }
    }

    let combinations = [[]];
    allGroups.forEach(group => {
      const nextCombos = [];
      combinations.forEach(existingCombo => {
        group.vals.forEach(val => {
          nextCombos.push([...existingCombo, val]);
        });
      });
      combinations = nextCombos;
    });

    const mixedOptions = combinations.map(combo => ({
      spec: combo.join(' - '),
      purchasePrice: 0,
      sellingPrice: '',
      stock: 0,
      reorderLevel: 5
    }));

    setVariationOptions(mixedOptions);
    alert(isBn ? `⚡ মিক্সার সফল! মোট ${mixedOptions.length}টি কম্বিনেশন তৈরি হয়েছে।` : `Mixer generated ${mixedOptions.length} combinations!`);
  };

  const addOptionRow = () => {
    setVariationOptions(prev => [...prev, { spec: '', purchasePrice: 0, sellingPrice: '', stock: 0, reorderLevel: 5 }]);
  };

  const updateOptionRow = (index, field, val) => {
    setVariationOptions(prev => prev.map((item, idx) => idx === index ? { ...item, [field]: val } : item));
  };

  const removeOptionRow = (index) => {
    if (variationOptions.length <= 1) return;
    setVariationOptions(prev => prev.filter((_, idx) => idx !== index));
  };

  const applyPresetObject = (presetObj) => {
    if (presetObj.productName) setProdNameBn(presetObj.productName);
    if (presetObj.categoryId) setProdCategory(presetObj.categoryId);
    if (presetObj.unit) setProdUnit(presetObj.unit);

    if (presetObj.options && presetObj.options.length > 0) {
      setVariationOptions(presetObj.options.map(opt => ({
        spec: opt.spec || '',
        purchasePrice: 0,
        sellingPrice: opt.sellingPrice !== undefined ? opt.sellingPrice : '',
        stock: 0,
        reorderLevel: opt.reorderLevel || 5
      })));
    }
  };

  const handleSaveAsCustomPreset = () => {
    if (!prodNameBn.trim()) {
      alert(isBn ? 'অনুগ্রহ করে পণ্যের নাম লিখুন!' : 'Please enter product name!');
      return;
    }

    const presetTitlePrompt = prompt(
      isBn ? 'এই কাস্টম টেমপ্লেটটির একটি সংক্ষিপ্ত শিরোনাম দিন:' : 'Enter short title for this custom preset:',
      `📦 ${prodNameBn}`
    );

    if (!presetTitlePrompt || !presetTitlePrompt.trim()) return;

    const groupNamesStr = variationGroups.map(g => g.name).join(' + ');

    addCustomPreset({
      title: presetTitlePrompt.trim(),
      productName: prodNameBn,
      categoryId: prodCategory,
      unit: prodUnit,
      variationTypeName: groupNamesStr,
      options: variationOptions.map(o => ({
        spec: o.spec,
        purchasePrice: Number(o.purchasePrice || 0),
        sellingPrice: Number(o.sellingPrice || 0),
        stock: Number(o.stock || 0),
        reorderLevel: Number(o.reorderLevel || 5)
      }))
    });

    alert(isBn ? `"${presetTitlePrompt.trim()}" টেমপ্লেটটি সেভ হয়েছে!` : 'Custom preset saved!');
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'ALL' || p.categoryId === selectedCategory;
    const matchesBrand = selectedBrand === 'ALL' || (p.brand && p.brand.split(',').map(b => b.trim()).includes(selectedBrand));
    
    const q = searchQuery.toLowerCase();
    const matchesQuery = !q || (
      p.nameBn.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      (p.variationTypeName && p.variationTypeName.toLowerCase().includes(q)) ||
      (p.variants || []).some(v => 
        v.spec.toLowerCase().includes(q) || 
        v.sku.toLowerCase().includes(q)
      )
    );

    return matchesCat && matchesBrand && matchesQuery;
  });

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!prodNameBn) return;

    const finalBrand = prodBrands.length > 0 ? prodBrands.join(', ') : (brands[0] || 'Unbranded');

    const groupNamesStr = variationGroups.map(g => g.name).join(' + ');

    const formattedVariants = variationOptions.map((opt, idx) => ({
      spec: opt.spec || `Option-${idx + 1}`,
      sku: `${finalBrand.substring(0, 3)}-${(opt.spec || `O${idx + 1}`).replace(/\s+/g, '')}`,
      purchasePrice: Number(opt.purchasePrice || 0),
      sellingPrice: Number(opt.sellingPrice || 0),
      stock: Number(opt.stock || 0),
      reorderLevel: Number(opt.reorderLevel || 5)
    }));

    const newProd = {
      nameBn: prodNameBn,
      nameEn: prodNameBn,
      categoryId: prodCategory,
      brand: finalBrand,
      unit: prodUnit,
      variationTypeName: groupNamesStr || (isBn ? 'কম্বিনেশন ভেরিয়েন্ট' : 'Variation Combination'),
      variants: formattedVariants
    };

    addProduct(newProd);
    alert(isBn ? `"${prodNameBn}" (${finalBrand}) সফলভাবে যুক্ত হয়েছে!` : 'Product created!');
    setShowAddProdModal(false);
    resetForm();
  };

  // Handler when brands are added/removed in Select Brand(s)
  const handleProdBrandsChange = (newBrands) => {
    // Find newly added brands
    const addedBrands = newBrands.filter(b => !prodBrands.includes(b));
    setProdBrands(newBrands);

    if (addedBrands.length > 0) {
      const cleanSpecsSet = new Set();

      // 1. From variationGroups
      variationGroups.forEach(grp => {
        if (grp.values) {
          grp.values.split(',').forEach(val => {
            let s = val.trim();
            newBrands.forEach(b => {
              s = s.replace(new RegExp(`^${b}\\s*[-–—:]\\s*`, 'i'), '');
            });
            if (s.trim()) cleanSpecsSet.add(s.trim());
          });
        }
      });

      // 2. From variationOptions
      variationOptions.forEach(opt => {
        let s = opt.spec || '';
        newBrands.forEach(b => {
          s = s.replace(new RegExp(`^${b}\\s*[-–—:]\\s*`, 'i'), '');
        });
        if (s.trim()) cleanSpecsSet.add(s.trim());
      });

      const baseSpecs = Array.from(cleanSpecsSet);

      if (baseSpecs.length > 0) {
        setVariationOptions(prev => {
          const nextOptions = [...prev];
          addedBrands.forEach(brand => {
            baseSpecs.forEach(spec => {
              const comboSpec = `${brand} - ${spec}`;
              const exists = nextOptions.some(opt => opt.spec === comboSpec);
              if (!exists) {
                nextOptions.push({
                  spec: comboSpec,
                  purchasePrice: 0,
                  sellingPrice: 0,
                  stock: 0,
                  reorderLevel: 5
                });
              }
            });
          });
          return nextOptions;
        });
      }
    }
  };

  // Populate Edit Product Modal with exact same rich form
  const handleOpenEditProductModal = (prod) => {
    setEditingProduct(prod);
    setProdNameBn(prod.nameBn);
    setProdCategory(prod.categoryId);
    const bArray = prod.brand
      ? prod.brand.split(',').map(b => b.trim()).filter(Boolean)
      : (brands[0] ? [brands[0]] : []);
    setProdBrands(bArray);
    setProdUnit(prod.unit || 'Goj');
    
    // Cleanly extract base specs without brand prefix for Group Values
    const cleanSpecsSet = new Set();
    (prod.variants || []).forEach(v => {
      let cleanSpec = v.spec || '';
      bArray.forEach(b => {
        const regex = new RegExp(`^${b}\\s*[-–—:]\\s*`, 'i');
        cleanSpec = cleanSpec.replace(regex, '');
      });
      if (cleanSpec.trim()) {
        cleanSpecsSet.add(cleanSpec.trim());
      }
    });

    const cleanValues = Array.from(cleanSpecsSet).join(', ');

    setVariationGroups([
      { id: 1, name: prod.variationTypeName || (isBn ? 'টাইপ' : 'Type'), values: cleanValues || '' }
    ]);
    
    setVariationOptions((prod.variants || []).map(v => ({
      id: v.id,
      spec: v.spec,
      purchasePrice: v.purchasePrice,
      sellingPrice: v.sellingPrice,
      stock: v.stock,
      reorderLevel: v.reorderLevel || 5
    })));

    setShowEditProdModal(true);
  };

  // Save Full Product Edit
  const handleSaveProductEdit = (e) => {
    e.preventDefault();
    if (!editingProduct || !prodNameBn) return;

    const finalBrand = prodBrands.length > 0 ? prodBrands.join(', ') : (brands[0] || 'Unbranded');
    const groupNamesStr = variationGroups.map(g => g.name).join(' + ');

    // Ensure all selected brands have variation options generated
    let finalVariationOptions = [...variationOptions];
    if (prodBrands.length > 0) {
      const cleanSpecsSet = new Set();
      variationOptions.forEach(opt => {
        let s = opt.spec || '';
        prodBrands.forEach(b => {
          s = s.replace(new RegExp(`^${b}\\s*[-–—:]\\s*`, 'i'), '');
        });
        if (s.trim()) cleanSpecsSet.add(s.trim());
      });
      const baseSpecs = Array.from(cleanSpecsSet);

      if (baseSpecs.length > 0) {
        prodBrands.forEach(brand => {
          baseSpecs.forEach(spec => {
            const comboSpec = `${brand} - ${spec}`;
            const exists = finalVariationOptions.some(opt => opt.spec === comboSpec);
            if (!exists) {
              finalVariationOptions.push({
                spec: comboSpec,
                purchasePrice: 0,
                sellingPrice: 0,
                stock: 0,
                reorderLevel: 5
              });
            }
          });
        });
      }
    }

    const formattedVariants = finalVariationOptions.map((opt, idx) => ({
      id: opt.id || `v_${Date.now()}_${idx}`,
      spec: opt.spec || `Option-${idx + 1}`,
      sku: `${finalBrand.substring(0, 3)}-${(opt.spec || `O${idx + 1}`).replace(/\s+/g, '')}`,
      purchasePrice: Number(opt.purchasePrice || 0),
      sellingPrice: Number(opt.sellingPrice || 0),
      stock: Number(opt.stock || 0),
      reorderLevel: Number(opt.reorderLevel || 5)
    }));

    updateProduct(editingProduct.id, {
      nameBn: prodNameBn,
      nameEn: prodNameBn,
      categoryId: prodCategory,
      brand: finalBrand,
      unit: prodUnit,
      variationTypeName: groupNamesStr || (isBn ? 'কম্বিনেশন ভেরিয়েন্ট' : 'Variation Combination'),
      variants: formattedVariants
    });

    alert(isBn ? `"${prodNameBn}" পণ্যটির সকল তথ্য ও ভেরিয়েন্ট সফলভাবে আপডেট করা হয়েছে!` : 'Product & variations updated!');
    setShowEditProdModal(false);
    setEditingProduct(null);
    resetForm();
  };

  const handleDuplicateProduct = (e) => {
    e.preventDefault();
    if (!targetProduct || !duplicateTargetBrand) return;

    duplicateProductToBrand(targetProduct.id, duplicateTargetBrand);
    alert(isBn ? `"${targetProduct.nameBn}" পণ্যটি সকল সাইজসহ "${duplicateTargetBrand}" ব্র্যান্ডে ডুপ্লিকেট করা হয়েছে!` : 'Product duplicated to brand!');
    setShowDuplicateModal(false);
  };

  const handleCreateVariant = (e) => {
    e.preventDefault();
    if (!targetProduct) return;

    const opt = variationOptions[0];

    addVariantToProduct(targetProduct.id, {
      spec: opt.spec || 'New Option',
      sku: `${(opt.spec || 'OPT').replace(/\s+/g, '')}`,
      purchasePrice: Number(opt.purchasePrice || 0),
      sellingPrice: Number(opt.sellingPrice || 0),
      stock: Number(opt.stock || 0),
      reorderLevel: Number(opt.reorderLevel || 5)
    });

    alert(isBn ? 'নতুন ভেরিয়েন্ট অপশন সফলভাবে যুক্ত হয়েছে!' : 'New option added!');
    setShowAddVariantModal(false);
    resetForm();
  };

  const handleSaveVariantEdit = (e) => {
    e.preventDefault();
    if (!editingVariant) return;

    updateVariantDetails(editingVariant.productId, editingVariant.variant.id, {
      spec: editingVariant.variant.spec,
      sku: editingVariant.variant.sku,
      purchasePrice: Number(editingVariant.variant.purchasePrice),
      sellingPrice: Number(editingVariant.variant.sellingPrice),
      stock: Number(editingVariant.variant.stock),
      reorderLevel: Number(editingVariant.variant.reorderLevel)
    });

    alert(isBn ? 'ভেরিয়েন্টের তথ্য ও দাম আপডেট করা হয়েছে!' : 'Variant updated!');
    setEditingVariant(null);
  };

  const resetForm = () => {
    setProdNameBn('');
    setProdBrands(brands[0] ? [brands[0]] : []);
    setProdUnit('Goj');
    setVariationGroups([
      { id: 1, name: 'তারের সাইজ (Cable Size)', values: '1.0 rm, 1.3 rm, 2.0 rm, 14/76' },
      { id: 2, name: 'রং (Color)', values: 'লাল, কালো' }
    ]);
    setVariationOptions([
      { spec: '1.0 rm - লাল', purchasePrice: 0, sellingPrice: 25, stock: 0, reorderLevel: 50 },
      { spec: '1.0 rm - কালো', purchasePrice: 0, sellingPrice: 25, stock: 0, reorderLevel: 50 }
    ]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Action Bar & Filters */}
      <div className="card">
        <div style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                className="input-control"
                placeholder={isBn ? 'পণ্য, গজ, মিটার, পিন/প্যাচ, 14/76 বা ব্র্যান্ড খুঁজুন...' : 'Search product, goj, size or brand...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            
            {/* View Density Switcher */}
            <div style={{ display: 'flex', border: '1px solid #334155', borderRadius: '6px', overflow: 'hidden' }}>
              <button
                type="button"
                onClick={() => setViewDensity('compact')}
                className={`btn btn-sm ${viewDensity === 'compact' ? 'btn-primary' : 'btn-secondary'}`}
                title={isBn ? 'কম্প্যাক্ট ভিউ (অ্যাকোর্ডিয়ন)' : 'Compact View'}
                style={{ borderRadius: 0 }}
              >
                <ListFilter size={15} />
                <span>{isBn ? 'কম্প্যাক্ট' : 'Compact'}</span>
              </button>

              <button
                type="button"
                onClick={() => setViewDensity('expanded')}
                className={`btn btn-sm ${viewDensity === 'expanded' ? 'btn-primary' : 'btn-secondary'}`}
                title={isBn ? 'বিস্তারিত ভিউ' : 'Expanded View'}
                style={{ borderRadius: 0 }}
              >
                <LayoutGrid size={15} />
                <span>{isBn ? 'সব খোলা' : 'Expanded'}</span>
              </button>
            </div>

            <select
              className="select-control"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="ALL">{isBn ? 'সকল ক্যাটাগরি' : 'All Categories'}</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{isBn ? c.nameBn : c.nameEn}</option>
              ))}
            </select>

            <select
              className="select-control"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="ALL">{isBn ? 'সকল ব্র্যান্ড' : 'All Brands'}</option>
              {brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <button onClick={() => { resetForm(); setShowAddProdModal(true); }} className="btn btn-primary">
              <PlusCircle size={18} />
              <span>{isBn ? '+ নতুন পণ্য যোগ করুন' : '+ Add Product'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product List Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: viewDensity === 'compact' ? '0.6rem' : '1rem' }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(prod => {
            const cat = categories.find(c => c.id === prod.categoryId);
            const isExpanded = viewDensity === 'expanded' || !!expandedProductIds[prod.id];
            const totalStock = (prod.variants || []).reduce((sum, v) => sum + v.stock, 0);

            return (
              <div 
                key={prod.id} 
                className="card"
                style={{ 
                  padding: viewDensity === 'compact' ? '0.75rem 1rem' : '1.25rem',
                  border: isExpanded ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid #334155'
                }}
              >
                {/* Product Header */}
                <div style={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  paddingBottom: isExpanded ? '0.75rem' : '0',
                  marginBottom: isExpanded ? '0.75rem' : '0',
                  borderBottom: isExpanded ? '1px solid #334155' : 'none'
                }}>
                  <div 
                    onClick={() => toggleExpandProduct(prod.id)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.6rem', 
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    <span style={{ color: '#06b6d4' }}>
                      {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </span>

                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span>{isBn ? prod.nameBn : prod.nameEn}</span>
                      {(prod.brand || '').split(',').map(b => b.trim()).filter(Boolean).map((b, i) => (
                        <span key={i} className="badge badge-purple" style={{ fontSize: '0.75rem', padding: '1px 6px' }}>{b}</span>
                      ))}
                      
                      <span style={{ fontSize: '0.775rem', color: '#94a3b8', fontWeight: 400 }}>
                        • {isBn ? cat?.nameBn : cat?.nameEn}
                      </span>

                      <span className="badge badge-cyan" style={{ fontSize: '0.75rem', padding: '1px 6px' }}>
                        {(prod.variants || []).length} {isBn ? 'টি ভেরিয়েন্ট' : 'Variants'}
                      </span>

                      <span className="badge badge-green" style={{ fontSize: '0.75rem', padding: '1px 6px' }}>
                        মোট স্টক: {totalStock} {prod.unit === 'Goj' ? (isBn ? 'গজ' : 'Yard') : prod.unit}
                      </span>
                    </h3>
                  </div>

                  {/* Compact Action Buttons with EDIT PRODUCT ICON BUTTON! */}
                  <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                    {/* EDIT PRODUCT ICON BUTTON */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditProductModal(prod);
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.35rem 0.5rem', color: '#f59e0b' }}
                      title={isBn ? 'পণ্য ও এর সকল ভেরিয়েন্ট এডিট করুন (Edit Product & Variations)' : 'Edit Product & Variations'}
                    >
                      <Edit3 size={16} />
                    </button>

                    {/* Duplicate Symbol Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTargetProduct(prod);
                        setShowDuplicateModal(true);
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.35rem 0.5rem', color: '#8b5cf6' }}
                      title={isBn ? 'অন্য ব্র্যান্ডে ১-ক্লিকে কপি করুন (Duplicate to Brand)' : 'Duplicate to Brand'}
                    >
                      <Copy size={16} />
                    </button>

                    {/* Add Option Symbol Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTargetProduct(prod);
                        resetForm();
                        setVariationOptions([{ spec: '', purchasePrice: 0, sellingPrice: 0, stock: 0, reorderLevel: 5 }]);
                        setShowAddVariantModal(true);
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.35rem 0.5rem' }}
                      title={isBn ? '+ নতুন ভেরিয়েন্ট অপশন যোগ (Add Variant Option)' : 'Add Variant Option'}
                    >
                      <Plus size={16} />
                    </button>

                    {/* Delete Product Symbol Button */}
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        const confirmed = await showConfirm({
                          title: isBn ? 'পণ্য মুছে ফেলা' : 'Delete Product',
                          message: isBn ? 'আপনি কি নিশ্চিত যে এই সম্পূর্ণ পণ্যটি মুছে ফেলতে চান?' : 'Delete this product?',
                          type: 'danger',
                          confirmText: isBn ? 'হ্যাঁ, ডিলিট করুন' : 'Delete'
                        });
                        if (confirmed) {
                          deleteProduct(prod.id);
                        }
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.35rem 0.5rem', color: '#f43f5e' }}
                      title={isBn ? 'পণ্য মুছে ফেলুন (Delete Product)' : 'Delete Product'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Collapsible Variant Table */}
                {isExpanded && (
                  <div className="table-container" style={{ marginTop: '0.5rem' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>{isBn ? `ভেরিয়েন্ট অপশন (${prod.variationTypeName || 'কম্বিনেশন'})` : 'Variation Option'}</th>
                          <th>SKU Code</th>
                          <th style={{ color: '#f59e0b' }}>{isBn ? 'কিনা দাম (ক্রয়মূল্য)' : 'Purchase Rate'}</th>
                          <th style={{ color: '#10b981' }}>{isBn ? 'বিক্রি দাম (বিক্রয়মূল্য)' : 'Selling Rate'}</th>
                          <th>{isBn ? 'বর্তমান স্টক' : 'Stock'}</th>
                          <th style={{ textAlign: 'right' }}>{isBn ? 'অ্যাকশন' : 'Action'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(prod.variants || []).map(varItem => {
                          const isLow = varItem.stock <= varItem.reorderLevel;
                          return (
                            <tr key={varItem.id}>
                              <td style={{ fontWeight: 600, color: '#06b6d4' }}>
                                {varItem.spec}
                              </td>

                              <td style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
                                {varItem.sku}
                              </td>
                              <td style={{ fontWeight: 600, color: '#f59e0b', verticalAlign: 'top' }}>
                                <div>৳{varItem.purchasePrice} / {prod.unit === 'Goj' ? (isBn ? 'গজ' : 'Yard') : prod.unit}</div>
                                {varItem.batches && varItem.batches.filter(b => b.remainingQuantity > 0).length > 1 && (
                                  <div style={{ marginTop: '6px', fontSize: '0.75rem', fontWeight: 'normal', color: '#94a3b8' }}>
                                    {varItem.batches.filter(b => b.remainingQuantity > 0).map((b, idx) => (
                                      <div key={idx} style={{ display: 'flex', gap: '4px', whiteSpace: 'nowrap', marginTop: '2px' }}>
                                        • ৳{b.purchasePrice} ({b.remainingQuantity} {prod.unit === 'Goj' ? (isBn ? 'গজ' : 'Yard') : prod.unit})
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </td>
                              <td style={{ fontWeight: 700, color: '#10b981', verticalAlign: 'top' }}>
                                <div>৳{varItem.sellingPrice} / {prod.unit === 'Goj' ? (isBn ? 'গজ' : 'Yard') : prod.unit}</div>
                                {varItem.batches && varItem.batches.filter(b => b.remainingQuantity > 0).length > 1 && (
                                  <div style={{ marginTop: '6px', fontSize: '0.75rem', fontWeight: 'normal', color: '#64748b' }}>
                                    {varItem.batches.filter(b => b.remainingQuantity > 0).map((b, idx) => (
                                      <div key={idx} style={{ marginTop: '2px', whiteSpace: 'nowrap' }}>
                                        • ৳{b.sellingPrice}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </td>
                              <td style={{ verticalAlign: 'top' }}>
                                <div>
                                  {isLow ? (
                                    <span className="badge badge-amber">
                                      <AlertTriangle size={12} /> {varItem.stock} {prod.unit === 'Goj' ? (isBn ? 'গজ' : 'Yard') : prod.unit}
                                    </span>
                                  ) : (
                                    <span className="badge badge-green">
                                      {varItem.stock} {prod.unit === 'Goj' ? (isBn ? 'গজ' : 'Yard') : prod.unit}
                                    </span>
                                  )}
                                </div>
                                {varItem.batches && varItem.batches.filter(b => b.remainingQuantity > 0).length > 1 && (
                                  <div style={{ marginTop: '6px', fontSize: '0.725rem', color: '#64748b' }}>
                                    {varItem.batches.filter(b => b.remainingQuantity > 0).map((b, idx) => (
                                      <div key={idx} style={{ whiteSpace: 'nowrap', marginTop: '2px' }}>
                                        • {b.remainingQuantity} {prod.unit === 'Goj' ? (isBn ? 'গজ' : 'Yard') : prod.unit} <span style={{ color: '#06b6d4' }}>({b.purchaseVoucherId === 'initial' ? (isBn ? 'ওপেনিং' : 'Init') : b.purchaseVoucherId})</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'inline-flex', gap: '4px' }}>
                                  <button
                                    onClick={() => setEditingVariant({ productId: prod.id, variant: { ...varItem } })}
                                    className="btn btn-secondary btn-sm"
                                    style={{ padding: '0.25rem 0.45rem' }}
                                    title="এডিট করুন"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  {(prod.variants || []).length > 1 && (
                                    <button
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        const confirmed = await showConfirm({
                                          title: isBn ? 'ভেরিয়েন্ট মুছে ফেলা' : 'Delete Variant',
                                          message: isBn ? 'এই ভেরিয়েন্ট অপশনটি মুছে ফেলতে চান?' : 'Delete this variant?',
                                          type: 'danger',
                                          confirmText: isBn ? 'হ্যাঁ, ডিলিট করুন' : 'Delete'
                                        });
                                        if (confirmed) {
                                          deleteVariantFromProduct(prod.id, varItem.id);
                                        }
                                      }}
                                      className="btn btn-secondary btn-sm"
                                      style={{ padding: '0.25rem 0.45rem', color: '#f43f5e' }}
                                      title="ভেরিয়েন্ট ডিলিট"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <Package size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
            <p>{isBn ? 'কোনো পণ্য পাওয়া যায়নি!' : 'No products found!'}</p>
          </div>
        )}
      </div>

      {/* Modal: Add New Product */}
      {showAddProdModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '820px' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>{isBn ? 'নতুন পণ্য ও মাল্টি-ভেরিয়েন্ট মিক্সার তৈরি' : 'Add Product & Multi-Variation Mixer'}</h3>
              <button onClick={() => setShowAddProdModal(false)} className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>✕</button>
            </div>
            <form onSubmit={handleCreateProduct}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Instant Presets Bar */}
                <div style={{
                  padding: '0.85rem',
                  backgroundColor: 'rgba(6, 182, 212, 0.12)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Zap size={16} />
                      {isBn ? '১-ক্লিকে টেমপ্লেট নির্বাচন করুন (Instant Presets):' : 'Instant Presets:'}
                    </span>

                    <button
                      type="button"
                      onClick={handleSaveAsCustomPreset}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '2px 8px', backgroundColor: '#8b5cf6', color: '#ffffff' }}
                      title="বর্তমানে ফর্মে লেখা পণ্য ও ভেরিয়েন্ট সেটিংসটি কাস্টম টেমপ্লেট হিসেবে সেভ করুন"
                    >
                      <BookmarkPlus size={14} />
                      <span>{isBn ? '+ বর্তমান সেটআপ কাস্টম টেমপ্লেট করুন' : '+ Save as Preset'}</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {presets.map(p => (
                      <div key={p.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                        <button
                          type="button"
                          onClick={() => applyPresetObject(p)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                        >
                          {p.title}
                        </button>
                        {p.isCustom && (
                          <button
                            type="button"
                            onClick={async () => {
                              const confirmed = await showConfirm({
                                title: isBn ? 'টেমপ্লেট মুছে ফেলা' : 'Delete Preset',
                                message: isBn ? 'এই কাস্টম টেমপ্লেটটি মুছে ফেলতে চান?' : 'Delete preset?',
                                type: 'danger',
                                confirmText: isBn ? 'হ্যাঁ, ডিলিট করুন' : 'Delete'
                              });
                              if (confirmed) {
                                deleteCustomPreset(p.id);
                              }
                            }}
                            style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '2px' }}
                            title="টেমপ্লেট ডিলিট"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Base Product Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">{isBn ? 'পণ্যের মূল নাম (Product Name)' : 'Product Name'}</label>
                    <input 
                      type="text" 
                      required 
                      className="input-control" 
                      value={prodNameBn} 
                      onChange={(e) => setProdNameBn(e.target.value)} 
                      placeholder={isBn ? 'যেমন: বিআরবি সিঙ্গেল কোর তার / ওয়ালটন এলইড লাইট' : 'Product Name'} 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{isBn ? 'ক্যাটাগরি' : 'Category'}</label>
                    <select className="select-control" value={prodCategory} onChange={(e) => setProdCategory(e.target.value)}>
                      {categories.map(c => <option key={c.id} value={c.id}>{isBn ? c.nameBn : c.nameEn}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{isBn ? 'ব্র্যান্ড নির্বাচন করুন (একাধিক সম্ভব)' : 'Select Brand(s)'}</label>
                    <MultiSelectBrandDropdown
                      brands={brands}
                      selectedBrands={prodBrands}
                      onChange={handleProdBrandsChange}
                      isBn={isBn}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">{isBn ? 'বিক্রয় ও হিসেবের একক (Unit)' : 'Unit of Measurement'}</label>
                    <select className="select-control" value={prodUnit} onChange={(e) => setProdUnit(e.target.value)} style={{ fontWeight: 600, color: '#06b6d4' }}>
                      <option value="Goj">গজ (Yard) - খুচরা বিক্রির জন্য সেরা</option>
                      <option value="Meter">মিটার (Meter)</option>
                      <option value="Pcs">পিস (Pcs)</option>
                      <option value="Coil">কয়েল (Coil)</option>
                      <option value="Feet">ফুট (Feet)</option>
                      <option value="Box">বক্স (Box)</option>
                      <option value="Kg">কেজি (Kg)</option>
                    </select>
                  </div>
                </div>

                {/* Multi-Group Variation Setup */}
                <div style={{ backgroundColor: '#0f172a', padding: '1.15rem', borderRadius: '10px', border: '1px solid #8b5cf6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h4 style={{ fontSize: '0.95rem', color: '#8b5cf6', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Sliders size={18} />
                      {isBn ? '১. একের অধিক ভেরিয়েশন টাইপ গ্রুপসমূহ (+ Add Variation Groups):' : '1. Multi-Variation Groups:'}
                    </h4>

                    <button
                      type="button"
                      onClick={addVariationGroup}
                      className="btn btn-secondary btn-sm"
                      style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}
                    >
                      <Plus size={14} />
                      <span>{isBn ? '+ নতুন ভেরিয়েশন গ্রুপ যোগ (যেমন: সাইজ/রং)' : '+ Add Variation Group'}</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                    {variationGroups.map((grp, gIdx) => (
                      <div key={grp.id} style={{
                        backgroundColor: '#1e293b',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #334155',
                        display: 'grid',
                        gridTemplateColumns: '1.5fr 2.5fr 36px',
                        gap: '0.5rem',
                        alignItems: 'center'
                      }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                            {isBn ? `গ্রুপ #${gIdx + 1} নাম (যেমন: তারের সাইজ / রং)` : `Group #${gIdx + 1} Name`}
                          </label>
                          <input
                            type="text"
                            className="input-control"
                            value={grp.name}
                            onChange={(e) => updateVariationGroup(grp.id, 'name', e.target.value)}
                            placeholder={isBn ? 'যেমন: তারের সাইজ / রং' : 'e.g. Size or Color'}
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.875rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                            {isBn ? 'গ্রুপের অপশনসমূহ (কমা দিয়ে লিখুন):' : 'Group Values (comma separated):'}
                          </label>
                          <input
                            type="text"
                            className="input-control"
                            value={grp.values}
                            onChange={(e) => updateVariationGroup(grp.id, 'values', e.target.value)}
                            placeholder={isBn ? 'যেমন: 1.0 rm, 1.3 rm, 2.0 rm বা লাল, কালো, সবুজ' : 'e.g. 1.0rm, 1.3rm'}
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.875rem' }}
                          />
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                          {variationGroups.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeVariationGroup(grp.id)}
                              style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}
                              title="গ্রুপ মুছে ফেলুন"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={runVariationMixer}
                    className="btn btn-primary"
                    style={{ width: '100%', backgroundColor: '#8b5cf6', color: '#ffffff' }}
                  >
                    <span>{isBn ? '⚡ মিক্সার চালিয়ে সকল গ্রুপ কম্বিনেশন জেনারেট করুন' : 'Run Multi-Variation Mixer Matrix'}</span>
                  </button>
                </div>

                {/* Resulting Mixed Variation Options Box */}
                <div style={{ backgroundColor: '#0f172a', padding: '1.15rem', borderRadius: '10px', border: '1px solid #06b6d4' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <label className="form-label" style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.9rem' }}>
                      {isBn ? '২. মিক্সারকৃত কম্বিনেশনসমূহ:' : '2. Mixed Variant Combinations:'}
                    </label>
                    <button type="button" onClick={addOptionRow} className="btn btn-primary btn-sm">
                      + {isBn ? 'আরেকটি কম্বিনেশন অপশন যোগ' : 'Add Option'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {variationOptions.map((opt, oIdx) => (
                      <div key={oIdx} style={{
                        padding: '0.85rem',
                        backgroundColor: '#1e293b',
                        borderRadius: '8px',
                        border: '1px solid #334155',
                        display: 'grid',
                        gridTemplateColumns: '1fr 36px',
                        gap: '0.5rem',
                        alignItems: 'center'
                      }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                            {isBn ? `কম্বিনেশন #${oIdx + 1}` : `Combo Spec`}
                          </label>
                          <input
                            type="text"
                            required
                            className="input-control"
                            placeholder={isBn ? 'যেমন: 1.0 rm - লাল' : 'Option spec'}
                            value={opt.spec}
                            onChange={(e) => updateOptionRow(oIdx, 'spec', e.target.value)}
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.875rem' }}
                          />
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                          {variationOptions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeOptionRow(oIdx)}
                              style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}
                              title="অপশনটি ডিলিট করুন"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddProdModal(false)} className="btn btn-secondary">{isBn ? 'বাতিল' : 'Cancel'}</button>
                <button type="submit" className="btn btn-primary">{isBn ? 'পণ্য ও ভেরিয়েন্ট সেভ করুন' : 'Save Product & Variations'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Existing Product (Uses EXACT SAME Rich Form as Add Product) */}
      {showEditProdModal && editingProduct && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '820px' }}>
            <div className="modal-header">
              <h3>{isBn ? `পণ্য ও ভেরিয়েন্ট এডিট (${editingProduct.nameBn})` : `Edit Product & Variations (${editingProduct.nameBn})`}</h3>
              <button onClick={() => setShowEditProdModal(false)} className="btn btn-secondary btn-sm">✕</button>
            </div>
            <form onSubmit={handleSaveProductEdit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Base Product Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">{isBn ? 'পণ্যের মূল নাম (Product Name)' : 'Product Name'}</label>
                    <input 
                      type="text" 
                      required 
                      className="input-control" 
                      value={prodNameBn} 
                      onChange={(e) => setProdNameBn(e.target.value)} 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{isBn ? 'ক্যাটাগরি' : 'Category'}</label>
                    <select className="select-control" value={prodCategory} onChange={(e) => setProdCategory(e.target.value)}>
                      {categories.map(c => <option key={c.id} value={c.id}>{isBn ? c.nameBn : c.nameEn}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{isBn ? 'ব্র্যান্ড নির্বাচন করুন (একাধিক সম্ভব)' : 'Select Brand(s)'}</label>
                    <MultiSelectBrandDropdown
                      brands={brands}
                      selectedBrands={prodBrands}
                      onChange={setProdBrands}
                      isBn={isBn}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">{isBn ? 'বিক্রয় ও হিসেবের একক (Unit)' : 'Unit of Measurement'}</label>
                    <select className="select-control" value={prodUnit} onChange={(e) => setProdUnit(e.target.value)} style={{ fontWeight: 600, color: '#06b6d4' }}>
                      <option value="Goj">গজ (Yard) - খুচরা বিক্রির জন্য সেরা</option>
                      <option value="Meter">মিটার (Meter)</option>
                      <option value="Pcs">পিস (Pcs)</option>
                      <option value="Coil">কয়েল (Coil)</option>
                      <option value="Feet">ফুট (Feet)</option>
                      <option value="Box">বক্স (Box)</option>
                      <option value="Kg">কেজি (Kg)</option>
                    </select>
                  </div>
                </div>

                {/* Multi-Group Variation Setup */}
                <div style={{ backgroundColor: '#0f172a', padding: '1.15rem', borderRadius: '10px', border: '1px solid #8b5cf6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h4 style={{ fontSize: '0.95rem', color: '#8b5cf6', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Sliders size={18} />
                      {isBn ? '১. ভেরিয়েশন টাইপ গ্রুপসমূহ (+ Add Variation Groups):' : '1. Multi-Variation Groups:'}
                    </h4>

                    <button
                      type="button"
                      onClick={addVariationGroup}
                      className="btn btn-secondary btn-sm"
                      style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}
                    >
                      <Plus size={14} />
                      <span>{isBn ? '+ নতুন ভেরিয়েশন গ্রুপ যোগ' : '+ Add Variation Group'}</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                    {variationGroups.map((grp, gIdx) => (
                      <div key={grp.id} style={{
                        backgroundColor: '#1e293b',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #334155',
                        display: 'grid',
                        gridTemplateColumns: '1.5fr 2.5fr 36px',
                        gap: '0.5rem',
                        alignItems: 'center'
                      }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                            {isBn ? `গ্রুপ #${gIdx + 1} নাম` : `Group #${gIdx + 1} Name`}
                          </label>
                          <input
                            type="text"
                            className="input-control"
                            value={grp.name}
                            onChange={(e) => updateVariationGroup(grp.id, 'name', e.target.value)}
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.875rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                            {isBn ? 'গ্রুপের অপশনসমূহ (কমা দিয়ে লিখুন):' : 'Group Values (comma separated):'}
                          </label>
                          <input
                            type="text"
                            className="input-control"
                            value={grp.values}
                            onChange={(e) => updateVariationGroup(grp.id, 'values', e.target.value)}
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.875rem' }}
                          />
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                          {variationGroups.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeVariationGroup(grp.id)}
                              style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}
                              title="গ্রুপ মুছে ফেলুন"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={runVariationMixer}
                    className="btn btn-primary"
                    style={{ width: '100%', backgroundColor: '#8b5cf6', color: '#ffffff' }}
                  >
                    <span>{isBn ? '⚡ মিক্সার চালিয়ে সকল গ্রুপ কম্বিনেশন জেনারেট করুন' : 'Run Multi-Variation Mixer Matrix'}</span>
                  </button>
                </div>

                {/* Resulting Mixed Variation Options Box */}
                <div style={{ backgroundColor: '#0f172a', padding: '1.15rem', borderRadius: '10px', border: '1px solid #06b6d4' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <label className="form-label" style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.9rem' }}>
                      {isBn ? '২. কম্বিনেশনসমূহ:' : '2. Variant Combinations:'}
                    </label>
                    <button type="button" onClick={addOptionRow} className="btn btn-primary btn-sm">
                      + {isBn ? 'আরেকটি কম্বিনেশন অপশন যোগ' : 'Add Option'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {variationOptions.map((opt, oIdx) => (
                      <div key={oIdx} style={{
                        padding: '0.85rem',
                        backgroundColor: '#1e293b',
                        borderRadius: '8px',
                        border: '1px solid #334155',
                        display: 'grid',
                        gridTemplateColumns: '1fr 36px',
                        gap: '0.5rem',
                        alignItems: 'center'
                      }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                            {isBn ? `কম্বিনেশন #${oIdx + 1}` : `Combo Spec`}
                          </label>
                          <input
                            type="text"
                            required
                            className="input-control"
                            value={opt.spec}
                            onChange={(e) => updateOptionRow(oIdx, 'spec', e.target.value)}
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.875rem' }}
                          />
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                          {variationOptions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeOptionRow(oIdx)}
                              style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}
                              title="অপশনটি ডিলিট করুন"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowEditProdModal(false)} className="btn btn-secondary">{isBn ? 'বাতিল' : 'Cancel'}</button>
                <button type="submit" className="btn btn-primary">{isBn ? 'পণ্য আপডেট করুন' : 'Update Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Duplicate Product to Another Brand */}
      {showDuplicateModal && targetProduct && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>{isBn ? 'অন্য ব্র্যান্ডে সম্পূর্ণ পণ্য কপি করুন' : 'Duplicate Product to Brand'}</h3>
              <button onClick={() => setShowDuplicateModal(false)} className="btn btn-secondary btn-sm">✕</button>
            </div>
            <form onSubmit={handleDuplicateProduct}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ backgroundColor: '#0f172a', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem' }}>
                  মূল পণ্য: <strong>{targetProduct.nameBn}</strong> (বর্তমান ব্র্যান্ড: {targetProduct.brand})
                </div>

                <div className="form-group">
                  <label className="form-label">{isBn ? 'কোন ব্র্যান্ডে কপি করতে চান?' : 'Select Target Brand'}</label>
                  <select
                    className="select-control"
                    value={duplicateTargetBrand}
                    onChange={(e) => setDuplicateTargetBrand(e.target.value)}
                  >
                    {brands.filter(b => b !== targetProduct.brand).map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowDuplicateModal(false)} className="btn btn-secondary">{isBn ? 'বাতিল' : 'Cancel'}</button>
                <button type="submit" className="btn btn-primary">
                  <Copy size={16} />
                  <span>{isBn ? '১-ক্লিকে কপি তৈরি করুন' : 'Duplicate Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Single Variation Option */}
      {showAddVariantModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h3>{isBn ? 'নতুন ভেরিয়েন্ট অপশন যোগ করুন' : 'Add New Variation Option'}</h3>
              <button onClick={() => setShowAddVariantModal(false)} className="btn btn-secondary btn-sm">✕</button>
            </div>
            <form onSubmit={handleCreateVariant}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="form-group">
                  <label className="form-label">{isBn ? 'ভেরিয়েন্ট অপশন (যেমন: 14/76 - লাল)' : 'Variation Option Spec'}</label>
                  <input type="text" required className="input-control" value={variationOptions[0].spec} onChange={(e) => updateOptionRow(0, 'spec', e.target.value)} placeholder={isBn ? 'যেমন: 1.0 rm - লাল' : 'e.g. 1.0rm - Red'} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddVariantModal(false)} className="btn btn-secondary">{isBn ? 'বাতিল' : 'Cancel'}</button>
                <button type="submit" className="btn btn-primary">{isBn ? 'অপশন সেভ করুন' : 'Save Option'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Single Variation Option */}
      {editingVariant && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>{isBn ? 'ভেরিয়েন্ট অপশন এডিট' : 'Edit Variation Option'}</h3>
              <button onClick={() => setEditingVariant(null)} className="btn btn-secondary btn-sm">✕</button>
            </div>
            <form onSubmit={handleSaveVariantEdit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="form-group">
                  <label className="form-label">{isBn ? 'অপশন নাম / স্পেক' : 'Option Title'}</label>
                  <input
                    type="text"
                    className="input-control"
                    value={editingVariant.variant.spec}
                    onChange={(e) => setEditingVariant({
                      ...editingVariant,
                      variant: { ...editingVariant.variant, spec: e.target.value }
                    })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setEditingVariant(null)} className="btn btn-secondary">{isBn ? 'বাতিল' : 'Cancel'}</button>
                <button type="submit" className="btn btn-primary">{isBn ? 'আপডেট করুন' : 'Update Option'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
