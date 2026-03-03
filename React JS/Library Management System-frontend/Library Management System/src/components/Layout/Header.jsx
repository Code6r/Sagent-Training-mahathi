// components/Layout/Header.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/': 'Dashboard',
  '/books': 'Books Management',
  '/authors': 'Authors Management',
  '/members': 'Members Management',
  '/libraries': 'Libraries Management',
  '/librarians': 'Librarians Management',
  '/book-copies': 'Book Copies Management',
  '/catalog': 'Catalog Entries',
  '/borrowings': 'Borrowing Records',
  '/fines': 'Fines Management',
  '/requests': 'Requests Management',
  '/notifications': 'Notifications'
};

const Header = () => {
  const location = useLocation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '16px 32px',
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 50
      }}
    >
      <div>
        <motion.h1
          key={location.pathname}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            fontSize: '24px', fontWeight: 800,
            background: 'linear-gradient(135deg, #f1f5f9, #94a3b8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}
        >
          {pageTitles[location.pathname] || 'Library Management'}
        </motion.h1>
        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
          Manage your library ecosystem
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            padding: '8px 16px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '10px',
            fontSize: '13px', color: '#818cf8', fontWeight: 500,
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          🕐 {time.toLocaleTimeString()}
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{
            width: '40px', height: '40px',
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', cursor: 'pointer'
          }}
        >
          👤
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;