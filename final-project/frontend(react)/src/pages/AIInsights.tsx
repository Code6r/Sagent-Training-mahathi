import React, { useState } from 'react';
import { generateCoachResponse } from '../ai/aiCoach';
import { generateHabitPlan } from '../ai/aiHabitGenerator';
import { motion } from 'framer-motion';
import { Send, Bot, Sparkles } from 'lucide-react';

export default function AIInsights() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: "Hello! I'm your AI Habit Coach. How can I assist you with your goals today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [goalInput, setGoalInput] = useState('');
  const [plan, setPlan] = useState<string[]>([]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setLoading(true);

    const aiRes = await generateCoachResponse(userText, { currentStreak: 5, category: 'HEALTH' });
    
    setMessages(prev => [...prev, { role: 'ai', text: aiRes }]);
    setLoading(false);
  };

  const handleGeneratePlan = async () => {
    if (!goalInput.trim()) return;
    setLoading(true);
    const result = await generateHabitPlan(goalInput);
    setPlan(result);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-8rem)]">
      {/* AI Coach Chat */}
      <div className="flex flex-col glass-panel overflow-hidden border-slate-200">
        <div className="p-6 border-b border-slate-100 bg-white/50 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-400 flex justify-center items-center text-white shadow-md">
            <Bot size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">AI Coach Assistant</h2>
            <p className="text-xs text-slate-500 font-medium">Always here to help you</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i} 
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                m.role === 'user' 
                  ? 'bg-slate-900 text-white rounded-tr-sm' 
                  : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
              }`}>
                {m.text}
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-sm flex space-x-2 w-20">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="p-4 bg-white/80 border-t border-slate-100 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your habits..."
            className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-inner"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="p-3.5 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30 flex items-center justify-center disabled:opacity-50"
          >
            <Send size={20} className="ml-1" />
          </button>
        </form>
      </div>

      {/* AI Generator */}
      <div className="glass-panel p-8 border-slate-200 flex flex-col">
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 text-indigo-600 font-bold bg-indigo-50 px-3 py-1.5 rounded-lg mb-4 text-sm">
            <Sparkles size={16} />
            <span>Habit Plan Generator</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Build a new routine</h2>
          <p className="text-slate-500">Tell us your goal, and our AI will build a personalized habit track for you.</p>
        </div>

        <div className="space-y-4 flex-1">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">What is your ultimate goal?</label>
            <input 
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="e.g. Become a Sr Frontend Developer"
              className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm" 
            />
          </div>
          <button 
            onClick={handleGeneratePlan}
            disabled={loading || !goalInput.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50"
          >
            Generate My Plan
          </button>

          {plan.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
            >
              <h3 className="font-bold text-lg mb-4 pb-4 border-b border-slate-100">Your Custom Plan</h3>
              <ul className="space-y-4">
                {plan.map((step, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center mt-0.5">
                      {i + 1}
                    </div>
                    <span className="text-slate-700 font-medium">{step}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-6 w-full py-2 border-2 border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                Add All to Dashboard
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
