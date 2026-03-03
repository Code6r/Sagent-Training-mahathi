// components/Pages/Members.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getMembers, createMember, updateMember, deleteMember } from '../../api/api';
import DataTable from '../Common/DataTable';
import Modal from '../Common/Modal';
import PageTransition from '../Common/PageTransition';
import LoadingSpinner from '../Common/LoadingSpinner';
import toast, { Toaster } from 'react-hot-toast';

const emptyMember = { memberId: '', name: '', email: '', phone: '', membershipDate: '', status: 'Active' };
const inputStyle = {
  width: '100%', padding: '12px 16px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '10px', color: '#f1f5f9',
  fontSize: '14px', outline: 'none'
};
const labelStyle = { fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' };

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyMember);
  const [editing, setEditing] = useState(false);

  const fetchMembers = async () => {
    try {
      const res = await getMembers();
      setMembers(res.data);
    } catch {
      setMembers([
        { memberId: 'MEM001', name: 'Alice Johnson', email: 'alice.johnson@email.com', phone: '555-0101', membershipDate: '2023-01-15', status: 'Active' },
        { memberId: 'MEM002', name: 'Bob Williams', email: 'bob.williams@email.com', phone: '555-0102', membershipDate: '2023-03-22', status: 'Active' },
        { memberId: 'MEM003', name: 'Clara Chen', email: 'clara.chen@email.com', phone: '555-0103', membershipDate: '2022-11-08', status: 'Active' },
        { memberId: 'MEM004', name: 'David Martinez', email: 'david.martinez@email.com', phone: '555-0104', membershipDate: '2024-01-10', status: 'Inactive' },
        { memberId: 'MEM005', name: 'Eva Thompson', email: 'eva.thompson@email.com', phone: '555-0105', membershipDate: '2023-06-30', status: 'Active' },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await updateMember(form.memberId, form); toast.success('Member updated!'); }
      else { await createMember(form); toast.success('Member created! 🎉'); }
      fetchMembers();
      setModalOpen(false);
      setForm(emptyMember);
    } catch { toast.error('Operation failed'); }
  };

  const handleEdit = (member) => { setForm(member); setEditing(true); setModalOpen(true); };
  const handleDelete = async (member) => {
    if (window.confirm(`Delete "${member.name}"?`)) {
      try { await deleteMember(member.memberId); toast.success('Deleted!'); fetchMembers(); }
      catch { toast.error('Failed'); }
    }
  };

  const columns = [
    { header: 'ID', accessor: 'memberId', render: (r) => <span style={{ color: '#ec4899', fontWeight: 600, fontFamily: 'monospace' }}>{r.memberId}</span> },
    { header: 'Name', accessor: 'name', render: (r) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: `linear-gradient(135deg, hsl(${r.name.length * 30}, 70%, 60%), hsl(${r.name.length * 30 + 40}, 70%, 50%))`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', fontWeight: 700
        }}>{r.name[0]}</div>
        <span style={{ fontWeight: 600 }}>{r.name}</span>
      </div>
    )},
    { header: 'Email', accessor: 'email', render: (r) => <span style={{ color: '#94a3b8' }}>{r.email}</span> },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Member Since', accessor: 'membershipDate' },
    { header: 'Status', accessor: 'status', render: (r) => (
      <span style={{
        padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
        background: r.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
        color: r.status === 'Active' ? '#34d399' : '#f87171',
        border: `1px solid ${r.status === 'Active' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
      }}>
        {r.status === 'Active' ? '● ' : '○ '}{r.status}
      </span>
    )},
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <PageTransition>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)' } }} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => { setForm(emptyMember); setEditing(false); setModalOpen(true); }}
          style={{
            background: 'linear-gradient(135deg, #ec4899, #f472b6)', border: 'none', color: 'white',
            padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          ➕ Add Member
        </motion.button>
      </motion.div>
      <DataTable columns={columns} data={members} onEdit={handleEdit} onDelete={handleDelete} />
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setForm(emptyMember); setEditing(false); }} title={editing ? '✏️ Edit Member' : '👥 Add Member'}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div><label style={labelStyle}>Member ID</label><input style={inputStyle} value={form.memberId} onChange={(e) => setForm({...form, memberId: e.target.value})} required disabled={editing} placeholder="MEM006" /></div>
            <div><label style={labelStyle}>Name</label><input style={inputStyle} value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required /></div>
            <div><label style={labelStyle}>Email</label><input style={inputStyle} type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required /></div>
            <div><label style={labelStyle}>Phone</label><input style={inputStyle} value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} /></div>
            <div><label style={labelStyle}>Membership Date</label><input style={inputStyle} type="date" value={form.membershipDate} onChange={(e) => setForm({...form, membershipDate: e.target.value})} required /></div>
            <div><label style={labelStyle}>Status</label><select style={inputStyle} value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}><option value="Active">Active</option><option value="Inactive">Inactive</option></select></div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" style={{ width: '100%', marginTop: '24px', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', border: 'none', color: 'white', padding: '14px', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
            {editing ? '💾 Update' : '✨ Create'}
          </motion.button>
        </form>
      </Modal>
    </PageTransition>
  );
};

export default Members;