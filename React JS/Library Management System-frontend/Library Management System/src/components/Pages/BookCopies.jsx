// components/Pages/BookCopies.jsx
import React from 'react';
import { getBookCopies, createBookCopy, updateBookCopy, deleteBookCopy } from '../../api/api';
import CrudPage from './CrudPage';

const statusColors = {
  Available: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
  Borrowed: { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
  Reserved: { bg: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: 'rgba(99, 102, 241, 0.3)' },
};

const BookCopies = () => (
  <CrudPage config={{
    entityName: 'Book Copy', icon: '📋', gradient: 'linear-gradient(135deg, #14b8a6, #2dd4bf)',
    idField: 'copyId', fetchFn: getBookCopies, createFn: createBookCopy, updateFn: updateBookCopy, deleteFn: deleteBookCopy,
    emptyForm: { copyId: '', bookId: '', libraryId: '', status: 'Available', location: '' },
    mapRowToForm: (row) => ({
      copyId: row?.copyId || '',
      bookId: row?.book?.bookId || '',
      libraryId: row?.library?.libraryId || '',
      status: row?.status || 'Available',
      location: row?.location || '',
    }),
    mapFormToPayload: (form) => ({
      copyId: form.copyId,
      book: form.bookId ? { bookId: form.bookId } : null,
      library: form.libraryId ? { libraryId: form.libraryId } : null,
      status: form.status,
      location: form.location,
    }),
    columns: [
      { header: 'Copy ID', accessor: 'copyId', render: (r) => <span style={{ color: '#14b8a6', fontWeight: 600, fontFamily: 'monospace' }}>{r.copyId}</span> },
      { header: 'Book', accessor: 'book', render: (r) => <span style={{ fontWeight: 600 }}>📖 {r.book?.title || 'N/A'}</span> },
      { header: 'Library', accessor: 'library', render: (r) => <span style={{ color: '#94a3b8' }}>🏛️ {r.library?.name || 'N/A'}</span> },
      { header: 'Status', accessor: 'status', render: (r) => {
        const s = statusColors[r.status] || statusColors.Available;
        return <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{r.status}</span>;
      }},
      { header: 'Location', accessor: 'location', render: (r) => <span style={{ color: '#94a3b8' }}>📍 {r.location}</span> },
    ],
    formFields: [
      { key: 'copyId', label: 'Copy ID', placeholder: 'CP006', isId: true },
      { key: 'bookId', label: 'Book ID', placeholder: 'BK001' },
      { key: 'libraryId', label: 'Library ID', placeholder: 'LIB001' },
      { key: 'status', label: 'Status', type: 'select', options: ['Available', 'Borrowed', 'Reserved'] },
      { key: 'location', label: 'Location', placeholder: 'e.g., Shelf A-12' },
    ],
    fallbackData: [
      { copyId: 'CP001', book: { title: 'To Kill a Mockingbird' }, library: { name: 'Central City Library' }, status: 'Available', location: 'Shelf A-12' },
      { copyId: 'CP002', book: { title: '1984' }, library: { name: 'Central City Library' }, status: 'Borrowed', location: 'Shelf B-05' },
      { copyId: 'CP003', book: { title: 'Pride and Prejudice' }, library: { name: 'Westside Library' }, status: 'Available', location: 'Shelf C-08' },
      { copyId: 'CP004', book: { title: 'The Great Gatsby' }, library: { name: 'University Library' }, status: 'Reserved', location: 'Shelf D-03' },
      { copyId: 'CP005', book: { title: 'One Hundred Years of Solitude' }, library: { name: "Children's Library" }, status: 'Available', location: 'Shelf E-11' },
    ]
  }} />
);

export default BookCopies;
