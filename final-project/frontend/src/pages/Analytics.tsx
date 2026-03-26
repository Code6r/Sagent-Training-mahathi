import React from 'react';
import { useHabits } from '../hooks/useHabits';
import { useTasks } from '../hooks/useTasks';
import { useHistory } from '../hooks/useHistory';
import { calculateStreakStats } from '../utils/streakEngine';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';
import { Flame, Target, TrendingUp, CheckCircle } from 'lucide-react';

export default function Analytics() {
  const { habits } = useHabits();
  const { tasks } = useTasks();
  const { history, isLoading } = useHistory();
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  const chartData = Array.from({ length: 30 }, (_, i) => {
    const d = subDays(today, 29 - i);
    const dayStart = startOfDay(d);
    
    // Count completions for this specific day using robust comparison
    const completionsCount = history.filter(h => {
      if (!h.completedAt) return false;
      try {
        const itemDate = new Date(h.completedAt);
        return isSameDay(itemDate, dayStart);
      } catch {
        return false;
      }
    }).length;

    return { 
      date: format(d, 'MMM dd'), 
      completions: completionsCount 
    };
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Activity Level</h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last 30 Days</span>
          </div>
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
                <Area type="monotone" dataKey="completions" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#cg)" dot={false} activeDot={{ r: 6, strokeWidth: 0 }}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Emotional Well-being</h3>
            <span className="text-xs font-bold text-pink-500 uppercase tracking-widest">Sentiment Trend</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={Array.from({ length: 14 }, (_, i) => {
                  const d = subDays(today, 13 - i);
                  const dayStart = startOfDay(d);
                  
                  const dayHistory = history.filter(h => {
                    if (!h.completedAt) return false;
                    try {
                      return isSameDay(new Date(h.completedAt), dayStart);
                    } catch { return false; }
                  });

                  const avgMood = dayHistory.length > 0 
                    ? dayHistory.reduce((acc, h) => acc + (h.mood || 3), 0) / dayHistory.length 
                    : 3;
                  return { date: format(d, 'MMM dd'), mood: Number(avgMood.toFixed(1)) };
                })} 
                margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} interval={2} dy={8}/>
                <YAxis domain={[1, 5]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4"/>
                <Tooltip 
                  formatter={(v: number) => [v, 'Mood Score']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,.1)' }}
                />
                <Area type="monotone" dataKey="mood" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#mg)" dot={false} activeDot={{ r: 6, strokeWidth: 0 }}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {habitData.length > 0 && (
          <div className="lg:col-span-1 glass-panel p-8 rounded-2xl">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Streak Power</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={habitData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }} barSize={12}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} width={80} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  <Bar dataKey="streak" radius={[0, 4, 4, 0]}>
                    {habitData.map((_, i) => <Cell key={i} fill={`hsl(${160 + i * 40}, 70%, 50%)`}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="lg:col-span-2 glass-panel p-8 rounded-2xl">
            <h3 className="text-lg font-bold text-slate-800 mb-5">Habit Breakdown</h3>
            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {habitData.map((h, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{h.fullName}</p>
                    <div className="flex gap-2 mt-1">
                       <span className="text-[10px] font-black px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded uppercase tracking-tighter">{h.taskCount} tasks</span>
                       <span className="text-[10px] font-black px-1.5 py-0.5 bg-primary-100 text-primary-600 rounded uppercase tracking-tighter">{h.streak}d streak</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Consistency</p>
                      <p className="text-xl font-black text-primary-600 leading-none">{h.consistency}%</p>
                    </div>
                    <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500" style={{ width: `${h.consistency}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>

      {habits.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg font-medium">No habits yet — add your first habit on the Dashboard!</p>
        </div>
      )}
    </div>
  );
}
