// components/Pages/BorrowingRecords.jsx
import React from 'react';
import { getBorrowingRecords, createBorrowingRecord, updateBorrowingRecord, deleteBorrowingRecord } from '../../api/api';
import CrudPage from './CrudPage';

const BorrowingRecords = () => (
  <CrudPage config={{
    entityName: 'Borrowing Record', icon: '🔄', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    idField: 'recordId', fetchFn: getBorrowingRecords, createFn: createBorrowingRecord, updateFn: updateBorrowingRecord, deleteFn: deleteBorrowingRecord,
    emptyForm: { recordId: '', memberId: '', copyId: '', borrowDate: '', dueDate: '', returnDate: '', status: 'Active' },
    mapRowToForm: (row) => ({
      recordId: row?.recordId || '',
      memberId: row?.member?.memberId || '',
      copyId: row?.copy?.copyId || '',
      borrowDate: row?.borrowDate || '',
      dueDate: row?.dueDate || '',
      returnDate: row?.returnDate || '',
      status: row?.status || 'Active',
    }),
    mapFormToPayload: (form) => ({
      recordId: form.recordId,
      member: form.memberId ? { memberId: form.memberId } : null,
      copy: form.copyId ? { copyId: form.copyId } : null,
      borrowDate: form.borrowDate,
      dueDate: form.dueDate,
      returnDate: form.returnDate || null,
      status: form.status,
    }),
    columns: [
      { header: 'Record ID', accessor: 'recordId', render: (r) => <span style={{ color: '#f59e0b', fontWeight: 600, fontFamily: 'monospace' }}>{r.recordId}</span> },
      { header: 'Member', accessor: 'member', render: (r) => <span>👤 {r.member?.name || 'N/A'}</span> },
      { header: 'Copy', accessor: 'copy', render: (r) => <span>📋 {r.copy?.copyId || 'N/A'}</span> },
      { header: 'Borrow Date', accessor: 'borrowDate' },
      { header: 'Due Date', accessor: 'dueDate' },
      { header: 'Return Date', accessor: 'returnDate', render: (r) => r.returnDate || <span style={{ color: '#64748b' }}>—</span> },
      { header: 'Status', accessor: 'status', render: (r) => {
        const colors = { Active: '#3b82f6', Returned: '#10b981', Overdue: '#ef4444' };
        return <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: `${colors[r.status]}20`, color: colors[r.status], border: `1px solid ${colors[r.status]}40` }}>{r.status}</span>;
      }},
    ],
    formFields: [
      { key: 'recordId', label: 'Record ID', placeholder: 'BR006', isId: true },
      { key: 'memberId', label: 'Member ID', placeholder: 'MEM001' },
      { key: 'copyId', label: 'Copy ID', placeholder: 'CP001' },
      { key: 'borrowDate', label: 'Borrow Date', type: 'date' },
      { key: 'dueDate', label: 'Due Date', type: 'date' },
      { key: 'returnDate', label: 'Return Date', type: 'date', required: false },
      { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Returned', 'Overdue'] },
    ],
    fallbackData: [
      { recordId: 'BR001', member: { name: 'Alice Johnson' }, copy: { copyId: 'CP002' }, borrowDate: '2024-10-01', dueDate: '2024-10-15', returnDate: null, status: 'Active' },
      { recordId: 'BR002', member: { name: 'Bob Williams' }, copy: { copyId: 'CP001' }, borrowDate: '2024-09-15', dueDate: '2024-09-29', returnDate: '2024-09-28', status: 'Returned' },
      { recordId: 'BR003', member: { name: 'Clara Chen' }, copy: { copyId: 'CP003' }, borrowDate: '2024-10-05', dueDate: '2024-10-19', returnDate: null, status: 'Active' },
      { recordId: 'BR004', member: { name: 'David Martinez' }, copy: { copyId: 'CP005' }, borrowDate: '2024-08-20', dueDate: '2024-09-03', returnDate: '2024-09-10', status: 'Overdue' },
      { recordId: 'BR005', member: { name: 'Eva Thompson' }, copy: { copyId: 'CP004' }, borrowDate: '2024-10-10', dueDate: '2024-10-24', returnDate: null, status: 'Active' },
    ]
  }} />
);

export default BorrowingRecords;
