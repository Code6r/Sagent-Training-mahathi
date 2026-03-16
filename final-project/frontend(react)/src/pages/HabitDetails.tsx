import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHabits } from '../hooks/useHabits';
import { useTasks } from '../hooks/useTasks';
import { useHistory } from '../hooks/useHistory';
import { HabitHeatmap } from '../components/HabitHeatmap';
import { calculateStreakStats } from '../utils/streakEngine';
import { ArrowLeft, Trash2, Calendar, Target, Award, Zap, Check, Plus, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HabitDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { habits, deleteHabit } = useHabits();
  const { tasks, createTask, deleteTask } = useTasks(Number(id));  // fetch by habitId
  const { history, createHistory } = useHistory();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const habit = habits.find((h) => h.id === Number(id));
  const habitTasks = tasks.filter((t) => t && t.habitId === Number(id));
  const taskIds = habitTasks.map((t) => t.id);
  let stats = { currentStreak: 0, longestStreak: 0, consistencyScore: 0, successProbability: 0 };
  try { stats = calculateStreakStats(history ?? [], taskIds); } catch {}
  const today = new Date().toISOString().split('T')[0];

  if (!habit) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold text-slate-800">Habit not found</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-primary-600 hover:underline font-medium">← Go Back</button>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(`Delete "${habit.name}"? This cannot be undone.`)) {
      deleteHabit(habit.id);
      navigate('/');
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setIsAddingTask(true);
    try {
      createTask({
        habitId: habit.id,
        title: newTaskTitle.trim(),
        completed: false,
        dueDate: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Failed to create task', err);
    } finally {
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  const handleCompleteTask = (taskId: number) => {
    createHistory({ taskId, habitId: Number(id) });
  };

  const difficultyStyle = {
    HARD:   'bg-red-50 text-red-600 border-red-200',
    MEDIUM: 'bg-amber-50 text-amber-600 border-amber-200',
    EASY:   'bg-green-50 text-green-600 border-green-200',
  }[habit.difficulty] ?? 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <header className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 p-2 pl-3 pr-4 border border-slate-200 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 p-2 pl-3 pr-4 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors shadow-sm font-medium text-sm border border-red-100"
        >
          <Trash2 size={16} /> Delete Habit
        </button>
      </header>

      {/* Hero card */}
      <div className="glass-panel p-8 md:p-10 relative overflow-hidden bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl">
        <div className="flex items-start justify-between mb-3">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">{habit.name}</h1>
          <span className={`shrink-0 ml-4 mt-1 px-4 py-1.5 text-sm font-bold uppercase tracking-wider rounded-full border ${difficultyStyle}`}>
            {habit.difficulty}
          </span>
        </div>
        {habit.description && (
          <p className="text-lg text-slate-500 font-medium mb-10">{habit.description}</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Zap className="text-orange-500" size={20} />}  label="Current Streak"  value={stats.currentStreak}     unit="days" bg="bg-orange-50" />
          <StatCard icon={<Award className="text-purple-500" size={20} />} label="Longest Streak"  value={stats.longestStreak}     unit="days" bg="bg-purple-50" />
          <StatCard icon={<Target className="text-blue-500" size={20} />}  label="Consistency"     value={stats.consistencyScore}  unit="%"    bg="bg-blue-50" />
          <StatCard icon={<Calendar className="text-green-500" size={20} />}label="Success Prob."  value={stats.successProbability} unit="%"   bg="bg-green-50" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tasks Panel */}
        <div className="glass-panel p-6 border-slate-200 rounded-2xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-bold text-slate-800">Today's Tasks</h3>
            {habitTasks.length > 0 && (
              <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
                {habitTasks.filter(t => history.some(h => h.taskId === t.id && h.completedAt?.startsWith(today))).length}/{habitTasks.length} done
              </span>
            )}
          </div>

          <div className="space-y-3 mb-5 max-h-72 overflow-y-auto pr-1">
            <AnimatePresence>
              {habitTasks.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-slate-400 text-sm text-center py-8 italic"
                >
                  No tasks yet. Add your first task below!
                </motion.p>
              ) : (
                habitTasks.map((task) => {
                  const isCompletedToday = history.some(
                    (h) => h.taskId === task.id && h.completedAt?.startsWith(today)
                  );
                  return (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        isCompletedToday
                          ? 'bg-primary-50/60 border-primary-200'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => !isCompletedToday && handleCompleteTask(task.id)}
                          disabled={isCompletedToday}
                          className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 border-2 ${
                            isCompletedToday
                              ? 'bg-primary-500 border-primary-500 text-white'
                              : 'bg-white border-slate-300 text-transparent hover:border-primary-400'
                          }`}
                        >
                          <Check size={14} strokeWidth={3} />
                        </motion.button>
                        <span className={`font-medium text-sm truncate ${isCompletedToday ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {task.title}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="shrink-0 ml-2 p-1 text-slate-300 hover:text-red-400 transition-colors rounded-full"
                        title="Delete task"
                      >
                        ×
                      </button>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

          {/* Add Task Form */}
          <form onSubmit={handleAddTask} className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="e.g. Read 10 pages..."
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm bg-slate-50 text-slate-900 placeholder-slate-400"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isAddingTask || !newTaskTitle.trim()}
              className="flex items-center justify-center px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium gap-1.5"
            >
              <Plus size={16} /> Add Task
            </motion.button>
          </form>
        </div>

        {/* Heatmap Panel */}
        <div className="glass-panel p-6 border-slate-200 rounded-2xl">
          <div className="flex items-center gap-2 mb-5">
            <Flame size={18} className="text-orange-500" />
            <h3 className="text-xl font-bold text-slate-800">Activity Heatmap</h3>
          </div>
          <HabitHeatmap history={history} taskIds={taskIds} />
          <p className="text-xs text-slate-400 mt-4 text-center">
            Each cell = 1 day. Green = at least one task completed.
          </p>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon, label, value, unit, bg }: { icon: React.ReactNode; label: string; value: number; unit: string; bg: string }) => (
  <motion.div
    whileHover={{ scale: 1.04 }}
    className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col items-center text-center"
  >
    <div className={`p-3 rounded-full mb-3 ${bg}`}>{icon}</div>
    <div className="text-slate-500 font-semibold text-xs mb-1 uppercase tracking-wide">{label}</div>
    <div className="text-3xl font-black text-slate-800">
      {value}<span className="text-base text-slate-400 font-medium ml-1">{unit}</span>
    </div>
  </motion.div>
);
