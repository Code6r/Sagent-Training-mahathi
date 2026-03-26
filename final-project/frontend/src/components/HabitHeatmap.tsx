import React from 'react';
import { generateHeatmapData } from '../utils/heatmapGenerator';
import { History } from '../api/types';

interface HabitHeatmapProps {
  history: History[];
  taskIds?: number[];
}

export const HabitHeatmap: React.FC<HabitHeatmapProps> = ({ history, taskIds }) => {
  const filteredHistory = taskIds ? history.filter(h => taskIds.includes(h.taskId)) : history;
  const data = generateHeatmapData(filteredHistory, 365); // 1 year data
  
  // Create weeks array for rendering
  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  const getColor = (count: number) => {
    if (count === 0) return 'bg-slate-100 hover:bg-slate-200';
    if (count === 1) return 'bg-emerald-200 hover:bg-emerald-300';
    if (count === 2) return 'bg-emerald-400 hover:bg-emerald-500';
    if (count === 3) return 'bg-emerald-600 hover:bg-emerald-700';
    return 'bg-emerald-800 hover:bg-emerald-900';
  };

  return (
    <div className="flex bg-white/50 p-6 rounded-2xl border border-slate-100 overflow-x-auto custom-scrollbar shadow-inner">
      <div className="flex gap-1 min-w-max">
        {weeks.map((week, wIndex) => (
          <div key={wIndex} className="flex flex-col gap-1">
            {week.map((day, _dIndex) => (
              <div
                key={day.date}
                title={`${day.count} completed on ${day.date}`}
                className={`w-3.5 h-3.5 rounded-sm transition-colors duration-200 cursor-pointer ${getColor(day.count)}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
