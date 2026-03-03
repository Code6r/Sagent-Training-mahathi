// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Pages/Dashboard';
import Books from './components/Pages/Books';
import Authors from './components/Pages/Authors';
import Members from './components/Pages/Members';
import Libraries from './components/Pages/Libraries';
import Librarians from './components/Pages/Librarians';
import BookCopies from './components/Pages/BookCopies';
import CatalogEntries from './components/Pages/CatalogEntries';
import BorrowingRecords from './components/Pages/BorrowingRecords';
import Fines from './components/Pages/Fines';
import Requests from './components/Pages/Requests';
import Notifications from './components/Pages/Notifications';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
            <Route path="/authors" element={<Authors />} />
            <Route path="/members" element={<Members />} />
            <Route path="/libraries" element={<Libraries />} />
            <Route path="/librarians" element={<Librarians />} />
            <Route path="/book-copies" element={<BookCopies />} />
            <Route path="/catalog" element={<CatalogEntries />} />
            <Route path="/borrowings" element={<BorrowingRecords />} />
            <Route path="/fines" element={<Fines />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </Router>
  );
}

export default App;