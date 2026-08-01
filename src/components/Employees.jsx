import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Users, PlusCircle, DollarSign, Calendar, Printer, CheckCircle, HandCoins, Edit3, Trash2 } from 'lucide-react';

export const Employees = () => {
  const { lang, employees, salaryTx, addEmployee, updateEmployee, deleteEmployee, addSalaryTransaction, setPrintDoc, showConfirm } = useStore();
  const isBn = lang === 'bn';

  // Modals
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [showPaySalaryModal, setShowPaySalaryModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);

  // New Employee Form
  const [empName, setEmpName] = useState('');
  const [empPhone, setEmpPhone] = useState('');
  const [empDesignation, setEmpDesignation] = useState('সেলস এক্সিকিউটিভ');
  const [empSalary, setEmpSalary] = useState(15000);

  // Pay Salary Form
  const [payType, setPayType] = useState('Salary Payment'); // 'Salary Payment' or 'Advance'
  const [monthYear, setMonthYear] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [payDate, setPayDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [payAmount, setPayAmount] = useState('');
  const [payNotes, setPayNotes] = useState('');

  // Edit Employee State
  const [showEditEmpModal, setShowEditEmpModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  const [editEmpName, setEditEmpName] = useState('');
  const [editEmpPhone, setEditEmpPhone] = useState('');
  const [editEmpDesignation, setEditEmpDesignation] = useState('');
  const [editEmpSalary, setEditEmpSalary] = useState('');
  const [editEmpStatus, setEditEmpStatus] = useState('Active');

  const handleStartEditEmployee = (emp) => {
    setEditingEmp(emp);
    setEditEmpName(emp.name);
    setEditEmpPhone(emp.phone || '');
    setEditEmpDesignation(emp.designation || '');
    setEditEmpSalary(emp.monthlySalary || 0);
    setEditEmpStatus(emp.status || 'Active');
    setShowEditEmpModal(true);
  };

  const handleUpdateEmployee = (e) => {
    e.preventDefault();
    if (!editingEmp || !editEmpName) return;

    updateEmployee(editingEmp.id, {
      name: editEmpName,
      phone: editEmpPhone,
      designation: editEmpDesignation,
      monthlySalary: Number(editEmpSalary),
      status: editEmpStatus
    });

    alert(isBn ? 'কর্মচারী তথ্য সফলভাবে আপডেট করা হয়েছে!' : 'Employee updated!');
    setShowEditEmpModal(false);
    setEditingEmp(null);
  };

  const handleCreateEmployee = (e) => {
    e.preventDefault();
    if (!empName) return;

    addEmployee({
      name: empName,
      phone: empPhone,
      designation: empDesignation,
      monthlySalary: Number(empSalary),
      joinDate: new Date().toISOString().split('T')[0]
    });

    alert(isBn ? 'কর্মচারী সফলভাবে যোগ করা হয়েছে!' : 'Employee added!');
    setShowAddEmpModal(false);
    setEmpName('');
    setEmpPhone('');
  };

  const handleDisburseSalary = (e) => {
    e.preventDefault();
    if (!selectedEmp || !payAmount) return;

    const payload = {
      employeeId: selectedEmp.id,
      employeeName: selectedEmp.name,
      monthYear,
      type: payType,
      amount: Number(payAmount),
      date: payDate,
      notes: payNotes || (payType === 'Advance' ? (isBn ? 'অগ্রিম বেতন গ্রহণ' : 'Advance Salary') : (isBn ? 'মাসিক বেতন প্রদান' : 'Monthly Salary Payment'))
    };

    const salRecord = addSalaryTransaction(payload);
    alert(isBn ? 'বেতন/অগ্রিম হিসাব জমা হয়েছে!' : 'Salary payment recorded!');
    setShowPaySalaryModal(false);
    setPayAmount('');
    setPayNotes('');
    const today = new Date();
    setPayDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);

    // Trigger Print Payslip
    setPrintDoc({ type: 'salary', data: { ...salRecord, designation: selectedEmp.designation } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users color="#06b6d4" />
            <span>{isBn ? 'কর্মচারী ও বেতন হিসাব (Payroll & Staff Management)' : 'Employee & Payroll'}</span>
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            {isBn ? 'দোকানের কর্মচারীদের তালিকা, মাসিক নির্দিষ্ট বেতন, অগ্রিম গ্রহণ ও পে-স্লিপ তৈরি করুন' : 'Manage staff salaries, advance payouts and print payslips'}
          </p>
        </div>

        <button onClick={() => setShowAddEmpModal(true)} className="btn btn-primary">
          <PlusCircle size={18} />
          <span>{isBn ? '+ নতুন কর্মচারী যোগ করুন' : '+ Add Employee'}</span>
        </button>
      </div>

      {/* Employee Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {employees.map(emp => {
          // Calculate advance paid & salary paid for selected month
          const empTxs = salaryTx.filter(tx => tx.employeeId === emp.id);
          const totalPaid = empTxs.reduce((acc, curr) => acc + (curr.amount || 0), 0);

          return (
            <div key={emp.id} className="card" style={{ borderLeft: '4px solid #06b6d4' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>{emp.name}</h3>
                  <div style={{ fontSize: '0.825rem', color: '#06b6d4', fontWeight: 600 }}>{emp.designation}</div>
                  <div style={{ fontSize: '0.775rem', color: '#94a3b8', marginTop: '2px' }}>📱 {emp.phone}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                  <span className={`badge ${emp.status === 'Inactive' ? 'badge-amber' : 'badge-green'}`}>
                    {emp.status === 'Inactive' ? (isBn ? 'নিষ্ক্রিয়' : 'Inactive') : (isBn ? 'সক্রিয়' : 'Active')}
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => handleStartEditEmployee(emp)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.25rem 0.4rem' }}
                      title={isBn ? 'কর্মচারী এডিট করুন' : 'Edit Employee'}
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={async () => {
                        const confirmed = await showConfirm({
                          title: isBn ? 'কর্মচারী মুছে ফেলা' : 'Delete Employee',
                          message: isBn ? `আপনি কি নিশ্চিত যে কর্মচারী ${emp.name} কে মুছে ফেলতে চান?` : `Are you sure you want to delete employee ${emp.name}?`,
                          type: 'danger',
                          confirmText: isBn ? 'হ্যাঁ, ডিলিট করুন' : 'Delete'
                        });
                        if (confirmed) {
                          deleteEmployee(emp.id);
                        }
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.25rem 0.4rem', color: '#f43f5e' }}
                      title={isBn ? 'কর্মচারী মুছুন' : 'Delete Employee'}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>

              <div style={{
                padding: '0.75rem',
                backgroundColor: '#0f172a',
                borderRadius: '8px',
                margin: '0.75rem 0',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.775rem', color: '#94a3b8' }}>{isBn ? 'মাসিক নির্ধারিত বেতন:' : 'Monthly Base Salary:'}</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#10b981' }}>৳{emp.monthlySalary.toLocaleString('en-BD')}</div>
                </div>

                <button
                  onClick={() => {
                    setSelectedEmp(emp);
                    setShowPaySalaryModal(true);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  <HandCoins size={15} />
                  <span>{isBn ? 'বেতন / অগ্রিম প্রদান' : 'Pay Salary'}</span>
                </button>
              </div>

              {/* Recent Salary History for Employee */}
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                <strong>{isBn ? 'সর্বশেষ লেনদেনসমূহ:' : 'Recent Salary Transactions:'}</strong>
                <div style={{ marginTop: '0.35rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {empTxs.slice(0, 3).map(tx => (
                    <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem' }}>
                      <span>{tx.date} ({tx.type === 'Advance' ? (isBn ? 'অগ্রিম' : 'Advance') : (isBn ? 'বেতন' : 'Salary')})</span>
                      <span style={{ fontWeight: 600, color: '#f8fafc' }}>৳{tx.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Salary Transactions Log Table */}
      <div className="card">
        <div className="card-title">
          <DollarSign size={20} color="#10b981" />
          <span>{isBn ? 'বেতন ও অগ্রিম প্রদানের রেকর্ড খাতা (Salary Transactions)' : 'Salary Log'}</span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{isBn ? 'তারিখ' : 'Date'}</th>
                <th>{isBn ? 'কর্মচারীর নাম' : 'Employee'}</th>
                <th>{isBn ? 'মাস' : 'Month'}</th>
                <th>{isBn ? 'ধরন' : 'Type'}</th>
                <th>{isBn ? 'বিবরণ' : 'Notes'}</th>
                <th>{isBn ? 'টাকার পরিমাণ' : 'Amount'}</th>
                <th style={{ textAlign: 'right' }}>{isBn ? 'পে-স্লিপ' : 'Slip'}</th>
              </tr>
            </thead>
            <tbody>
              {salaryTx.map(st => (
                <tr key={st.id}>
                  <td style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{st.date}</td>
                  <td style={{ fontWeight: 600 }}>{st.employeeName}</td>
                  <td><span className="badge badge-purple">{st.monthYear}</span></td>
                  <td>
                    {st.type === 'Advance' ? (
                      <span className="badge badge-amber">{isBn ? 'অগ্রিম গ্রহণ' : 'Advance'}</span>
                    ) : (
                      <span className="badge badge-green">{isBn ? 'বেতন পরিশোধ' : 'Salary'}</span>
                    )}
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{st.notes}</td>
                  <td style={{ fontWeight: 700, color: '#10b981' }}>৳{st.amount.toLocaleString('en-BD')}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => setPrintDoc({ type: 'salary', data: st })}
                      className="btn btn-secondary btn-sm"
                      title="পে-স্লিপ প্রিন্ট করুন"
                    >
                      <Printer size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Employee */}
      {showAddEmpModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{isBn ? 'নতুন কর্মচারী যোগ করুন' : 'Add New Employee'}</h3>
              <button onClick={() => setShowAddEmpModal(false)} className="btn btn-secondary btn-sm">✕</button>
            </div>
            <form onSubmit={handleCreateEmployee}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="form-group">
                  <label className="form-label">{isBn ? 'কর্মচারীর নাম' : 'Employee Name'}</label>
                  <input type="text" required className="input-control" value={empName} onChange={(e) => setEmpName(e.target.value)} placeholder="e.g. মোঃ রফিকুল ইসলাম" />
                </div>
                <div className="form-group">
                  <label className="form-label">{isBn ? 'পদবী / দায়িত্ব' : 'Designation'}</label>
                  <input type="text" className="input-control" value={empDesignation} onChange={(e) => setEmpDesignation(e.target.value)} placeholder="e.g. সেলস এক্সিকিউটিভ / হেলপার" />
                </div>
                <div className="form-group">
                  <label className="form-label">{isBn ? 'মোবাইল নম্বর' : 'Phone Number'}</label>
                  <input type="text" className="input-control" value={empPhone} onChange={(e) => setEmpPhone(e.target.value)} placeholder="017........" />
                </div>
                <div className="form-group">
                  <label className="form-label">{isBn ? 'মাসিক নির্ধারিত বেতন (৳)' : 'Monthly Salary ৳'}</label>
                  <input type="number" required className="input-control" value={empSalary} onChange={(e) => setEmpSalary(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddEmpModal(false)} className="btn btn-secondary">{isBn ? 'বাতিল' : 'Cancel'}</button>
                <button type="submit" className="btn btn-primary">{isBn ? 'সংরক্ষণ করুন' : 'Save Employee'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Pay Salary or Advance */}
      {showPaySalaryModal && selectedEmp && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedEmp.name} - {isBn ? 'বেতন / অগ্রিম প্রদান' : 'Pay Salary / Advance'}</h3>
              <button onClick={() => setShowPaySalaryModal(false)} className="btn btn-secondary btn-sm">✕</button>
            </div>
            <form onSubmit={handleDisburseSalary}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="form-group">
                  <label className="form-label">{isBn ? 'পেমেন্ট এর ধরন' : 'Payment Type'}</label>
                  <select className="select-control" value={payType} onChange={(e) => setPayType(e.target.value)}>
                    <option value="Salary Payment">{isBn ? 'মাসিক বেতন পরিশোধ (Full/Partial Salary)' : 'Salary Payment'}</option>
                    <option value="Advance">{isBn ? 'অগ্রিম গ্রহণ (Advance Salary)' : 'Advance'}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{isBn ? 'কোন মাসের বেতন' : 'Month'}</label>
                  <input 
                    type="month" 
                    className="input-control" 
                    value={monthYear} 
                    onChange={(e) => setMonthYear(e.target.value)} 
                    onClick={(e) => { try { e.target.showPicker(); } catch(err){} }}
                    style={{ cursor: 'pointer' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{isBn ? 'পেমেন্ট প্রদানের তারিখ' : 'Payment Date'}</label>
                  <input 
                    type="date" 
                    className="input-control" 
                    value={payDate} 
                    onChange={(e) => setPayDate(e.target.value)} 
                    onClick={(e) => { try { e.target.showPicker(); } catch(err){} }}
                    style={{ cursor: 'pointer' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{isBn ? 'প্রদেয় টাকার পরিমাণ (৳)' : 'Amount ৳'}</label>
                  <input type="number" required className="input-control" placeholder={`মাসিক বেতন: ৳${selectedEmp.monthlySalary}`} value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">{isBn ? 'বিবরণ / মন্তব্য' : 'Notes'}</label>
                  <input type="text" className="input-control" placeholder={isBn ? 'যেমন: ঈদ বোনাস বা অগ্রিম সমন্নয়' : 'Notes'} value={payNotes} onChange={(e) => setPayNotes(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowPaySalaryModal(false)} className="btn btn-secondary">{isBn ? 'বাতিল' : 'Cancel'}</button>
                <button type="submit" className="btn btn-primary">{isBn ? 'পরিশোধ ও পে-স্লিপ প্রিন্ট' : 'Pay & Print Slip'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Employee */}
      {showEditEmpModal && editingEmp && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{isBn ? 'কর্মচারী তথ্য এডিট করুন' : 'Edit Employee'}</h3>
              <button onClick={() => setShowEditEmpModal(false)} className="btn btn-secondary btn-sm">✕</button>
            </div>
            <form onSubmit={handleUpdateEmployee}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="form-group">
                  <label className="form-label">{isBn ? 'কর্মচারীর নাম' : 'Employee Name'}</label>
                  <input type="text" required className="input-control" value={editEmpName} onChange={(e) => setEditEmpName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">{isBn ? 'পদবী / দায়িত্ব' : 'Designation'}</label>
                  <input type="text" className="input-control" value={editEmpDesignation} onChange={(e) => setEditEmpDesignation(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">{isBn ? 'মোবাইল নম্বর' : 'Phone Number'}</label>
                  <input type="text" className="input-control" value={editEmpPhone} onChange={(e) => setEditEmpPhone(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">{isBn ? 'মাসিক নির্ধারিত বেতন (৳)' : 'Monthly Salary ৳'}</label>
                  <input type="number" required className="input-control" value={editEmpSalary} onChange={(e) => setEditEmpSalary(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">{isBn ? 'অবস্থা' : 'Status'}</label>
                  <select className="select-control" value={editEmpStatus} onChange={(e) => setEditEmpStatus(e.target.value)}>
                    <option value="Active">{isBn ? 'সক্রিয় (Active)' : 'Active'}</option>
                    <option value="Inactive">{isBn ? 'নিষ্ক্রিয় (Inactive)' : 'Inactive'}</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowEditEmpModal(false)} className="btn btn-secondary">{isBn ? 'বাতিল' : 'Cancel'}</button>
                <button type="submit" className="btn btn-primary">{isBn ? 'আপডেট করুন' : 'Update'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
