// components/Pages/Librarians.jsx
import React from 'react';
import { getLibrarians, createLibrarian, updateLibrarian, deleteLibrarian } from '../../api/api';
import CrudPage from './CrudPage';

const Librarians = () => (
  <CrudPage config={{
    entityName: 'Librarian', icon: '👨‍💼', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    idField: 'librarianId', fetchFn: getLibrarians, createFn: createLibrarian, updateFn: updateLibrarian, deleteFn: deleteLibrarian,
    emptyForm: { librarianId: '', name: '', email: '', password: '', role: '', libraryId: '' },
    mapRowToForm: (row) => ({
      librarianId: row?.librarianId || '',
      name: row?.name || '',
      email: row?.email || '',
      password: row?.password || '',
      role: row?.role || '',
      libraryId: row?.library?.libraryId || '',
    }),
    mapFormToPayload: (form) => ({
      librarianId: form.librarianId,
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      library: form.libraryId ? { libraryId: form.libraryId } : null,
    }),
    columns: [
      { header: 'ID', accessor: 'librarianId', render: (r) => <span style={{ color: '#f59e0b', fontWeight: 600, fontFamily: 'monospace' }}>{r.librarianId}</span> },
      { header: 'Name', accessor: 'name', render: (r) => <span style={{ fontWeight: 600 }}>👨‍💼 {r.name}</span> },
      { header: 'Email', accessor: 'email', render: (r) => <span style={{ color: '#94a3b8' }}>{r.email}</span> },
      { header: 'Role', accessor: 'role', render: (r) => (
        <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>{r.role}</span>
      )},
      { header: 'Library', accessor: 'library', render: (r) => <span style={{ color: '#94a3b8' }}>{r.library?.name || 'N/A'}</span> },
    ],
    formFields: [
      { key: 'librarianId', label: 'Librarian ID', placeholder: 'LBRN006', isId: true },
      { key: 'name', label: 'Name', placeholder: 'Full Name' },
      { key: 'email', label: 'Email', placeholder: 'email@library.org', type: 'email' },
      { key: 'password', label: 'Password', placeholder: 'Password', type: 'password' },
      { key: 'role', label: 'Role', placeholder: 'e.g., Head Librarian' },
      { key: 'libraryId', label: 'Library ID', placeholder: 'LIB001', required: false },
    ],
    fallbackData: [
      { librarianId: 'LBRN001', name: 'Sarah Mitchell', email: 'sarah@citylib.org', role: 'Head Librarian', library: { name: 'Central City Library' } },
      { librarianId: 'LBRN002', name: 'James Cooper', email: 'james@citylib.org', role: 'Assistant Librarian', library: { name: 'Westside Library' } },
      { librarianId: 'LBRN003', name: 'Maria Gonzalez', email: 'maria@unilib.edu', role: 'Research Librarian', library: { name: 'University Library' } },
      { librarianId: 'LBRN004', name: 'Tom Baker', email: 'tom@discoverylib.org', role: "Children's Librarian", library: { name: "Children's Library" } },
      { librarianId: 'LBRN005', name: 'Linda Park', email: 'linda@medialib.org', role: 'Digital Services', library: { name: 'Digital Media Library' } },
    ]
  }} />
);

export default Librarians;
