import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../hooks/useHabits';
import { useTasks } from '../hooks/useTasks';
import { useHistory } from '../hooks/useHistory';
import { useDashboardData } from '../hooks/useDashboardData';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { HabitCard } from '../components/HabitCard';
import { CreateHabitModal } from '../components/CreateHabitModal';
import { FireIcon } from '../components/FireIcon';
import { getStoredUser, getStoredUserId } from '../utils/auth';
import { 
  Plus, 
  Activity, 
  Flame, 
  Star,
  LayoutDashboard,
  Sparkles,
  Book,
  Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const CATEGORY_ICONS: Record<string, any> = {
  HEALTH: Activity,
  LEARNING: Book,
  CAREER: Briefcase,
  MINDFULNESS: Sparkles,
};

export default function Dashboard() {
  const { habits, createHabit, isLoading: habitsLoading } = useHabits();
  const { tasks, isLoading: tasksLoading, updateTask } = useTasks();
  const { history, isLoading: historyLoading } = useHistory();
  const { data: leaderboard, isLoading: leaderboardLoading } = useLeaderboard();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { 
    firstName, 
    momentum, 
    currentStreak, 
    bestStreak, 
    accuracyText, 
    rank, 
    categorizedHabits, 
    categories 
  } = useDashboardData(habits, tasks, history);

  const todayDisplay = format(new Date(), 'EEEE, MMMM d').toUpperCase();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const handleCompleteTask = (taskId: number) => {
    updateTask({ id: taskId, data: { completed: true } });
  };

  const isLoading = habitsLoading || tasksLoading || historyLoading || leaderboardLoading;

  const currentUserId = getStoredUserId();
  const userLeaderboardEntry = leaderboard?.find(u => u.userId === currentUserId);
  const displayRank = userLeaderboardEntry 
    ? (userLeaderboardEntry.rank === 1 ? '🥇 Champion' : userLeaderboardEntry.rank <= 3 ? `🌟 Top ${userLeaderboardEntry.rank}` : `#${userLeaderboardEntry.rank} Global`) 
    : rank;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <p className="text-[11px] font-black text-indigo-500 tracking-[0.2em] uppercase font-outfit mb-4">
            {todayDisplay}
          </p>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight font-outfit leading-[1.1]">
            {greeting}, <span className="text-indigo-600">{firstName.toLowerCase()}.</span>
          </h1>
          <p className="text-lg text-slate-400 font-medium tracking-tight mt-4">
            Your momentum is at <span className="text-slate-900 font-bold">{momentum}%</span> consistency today. Ready to push further?
          </p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-3 bg-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all font-outfit"
        >
          <Plus size={20} strokeWidth={3} />
          <span>New Initiative</span>
        </motion.button>
      </div>

      {/* Top Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: LayoutDashboard, label: 'Completion', value: `${momentum}%`, tag: '', color: '' },
          { icon: (props: any) => <FireIcon streakActive={currentStreak > 0} color="currentColor" {...props} />, label: 'Current Streak', value: `${currentStreak}d`, tag: 'ACTIVE', color: '', iconBg: 'bg-orange-50', iconColor: currentStreak > 0 ? 'text-orange-500' : 'text-slate-400' },
          { icon: Activity, label: 'Accuracy', value: accuracyText, tag: 'DAILY', color: '' },
          { icon: Star, label: 'Global Rank', value: displayRank, tag: userLeaderboardEntry ? `${userLeaderboardEntry.score.toLocaleString()} PTS` : '0 PTS', color: 'text-indigo-600' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2rem] p-8 border border-slate-50 shadow-sm flex flex-col justify-between h-44 group hover:border-indigo-100 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${stat.iconBg || 'bg-indigo-50'} ${stat.iconColor || 'text-indigo-600'}`}>
                <stat.icon size={20} />
              </div>
              {stat.tag && <span className="text-[9px] font-black text-slate-300 tracking-widest uppercase font-outfit">{stat.tag}</span>}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-outfit mb-1">{stat.label}</p>
              <p className={`text-3xl font-black text-slate-900 font-outfit ${stat.color}`}>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Today's Focus */}
      <div className="space-y-10">
        <div className="flex items-center space-x-4">
          <div className="w-1 h-6 bg-indigo-600 rounded-full" />
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase font-outfit">Today's Focus</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {habits.slice(0, 3).map((habit) => (
             <HabitCard 
               key={habit.id}
               habit={habit}
               tasks={tasks}
               history={history}
               onComplete={handleCompleteTask}
               onClick={(id) => navigate(`/habit/${id}`)}
             />
           ))}
        </div>
      </div>

      {/* Categorized Sections */}
      <div className="space-y-16">
        {categories.map((category) => {
          const catHabits = categorizedHabits[category] || [];
          if (catHabits.length === 0) return null;
          const Icon = CATEGORY_ICONS[category] || Activity;

          return (
            <div key={category} className="space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                    <Icon size={18} />
                  </div>
                  <h2 className="text-sm font-black text-slate-900 tracking-[0.2em] uppercase font-outfit">
                    {category} <span className="ml-2 text-slate-300 font-medium">{catHabits.length}</span>
                  </h2>
                </div>
                <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors font-outfit">
                  View All &rarr;
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {catHabits.map((habit) => (
                   <HabitCard 
                     key={habit.id}
                     habit={habit}
                     tasks={tasks}
                     history={history}
                     onComplete={handleCompleteTask}
                     onClick={(id) => navigate(`/habit/${id}`)}
                   />
                 ))}
              </div>
            </div>
          );
        })}
      </div>

      <CreateHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => createHabit(data)}
      />
    </div>
  );
}
