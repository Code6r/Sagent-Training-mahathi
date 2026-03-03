// components/Pages/Authors.jsx
import React from 'react';
import { getAuthors, createAuthor, updateAuthor, deleteAuthor } from '../../api/api';
import CrudPage from './CrudPage';

const Authors = () => (
  <CrudPage config={{
    entityName: 'Author', icon: '✍️', gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    idField: 'authorId', fetchFn: getAuthors, createFn: createAuthor, updateFn: updateAuthor, deleteFn: deleteAuthor,
    emptyForm: { authorId: '', name: '', biography: '' },
    columns: [
      { header: 'ID', accessor: 'authorId', render: (r) => <span style={{ color: '#8b5cf6', fontWeight: 600, fontFamily: 'monospace' }}>{r.authorId}</span> },
      { header: 'Name', accessor: 'name', render: (r) => <span style={{ fontWeight: 600 }}>✍️ {r.name}</span> },
      { header: 'Biography', accessor: 'biography', render: (r) => <span style={{ color: '#94a3b8', fontSize: '13px' }}>{r.biography?.substring(0, 80)}...</span> },
    ],
    formFields: [
      { key: 'authorId', label: 'Author ID', placeholder: 'AUT006', isId: true },
      { key: 'name', label: 'Name', placeholder: 'Author Name' },
      { key: 'biography', label: 'Biography', placeholder: 'Brief biography...', type: 'textarea' },
    ],
    fallbackData: [
      { authorId: 'AUT001', name: 'Harper Lee', biography: 'Nelle Harper Lee was an American novelist best known for To Kill a Mockingbird.' },
      { authorId: 'AUT002', name: 'George Orwell', biography: 'Eric Arthur Blair, known by his pen name George Orwell.' },
      { authorId: 'AUT003', name: 'Jane Austen', biography: 'Jane Austen was an English novelist known for her six major novels.' },
      { authorId: 'AUT004', name: 'F. Scott Fitzgerald', biography: 'Francis Scott Key Fitzgerald was an American novelist of the Jazz Age.' },
      { authorId: 'AUT005', name: 'Gabriel García Márquez', biography: 'Gabriel José de la Concordia García Márquez was a Colombian novelist.' },
    ]
  }} />
);

export default Authors;