import { Habit, History } from '../api/types';

// In a real production system, this would call an AI model via an API endpoint.
// We implement a deterministic predictor based on heuristics for client-side demo if no AI is available.
export const predictSkipProbability = async (habit: Habit, history: History[]): Promise<number> => {
  // Mock logic: 
  const recentCompletions = history.filter(h => new Date(h.completedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  if (recentCompletions.length === 0) return 85; 
  if (recentCompletions.length >= 7) return 5;
  
  let skipProb = 50;
  
  if (habit.difficulty === 'HARD') skipProb += 20;
  if (habit.difficulty === 'EASY') skipProb -= 15;
  
  skipProb -= (recentCompletions.length * 5);
  
  return Math.min(100, Math.max(0, skipProb));
};
