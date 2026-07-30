import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Trash2, KeyRound, Shield, ShieldCheck, AlertCircle } from 'lucide-react';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', name: '', role: 'staff' });
  const [changePassUser, setChangePassUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const token = localStorage.getItem('estore_token');
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users', { headers });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const addUser = async () => {
    if (!newUser.username.trim() || !newUser.password.trim()) {
      showMsg('error', 'ইউজারনেম ও পাসওয়ার্ড আবশ্যক');
      return;
    }
    try {
      const res = await fetch('/api/users', {
        method: 'POST', headers,
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      if (res.ok) {
        showMsg('success', 'ইউজার তৈরি হয়েছে');
        setNewUser({ username: '', password: '', name: '', role: 'staff' });
        setShowAddForm(false);
        fetchUsers();
      } else {
        showMsg('error', data.error);
      }
    } catch { showMsg('error', 'সার্ভার এরর'); }
  };

  const deleteUser = async (username) => {
    if (!window.confirm(`"${username}" ইউজারকে মুছে ফেলতে চান?`)) return;
    try {
      const res = await fetch('/api/users', {
        method: 'DELETE', headers,
        body: JSON.stringify({ username })
      });
      if (res.ok) {
        showMsg('success', 'ইউজার মুছে ফেলা হয়েছে');
        fetchUsers();
      } else {
        const data = await res.json();
        showMsg('error', data.error);
      }
    } catch { showMsg('error', 'সার্ভার এরর'); }
  };

  const changePassword = async () => {
    if (!newPassword.trim()) {
      showMsg('error', 'নতুন পাসওয়ার্ড দিন');
      return;
    }
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH', headers,
        body: JSON.stringify({ username: changePassUser, newPassword })
      });
      if (res.ok) {
        showMsg('success', 'পাসওয়ার্ড পরিবর্তন হয়েছে');
        setChangePassUser(null);
        setNewPassword('');
      } else {
        const data = await res.json();
        showMsg('error', data.error);
      }
    } catch { showMsg('error', 'সার্ভার এরর'); }
  };

  const inputStyle = {
    padding: '0.6rem 0.75rem',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid #334155',
    borderRadius: '8px',
    color: '#f8fafc',
    fontSize: '0.9rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={22} style={{ color: '#06b6d4' }} />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>ইউজার ম্যানেজমেন্ট</h2>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          <UserPlus size={16} />
          নতুন ইউজার
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.75rem 1rem',
          backgroundColor: message.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
          border: `1px solid ${message.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
          borderRadius: '10px',
          marginBottom: '1rem',
          color: message.type === 'error' ? '#f87171' : '#4ade80',
          fontSize: '0.875rem'
        }}>
          <AlertCircle size={16} />
          {message.text}
        </div>
      )}

      {/* Add User Form */}
      {showAddForm && (
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem', borderLeft: '4px solid #06b6d4' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>নতুন ইউজার তৈরি করুন</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.3rem' }}>ইউজারনেম *</label>
              <input style={inputStyle} value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} placeholder="username" />
            </div>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.3rem' }}>পাসওয়ার্ড *</label>
              <input style={inputStyle} type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} placeholder="password" />
            </div>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.3rem' }}>নাম</label>
              <input style={inputStyle} value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} placeholder="কর্মচারীর নাম" />
            </div>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.3rem' }}>রোল</label>
              <select
                style={{ ...inputStyle, cursor: 'pointer' }}
                value={newUser.role}
                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="staff">কর্মচারী (Staff)</option>
                <option value="admin">মালিক (Admin)</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={addUser} style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}>
              তৈরি করুন
            </button>
            <button className="btn btn-secondary" onClick={() => setShowAddForm(false)} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              বাতিল
            </button>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {changePassUser && (
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem' }}>
            <KeyRound size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
            "{changePassUser}" এর পাসওয়ার্ড পরিবর্তন
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.3rem' }}>নতুন পাসওয়ার্ড</label>
              <input style={inputStyle} type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="নতুন পাসওয়ার্ড" />
            </div>
            <button className="btn btn-primary" onClick={changePassword} style={{ fontSize: '0.85rem', padding: '0.6rem 1rem', whiteSpace: 'nowrap' }}>
              পরিবর্তন
            </button>
            <button className="btn btn-secondary" onClick={() => { setChangePassUser(null); setNewPassword(''); }} style={{ fontSize: '0.85rem', padding: '0.6rem 1rem' }}>
              বাতিল
            </button>
          </div>
        </div>
      )}

      {/* Users List */}
      {loading ? (
        <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>লোড হচ্ছে...</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {users.map(u => (
            <div key={u.id} className="card" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '40px', height: '40px',
                  borderRadius: '10px',
                  background: u.role === 'admin' ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)' : 'rgba(100, 116, 139, 0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {u.role === 'admin' ? <ShieldCheck size={20} color="#fff" /> : <Shield size={20} color="#94a3b8" />}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>
                    {u.name || u.username}
                    <span style={{
                      marginLeft: '0.5rem',
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: u.role === 'admin' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                      color: u.role === 'admin' ? '#06b6d4' : '#94a3b8'
                    }}>
                      {u.role === 'admin' ? 'মালিক' : 'কর্মচারী'}
                    </span>
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem' }}>@{u.username}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  onClick={() => { setChangePassUser(u.username); setNewPassword(''); }}
                  style={{
                    padding: '0.4rem 0.6rem', background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '6px',
                    color: '#f59e0b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem',
                    fontSize: '0.8rem'
                  }}
                >
                  <KeyRound size={14} /> পাসওয়ার্ড
                </button>
                {u.username !== 'admin' && (
                  <button
                    onClick={() => deleteUser(u.username)}
                    style={{
                      padding: '0.4rem 0.6rem', background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px',
                      color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem',
                      fontSize: '0.8rem'
                    }}
                  >
                    <Trash2 size={14} /> মুছুন
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
