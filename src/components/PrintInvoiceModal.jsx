import React from 'react';
import { useStore } from '../context/StoreContext';
import { Printer, X, Zap } from 'lucide-react';

export const PrintInvoiceModal = () => {
  const { lang, printDoc, setPrintDoc } = useStore();
  const isBn = lang === 'bn';

  if (!printDoc) return null;

  const { type, data } = printDoc;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay no-print">
      <div className="modal-content" style={{ maxWidth: '700px', backgroundColor: '#ffffff', color: '#000000' }}>
        
        {/* Modal Controls Header: Title (Left), Print Button (Middle), Close X (Far Right) */}
        <div className="modal-header no-print" style={{ 
          backgroundColor: '#1e293b', 
          color: '#ffffff', 
          display: 'grid', 
          gridTemplateColumns: '1fr auto 1fr', 
          alignItems: 'center', 
          padding: '0.85rem 1.25rem' 
        }}>
          {/* Left Title */}
          <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>
            {type === 'sale' ? (isBn ? 'ক্যাশ মেমো প্রিভিউ' : 'Cash Memo Preview') : (isBn ? 'বেতন পে-স্লিপ প্রিভিউ' : 'Payslip Preview')}
          </h3>

          {/* Middle Centered Print Button */}
          <div style={{ textAlign: 'center' }}>
            <button onClick={handlePrint} className="btn btn-primary btn-sm" style={{ padding: '0.4rem 1rem' }}>
              <Printer size={15} />
              <span>{isBn ? 'প্রিন্ট / PDF সেভ' : 'Print / Save PDF'}</span>
            </button>
          </div>

          {/* Far Right Close Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setPrintDoc(null)} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.5rem' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Paper Layout */}
        <div className="modal-body printable-area" style={{ padding: '2rem', fontFamily: "'Hind Siliguri', 'Inter', sans-serif" }}>
          
          {/* Shop Header with Fardin Electrical Store Credentials */}
          <div style={{ textAlignment: 'center', textAlign: 'center', borderBottom: '2px solid #000000', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Zap size={28} color="#000000" fill="#000000" />
              <h1 style={{ fontSize: '1.7rem', fontWeight: 800, margin: 0, letterSpacing: '0.5px' }}>
                ফারদিন ইলেকট্রিক স্টোর
              </h1>
            </div>
            <p style={{ fontSize: '0.85rem', margin: 0, color: '#333333' }}>
              সকল প্রকার উচ্চমানের বিআরবি ক্যাবল, সুইচ-সকেট, এলইড লাইট, সার্কিট ব্রেকার ও পাইপ খুচরা ও পাইকারী বিক্রেতা
            </p>
            <p style={{ fontSize: '0.9rem', margin: '4px 0 0 0', fontWeight: 700 }}>
              পুনট বাজার, কালাই, জয়পুরহাট • মোবাইলঃ ০১৭২৩৭৫৭১৭৬
            </p>
          </div>

          {/* Document Title Badge */}
          <div style={{ textAlignment: 'center', textAlign: 'center', marginBottom: '1.25rem' }}>
            <span style={{
              display: 'inline-block',
              padding: '0.25rem 1.25rem',
              border: '1px solid #000000',
              fontWeight: 700,
              fontSize: '1rem',
              borderRadius: '4px',
              backgroundColor: '#f1f5f9'
            }}>
              {type === 'sale' ? 'ক্যাশ মেমো / INVOICE' : 'বেতন প্রদেয় স্লিপ / PAYSLIP'}
            </span>
          </div>

          {/* Sale Memo Details */}
          {type === 'sale' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.875rem' }}>
                <div>
                  <div><strong>গ্রাহকের নাম:</strong> {data.customerName || 'সাধারণ গ্রাহক'}</div>
                  <div><strong>মোবাইল:</strong> {data.customerPhone || 'N/A'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div><strong>মেমো নং:</strong> {data.id}</div>
                  <div><strong>তারিখ:</strong> {data.date}</div>
                </div>
              </div>

              {/* Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', borderTop: '1px solid #000', borderBottom: '1px solid #000' }}>
                    <th style={{ padding: '6px', textAlign: 'left' }}>ক্রঃ</th>
                    <th style={{ padding: '6px', textAlign: 'left' }}>পণ্যের বিবরণ ও ভেরিয়েন্ট সাইজ</th>
                    <th style={{ padding: '6px', textAlign: 'center' }}>পরিমাণ</th>
                    <th style={{ padding: '6px', textAlign: 'right' }}>দর (৳)</th>
                    <th style={{ padding: '6px', textAlign: 'right' }}>মোট (৳)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items?.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '6px' }}>{idx + 1}</td>
                      <td style={{ padding: '6px' }}>
                        <strong>{item.productName}</strong> - {item.spec} ({item.brand})
                      </td>
                      <td style={{ padding: '6px', textAlign: 'center' }}>{item.quantity} {item.unit === 'Goj' ? 'গজ' : item.unit}</td>
                      <td style={{ padding: '6px', textAlign: 'right' }}>৳{item.unitPrice}</td>
                      <td style={{ padding: '6px', textAlign: 'right', fontWeight: 600 }}>৳{item.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                <div style={{ width: '240px', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>সাব-টোটাল:</span>
                    <span>৳{data.subtotal}</span>
                  </div>
                  {data.discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>বিশেষ ছাড়:</span>
                      <span>- ৳{data.discount}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px solid #000', paddingTop: '4px' }}>
                    <span>সর্বমোট বিল:</span>
                    <span>৳{data.grandTotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>জমা (Paid):</span>
                    <span>৳{data.paidAmount}</span>
                  </div>
                  {data.dueAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626', fontWeight: 700 }}>
                      <span>বাকি (Due):</span>
                      <span>৳{data.dueAmount}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Salary Payslip Details */}
          {type === 'salary' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                <div>
                  <div><strong>কর্মচারীর নাম:</strong> {data.employeeName}</div>
                  <div><strong>পদবী:</strong> {data.designation || 'স্টাফ'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div><strong>ভাউচার আইডি:</strong> {data.id}</div>
                  <div><strong>তারিখ:</strong> {data.date}</div>
                  <div><strong>মাস:</strong> {data.monthYear}</div>
                </div>
              </div>

              <div style={{ padding: '1rem', border: '1px solid #000', borderRadius: '6px', marginBottom: '1.5rem', backgroundColor: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>পেমেন্ট বিবরণ:</span>
                  <strong>{data.type === 'Advance' ? 'বেতন অগ্রিম (Advance)' : 'মাসিক বেতন পরিশোধ (Salary Payment)'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', borderTop: '1px dashed #000', paddingTop: '0.5rem' }}>
                  <span>পরিশোধিত টাকা:</span>
                  <span>৳{data.amount?.toLocaleString('en-BD')}</span>
                </div>
                {data.notes && (
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.5rem' }}>
                    মন্তব্য: {data.notes}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Signatures */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '1rem', borderTop: '1px dashed #cbd5e1', fontSize: '0.85rem' }}>
            <div>
              <div style={{ borderTop: '1px solid #000', width: '140px', textAlign: 'center', paddingTop: '4px' }}>
                গ্রাহকের স্বাক্ষর
              </div>
            </div>
            <div>
              <div style={{ borderTop: '1px solid #000', width: '160px', textAlign: 'center', paddingTop: '4px' }}>
                ক্যাশিয়ার / কর্তৃপক্ষ স্বাক্ষর
              </div>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#64748b', marginTop: '1.5rem' }}>
            *** ক্রিত মালামাল ৭ দিনের মধ্যে ক্যাশ মেমো সহ ফেরতযোগ্য। ধন্যবাদ আবার আসবেন! ***
          </p>

        </div>
      </div>
    </div>
  );
};
