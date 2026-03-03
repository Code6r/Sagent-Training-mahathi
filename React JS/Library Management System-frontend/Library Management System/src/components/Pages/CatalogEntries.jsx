// components/Pages/CatalogEntries.jsx
import React from 'react';
import { getCatalogEntries, createCatalogEntry, updateCatalogEntry, deleteCatalogEntry } from '../../api/api';
import CrudPage from './CrudPage';

const CatalogEntries = () => (
  <CrudPage config={{
    entityName: 'Catalog Entry', icon: '🗂️', gradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
    idField: 'entryId', fetchFn: getCatalogEntries, createFn: createCatalogEntry, updateFn: updateCatalogEntry, deleteFn: deleteCatalogEntry,
    emptyForm: { entryId: '', bookId: '', libraryId: '', dateAdded: '', lastUpdated: '' },
    mapRowToForm: (row) => ({
      entryId: row?.entryId || '',
      bookId: row?.book?.bookId || '',
      libraryId: row?.library?.libraryId || '',
      dateAdded: row?.dateAdded || '',
      lastUpdated: row?.lastUpdated || '',
    }),
    mapFormToPayload: (form) => ({
      entryId: form.entryId,
      book: form.bookId ? { bookId: form.bookId } : null,
      library: form.libraryId ? { libraryId: form.libraryId } : null,
      dateAdded: form.dateAdded,
      lastUpdated: form.lastUpdated || null,
    }),
    columns: [
      { header: 'Entry ID', accessor: 'entryId', render: (r) => <span style={{ color: '#6366f1', fontWeight: 600, fontFamily: 'monospace' }}>{r.entryId}</span> },
      { header: 'Book', accessor: 'book', render: (r) => <span style={{ fontWeight: 600 }}>📖 {r.book?.title || 'N/A'}</span> },
      { header: 'Library', accessor: 'library', render: (r) => <span>🏛️ {r.library?.name || 'N/A'}</span> },
      { header: 'Date Added', accessor: 'dateAdded' },
      { header: 'Last Updated', accessor: 'lastUpdated' },
    ],
    formFields: [
      { key: 'entryId', label: 'Entry ID', placeholder: 'CAT006', isId: true },
      { key: 'bookId', label: 'Book ID', placeholder: 'BK001' },
      { key: 'libraryId', label: 'Library ID', placeholder: 'LIB001' },
      { key: 'dateAdded', label: 'Date Added', type: 'date' },
      { key: 'lastUpdated', label: 'Last Updated', type: 'date', required: false },
    ],
    fallbackData: [
      { entryId: 'CAT001', book: { title: 'To Kill a Mockingbird' }, library: { name: 'Central City Library' }, dateAdded: '2022-06-15', lastUpdated: '2024-01-10' },
      { entryId: 'CAT002', book: { title: '1984' }, library: { name: 'Central City Library' }, dateAdded: '2022-07-20', lastUpdated: '2024-02-15' },
      { entryId: 'CAT003', book: { title: 'Pride and Prejudice' }, library: { name: 'Westside Library' }, dateAdded: '2023-01-05', lastUpdated: '2024-03-01' },
      { entryId: 'CAT004', book: { title: 'The Great Gatsby' }, library: { name: 'University Library' }, dateAdded: '2023-04-12', lastUpdated: '2024-01-20' },
      { entryId: 'CAT005', book: { title: 'One Hundred Years of Solitude' }, library: { name: "Children's Library" }, dateAdded: '2023-08-30', lastUpdated: '2024-04-05' },
    ]
  }} />
);

export default CatalogEntries;
