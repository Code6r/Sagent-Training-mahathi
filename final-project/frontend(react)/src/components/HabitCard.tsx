import React from 'react';
import { motion } from 'framer-motion';
import { Check, Flame, ChevronRight, ListTodo } from 'lucide-react';
import { Habit, Task, History } from '../api/types';
import { calculateStreakStats } from '../utils/streakEngine';

interface HabitCardProps {
  habit: Habit;
  tasks: Task[];
  history: History[];
  onComplete: (taskId: number, habitId: number) => void;
  onClick: (habitId: number) => void;
}

const categoryConfig: Record<string, { gradient: string; badge: string; text: string; emoji: string }> = {
  HEALTH:      { gradient: 'from-emerald-500/10 to-green-500/5',    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', text: 'text-emerald-600', emoji: '💪' },
  CAREER:      { gradient: 'from-blue-500/10 to-indigo-500/5',      badge: 'bg-blue-100 text-blue-700 border-blue-200',         text: 'text-blue-600',    emoji: '🚀' },
  LEARNING:    { gradient: 'from-purple-500/10 to-violet-500/5',    badge: 'bg-purple-100 text-purple-700 border-purple-200',    text: 'text-purple-600',  emoji: '📚' },
  MINDFULNESS: { gradient: 'from-amber-500/10 to-orange-500/5',     badge: 'bg-amber-100 text-amber-700 border-amber-200',       text: 'text-amber-600',   emoji: '🧘' },
};

const difficultyDots: Record<string, { dots: number; color: string }> = {
  EASY:   { dots: 1, color: 'bg-green-400' },
  MEDIUM: { dots: 2, color: 'bg-amber-400' },
  HARD:   { dots: 3, color: 'bg-red-400' },
};

const capitalize = (s?: string) => (s ? s.charAt(0) + s.slice(1).toLowerCase() : '');

export const HabitCard: React.FC<HabitCardProps> = ({ habit, tasks, history, onComplete, onClick }) => {
  const habitTasks = tasks.filter((t) => t && t.habitId === habit.id);
  const taskIds = habitTasks.map((t) => t.id);

  let stats = { currentStreak: 0, longestStreak: 0, consistencyScore: 0, successProbability: 0 };
  try { stats = calculateStreakStats(history ?? [], taskIds); } catch {}

  const today = new Date().toISOString().split('T')[0];
  const safeHistory = history ?? [];

  const tasksCompletedToday = habitTasks.filter((task) =>
    safeHistory.some((h) => h && h.taskId === task.id && h.completedAt?.startsWith?.(today))
  );
  const completedCount = tasksCompletedToday.length;
  const totalTasks = habitTasks.length;
  const isActiveToday = completedCount > 0;
  const allDoneToday = totalTasks > 0 && completedCount === totalTasks;
  const progressPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const cat = categoryConfig[habit.category ?? ''] ?? categoryConfig.HEALTH;
  const diff = difficultyDots[habit.difficulty ?? ''] ?? difficultyDots.EASY;

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (totalTasks === 0) return;
    const nextTask = habitTasks.find(
      (task) => !safeHistory.some((h) => h && h.taskId === task.id && h.completedAt?.startsWith?.(today))
    );
    if (nextTask) onComplete(nextTask.id, habit.id);
  };

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={() => onClick(habit.id)}
      className={`relative overflow-hidden cursor-pointer bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-shadow group ${
        isActiveToday ? 'border-emerald-200 shadow-emerald-100' : 'border-slate-200'
      }`}
    >
      {/* Category gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} pointer-events-none`} />

      {/* Active today glow stripe */}
      {isActiveToday && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-primary-500" />
      )}

      <div className="relative p-5">
        {/* Top Row: emoji + name + category badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`text-2xl shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${cat.badge.split(' ')[0]}`}>
              {cat.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 text-base leading-tight truncate">
                {habit.name || 'Unnamed Habit'}
              </h3>
              {habit.description && (
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{habit.description}</p>
              )}
            </div>
          </div>
          <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full border ${cat.badge}`}>
            {capitalize(habit.category) || 'Health'}
          </span>
        </div>

        {/* Difficulty dots */}
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3].map(n => (
            <div key={n} className={`w-1.5 h-1.5 rounded-full ${n <= diff.dots ? diff.color : 'bg-slate-200'}`} />
          ))}
          <span className="text-[10px] text-slate-400 ml-1 font-medium">{capitalize(habit.difficulty) || 'Easy'}</span>
        </div>

        {/* Task Progress */}
        {totalTasks > 0 ? (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <ListTodo size={11} /> {completedCount}/{totalTasks} tasks today
              </span>
              {allDoneToday ? (
                <span className="text-emerald-600 font-bold">✓ Complete!</span>
              ) : isActiveToday ? (
                <span className="text-primary-600 font-semibold">{progressPct}%</span>
              ) : null}
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`h-full rounded-full ${allDoneToday ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-primary-400 to-primary-600'}`}
              />
            </div>
          </div>
        ) : (
          <div className="mb-4 text-xs text-slate-400 italic flex items-center gap-1">
            <ListTodo size={11} /> Click to add tasks
          </div>
        )}

        {/* Footer: streak + action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
              stats.currentStreak > 0 ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
            }`}>
              <Flame size={12} className={stats.currentStreak > 0 ? 'text-orange-500' : 'text-slate-300'} />
              {stats.currentStreak}d
            </div>
            {stats.consistencyScore > 0 && (
              <span className="text-xs text-slate-400 font-medium">{stats.consistencyScore}% consistent</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleComplete}
              disabled={allDoneToday || totalTasks === 0}
              title={totalTasks === 0 ? 'Add tasks first' : allDoneToday ? 'All done!' : 'Mark next task done'}
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                allDoneToday
                  ? 'bg-emerald-500 text-white shadow-md'
                  : isActiveToday
                  ? 'bg-primary-100 text-primary-600 border border-primary-200 hover:bg-primary-200'
                  : totalTasks === 0
                  ? 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 hover:bg-primary-100 hover:text-primary-600 hover:border-primary-200'
              }`}
            >
              <Check size={15} strokeWidth={3} />
            </motion.button>
            <ChevronRight size={15} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
