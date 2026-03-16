import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../hooks/useHabits';
import { useTasks } from '../hooks/useTasks';
import { useHistory } from '../hooks/useHistory';
import { HabitCard } from '../components/HabitCard';
import { CreateHabitModal } from '../components/CreateHabitModal';
import { calculateStreakStats } from '../utils/streakEngine';
import { Plus, Flame, CheckCircle, Target, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { getStoredUser } from '../utils/auth';
import { format } from 'date-fns';

const GREETINGS = ['Good morning', 'Keep going', 'Stay consistent', 'Great work', 'You got this'];

export default function Dashboard() {
  const { habits, createHabit, isLoading: habitsLoading } = useHabits();
  const { tasks, isLoading: tasksLoading } = useTasks();
  const { history, createHistory, isLoading: historyLoading } = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const user = getStoredUser();
  const firstName = user?.name?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toISOString().split('T')[0];
  const todayFormatted = format(new Date(), 'EEEE, MMMM d');

  // Summary stats
  const allTaskIds = tasks.map(t => t.id);
  const completedTodayCount = history.filter(h => h.completedAt?.startsWith(today)).length;
  const habitsWithTasks = habits.filter(h => tasks.some(t => t.habitId === h.id));
  const habitsActiveToday = habitsWithTasks.filter(habit => {
    const habitTasks = tasks.filter(t => t.habitId === habit.id);
    return habitTasks.some(task => history.some(h => h.taskId === task.id && h.completedAt?.startsWith(today)));
  }).length;
  const bestStreak = Math.max(0, ...habits.map(habit => {
    const taskIds = tasks.filter(t => t.habitId === habit.id).map(t => t.id);
    try { return calculateStreakStats(history, taskIds).currentStreak; } catch { return 0; }
  }));
  const overallConsistency = habits.length > 0
    ? Math.round(habits.reduce((sum, habit) => {
        const taskIds = tasks.filter(t => t.habitId === habit.id).map(t => t.id);
        try { return sum + calculateStreakStats(history, taskIds).consistencyScore; } catch { return sum; }
      }, 0) / habits.length)
    : 0;

  const handleCompleteTask = (taskId: number, habitId: number) => createHistory({ taskId, habitId });
  const isLoading = habitsLoading || tasksLoading || historyLoading;

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-10 shadow-2xl"
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-primary-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">{todayFormatted}</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
              {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-emerald-400">{firstName}! 👋</span>
            </h1>
            <p className="text-slate-400 text-base">
              {habits.length === 0
                ? "Let's build your first habit today."
                : `You have ${habits.length} habit${habits.length !== 1 ? 's' : ''} to work on. Keep the momentum going!`}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl hover:bg-slate-100 transition-all shadow-lg font-semibold hover:-translate-y-0.5"
          >
            <Plus size={18} />
            Add Habit
          </button>
        </div>

        {/* Stats Row */}
        {!isLoading && (
          <div className="relative mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: <Target size={16} />, label: 'Total Habits', value: habits.length, color: 'text-blue-400' },
              { icon: <CheckCircle size={16} />, label: 'Active Today', value: `${habitsActiveToday}/${habitsWithTasks.length}`, color: 'text-emerald-400' },
              { icon: <Flame size={16} />, label: 'Best Streak', value: `${bestStreak}d`, color: 'text-orange-400' },
              { icon: <TrendingUp size={16} />, label: 'Consistency', value: `${overallConsistency}%`, color: 'text-purple-400' },
            ].map(({ icon, label, value, color }) => (
              <div key={label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                <div className={`flex items-center gap-2 ${color} mb-2 text-xs font-semibold uppercase tracking-wide`}>
                  {icon} {label}
                </div>
                <p className="text-2xl font-black text-white">{value}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Habits Section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Your Habits</h2>
            <p className="text-sm text-slate-500 mt-0.5">Click a habit to manage tasks and view progress</p>
          </div>
          {habits.length > 0 && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-all font-medium"
            >
              <Plus size={14} /> New Habit
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-44 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : habits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center mb-6 shadow-inner">
              <Sparkles size={32} className="text-primary-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">No Habits Yet</h3>
            <p className="text-slate-500 max-w-sm mb-8">Start your journey by creating your first habit. Small steps lead to big changes!</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-7 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Plus size={18} /> Create Your First Habit
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {habits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
              >
                <HabitCard
                  habit={habit}
                  tasks={tasks}
                  history={history}
                  onComplete={handleCompleteTask}
                  onClick={(id) => navigate(`/habit/${id}`)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Today's Progress Bar (shown only when habits exist) */}
      {!isLoading && habitsWithTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-2xl border-slate-200"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-800">Today's Progress</h3>
            <span className="text-sm font-semibold text-slate-600">
              {habitsActiveToday} / {habitsWithTasks.length} habits active
            </span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: habitsWithTasks.length > 0 ? `${(habitsActiveToday / habitsWithTasks.length) * 100}%` : '0%' }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
              className="h-full bg-gradient-to-r from-primary-400 via-emerald-500 to-primary-600 rounded-full"
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {habitsActiveToday === habitsWithTasks.length && habitsWithTasks.length > 0
              ? '🎉 All habits active today! Amazing work!'
              : `${habitsWithTasks.length - habitsActiveToday} habit${habitsWithTasks.length - habitsActiveToday !== 1 ? 's' : ''} still need attention today`}
          </p>
        </motion.div>
      )}

      <CreateHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => createHabit(data)}
      />
    </div>
  );
}
