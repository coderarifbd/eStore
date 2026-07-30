import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  FolderPlus, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Search, 
  LayoutGrid, 
  List, 
  Zap, 
  Lightbulb, 
  ToggleRight, 
  ShieldAlert, 
  Fan, 
  Box, 
  Wrench,
  Grid
} from 'lucide-react';

export const Categories = () => {
  const { lang, categories, products, addCategory, deleteCategory, updateCategory } = useStore();
  const isBn = lang === 'bn';

  const [nameBn, setNameBn] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Zap');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Edit category modal state
  const [editingCategory, setEditingCategory] = useState(null);

  const availableIcons = [
    { id: 'Zap', label: '⚡ তার / স্পার্ক (Zap)' },
    { id: 'Lightbulb', label: '💡 লাইট / বাল্ব (Lightbulb)' },
    { id: 'ToggleRight', label: '🔌 সুইচ / সকেট (Toggle)' },
    { id: 'ShieldAlert', label: '🛡️ সার্কিট ব্রেকার (Breaker)' },
    { id: 'Fan', label: '🌀 ফ্যান (Fan)' },
    { id: 'Box', label: '📦 পাইপ / বক্সেস (Box)' },
    { id: 'Wrench', label: '🛠️ টুলস (Wrench)' },
    { id: 'Grid', label: '🔳 গ্যাং বোর্ড (Grid)' }
  ];

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!nameBn.trim()) return;

    addCategory({
      nameBn: nameBn.trim(),
      nameEn: nameEn.trim() || nameBn.trim(),
      icon: selectedIcon
    });

    alert(isBn ? 'নতুন ক্যাটাগরি সফলভাবে যোগ করা হয়েছে!' : 'Category added successfully!');
    setNameBn('');
    setNameEn('');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.nameBn.trim()) return;

    updateCategory(editingCategory.id, {
      nameBn: editingCategory.nameBn.trim(),
      nameEn: editingCategory.nameEn.trim() || editingCategory.nameBn.trim(),
      icon: editingCategory.icon
    });

    alert(isBn ? 'ক্যাটাগরি আপডেট করা হয়েছে!' : 'Category updated successfully!');
    setEditingCategory(null);
  };

  const filteredCategories = categories.filter(c => 
    c.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner & Add Category Form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        
        {/* Left Info Card */}
        <div className="card">
          <div className="card-title" style={{ color: '#06b6d4' }}>
            <FolderPlus size={20} />
            <span>{isBn ? 'ক্যাটাগরি তালিকা ম্যানেজমেন্ট (Category Manager)' : 'Category Manager'}</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1rem' }}>
            {isBn ? 'এখানে ইলেকট্রিক্যাল দোকানের মালামালের ক্যাটাগরি (যেমন: তার, সুইচ, লাইট, ফ্যান) যোগ ও পরিচালনা করুন।' : 'Add and manage custom product categories.'}
          </p>

          <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <input
                type="text"
                required
                className="input-control"
                placeholder={isBn ? 'ক্যাটাগরি নাম (বাংলা)...' : 'Category Name (Bangla)...'}
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
              />
              <input
                type="text"
                className="input-control"
                placeholder={isBn ? 'ক্যাটাগরি নাম (English)...' : 'Category Name (English)...'}
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <select
                className="select-control"
                value={selectedIcon}
                onChange={(e) => setSelectedIcon(e.target.value)}
                style={{ flex: 1 }}
              >
                {availableIcons.map(ico => (
                  <option key={ico.id} value={ico.id}>{ico.label}</option>
                ))}
              </select>

              <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                <PlusCircle size={18} />
                <span>{isBn ? '+ যোগ করুন' : '+ Add Category'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Search & View Mode Switcher */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{isBn ? 'মোট ক্যাটাগরি সংখ্যা:' : 'Total Categories:'}</span>
            
            {/* View Mode Toggle Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#0f172a', padding: '3px', borderRadius: '6px', border: '1px solid #334155' }}>
              <button
                onClick={() => setViewMode('grid')}
                className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 8px' }}
                title={isBn ? 'গ্রিড ভিউ' : 'Grid View'}
              >
                <LayoutGrid size={16} />
                <span>{isBn ? 'গ্রিড' : 'Grid'}</span>
              </button>

              <button
                onClick={() => setViewMode('list')}
                className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 8px' }}
                title={isBn ? 'লিস্ট ভিউ' : 'List View'}
              >
                <List size={16} />
                <span>{isBn ? 'লিস্ট' : 'List'}</span>
              </button>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="input-control"
              placeholder={isBn ? 'ক্যাটাগরি খুঁজুন...' : 'Search category...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

      </div>

      {/* Categories Content Area */}
      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {filteredCategories.map(cat => {
            const catProds = products.filter(p => p.categoryId === cat.id);

            return (
              <div key={cat.id} className="card" style={{ borderLeft: '4px solid #06b6d4', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                      {isBn ? cat.nameBn : cat.nameEn}
                    </h3>
                    <span className="badge badge-cyan">
                      {catProds.length} {isBn ? 'টি পণ্য' : 'Products'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    {cat.nameEn}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #334155' }}>
                  <button
                    onClick={() => setEditingCategory({ ...cat })}
                    className="btn btn-secondary btn-sm"
                  >
                    <Edit3 size={14} />
                    <span>{isBn ? 'এডিট' : 'Edit'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(isBn ? `আপনি কি নিশ্চিত যে "${cat.nameBn}" ক্যাটাগরি মুছে ফেলতে চান?` : `Delete category?`)) {
                        deleteCategory(cat.id);
                      }
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#f43f5e' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{isBn ? 'ক্যাটাগরি নাম (বাংলা)' : 'Category Name (Bn)'}</th>
                  <th>{isBn ? 'ক্যাটাগরি নাম (English)' : 'Category Name (En)'}</th>
                  <th>{isBn ? 'পণ্যের সংখ্যা' : 'Product Count'}</th>
                  <th style={{ textAlign: 'right' }}>{isBn ? 'অ্যাকশন' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat, idx) => {
                  const catProds = products.filter(p => p.categoryId === cat.id);

                  return (
                    <tr key={cat.id}>
                      <td style={{ color: '#64748b' }}>{idx + 1}</td>
                      <td style={{ fontWeight: 700, fontSize: '1.05rem', color: '#06b6d4' }}>
                        {cat.nameBn}
                      </td>
                      <td style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                        {cat.nameEn}
                      </td>
                      <td>
                        <span className="badge badge-purple">{catProds.length} {isBn ? 'টি পণ্য' : 'Products'}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => setEditingCategory({ ...cat })}
                            className="btn btn-secondary btn-sm"
                          >
                            <Edit3 size={14} />
                            <span>{isBn ? 'এডিট' : 'Edit'}</span>
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(isBn ? `আপনি কি নিশ্চিত যে "${cat.nameBn}" ক্যাটাগরি মুছে ফেলতে চান?` : `Delete category?`)) {
                                deleteCategory(cat.id);
                              }
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#f43f5e' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>{isBn ? 'ক্যাটাগরি সংশোধন করুন' : 'Edit Category'}</h3>
              <button onClick={() => setEditingCategory(null)} className="btn btn-secondary btn-sm">✕</button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="form-group">
                  <label className="form-label">{isBn ? 'ক্যাটাগরি নাম (বাংলা)' : 'Category Name (Bn)'}</label>
                  <input
                    type="text"
                    required
                    className="input-control"
                    value={editingCategory.nameBn}
                    onChange={(e) => setEditingCategory({ ...editingCategory, nameBn: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{isBn ? 'ক্যাটাগরি নাম (English)' : 'Category Name (En)'}</label>
                  <input
                    type="text"
                    className="input-control"
                    value={editingCategory.nameEn}
                    onChange={(e) => setEditingCategory({ ...editingCategory, nameEn: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setEditingCategory(null)} className="btn btn-secondary">{isBn ? 'বাতিল' : 'Cancel'}</button>
                <button type="submit" className="btn btn-primary">{isBn ? 'আপডেট করুন' : 'Update Category'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
