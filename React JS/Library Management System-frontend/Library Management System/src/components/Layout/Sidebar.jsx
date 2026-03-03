// components/Layout/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/books', label: 'Books', icon: '📚' },
  { path: '/authors', label: 'Authors', icon: '✍️' },
  { path: '/members', label: 'Members', icon: '👥' },
  { path: '/libraries', label: 'Libraries', icon: '🏛️' },
  { path: '/librarians', label: 'Librarians', icon: '👨‍💼' },
  { path: '/book-copies', label: 'Book Copies', icon: '📋' },
  { path: '/catalog', label: 'Catalog', icon: '🗂️' },
  { path: '/borrowings', label: 'Borrowings', icon: '🔄' },
  { path: '/fines', label: 'Fines', icon: '💰' },
  { path: '/requests', label: 'Requests', icon: '📩' },
  { path: '/notifications', label: 'Notifications', icon: '🔔' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        height: '100vh',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', left: 0, top: 0, zIndex: 100,
        overflow: 'hidden'
      }}
    >
      {/* Logo */}
      <motion.div
        style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex', alignItems: 'center', gap: '12px',
          cursor: 'pointer'
        }}
        onClick={() => setCollapsed(!collapsed)}
        whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
      >
        <motion.div
          animate={{ rotate: collapsed ? 180 : 0 }}
          style={{
            width: '40px', height: '40px',
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', flexShrink: 0
          }}
        >
          📖
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <h1 style={{ fontSize: '16px', fontWeight: 800, color: '#f1f5f9', whiteSpace: 'nowrap' }}>
                LibraryMS
              </h1>
              <p style={{ fontSize: '10px', color: '#64748b', whiteSpace: 'nowrap' }}>
                Management System
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Nav */}
      <nav style={{
        flex: 1, overflowY: 'auto', padding: '12px 8px',
        display: 'flex', flexDirection: 'column', gap: '4px'
      }}>
        {menuItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={{ textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 4, backgroundColor: 'rgba(99, 102, 241, 0.15)' }}
                whileTap={{ scale: 0.97 }}
                onHoverStart={() => setHoveredItem(item.path)}
                onHoverEnd={() => setHoveredItem(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: collapsed ? '12px 20px' : '12px 16px',
                  borderRadius: '12px',
                  position: 'relative',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.1))'
                    : 'transparent',
                  border: isActive
                    ? '1px solid rgba(99, 102, 241, 0.3)'
                    : '1px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    style={{
                      position: 'absolute', left: 0, top: '50%',
                      transform: 'translateY(-50%)',
                      width: '3px', height: '60%',
                      background: 'linear-gradient(180deg, #6366f1, #ec4899)',
                      borderRadius: '0 4px 4px 0'
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      style={{
                        fontSize: '13px', fontWeight: isActive ? 600 : 400,
                        color: isActive ? '#f1f5f9' : '#94a3b8',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip for collapsed */}
                {collapsed && hoveredItem === item.path && (
                  <motion.div
                    initial={{ opacity: 0, x: -10, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    style={{
                      position: 'absolute', left: '60px', top: '50%',
                      transform: 'translateY(-50%)',
                      background: '#1e293b',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '6px 12px', borderRadius: '8px',
                      fontSize: '12px', color: '#f1f5f9',
                      whiteSpace: 'nowrap', zIndex: 1000,
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    {item.label}
                  </motion.div>
                )}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <AnimatePresence>
          {!collapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: '10px', color: '#475569', textAlign: 'center' }}
            >
              © 2024 LibraryMS v1.0
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};

export default Sidebar;