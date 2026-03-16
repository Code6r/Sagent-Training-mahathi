import { isSameDay, subDays } from 'date-fns';
import { History } from '../api/types';

export const generateHeatmapData = (history: History[], days: number = 365) => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const targetDate = subDays(today, i);
    // Count how many tasks were completed on this exact date
    const count = history.filter(h => isSameDay(new Date(h.completedAt), targetDate)).length;
    data.push({
      date: targetDate.toISOString().split('T')[0],
      count,
    });
  }
  
  return data;
};
