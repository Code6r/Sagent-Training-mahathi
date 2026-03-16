import { History } from '../api/types';
import { isSameDay, subDays, startOfDay, isBefore } from 'date-fns';

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  consistencyScore: number;
  successProbability: number;
}

/**
 * Calculate streak stats for a habit.
 * A day counts as "active" if AT LEAST ONE task under this habit was completed on that day.
 */
export const calculateStreakStats = (history: History[], taskIds: number[]): StreakStats => {
  const empty = { currentStreak: 0, longestStreak: 0, consistencyScore: 0, successProbability: 0 };

  if (!history || !taskIds || taskIds.length === 0) return empty;

  // Only consider completions for this habit's tasks — SKIP entries without completedAt
  const taskHistory = history.filter(
    (h) => h && taskIds.includes(h.taskId) && h.completedAt && typeof h.completedAt === 'string'
  );

  if (taskHistory.length === 0) return empty;

  // Get unique active days (day counts if ANY task was completed)
  const uniqueDayTimestamps = [
    ...new Set(
      taskHistory.map((h) => {
        try {
          return startOfDay(new Date(h.completedAt!)).getTime();
        } catch {
          return null;
        }
      }).filter((t): t is number => t !== null && !isNaN(t))
    ),
  ];

  const normalizedDates = uniqueDayTimestamps
    .map((t) => new Date(t))
    .sort((a, b) => b.getTime() - a.getTime()); // most recent first

  if (normalizedDates.length === 0) return empty;

  const today = startOfDay(new Date());

  // ── Current Streak ──────────────────────────────────────────────
  let currentStreak = 0;
  const mostRecent = normalizedDates[0];
  if (isSameDay(mostRecent, today) || isSameDay(mostRecent, subDays(today, 1))) {
    currentStreak = 1;
    for (let i = 1; i < normalizedDates.length; i++) {
      const expected = subDays(normalizedDates[0], i);
      if (isSameDay(normalizedDates[i], expected)) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // ── Longest Streak ───────────────────────────────────────────────
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate: Date | null = null;
  const ascendingDates = [...normalizedDates].reverse();
  for (const d of ascendingDates) {
    if (!lastDate) {
      tempStreak = 1;
    } else {
      const expectedNext = subDays(lastDate, -1);
      if (isSameDay(d, expectedNext)) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    lastDate = d;
    if (tempStreak > longestStreak) longestStreak = tempStreak;
  }

  // ── Consistency Score (last 30 days) ──────────────────────────────
  const thirtyDaysAgo = subDays(today, 30);
  const activeDaysLast30 = normalizedDates.filter((d) => !isBefore(d, thirtyDaysAgo)).length;
  const consistencyScore = Math.min(100, Math.round((activeDaysLast30 / 30) * 100));

  // ── Success Probability ───────────────────────────────────────────
  const streakBonus = Math.min(currentStreak * 2, 20);
  const probability = Math.min(100, Math.max(0, 30 + consistencyScore * 0.5 + streakBonus));

  return {
    currentStreak,
    longestStreak,
    consistencyScore,
    successProbability: Math.round(probability),
  };
};
