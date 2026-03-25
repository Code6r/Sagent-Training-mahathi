import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosClient';

export interface LeaderboardEntry {
  userId: number;
  name: string;
  tasksCompleted: number;
  habitsCompleted: number;
  streak: number;
  score: number;
  rank: number;
}

export const useLeaderboard = () => {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const data = await api.get('/leaderboard');
      return (Array.isArray(data) ? data : []) as LeaderboardEntry[];
    },
    refetchInterval: 30000,
  });
};
