// components/Common/DataTable.jsx
import React from 'react';
import { motion } from 'framer-motion';

const DataTable = ({ columns, data, onEdit, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    style={{
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(30, 41, 59, 0.4))',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      overflow: 'hidden'
    }}
  >
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            {columns.map((col, i) => (
              <th key={i} style={{
                padding: '16px 20px', textAlign: 'left',
                fontSize: '12px', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.05em',
                color: '#94a3b8',
                background: 'rgba(99, 102, 241, 0.05)'
              }}>
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th style={{
                padding: '16px 20px', textAlign: 'center',
                fontSize: '12px', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.05em',
                color: '#94a3b8',
                background: 'rgba(99, 102, 241, 0.05)'
              }}>
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <motion.tr
              key={rowIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: rowIndex * 0.05 }}
              whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.05)' }}
              style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'background 0.2s'
              }}
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} style={{
                  padding: '14px 20px', fontSize: '14px', color: '#e2e8f0'
                }}>
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    {onEdit && (
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(row)}
                        style={{
                          background: 'rgba(99, 102, 241, 0.2)',
                          border: '1px solid rgba(99, 102, 241, 0.3)',
                          color: '#818cf8',
                          padding: '6px 14px', borderRadius: '8px',
                          cursor: 'pointer', fontSize: '12px', fontWeight: 500
                        }}
                      >
                        ✏️ Edit
                      </motion.button>
                    )}
                    {onDelete && (
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(row)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.2)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#f87171',
                          padding: '6px 14px', borderRadius: '8px',
                          cursor: 'pointer', fontSize: '12px', fontWeight: 500
                        }}
                      >
                        🗑️ Delete
                      </motion.button>
                    )}
                  </div>
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
    {data.length === 0 && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          padding: '60px', textAlign: 'center', color: '#64748b'
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
        <p style={{ fontSize: '16px' }}>No data found</p>
      </motion.div>
    )}
  </motion.div>
);

export default DataTable;