// components/Common/AnimatedCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({ children, delay = 0, className = '', onClick, style = {} }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    whileHover={{ 
      y: -5, 
      scale: 1.02,
      boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.25)'
    }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={className}
    style={{
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(30, 41, 59, 0.4))',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '24px',
      cursor: onClick ? 'pointer' : 'default',
      ...style
    }}
  >
    {children}
  </motion.div>
);

export default AnimatedCard;