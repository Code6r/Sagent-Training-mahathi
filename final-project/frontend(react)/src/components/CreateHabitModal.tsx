import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Flame, Target, BookOpen, Heart } from 'lucide-react';

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CATEGORIES = [
  { id: 'HEALTH', label: 'Health', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' },
  { id: 'CAREER', label: 'Career', icon: Target, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
  { id: 'LEARNING', label: 'Learning', icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
  { id: 'MINDFULNESS', label: 'Mind', icon: Flame, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100' }
] as const;

const DIFFICULTIES = [
  { id: 'EASY', label: 'Easy', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  { id: 'MEDIUM', label: 'Medium', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  { id: 'HARD', label: 'Hard', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
] as const;

export const CreateHabitModal: React.FC<CreateHabitModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('HEALTH');
  const [difficulty, setDifficulty] = useState<string>('EASY');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = () => {
    setName('');
    setDescription('');
    setCategory('HEALTH');
    setDifficulty('EASY');
    setIsSubmitting(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ 
        name: name.trim(), 
        description: description.trim(), 
        category, 
        difficulty,
        frequency: 'DAILY',
        status: 'ACTIVE'
      });
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create habit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        />

        {/* Modal content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 flex-shrink-0">
            <h2 className="text-xl font-bold text-slate-900">Start New Habit</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Content - Scrollable */}
          <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 scroll-smooth">
            <div className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  What habit do you want to build? <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Read for 30 minutes"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 text-slate-900 text-lg"
                />
              </div>

              {/* Description textarea */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Why is this important? <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us more about your goal..."
                  rows={2}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-slate-300 text-slate-600"
                />
              </div>

              {/* Category Grid */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${
                          category === cat.id
                            ? `border-indigo-500 ${cat.bg} shadow-sm`
                            : 'border-slate-50 bg-slate-50/50 text-slate-500 hover:border-slate-200 hover:bg-white'
                        }`}
                      >
                        <div className={`p-2 rounded-xl ${category === cat.id ? 'bg-white' : 'bg-white shadow-sm'}`}>
                          <Icon size={18} className={cat.color} />
                        </div>
                        <span className={`font-semibold text-sm ${category === cat.id ? 'text-indigo-700' : 'text-slate-600'}`}>
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  How challenging is this?
                </label>
                <div className="flex gap-2">
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff.id}
                      type="button"
                      onClick={() => setDifficulty(diff.id)}
                      className={`flex-1 py-3 px-2 rounded-2xl text-xs font-bold border-2 transition-all ${
                        difficulty === diff.id
                          ? `border-slate-900 bg-slate-900 text-white`
                          : `border-slate-100 bg-white text-slate-400 hover:border-slate-200`
                      }`}
                    >
                      {diff.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Actions (integrated into scroll for mobile, but better as a footer) */}
            <div className="mt-8 flex gap-3 sticky bottom-0 bg-white pt-4 pb-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-4 px-6 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !name.trim()}
                className="flex-[1.5] py-4 px-6 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle size={20} />
                    <span>Create Habit</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
