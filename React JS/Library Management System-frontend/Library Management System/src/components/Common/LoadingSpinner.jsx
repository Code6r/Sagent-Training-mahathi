// components/Common/LoadingSpinner.jsx
import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => (
  <div style={{
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    height: '400px', flexDirection: 'column', gap: '20px'
  }}>
    <motion.div
      style={{
        width: 50, height: 50, borderRadius: '50%',
        border: '3px solid rgba(99, 102, 241, 0.2)',
        borderTop: '3px solid #6366f1'
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      style={{ color: '#94a3b8', fontSize: '14px' }}
    >
      Loading...
    </motion.p>
  </div>
);

export default LoadingSpinner;