import { useMemo } from 'react';
import { Habit, Task, History } from '../api/types';
import { format } from 'date-fns';
import { getStoredUser } from '../utils/auth';

export function useDashboardData(habits: Habit[], tasks: Task[], history: History[]) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const user = getStoredUser();
  const firstName = user?.name?.split(' ')[0] || 'mahathi';

  return useMemo(() => {
    // Momentum Calculations (Today's productivity)
    const totalRelevantTasks = tasks.filter(t => !t.dueDate || t.dueDate === today).length;
    const completedToday = tasks.filter(t => t.completed && (t.dueDate === today || !t.dueDate)).length;
    const momentum = totalRelevantTasks > 0 ? Math.round((completedToday / totalRelevantTasks) * 100) : 0;

    let currentStreak = 0;
    
    // Gather unique completion dates from history
    const historyDates = history.filter(h => h.completedAt).map(h => h.completedAt.split('T')[0]);
    const uniqueDates = Array.from(new Set(historyDates));
    
    let checkDate = new Date();
    let formattedCheck = format(checkDate, 'yyyy-MM-dd');

    // Check if user has history today
    if (uniqueDates.includes(formattedCheck)) {
      while (uniqueDates.includes(formattedCheck)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
        formattedCheck = format(checkDate, 'yyyy-MM-dd');
      }
    } else {
      // If no history today, start checking from yesterday. 
      // Their streak from yesterday is still valid until the end of today.
      checkDate.setDate(checkDate.getDate() - 1);
      formattedCheck = format(checkDate, 'yyyy-MM-dd');
      while (uniqueDates.includes(formattedCheck)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
        formattedCheck = format(checkDate, 'yyyy-MM-dd');
      }
    }

    // Streak & Accuracy Metrics
    const bestStreak = Math.max(currentStreak, ...habits.map(h => h.streaks || 0), habits.length === 0 ? 0 : 0);
    const accuracyText = `${completedToday}/${totalRelevantTasks}`;
    const rank = momentum > 80 ? 'Elite' : momentum > 50 ? 'Pro' : 'Novice';

    // Group habits by category for section rendering
    const categories = ['HEALTH', 'LEARNING', 'CAREER', 'MINDFULNESS'] as const;
    const categorizedHabits = categories.reduce((acc, cat) => {
      acc[cat] = habits.filter(h => h.category === cat);
      return acc;
    }, {} as Record<string, Habit[]>);

    return {
      firstName,
      momentum,
      currentStreak,
      bestStreak,
      accuracyText,
      rank,
      categorizedHabits,
      categories
    };
  }, [habits, tasks, history, today, firstName]);
}
