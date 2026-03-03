// components/Pages/Requests.jsx
import React from 'react';
import { getRequests, createRequest, updateRequest, deleteRequest } from '../../api/api';
import CrudPage from './CrudPage';

const Requests = () => (
  <CrudPage config={{
    entityName: 'Request', icon: '📩', gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    idField: 'requestId', fetchFn: getRequests, createFn: createRequest, updateFn: updateRequest, deleteFn: deleteRequest,
    emptyForm: { requestId: '', memberId: '', type: '', message: '', requestDate: '', status: 'Pending' },
    mapRowToForm: (row) => ({
      requestId: row?.requestId || '',
      memberId: row?.member?.memberId || '',
      type: row?.type || '',
      message: row?.message || '',
      requestDate: row?.requestDate || '',
      status: row?.status || 'Pending',
    }),
    mapFormToPayload: (form) => ({
      requestId: form.requestId,
      member: form.memberId ? { memberId: form.memberId } : null,
      type: form.type,
      message: form.message,
      requestDate: form.requestDate,
      status: form.status,
    }),
    columns: [
      { header: 'ID', accessor: 'requestId', render: (r) => <span style={{ color: '#8b5cf6', fontWeight: 600, fontFamily: 'monospace' }}>{r.requestId}</span> },
      { header: 'Member', accessor: 'member', render: (r) => <span>👤 {r.member?.name || 'N/A'}</span> },
      { header: 'Type', accessor: 'type', render: (r) => <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.3)' }}>{r.type}</span> },
      { header: 'Message', accessor: 'message', render: (r) => <span style={{ color: '#94a3b8', fontSize: '13px' }}>{r.message?.substring(0, 50)}...</span> },
      { header: 'Date', accessor: 'requestDate' },
      { header: 'Status', accessor: 'status', render: (r) => {
        const colors = { Pending: '#f59e0b', Approved: '#10b981', Completed: '#6366f1' };
        return <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: `${colors[r.status] || '#64748b'}20`, color: colors[r.status] || '#64748b', border: `1px solid ${colors[r.status] || '#64748b'}40` }}>{r.status}</span>;
      }},
    ],
    formFields: [
      { key: 'requestId', label: 'Request ID', placeholder: 'REQ006', isId: true },
      { key: 'memberId', label: 'Member ID', placeholder: 'MEM001' },
      { key: 'type', label: 'Type', placeholder: 'e.g., Book Reservation' },
      { key: 'message', label: 'Message', placeholder: 'Request details...', type: 'textarea' },
      { key: 'requestDate', label: 'Request Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Approved', 'Completed', 'Rejected'] },
    ],
    fallbackData: [
      { requestId: 'REQ001', member: { name: 'Alice Johnson' }, type: 'Book Reservation', message: 'Please reserve The Great Gatsby for me.', requestDate: '2024-10-08', status: 'Pending' },
      { requestId: 'REQ002', member: { name: 'Bob Williams' }, type: 'New Book Request', message: 'Can the library acquire Dune?', requestDate: '2024-09-25', status: 'Approved' },
      { requestId: 'REQ003', member: { name: 'Clara Chen' }, type: 'Membership Renewal', message: 'I would like to renew my membership.', requestDate: '2024-10-01', status: 'Completed' },
      { requestId: 'REQ004', member: { name: 'David Martinez' }, type: 'Inter-Library Loan', message: 'Need access to a rare manuscript.', requestDate: '2024-10-12', status: 'Pending' },
      { requestId: 'REQ005', member: { name: 'Eva Thompson' }, type: 'Extension Request', message: 'Please extend my borrowing period.', requestDate: '2024-10-15', status: 'Approved' },
    ]
  }} />
);

export default Requests;
