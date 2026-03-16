import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, BarChart2, Zap, Book, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/analytics', label: 'Analytics', icon: BarChart2 },
  { path: '/ai-insights', label: 'AI Coach', icon: Zap },
  { path: '/journal', label: 'Journal', icon: Book },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-200/50 bg-white/50 backdrop-blur-xl flex flex-col pt-8 pb-4">
        <div className="px-8 pb-8 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-500 to-primary-300 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
            <Target size={18} />
          </div>
          <span className="font-semibold text-lg tracking-tight">Ascend AI</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`relative flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive ? 'text-primary-700 font-medium' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className="absolute inset-0 bg-primary-50/80 rounded-lg -z-10"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Focus Mode Button */}
        <div className="px-4 space-y-3">
          <NavLink
            to="/focus"
            className="flex items-center justify-center space-x-2 w-full py-2.5 bg-slate-900 text-white rounded-lg shadow-md hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            <Target size={16} />
            <span>Enter Focus Mode</span>
          </NavLink>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            className="flex items-center justify-center space-x-2 w-full py-2.5 bg-red-50 text-red-600 rounded-lg shadow-sm hover:bg-red-100 transition-colors text-sm font-medium border border-red-100"
          >
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto p-8 pt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
