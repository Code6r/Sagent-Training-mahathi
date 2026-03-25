import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Book, 
  Briefcase, 
  Sparkles, 
  ChevronRight,
  Check
} from 'lucide-react';
import { Habit, Task, History } from '../api/types';
import { format } from 'date-fns';

interface HabitCardProps {
  habit: Habit;
  tasks: Task[];
  history: History[];
  onComplete: (taskId: number, habitId: number) => void;
  onClick: (habitId: number) => void;
}

const CATEGORY_MAP: Record<string, { icon: any; color: string; bg: string }> = {
  HEALTH:      { icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  LEARNING:    { icon: Book,     color: 'text-indigo-500',  bg: 'bg-indigo-50' },
  CAREER:      { icon: Briefcase, color: 'text-blue-500',    bg: 'bg-blue-50' },
  MINDFULNESS: { icon: Sparkles,  color: 'text-amber-500',   bg: 'bg-amber-50' },
};

export const HabitCard: React.FC<HabitCardProps> = ({ habit, tasks, history, onComplete, onClick }) => {
  const habitTasks = tasks.filter((t) => t && t.habitId === habit.id);
  const today = format(new Date(), 'yyyy-MM-dd');
  const safeHistory = history ?? [];

  const tasksCompletedToday = habitTasks.filter((task) =>
    task.completed || safeHistory.some((h) => h && h.taskId === task.id && h.completedAt?.startsWith?.(today))
  );

  const completedCount = tasksCompletedToday.length;
  const totalTasks = habitTasks.length;
  const progressPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const isAllDone = totalTasks > 0 && completedCount === totalTasks;

  const cat = CATEGORY_MAP[habit.category ?? ''] ?? CATEGORY_MAP.HEALTH;
  const Icon = cat.icon;

  return (
    <motion.div
      whileHover={{ y: -4, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
      onClick={() => onClick(habit.id)}
      className="bg-white rounded-[2.5rem] border border-slate-100 p-8 cursor-pointer transition-all duration-300 shadow-sm relative group"
    >
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center space-x-5">
          <div className={`${cat.bg} ${cat.color} p-4 rounded-2xl shadow-inner`}>
            <Icon size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-[22px] font-black text-slate-900 tracking-tight leading-none mb-2 font-outfit uppercase">
              {habit.name}
            </h3>
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border tracking-widest uppercase ${cat.bg} ${cat.color} border-current/10`}>
              {habit.category}
            </span>
          </div>
        </div>
        
        {habit.streaks && habit.streaks > 0 && (
          <div className="flex items-center space-x-1.5 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-xl border border-orange-100">
            <Sparkles size={14} className="fill-orange-500" />
            <span className="text-xs font-black font-outfit">{habit.streaks}d</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-outfit">Progress</span>
          <span className="text-sm font-black text-slate-900 font-outfit">{progressPct}%</span>
        </div>
        
        <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className={`h-full rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] shadow-[0_0_12px_rgba(99,102,241,0.4)]`}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2 text-slate-400">
            <div className="flex space-x-1">
              {[1, 2, 3].map(i => (
                <div key={i} className={`w-1 h-3 rounded-full ${i <= completedCount ? 'bg-indigo-400' : 'bg-slate-200'}`} />
              ))}
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider font-outfit">
              {completedCount}/{totalTasks} Daily Steps
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {isAllDone ? (
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                <Check size={20} strokeWidth={3} />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-400 transition-colors group-hover:translate-x-1 duration-300">
                <ChevronRight size={24} strokeWidth={2.5} />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
