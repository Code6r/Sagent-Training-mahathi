import React from 'react';
import { useHabits } from '../hooks/useHabits';
import { useTasks } from '../hooks/useTasks';
import { useHistory } from '../hooks/useHistory';
import { calculateStreakStats } from '../utils/streakEngine';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import { Flame, Target, TrendingUp, CheckCircle } from 'lucide-react';

export default function Analytics() {
  const { habits } = useHabits();
  const { tasks } = useTasks();
  const { history, isLoading } = useHistory();
  const today = startOfDay(new Date());
  const todayStr = today.toISOString().split('T')[0];

  const chartData = Array.from({ length: 30 }, (_, i) => {
    const d = subDays(today, 29 - i);
    const ds = d.toISOString().split('T')[0];
    return { date: format(d, 'MMM dd'), completions: history.filter(h => h.completedAt?.startsWith(ds)).length };
  });

  const habitData = habits.map(h => {
    const tids = tasks.filter(t => t.habitId === h.id).map(t => t.id);
    const s = calculateStreakStats(history, tids);
    return { name: h.name.length > 14 ? h.name.slice(0, 14) + '…' : h.name, fullName: h.name, streak: s.currentStreak, consistency: s.consistencyScore, longest: s.longestStreak, taskCount: tasks.filter(t => t.habitId === h.id).length };
  });

  const avgCons = habitData.length > 0 ? Math.round(habitData.reduce((s, h) => s + h.consistency, 0) / habitData.length) : 0;

  if (isLoading) return <div className="animate-pulse h-96 bg-slate-200 rounded-2xl" />;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Analytics</h1>
        <p className="text-slate-500 font-medium">Your complete habit performance overview.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {([
          { icon: <CheckCircle className="text-primary-500" size={20}/>, label: 'Total Completions', value: history.length, bg: 'bg-primary-50' },
          { icon: <Target className="text-blue-500" size={20}/>, label: 'Active Habits', value: habits.length, bg: 'bg-blue-50' },
          { icon: <Flame className="text-orange-500" size={20}/>, label: "Today's Done", value: history.filter(h => h.completedAt?.startsWith(todayStr)).length, bg: 'bg-orange-50' },
          { icon: <TrendingUp className="text-green-500" size={20}/>, label: 'Avg Consistency', value: `${avgCons}%`, bg: 'bg-green-50' },
        ] as const).map(({ icon, label, value, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-5 shadow-sm border border-white/50`}>
            <div className="flex items-center gap-2 mb-2">{icon}<span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span></div>
            <p className="text-3xl font-black text-slate-800">{value}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel p-8 rounded-2xl">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Task Completions — Last 30 Days</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} interval={4} dy={8}/>
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false}/>
              <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4"/>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,.1)' }}/>
              <Area type="monotone" dataKey="completions" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#cg)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {habitData.length > 0 && (
        <div className="glass-panel p-8 rounded-2xl">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Streak by Habit</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={habitData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }} barSize={28}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} unit="d"/>
                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4"/>
                <Tooltip formatter={(v: number) => [`${v} days`, 'Streak']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,.1)' }}/>
                <Bar dataKey="streak" radius={[8, 8, 0, 0]}>
                  {habitData.map((_, i) => <Cell key={i} fill={`hsl(${160 + i * 40}, 65%, ${50 + (i % 2) * 8}%)`}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {habits.length > 0 && (
        <div className="glass-panel p-8 rounded-2xl">
          <h3 className="text-lg font-bold text-slate-800 mb-5">Habit Summary</h3>
          <div className="space-y-3">
            {habitData.map((h, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{h.fullName}</p>
                  <p className="text-xs text-slate-400">{h.taskCount} tasks</p>
                </div>
                <div className="flex items-center gap-5 shrink-0">
                  <div className="text-center"><p className="text-xs text-slate-400">Streak</p><p className="font-bold text-orange-600">{h.streak}d 🔥</p></div>
                  <div className="text-center"><p className="text-xs text-slate-400">Best</p><p className="font-bold text-purple-600">{h.longest}d</p></div>
                  <div className="w-20">
                    <p className="text-xs text-slate-400 mb-1">30d cons.</p>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full" style={{ width: `${h.consistency}%` }}/>
                    </div>
                    <p className="text-xs text-primary-600 font-semibold mt-0.5 text-right">{h.consistency}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {habits.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg font-medium">No habits yet — add your first habit on the Dashboard!</p>
        </div>
      )}
    </div>
  );
}
