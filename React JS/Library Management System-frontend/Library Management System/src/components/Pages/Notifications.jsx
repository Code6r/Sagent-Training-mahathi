// components/Pages/Notifications.jsx
import React from 'react';
import { getNotifications, createNotification, updateNotification, deleteNotification } from '../../api/api';
import CrudPage from './CrudPage';

const Notifications = () => (
  <CrudPage config={{
    entityName: 'Notification', icon: '🔔', gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
    idField: 'notificationId', fetchFn: getNotifications, createFn: createNotification, updateFn: updateNotification, deleteFn: deleteNotification,
    emptyForm: { notificationId: '', memberId: '', type: '', message: '', sentDate: '', status: 'Sent' },
    mapRowToForm: (row) => ({
      notificationId: row?.notificationId || '',
      memberId: row?.member?.memberId || '',
      type: row?.type || '',
      message: row?.message || '',
      sentDate: row?.sentDate || '',
      status: row?.status || 'Sent',
    }),
    mapFormToPayload: (form) => ({
      notificationId: form.notificationId,
      member: form.memberId ? { memberId: form.memberId } : null,
      type: form.type,
      message: form.message,
      sentDate: form.sentDate,
      status: form.status,
    }),
    columns: [
      { header: 'ID', accessor: 'notificationId', render: (r) => <span style={{ color: '#ec4899', fontWeight: 600, fontFamily: 'monospace' }}>{r.notificationId}</span> },
      { header: 'Member', accessor: 'member', render: (r) => <span>👤 {r.member?.name || 'N/A'}</span> },
      { header: 'Type', accessor: 'type', render: (r) => <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', border: '1px solid rgba(236, 72, 153, 0.3)' }}>{r.type}</span> },
      { header: 'Message', accessor: 'message', render: (r) => <span style={{ color: '#94a3b8', fontSize: '13px' }}>{r.message?.substring(0, 60)}...</span> },
      { header: 'Sent Date', accessor: 'sentDate' },
      { header: 'Status', accessor: 'status', render: (r) => {
        const colors = { Sent: '#3b82f6', Read: '#10b981' };
        return <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: `${colors[r.status]}20`, color: colors[r.status], border: `1px solid ${colors[r.status]}40` }}>{r.status}</span>;
      }},
    ],
    formFields: [
      { key: 'notificationId', label: 'Notification ID', placeholder: 'NOT006', isId: true },
      { key: 'memberId', label: 'Member ID', placeholder: 'MEM001' },
      { key: 'type', label: 'Type', placeholder: 'e.g., Due Date Reminder' },
      { key: 'message', label: 'Message', placeholder: 'Notification message...', type: 'textarea' },
      { key: 'sentDate', label: 'Sent Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['Sent', 'Read'] },
    ],
    fallbackData: [
      { notificationId: 'NOT001', member: { name: 'Alice Johnson' }, type: 'Due Date Reminder', message: 'Your book "1984" is due on 2024-10-15.', sentDate: '2024-10-13', status: 'Sent' },
      { notificationId: 'NOT002', member: { name: 'David Martinez' }, type: 'Overdue Notice', message: 'Your book is overdue. A fine of $3.50 has been applied.', sentDate: '2024-09-04', status: 'Sent' },
      { notificationId: 'NOT003', member: { name: 'Bob Williams' }, type: 'Request Approved', message: 'Your new book request for "Dune" has been approved.', sentDate: '2024-09-28', status: 'Read' },
      { notificationId: 'NOT004', member: { name: 'Clara Chen' }, type: 'Membership Renewed', message: 'Your membership has been renewed until 2025-11-08.', sentDate: '2024-10-02', status: 'Read' },
      { notificationId: 'NOT005', member: { name: 'Eva Thompson' }, type: 'Reservation Ready', message: 'The book "The Great Gatsby" is now available for pickup.', sentDate: '2024-10-11', status: 'Sent' },
    ]
  }} />
);

export default Notifications;
