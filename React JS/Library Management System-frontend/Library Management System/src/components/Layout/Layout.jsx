// components/Layout/Layout.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import FloatingParticles from '../Common/FloatingParticles';

const Layout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    <FloatingParticles />
    <Sidebar />
    <motion.main
      style={{
        flex: 1, marginLeft: '260px',
        display: 'flex', flexDirection: 'column',
        minHeight: '100vh', position: 'relative', zIndex: 1
      }}
    >
      <Header />
      <div style={{ flex: 1, padding: '24px 32px' }}>
        {children}
      </div>
    </motion.main>
  </div>
);

export default Layout;