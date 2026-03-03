// components/Pages/Books.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getBooks, createBook, updateBook, deleteBook } from '../../api/api';
import DataTable from '../Common/DataTable';
import Modal from '../Common/Modal';
import PageTransition from '../Common/PageTransition';
import LoadingSpinner from '../Common/LoadingSpinner';
import toast, { Toaster } from 'react-hot-toast';

const emptyBook = { bookId: '', isbn: '', title: '', author: '', subject: '', publicationYear: '' };

const inputStyle = {
  width: '100%', padding: '12px 16px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '10px', color: '#f1f5f9',
  fontSize: '14px', outline: 'none',
  transition: 'all 0.3s'
};

const labelStyle = {
  fontSize: '12px', fontWeight: 600, color: '#94a3b8',
  marginBottom: '6px', display: 'block', textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyBook);
  const [editing, setEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data);
    } catch {
      setBooks([
        { bookId: 'BK001', isbn: '978-0061120084', title: 'To Kill a Mockingbird', author: 'Harper Lee', subject: 'Fiction', publicationYear: 1960 },
        { bookId: 'BK002', isbn: '978-0451524935', title: '1984', author: 'George Orwell', subject: 'Dystopian Fiction', publicationYear: 1949 },
        { bookId: 'BK003', isbn: '978-0141439518', title: 'Pride and Prejudice', author: 'Jane Austen', subject: 'Romance', publicationYear: 1813 },
        { bookId: 'BK004', isbn: '978-0743273565', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', subject: 'Classic Fiction', publicationYear: 1925 },
        { bookId: 'BK005', isbn: '978-0060883287', title: 'One Hundred Years of Solitude', author: 'Gabriel García Márquez', subject: 'Magical Realism', publicationYear: 1967 },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateBook(form.bookId, form);
        toast.success('Book updated successfully! 📖');
      } else {
        await createBook(form);
        toast.success('Book created successfully! 🎉');
      }
      fetchBooks();
      setModalOpen(false);
      setForm(emptyBook);
      setEditing(false);
    } catch {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (book) => {
    setForm(book);
    setEditing(true);
    setModalOpen(false);
    setTimeout(() => setModalOpen(true), 100);
  };

  const handleDelete = async (book) => {
    if (window.confirm(`Delete "${book.title}"?`)) {
      try {
        await deleteBook(book.bookId);
        toast.success('Book deleted! 🗑️');
        fetchBooks();
      } catch {
        toast.error('Delete failed');
      }
    }
  };

  const filteredBooks = books.filter(b =>
    b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: 'ID', accessor: 'bookId', render: (row) => (
      <span style={{ color: '#6366f1', fontWeight: 600, fontFamily: 'monospace' }}>{row.bookId}</span>
    )},
    { header: 'Title', accessor: 'title', render: (row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '20px' }}>📖</span>
        <span style={{ fontWeight: 600 }}>{row.title}</span>
      </div>
    )},
    { header: 'Author', accessor: 'author' },
    { header: 'ISBN', accessor: 'isbn', render: (row) => (
      <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#94a3b8' }}>{row.isbn}</span>
    )},
    { header: 'Subject', accessor: 'subject', render: (row) => (
      <span style={{
        padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
        background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8',
        border: '1px solid rgba(99, 102, 241, 0.3)'
      }}>
        {row.subject}
      </span>
    )},
    { header: 'Year', accessor: 'publicationYear' },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <PageTransition>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)' }
      }} />

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '24px', flexWrap: 'wrap', gap: '16px'
        }}
      >
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="🔍 Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              ...inputStyle,
              width: '320px',
              paddingLeft: '16px'
            }}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 10px 30px -10px rgba(99, 102, 241, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setForm(emptyBook); setEditing(false); setModalOpen(true); }}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', color: 'white',
            padding: '12px 24px', borderRadius: '12px',
            fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <span style={{ fontSize: '18px' }}>➕</span> Add Book
        </motion.button>
      </motion.div>

      {/* Count badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          marginBottom: '16px', fontSize: '13px', color: '#64748b'
        }}
      >
        Showing <span style={{ color: '#6366f1', fontWeight: 600 }}>{filteredBooks.length}</span> books
      </motion.div>

      <DataTable
        columns={columns}
        data={filteredBooks}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal Form */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setForm(emptyBook); setEditing(false); }}
        title={editing ? '✏️ Edit Book' : '📚 Add New Book'}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Book ID</label>
              <input
                style={inputStyle}
                value={form.bookId}
                onChange={(e) => setForm({ ...form, bookId: e.target.value })}
                required
                disabled={editing}
                placeholder="e.g., BK006"
              />
            </div>
            <div>
              <label style={labelStyle}>ISBN</label>
              <input
                style={inputStyle}
                value={form.isbn}
                onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                required
                placeholder="e.g., 978-0000000000"
              />
            </div>
            <div>
              <label style={labelStyle}>Title</label>
              <input
                style={inputStyle}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                placeholder="Book title"
              />
            </div>
            <div>
              <label style={labelStyle}>Author</label>
              <input
                style={inputStyle}
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                required
                placeholder="Author name"
              />
            </div>
            <div>
              <label style={labelStyle}>Subject</label>
              <input
                style={inputStyle}
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="e.g., Fiction, Science"
              />
            </div>
            <div>
              <label style={labelStyle}>Publication Year</label>
              <input
                style={inputStyle}
                type="number"
                value={form.publicationYear}
                onChange={(e) => setForm({ ...form, publicationYear: parseInt(e.target.value) })}
                placeholder="e.g., 2024"
              />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            style={{
              width: '100%', marginTop: '24px',
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              border: 'none', color: 'white',
              padding: '14px', borderRadius: '12px',
              fontSize: '15px', fontWeight: 700, cursor: 'pointer'
            }}
          >
            {editing ? '💾 Update Book' : '✨ Create Book'}
          </motion.button>
        </form>
      </Modal>
    </PageTransition>
  );
};

export default Books;