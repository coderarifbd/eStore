import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Receipt, PlusCircle, Calendar, DollarSign, Tag } from 'lucide-react';

export const Expenses = () => {
  const { lang, expenses, addExpense } = useStore();
  const isBn = lang === 'bn';

  const [category, setCategory] = useState('দোকান ভাড়া (Shop Rent)');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [paidBy, setPaidBy] = useState('ক্যাশ');

  const [selectedDate, setSelectedDate] = useState('');

  const expenseCategories = [
    'দোকান ভাড়া (Shop Rent)',
    'বিদ্যুৎ বিল (Electricity Bill)',
    'চা-নাস্তা ও স্ন্যাক্স (Tea & Snacks)',
    'পরিবহন খরচ (Transport)',
    'মেরামত ও মেইনটেন্যান্স (Maintenance)',
    'অন্যান্য ব্যয় (Miscellaneous)'
  ];

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    addExpense({
      category,
      amount: Number(amount),
      date,
      notes: notes || (isBn ? 'দোকানের সাধারণ ব্যয়' : 'General Shop Expense'),
      paidBy
    });

    alert(isBn ? 'ব্যয় সফলভাবে এন্ট্রি হয়েছে!' : 'Expense recorded successfully!');
    setAmount('');
    setNotes('');
  };

  const filteredExpenses = expenses.filter(exp => {
    if (!selectedDate) return true;
    return exp.date === selectedDate;
  });

  const totalExpenseAmount = filteredExpenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
      
      {/* Left Column: Log New Expense Form */}
      <div className="card">
        <div className="card-title" style={{ color: '#f43f5e' }}>
          <Receipt size={20} />
          <span>{isBn ? 'নতুন দোকান ব্যয় লিখুন (Add Expense)' : 'Log New Expense'}</span>
        </div>

        <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div className="form-group">
            <label className="form-label">{isBn ? 'ব্যয়ের ক্যাটাগরি' : 'Category'}</label>
            <select className="select-control" value={category} onChange={(e) => setCategory(e.target.value)}>
              {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{isBn ? 'টাকার পরিমাণ (Amount ৳)' : 'Amount ৳'}</label>
            <input
              type="number"
              required
              className="input-control"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{isBn ? 'তারিখ' : 'Date'}</label>
            <input
              type="date"
              required
              className="input-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onClick={(e) => { try { e.target.showPicker(); } catch(err){} }}
              style={{ cursor: 'pointer' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{isBn ? 'পেমেন্ট মাধ্যম' : 'Payment Mode'}</label>
            <select className="select-control" value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
              <option value="ক্যাশ">ক্যাশ (Cash)</option>
              <option value="bKash">বিকাশ (bKash)</option>
              <option value="ব্যাংক">ব্যাংক (Bank)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{isBn ? 'বিবরণ / নোট (Notes)' : 'Notes'}</label>
            <input
              type="text"
              className="input-control"
              placeholder={isBn ? 'যেমন: জুন মাসের বিদ্যুৎ বিল' : 'Notes'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-danger btn-lg" style={{ width: '100%', marginTop: '0.5rem' }}>
            <PlusCircle size={18} />
            <span>{isBn ? 'ব্যয় সংরক্ষণ করুন' : 'Record Expense'}</span>
          </button>
        </form>
      </div>

      {/* Right Column: Expenses History List */}
      <div className="card">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div className="card-title" style={{ marginBottom: 0 }}>
            <span>{isBn ? 'ব্যয়ের খাতা (Expenses Log)' : 'Expenses Log'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="date"
              className="input-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              onClick={(e) => { try { e.target.showPicker(); } catch(err){} }}
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.85rem', width: 'auto', cursor: 'pointer' }}
            />
            {selectedDate && (
              <button onClick={() => setSelectedDate('')} className="btn btn-secondary btn-sm">✕</button>
            )}
          </div>
        </div>

        {/* Total Summary */}
        <div style={{
          padding: '0.75rem 1rem',
          backgroundColor: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <span style={{ fontWeight: 600, color: '#94a3b8' }}>
            {isBn ? 'সর্বমোট নির্বাচিত ব্যয়:' : 'Total Selected Expenses:'}
          </span>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f43f5e' }}>
            ৳{totalExpenseAmount.toLocaleString('en-BD')}
          </span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{isBn ? 'তারিখ' : 'Date'}</th>
                <th>{isBn ? 'ক্যাটাগরি' : 'Category'}</th>
                <th>{isBn ? 'বিবরণ' : 'Notes'}</th>
                <th>{isBn ? 'মাধ্যম' : 'Mode'}</th>
                <th style={{ textAlign: 'right' }}>{isBn ? 'পরিমাণ' : 'Amount'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map(exp => (
                <tr key={exp.id}>
                  <td style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{exp.date}</td>
                  <td>
                    <span className="badge badge-rose">{exp.category}</span>
                  </td>
                  <td style={{ fontSize: '0.875rem' }}>{exp.notes}</td>
                  <td style={{ fontSize: '0.8rem', color: '#06b6d4' }}>{exp.paidBy || 'ক্যাশ'}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: '#f43f5e' }}>
                    ৳{exp.amount.toLocaleString('en-BD')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
