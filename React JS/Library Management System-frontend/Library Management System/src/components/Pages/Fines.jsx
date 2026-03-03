// components/Pages/Fines.jsx
import React from 'react';
import { getFines, createFine, updateFine, deleteFine } from '../../api/api';
import CrudPage from './CrudPage';

const Fines = () => (
  <CrudPage config={{
    entityName: 'Fine', icon: '💰', gradient: 'linear-gradient(135deg, #ef4444, #f87171)',
    idField: 'fineId', fetchFn: getFines, createFn: createFine, updateFn: updateFine, deleteFn: deleteFine,
    emptyForm: { fineId: '', memberId: '', recordId: '', amount: '', status: 'Unpaid', dueDate: '', paidDate: '' },
    mapRowToForm: (row) => ({
      fineId: row?.fineId || '',
      memberId: row?.member?.memberId || '',
      recordId: row?.record?.recordId || '',
      amount: row?.amount ?? '',
      status: row?.status || 'Unpaid',
      dueDate: row?.dueDate || '',
      paidDate: row?.paidDate || '',
    }),
    mapFormToPayload: (form) => ({
      fineId: form.fineId,
      member: form.memberId ? { memberId: form.memberId } : null,
      record: form.recordId ? { recordId: form.recordId } : null,
      amount: form.amount,
      status: form.status,
      dueDate: form.dueDate,
      paidDate: form.paidDate || null,
    }),
    columns: [
      { header: 'Fine ID', accessor: 'fineId', render: (r) => <span style={{ color: '#ef4444', fontWeight: 600, fontFamily: 'monospace' }}>{r.fineId}</span> },
      { header: 'Member', accessor: 'member', render: (r) => <span>👤 {r.member?.name || 'N/A'}</span> },
      { header: 'Amount', accessor: 'amount', render: (r) => <span style={{ fontWeight: 700, color: '#f59e0b' }}>${r.amount}</span> },
      { header: 'Status', accessor: 'status', render: (r) => {
        const colors = { Unpaid: '#ef4444', Paid: '#10b981', Waived: '#6366f1' };
        return <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: `${colors[r.status]}20`, color: colors[r.status], border: `1px solid ${colors[r.status]}40` }}>{r.status}</span>;
      }},
      { header: 'Due Date', accessor: 'dueDate' },
      { header: 'Paid Date', accessor: 'paidDate', render: (r) => r.paidDate || <span style={{ color: '#64748b' }}>—</span> },
    ],
    formFields: [
      { key: 'fineId', label: 'Fine ID', placeholder: 'FN006', isId: true },
      { key: 'memberId', label: 'Member ID', placeholder: 'MEM001' },
      { key: 'recordId', label: 'Record ID', placeholder: 'BR001' },
      { key: 'amount', label: 'Amount', placeholder: '0.00', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['Unpaid', 'Paid', 'Waived'] },
      { key: 'dueDate', label: 'Due Date', type: 'date' },
      { key: 'paidDate', label: 'Paid Date', type: 'date', required: false },
    ],
    fallbackData: [
      { fineId: 'FN001', member: { name: 'David Martinez' }, record: { recordId: 'BR004' }, amount: 3.50, status: 'Unpaid', dueDate: '2024-09-03', paidDate: null },
      { fineId: 'FN002', member: { name: 'Alice Johnson' }, record: { recordId: 'BR001' }, amount: 1.00, status: 'Paid', dueDate: '2024-07-15', paidDate: '2024-07-20' },
      { fineId: 'FN003', member: { name: 'Bob Williams' }, record: { recordId: 'BR002' }, amount: 0.50, status: 'Paid', dueDate: '2024-05-10', paidDate: '2024-05-12' },
      { fineId: 'FN004', member: { name: 'Clara Chen' }, record: { recordId: 'BR003' }, amount: 5.00, status: 'Unpaid', dueDate: '2024-10-19', paidDate: null },
      { fineId: 'FN005', member: { name: 'Eva Thompson' }, record: { recordId: 'BR005' }, amount: 2.00, status: 'Waived', dueDate: '2024-06-01', paidDate: null },
    ]
  }} />
);

export default Fines;
