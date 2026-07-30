import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Tag, PlusCircle, Edit3, Trash2, Search, LayoutGrid, List } from 'lucide-react';

export const Brands = ({ setActiveTab }) => {
  const { lang, brands, products, addBrand, deleteBrand, updateBrand } = useStore();
  const isBn = lang === 'bn';

  const [newBrandName, setNewBrandName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Edit brand modal state
  const [editingBrand, setEditingBrand] = useState(null);
  const [editedName, setEditedName] = useState('');

  const handleAddBrand = (e) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;

    const added = addBrand(newBrandName.trim());
    if (added) {
      alert(isBn ? 'নতুন ব্র্যান্ড সফলভাবে যোগ করা হয়েছে!' : 'Brand added successfully!');
      setNewBrandName('');
    } else {
      alert(isBn ? 'এই ব্র্যান্ডটি আগেই তালিকায় রয়েছে!' : 'This brand already exists!');
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingBrand || !editedName.trim()) return;

    const success = updateBrand(editingBrand, editedName.trim());
    if (success) {
      alert(isBn ? 'ব্র্যান্ডের নাম আপডেট করা হয়েছে!' : 'Brand renamed successfully!');
      setEditingBrand(null);
    } else {
      alert(isBn ? 'ব্র্যান্ড নাম পরিবর্তন করা সম্ভব হয়নি বা নামটি অন্য ব্র্যান্ডে বিদ্যমান!' : 'Could not rename brand!');
    }
  };

  const filteredBrands = brands.filter(b => b.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner & Add Brand Form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        
        {/* Left Info Card */}
        <div className="card">
          <div className="card-title" style={{ color: '#8b5cf6' }}>
            <Tag size={20} />
            <span>{isBn ? 'ব্র্যান্ড তালিকা ম্যানেজমেন্ট (Brand Manager)' : 'Brand Manager'}</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1rem' }}>
            {isBn ? 'এখানে আপনার দোকানে ব্যবহৃত সকল কোম্পানির ব্র্যান্ডের নাম ম্যানুয়ালি যোগ করুন। নতুন পণ্য যোগ করার সময় সিলেক্ট করা যাবে।' : 'Add and manage electrical brand names for product dropdowns.'}
          </p>

          <form onSubmit={handleAddBrand} style={{ display: 'flex', gap: '0.65rem' }}>
            <input
              type="text"
              required
              className="input-control"
              placeholder={isBn ? 'নতুন ব্র্যান্ড নাম লিখুন (যেমন: BRB, Partex, Vision)...' : 'Type brand name (e.g. BRB, Walton)...'}
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
              <PlusCircle size={18} />
              <span>{isBn ? '+ ব্র্যান্ড যোগ' : '+ Add Brand'}</span>
            </button>
          </form>
        </div>

        {/* Right Search & View Mode Switcher */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{isBn ? 'মোট ব্র্যান্ড সংখ্যা:' : 'Total Registered Brands:'}</span>
            
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
              placeholder={isBn ? 'ব্র্যান্ড নাম খুঁজুন...' : 'Search brand...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

      </div>

      {/* Brands Content Area: Grid View vs List View */}
      {viewMode === 'grid' ? (
        /* GRID VIEW */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {filteredBrands.map(bName => {
            const brandProds = products.filter(p => p.brand === bName);
            const totalVariants = brandProds.reduce((acc, p) => acc + p.variants.length, 0);

            return (
              <div key={bName} className="card" style={{ borderLeft: '4px solid #8b5cf6', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                      {bName}
                    </h3>
                    <span className="badge badge-purple">
                      {brandProds.length} {isBn ? 'টি পণ্য' : 'Products'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    {isBn ? `মোট ভেরিয়েন্ট সাইজ: ${totalVariants} টি` : `Total Variants: ${totalVariants}`}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #334155' }}>
                  <button
                    onClick={() => {
                      setEditingBrand(bName);
                      setEditedName(bName);
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    <Edit3 size={14} />
                    <span>{isBn ? 'এডিট' : 'Edit'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(isBn ? `আপনি কি নিশ্চিত যে "${bName}" ব্র্যান্ডটি মুছে ফেলতে চান?` : `Delete brand "${bName}"?`)) {
                        deleteBrand(bName);
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
        /* LIST TABLE VIEW */
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{isBn ? 'ব্র্যান্ড নাম (Brand Name)' : 'Brand Name'}</th>
                  <th>{isBn ? 'পণ্যের সংখ্যা' : 'Product Count'}</th>
                  <th>{isBn ? 'মোট ভেরিয়েন্ট' : 'Total Variants'}</th>
                  <th style={{ textAlign: 'right' }}>{isBn ? 'অ্যাকশন' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredBrands.map((bName, idx) => {
                  const brandProds = products.filter(p => p.brand === bName);
                  const totalVariants = brandProds.reduce((acc, p) => acc + p.variants.length, 0);

                  return (
                    <tr key={bName}>
                      <td style={{ color: '#64748b' }}>{idx + 1}</td>
                      <td style={{ fontWeight: 700, fontSize: '1.05rem', color: '#8b5cf6' }}>
                        {bName}
                      </td>
                      <td>
                        <span className="badge badge-cyan">{brandProds.length} {isBn ? 'টি পণ্য' : 'Products'}</span>
                      </td>
                      <td style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                        {totalVariants} {isBn ? 'টি সাইজ/ওয়াট' : 'Variants'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => {
                              setEditingBrand(bName);
                              setEditedName(bName);
                            }}
                            className="btn btn-secondary btn-sm"
                          >
                            <Edit3 size={14} />
                            <span>{isBn ? 'এডিট' : 'Edit'}</span>
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(isBn ? `আপনি কি নিশ্চিত যে "${bName}" ব্র্যান্ডটি মুছে ফেলতে চান?` : `Delete brand "${bName}"?`)) {
                                deleteBrand(bName);
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

      {/* Edit Brand Modal */}
      {editingBrand && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>{isBn ? 'ব্র্যান্ডের নাম সংশোধন করুন' : 'Edit Brand Name'}</h3>
              <button onClick={() => setEditingBrand(null)} className="btn btn-secondary btn-sm">✕</button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">{isBn ? 'ব্র্যান্ড নাম' : 'Brand Name'}</label>
                  <input
                    type="text"
                    required
                    className="input-control"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setEditingBrand(null)} className="btn btn-secondary">{isBn ? 'বাতিল' : 'Cancel'}</button>
                <button type="submit" className="btn btn-primary">{isBn ? 'আপডেট করুন' : 'Update Brand'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
