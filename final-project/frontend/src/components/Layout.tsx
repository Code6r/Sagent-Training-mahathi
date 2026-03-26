import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  History, 
  Activity, 
  Zap, 
  BookOpen, 
  LogOut, 
  Target,
  CircuitBoard,
  Trophy,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStoredUser } from '../utils/auth';

const NAV_ITEMS = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/progress-history', label: 'History', icon: History },
  { path: '/analytics', label: 'Performance', icon: Activity },
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { path: '/ai-insights', label: 'AI Coach', icon: Zap },
  { path: '/journal', label: 'Journal', icon: BookOpen },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col pt-8 pb-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="px-7 mb-10 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <CircuitBoard size={22} strokeWidth={2.5} />
          </div>
          <div>
            <span className="block font-black text-xl text-slate-900 tracking-tight leading-none">Habit Tracker</span>
            <span className="block text-[10px] font-bold text-slate-400 tracking-[0.1em] mt-1 uppercase">habit and task tracker</span>
          </div>
        </div>

        <div className="px-6 mb-4">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-2 mb-4">Main Menu</p>
          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 group ${
                    isActive 
                      ? 'text-[#4F46E5] font-bold bg-indigo-50/50' 
                      : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeBar"
                      className="absolute left-0 w-1 h-6 bg-[#4F46E5] rounded-r-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-[#4F46E5]' : 'group-hover:text-slate-600'} />
                  <span className="tracking-tight">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto px-6 space-y-4">
          <NavLink
            to="/focus"
            className="flex items-center justify-center space-x-2.5 w-full py-3.5 bg-slate-900 text-white rounded-xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 group"
          >
            <div className="bg-white/10 p-1.5 rounded-lg border border-white/10 group-hover:rotate-12 transition-transform">
              <Target size={14} />
            </div>
            <span className="text-sm font-bold tracking-tight">Focus Intelligence</span>
          </NavLink>
          
          <button
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 w-full py-3 text-slate-400 hover:text-rose-600 transition-colors text-sm font-bold group"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-[1400px] mx-auto p-10 pt-12 min-h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3, ease: "circOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
