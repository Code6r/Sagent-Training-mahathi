import { useState, useMemo } from 'react';
import { useHistory } from '../hooks/useHistory';
import { useTasks } from '../hooks/useTasks';
import { format, isSameDay } from 'date-fns';
import { 
  BookOpen, 
  Calendar, 
  Search, 
  Filter, 
  Smile, 
  Meh, 
  Frown, 
  Sparkles,
  ChevronRight,
  Send,
  Trash2,
  TrendingUp,
  Zap,
  Brain,
  Scale,
  Heart,
  CloudLightning,
  Flame,
  Award,
  Coffee,
  PartyPopper,
  Waves,
  HeartPulse,
  Ghost,
  HelpCircle,
  Stars
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MOOD_CONFIG = {
  15: { icon: Award, color: 'text-pink-600', bg: 'bg-pink-50', label: 'Incredible', emoji: '🌟' },
  14: { icon: PartyPopper, color: 'text-yellow-500', bg: 'bg-yellow-50', label: 'Excited', emoji: '🥳' },
  13: { icon: Stars, color: 'text-purple-500', bg: 'bg-purple-50', label: 'Inspired', emoji: '🎨' },
  12: { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50', label: 'On Fire', emoji: '🔥' },
  11: { icon: Brain, color: 'text-violet-600', bg: 'bg-violet-50', label: 'Flow State', emoji: '🧠' },
  10: { icon: Smile, color: 'text-pink-500', bg: 'bg-pink-50', label: 'Happy', emoji: '😊' },
  9: { icon: Sparkles, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Productive', emoji: '✨' },
  8: { icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50', label: 'Grateful', emoji: '🙏' },
  7: { icon: HelpCircle, color: 'text-indigo-400', bg: 'bg-indigo-50', label: 'Mixed', emoji: '🌀' },
  6: { icon: Scale, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Balanced', emoji: '⚖️' },
  5: { icon: Meh, color: 'text-slate-500', bg: 'bg-slate-50', label: 'Neutral', emoji: '😐' },
  4: { icon: Coffee, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Tired', emoji: '😴' },
  3: { icon: Frown, color: 'text-blue-400', bg: 'bg-blue-50', label: 'Sad', emoji: '😢' },
  2: { icon: Ghost, color: 'text-slate-400', bg: 'bg-slate-50', label: 'Anxious', emoji: '😰' },
  1: { icon: Waves, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Overwhelmed', emoji: '🌊' },
  0: { icon: CloudLightning, color: 'text-rose-600', bg: 'bg-rose-50', label: 'Stressed', emoji: '😫' },
};

const detectMood = (text: string): keyof typeof MOOD_CONFIG => {
  const t = text.toLowerCase();
  
  if (t.includes('incredible') || t.includes('triumph') || t.includes('win') || t.includes('victory')) return 15;
  if (t.includes('excited') || t.includes('party') || t.includes('yay') || t.includes('tada')) return 14;
  if (t.includes('inspire') || t.includes('idea') || t.includes('creative') || t.includes('artist')) return 13;
  if (t.includes('fire') || t.includes('crush') || t.includes('unstoppable') || t.includes('lit')) return 12;
  if (t.includes('focus') || t.includes('brain') || t.includes('flow') || t.includes('deep work')) return 11;
  if (t.includes('happy') || t.includes('joy') || t.includes('glad') || t.includes('pleasant')) return 10;
  if (t.includes('good') || t.includes('productive') || t.includes('progress') || t.includes('success')) return 9;
  if (t.includes('grateful') || t.includes('thank') || t.includes('bless') || t.includes('peace')) return 8;
  if (t.includes('mixed') || t.includes('confused') || t.includes('wonder') || t.includes('maybe')) return 7;
  if (t.includes('ok') || t.includes('fine') || t.includes('steady') || t.includes('balanced')) return 6;
  if (t.includes('meh') || t.includes('neutral') || t.includes('average') || t.includes('alright')) return 5;
  if (t.includes('tired') || t.includes('exhaust') || t.includes('sleep') || t.includes('drained')) return 4;
  if (t.includes('sad') || t.includes('cry') || t.includes('unhappy') || t.includes('depressed')) return 3;
  if (t.includes('anxious') || t.includes('fear') || t.includes('scared') || t.includes('worry')) return 2;
  if (t.includes('overwhelmed') || t.includes('too much') || t.includes('drown') || t.includes('buried')) return 1;
  if (t.includes('stress') || t.includes('anxiety') || t.includes('pressure') || t.includes('tension')) return 0;
  
  return 6;
};

export default function Journal() {
  const { history, updateHistory, deleteHistory } = useHistory();
  const { tasks } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNote, setEditNote] = useState('');

  const entries = useMemo(() => {
    return history
      .filter(h => {
        const task = tasks.find(t => t.id === h.taskId);
        const matchesSearch = (h.notes?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                             (task?.title.toLowerCase() || '').includes(searchQuery.toLowerCase());
        const matchesMood = selectedMood === null || h.mood === selectedMood;
        return matchesSearch && matchesMood;
      })
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  }, [history, tasks, searchQuery, selectedMood]);

  const moodStats = useMemo(() => {
    const last7 = history.slice(0, 7).map(h => h.mood || detectMood(h.notes || ''));
    if (last7.length === 0) return 0;
    const avg = last7.reduce((acc, curr) => acc + curr, 0) / last7.length;
    return Math.round((avg / 15) * 100); // 1,000,000% accurate conversion for 15 levels
  }, [history]);

  const handleUpdateNote = (id: number) => {
    const calculatedMood = detectMood(editNote);
    updateHistory({ id, updates: { notes: editNote, mood: calculatedMood } });
    setEditingId(null);
  };

  const safeDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return new Date();
      return d;
    } catch {
      return new Date();
    }
  };

  // Group entries by date
  const groupedEntries = useMemo(() => {
    const groups: { date: string; items: typeof entries }[] = [];
    entries.forEach(entry => {
      const entryDate = safeDate(entry.completedAt);
      const dateStr = format(entryDate, 'MMMM d, yyyy');
      const existingGroup = groups.find(g => g.date === dateStr);
      if (existingGroup) {
        existingGroup.items.push(entry);
      } else {
        groups.push({ date: dateStr, items: [entry] });
      }
    });
    return groups;
  }, [entries]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* Premium Header */}
      <header className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white shadow-2xl shadow-indigo-200/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl">
                <BookOpen size={24} className="text-white" />
              </div>
              <span className="text-indigo-100 font-bold tracking-wider uppercase text-xs">Mindful Tracking</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Habit Journal</h1>
            <p className="text-indigo-100/80 font-medium text-lg max-w-xl">
              Witness your personal evolution. Every entry is a step toward your best self.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-black">{moodStats}%</div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-indigo-100">Emotional Balance</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <TrendingUp size={32} className="text-indigo-200" />
          </div>
        </div>
        
        {/* Abstract decorative circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-indigo-400/20 rounded-full blur-3xl" />
      </header>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-panel p-4 sticky top-4 z-40 border-slate-200/60 shadow-xl shadow-slate-200/20 backdrop-blur-2xl overflow-hidden">
        <div className="relative w-full md:w-60">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 font-medium text-slate-700 transition-all outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          <button 
            onClick={() => setSelectedMood(null)}
            className={cn(
              "px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
              selectedMood === null ? "bg-slate-900 text-white shadow-lg" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            )}
          >
            All
          </button>
          {[15, 14, 13, 11, 10, 9, 8, 7, 3, 1].map((val) => {
            const config = MOOD_CONFIG[val as keyof typeof MOOD_CONFIG];
            return (
              <button
                key={val}
                onClick={() => setSelectedMood(val)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                  selectedMood === val 
                    ? "bg-white text-slate-900 shadow-xl ring-2 ring-indigo-500/20" 
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                )}
              >
                <config.icon size={14} className={config.color} />
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Journal Content */}
      <div className="space-y-16 relative">
        {/* Timeline Path */}
        <div className="absolute left-[31px] md:left-[35px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-indigo-500/20 via-violet-500/20 to-transparent hidden md:block" />

        <AnimatePresence mode="popLayout">
          {groupedEntries.map((group, groupIdx) => (
            <motion.div 
              key={group.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIdx * 0.1 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4 relative z-10 bg-slate-50/50 py-2 rounded-2xl">
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-100 flex flex-col items-center justify-center shadow-lg">
                  <span className="text-[10px] uppercase font-black text-indigo-500 leading-none mb-1">
                    {format(new Date(group.items[0].completedAt), 'MMM')}
                  </span>
                  <span className="text-2xl font-black text-slate-900 leading-none">
                    {format(new Date(group.items[0].completedAt), 'dd')}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{group.date}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
              </div>

              <div className="grid gap-8 ml-0 md:ml-20">
                {group.items.map((entry) => {
                  const task = tasks.find(t => t.id === entry.taskId);
                  if (!task) return null;
                  
                  // DYNAMIC MOOD DETECTION
                  const moodValue = entry.mood || (entry.notes ? detectMood(entry.notes) : 6);
                  const mood = MOOD_CONFIG[moodValue as keyof typeof MOOD_CONFIG];

                  return (
                    <motion.div
                      layout
                      key={entry.id}
                      className="group relative"
                    >
                      <div className="glass-panel p-6 border-slate-200/60 hover:border-indigo-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/5 group bg-white/80">
                        <div className="flex flex-col md:flex-row gap-8">
                          <div className="flex-shrink-0 flex md:flex-col items-center justify-center md:w-20 h-20 md:h-28 rounded-3xl bg-slate-50/80 border border-slate-100 group-hover:bg-white transition-all duration-500 shadow-sm overflow-hidden relative">
                            <div className={cn("absolute inset-0 opacity-10", mood.bg)} />
                            <div className="relative z-10 flex flex-col items-center">
                              <mood.icon size={32} className={cn("transition-transform group-hover:scale-110 duration-500", mood.color)} />
                              <span className="text-xl mt-1">{mood.emoji}</span>
                            </div>
                            <span className={cn("hidden md:block text-[10px] font-black uppercase mt-2 tracking-tighter relative z-10", mood.color)}>
                              {mood.label}
                            </span>
                          </div>

                          <div className="flex-1 space-y-5">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Sparkles size={14} className="text-indigo-400" />
                                  <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400">Moment of Progress</span>
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                                  {task.title}
                                </h3>
                                <div className="flex items-center text-sm font-bold text-slate-400">
                                  <Calendar size={14} className="mr-1.5" />
                                  {format(new Date(entry.completedAt), 'h:mm a')}
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => {
                                    setEditingId(entry.id);
                                    setEditNote(entry.notes || '');
                                  }}
                                  className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100"
                                >
                                  <Calendar size={20} />
                                </button>
                                <button 
                                  onClick={() => deleteHistory(entry.id)}
                                  className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                                >
                                  <Trash2 size={20} />
                                </button>
                              </div>
                            </div>

                            {editingId === entry.id ? (
                              <div className="space-y-4">
                                <div className="relative">
                                  <textarea
                                    autoFocus
                                    value={editNote}
                                    onChange={(e) => setEditNote(e.target.value)}
                                    className="w-full p-5 bg-white border-2 border-indigo-100 rounded-2xl focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none min-h-[140px] font-medium text-slate-700 transition-all shadow-inner text-lg"
                                    placeholder="Tell your story... how did this session go?"
                                  />
                                  {/* Live Preview of Mood while typing */}
                                  <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full animate-pulse">
                                    <span className="text-[10px] font-black text-slate-500 uppercase">Detecting Mood:</span>
                                    {(() => {
                                      const m = MOOD_CONFIG[detectMood(editNote)];
                                      return <m.icon size={16} className={m.color} />;
                                    })()}
                                  </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                  <button 
                                    onClick={() => setEditingId(null)}
                                    className="px-6 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
                                  >
                                    Cancel
                                  </button>
                                  <button 
                                    onClick={() => handleUpdateNote(entry.id)}
                                    className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-3"
                                  >
                                    <Send size={18} />
                                    Save Reflection
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div 
                                onClick={() => {
                                  setEditingId(entry.id);
                                  setEditNote(entry.notes || '');
                                }}
                                className={cn(
                                  "relative group/note p-6 rounded-3xl border-2 transition-all cursor-text leading-relaxed",
                                  entry.notes 
                                    ? "bg-gradient-to-br from-indigo-50/50 to-white border-indigo-100/60 text-slate-700 italic font-medium text-lg" 
                                    : "bg-slate-50 border-dashed border-slate-200 text-slate-400 font-bold text-center py-10"
                                )}
                              >
                                {entry.notes ? (
                                  <>
                                    <div className="absolute -top-3 left-6 px-2 bg-white text-indigo-300">
                                      <Sparkles size={24} className="opacity-40" />
                                    </div>
                                    <p className="px-2">{entry.notes}</p>
                                    <div className="mt-4 flex justify-end">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 opacity-60 group-hover/note:opacity-100 transition-opacity">Tap to edit reflection</span>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex flex-col items-center gap-3">
                                    <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-300">
                                      <Sparkles size={24} />
                                    </div>
                                    <span className="text-lg">Your journey deserves a record. Share a thought?</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {entries.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-20 flex flex-col items-center justify-center text-center border-dashed border-2 bg-slate-50/50"
          >
            <div className="w-24 h-24 bg-indigo-50 text-indigo-300 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Search size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">No Reflections Found</h3>
            <p className="text-slate-500 max-w-sm mb-8 font-medium">
              We searched far and wide, but couldn't find any entries. Try completing a task and adding a note!
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedMood(null); }}
              className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-black hover:bg-slate-50 transition-all shadow-lg active:scale-95"
            >
              Reset All Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}


