import { isSameDay, subDays } from 'date-fns';
import { History } from '../api/types';

export const generateHeatmapData = (history: History[], days: number = 365) => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const targetDate = subDays(today, i);
    // Count how many tasks were completed on this exact date
    let count = 0;
    try {
      count = history.filter(h => h.completedAt && isSameDay(new Date(h.completedAt), targetDate)).length;
    } catch (e) {
      count = 0;
    }
    data.push({
      date: targetDate.toISOString().split('T')[0],
      count,
    });
  }
  
  return data;
};
