import { useState } from 'react';
import { useHistory } from '../hooks/useHistory';
import { useTasks } from '../hooks/useTasks';
import { format } from 'date-fns';
import { BookOpen, Calendar, Edit3, Smile, Meh, Frown } from 'lucide-react';

export default function Journal() {
  const { history } = useHistory();
  const { tasks } = useTasks();

  const entries = history.filter(h => h.notes || h.mood !== undefined).sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="flex items-center space-x-4">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
          <BookOpen strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Habit Journal</h1>
          <p className="text-slate-500 font-medium">Reflect on your progress and track your mood.</p>
        </div>
      </header>

      <div className="space-y-6">
        {entries.map(entry => {
          const task = tasks.find(t => t.id === entry.taskId);
          if (!task) return null;

          return (
            <div key={entry.id} className="glass-panel p-6 border-slate-200 flex gap-6">
              <div className="flex-shrink-0 flex flex-col items-center justify-start space-y-2 mt-1">
                <div className="text-xs font-bold uppercase text-slate-400">Mood</div>
                {entry.mood === 5 ? <Smile className="text-green-500" size={32} /> : 
                 entry.mood === 3 ? <Meh className="text-amber-500" size={32} /> : 
                 entry.mood === 1 ? <Frown className="text-red-500" size={32} /> : 
                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">?</div>}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-slate-800">{task.title}</h3>
                  <div className="flex items-center text-sm font-medium text-slate-500">
                    <Calendar size={14} className="mr-1.5" />
                    {format(new Date(entry.completedAt), 'MMMM d, yyyy - h:mm a')}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-slate-700 leading-relaxed italic">
                  "{entry.notes || 'No reflections added for this session.'}"
                </div>
              </div>
            </div>
          );
        })}

        {entries.length === 0 && (
          <div className="glass-panel p-12 flex flex-col items-center justify-center text-center border-dashed border-2 bg-slate-50/50">
            <Edit3 size={48} className="text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">Your Journal is Empty</h3>
            <p className="text-slate-500 max-w-sm">When you complete a habit, you can add notes and track your mood. They will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
