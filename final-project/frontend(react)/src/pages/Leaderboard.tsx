import React from 'react';
import { motion } from 'framer-motion';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import { Trophy, Medal, Award, Flame, CheckCircle2 } from 'lucide-react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { FireIcon } from '../components/FireIcon';
import { AnimatedPodium } from '../components/AnimatedPodium';
import { getStoredUser, getStoredUserId } from '../utils/auth';

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useLeaderboard();
  const user = getStoredUser();
  const userId = getStoredUserId();
  const { width, height } = useWindowSize();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  const users = leaderboard || [];
  const currentUser = users.find(u => u.userId === userId);
  const isWinner = currentUser?.rank === 1 && currentUser?.score > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 relative">
      {isWinner && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.15} className="!fixed top-0 left-0 z-50 pointer-events-none" />}
      
      <div className="text-center space-y-8">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight font-outfit uppercase mt-6">
            Global Leaderboard
          </h1>
          <p className="text-lg text-slate-400 font-medium tracking-tight mt-3 max-w-xl mx-auto">
            Stay consistent, rack up your score, and maintain your streak to climb the ranks against other users.
          </p>
        </div>

        {isWinner && (
           <motion.div 
             initial={{ y: -20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="inline-block bg-white text-amber-500 px-6 py-2 rounded-full font-black text-lg shadow-xl font-outfit uppercase tracking-widest border-2 border-amber-400"
           >
             🏆 #1 Champion
           </motion.div>
        )}

        <AnimatedPodium topUsers={users} />
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative">
        <div className="space-y-4">
          {users.map((entry, idx) => {
            const isMe = entry.userId === userId;
            const isTop3 = entry.rank <= 3;
            
            return (
              <motion.div 
                key={entry.userId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex items-center justify-between p-6 rounded-3xl border transition-all duration-300 ${
                  isMe 
                    ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                    : isTop3 
                      ? 'bg-amber-50/30 border-amber-100 hover:border-amber-200' 
                      : 'bg-white border-slate-50 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-6">
                  {/* Rank Badge */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl font-outfit ${
                    entry.rank === 1 ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-white shadow-lg shadow-amber-200' :
                    entry.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-lg shadow-slate-200' :
                    entry.rank === 3 ? 'bg-gradient-to-br from-orange-300 to-orange-400 text-white shadow-lg shadow-orange-200' :
                    isMe ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {entry.rank === 1 ? <Trophy size={28} /> : 
                     entry.rank === 2 ? <Medal size={28} /> : 
                     entry.rank === 3 ? <Award size={28} /> : 
                     `#${entry.rank}`}
                  </div>

                  {/* User Profile Info */}
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className={`text-xl font-black font-outfit tracking-tight leading-none ${isMe ? 'text-indigo-900' : 'text-slate-900'}`}>
                        {entry.name || `User ${entry.userId}`}
                      </h3>
                      {isMe && <span className="text-[10px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded-md tracking-wider uppercase">You</span>}
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                       <span className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                         <CheckCircle2 size={12} className="mr-1 text-emerald-500" />
                         {entry.tasksCompleted} Tasks
                       </span>
                       <span className="w-1 h-1 bg-slate-200 rounded-full" />
                       <span className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                         <CheckCircle2 size={12} className="mr-1 text-emerald-500" />
                         {entry.habitsCompleted} Habits
                       </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-8">
                   {/* Streak */}
                   <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 font-outfit">Streak</span>
                      <div className={`flex items-center space-x-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-lg font-black text-sm font-outfit border border-orange-100`}>
                        <div className="w-3.5 h-3.5 flex items-center justify-center">
                           <FireIcon size={14} streakActive={entry.streak > 0} color="currentColor" />
                        </div>
                        <span>{entry.streak}d</span>
                      </div>
                   </div>

                   {/* Score */}
                   <div className="text-right">
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 font-outfit">Score</span>
                      <span className={`text-3xl font-black font-outfit tabular-nums ${isMe ? 'text-indigo-600' : 'text-slate-900'}`}>
                        {entry.score.toLocaleString()}
                      </span>
                   </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {users.length === 0 && (
          <div className="text-center py-20">
            <Trophy size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">No ranked users yet</h3>
            <p className="text-slate-500 mt-2">Complete a task to get on the leaderboard!</p>
          </div>
        )}
      </div>
    </div>
  );
}
