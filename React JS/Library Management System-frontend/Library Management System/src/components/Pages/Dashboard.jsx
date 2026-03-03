// components/Pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getDashboardStats } from '../../api/api';
import AnimatedCard from '../Common/AnimatedCard';
import AnimatedCounter from '../Common/AnimatedCounter';
import PageTransition from '../Common/PageTransition';
import LoadingSpinner from '../Common/LoadingSpinner';

const statCards = [
  { key: 'totalBooks', label: 'Total Books', icon: '📚', color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #818cf8)' },
  { key: 'totalMembers', label: 'Total Members', icon: '👥', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #f472b6)' },
  { key: 'activeMembers', label: 'Active Members', icon: '✅', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
  { key: 'totalLibraries', label: 'Libraries', icon: '🏛️', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)' },
  { key: 'activeBorrowings', label: 'Active Borrowings', icon: '🔄', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
  { key: 'overdueBorrowings', label: 'Overdue', icon: '⚠️', color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #f87171)' },
  { key: 'unpaidFines', label: 'Unpaid Fines', icon: '💰', color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #fb923c)' },
  { key: 'pendingRequests', label: 'Pending Requests', icon: '📩', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' },
  { key: 'availableCopies', label: 'Available Copies', icon: '📋', color: '#14b8a6', gradient: 'linear-gradient(135deg, #14b8a6, #2dd4bf)' },
];

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(res => { setStats(res.data); setLoading(false); })
      .catch(() => {
        // Fallback demo data
        setStats({
          totalBooks: 5, totalMembers: 5, activeMembers: 4,
          totalLibraries: 5, activeBorrowings: 3, overdueBorrowings: 1,
          unpaidFines: 2, totalUnpaidAmount: 8.50, pendingRequests: 2,
          availableCopies: 3
        });
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <PageTransition>
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(236, 72, 153, 0.1), rgba(6, 182, 212, 0.1))',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '20px',
          padding: '32px 40px',
          marginBottom: '32px',
          position: 'relative', overflow: 'hidden'
        }}
      >
        {/* Animated background orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', right: '-50px', top: '-50px',
            width: '200px', height: '200px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2), transparent)',
            borderRadius: '50%'
          }}
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 30, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{
            position: 'absolute', left: '30%', bottom: '-30px',
            width: '150px', height: '150px',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15), transparent)',
            borderRadius: '50%'
          }}
        />

        <h2 style={{
          fontSize: '28px', fontWeight: 800, marginBottom: '8px',
          position: 'relative', zIndex: 1,
          background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Welcome to Library Management System
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', position: 'relative', zIndex: 1 }}>
          Real-time overview of your library operations
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px', marginBottom: '32px'
      }}>
        {statCards.map((card, index) => (
          <AnimatedCard key={card.key} delay={index * 0.08}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 500, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {card.label}
                </p>
                <div style={{ fontSize: '36px', fontWeight: 800, color: card.color }}>
                  <AnimatedCounter end={stats[card.key] || 0} />
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                style={{
                  width: '60px', height: '60px',
                  background: card.gradient,
                  borderRadius: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '28px',
                  boxShadow: `0 10px 30px -10px ${card.color}60`
                }}
              >
                {card.icon}
              </motion.div>
            </div>
            {/* Progress bar animation */}
            <div style={{
              marginTop: '16px', height: '4px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '2px', overflow: 'hidden'
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '70%' }}
                transition={{ duration: 1.5, delay: index * 0.1, ease: 'easeOut' }}
                style={{
                  height: '100%', borderRadius: '2px',
                  background: card.gradient
                }}
              />
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Total Unpaid Amount Highlight */}
      <AnimatedCard delay={0.8}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: '70px', height: '70px',
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              borderRadius: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px'
            }}
          >
            💵
          </motion.div>
          <div>
            <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 500, textTransform: 'uppercase' }}>
              Total Unpaid Fine Amount
            </p>
            <div style={{ fontSize: '42px', fontWeight: 900, color: '#f59e0b' }}>
              $<AnimatedCounter end={stats.totalUnpaidAmount || 0} duration={2500} />
              <span style={{ fontSize: '20px', color: '#f59e0b80' }}>
                .{((stats.totalUnpaidAmount || 0) % 1 * 100).toFixed(0).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </AnimatedCard>
    </PageTransition>
  );
};

export default Dashboard;