import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, CheckCircle2, Calendar, ClipboardList, Target, AlertCircle, Clock, Search, ListFilter, ArrowUpDown } from 'lucide-react';
import api from '../api/axiosClient';
import { getStoredUserId } from '../utils/auth';

interface ProgressItem {
  id: any;
  name: string;
  type: 'HABIT' | 'TASK';
  completedDate: string;
  status: string;
}

export default function ProgressHistory() {
  const [items, setItems] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'TASK' | 'HABIT'>('ALL');
  const [sortBy, setSortBy] = useState<'DATE' | 'NAME' | 'STATUS'>('DATE');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userId = getStoredUserId();
        const data = await api.get(`/progress/history?userId=${userId}`);
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching progress history:', err);
        setError('Failed to load progress history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredItems = items
    .filter(item => {
      if (!item || !item.name) return false;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'NAME') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'STATUS') return (a.status || '').localeCompare(b.status || '');
      return (b.completedDate || '').localeCompare(a.completedDate || '');
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] p-6 bg-red-50 rounded-2xl border border-red-100">
        <p className="text-red-600 font-medium mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary-100 text-primary-600 rounded-2xl shadow-sm">
            <History size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Progress History</h1>
            <p className="text-slate-500 font-medium">Review your journey of consistency and growth.</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <ListFilter size={18} className="text-slate-400" />
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="ALL">All Types</option>
            <option value="TASK">Tasks Only</option>
            <option value="HABIT">Habits Only</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown size={18} className="text-slate-400" />
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="DATE">Newest First</option>
            <option value="NAME">By Name</option>
            <option value="STATUS">By Status</option>
          </select>
        </div>
      </div>

      <div className="glass-panel overflow-hidden border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Item Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Completion Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white/30">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    No matching items found. 🚀
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={item.id} 
                    className="hover:bg-primary-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          item.type === 'HABIT' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {item.type === 'HABIT' ? <Target size={18} /> : <ClipboardList size={18} />}
                        </div>
                        <span className="font-semibold text-slate-700 group-hover:text-primary-600 transition-colors">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                        item.type === 'HABIT' 
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-slate-500 space-x-1.5">
                        <Calendar size={14} />
                        <span className="text-sm font-medium">{item.completedDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.status === 'Completed' ? (
                        <div className="flex items-center text-emerald-600 space-x-1.5 bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100">
                          <CheckCircle2 size={14} />
                          <span className="text-xs font-bold uppercase tracking-tight">{item.status}</span>
                        </div>
                      ) : item.status === 'Overdue' ? (
                        <div className="flex items-center text-rose-600 space-x-1.5 bg-rose-50 w-fit px-3 py-1 rounded-full border border-rose-100">
                          <AlertCircle size={14} />
                          <span className="text-xs font-bold uppercase tracking-tight">{item.status}</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-slate-500 space-x-1.5 bg-slate-100 w-fit px-3 py-1 rounded-full border border-slate-200">
                          <Clock size={14} />
                          <span className="text-xs font-bold uppercase tracking-tight">{item.status}</span>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
