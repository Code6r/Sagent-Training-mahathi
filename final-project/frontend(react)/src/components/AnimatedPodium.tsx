import { motion } from 'framer-motion';
import { Trophy, Award, Medal, Crown } from 'lucide-react';
import { LeaderboardEntry } from '../hooks/useLeaderboard';
import { useSparkleAnimation } from '../hooks/useSparkleAnimation';

interface AnimatedPodiumProps {
  topUsers: LeaderboardEntry[];
}

export function AnimatedPodium({ topUsers }: AnimatedPodiumProps) {
  const sparkles = useSparkleAnimation(20);

  // Pad array to ensure we have exactly 3 spots even if empty
  const podiumData = [
    topUsers.find(u => u.rank === 2) || null, // 2nd place
    topUsers.find(u => u.rank === 1) || null, // 1st place
    topUsers.find(u => u.rank === 3) || null, // 3rd place
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto h-72 md:h-80 flex items-end justify-center px-4 overflow-hidden mb-16 mt-8">
      {/* Sparkles background */}
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute bg-amber-300 rounded-full blur-[1px] shadow-[0_0_10px_rgba(251,191,36,0.8)]"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, sparkle.scale, 0], y: [-20, -50] }}
          transition={{ duration: sparkle.duration, delay: sparkle.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: 6,
            height: 6,
          }}
        />
      ))}

      <div className="flex items-end justify-center w-full z-10 gap-2 md:gap-4 h-full relative">
        {podiumData.map((user, index) => {
          let heightClass = "h-[45%]"; 
          let bgGradient = "bg-gradient-to-t from-slate-300 to-slate-200 border-t-slate-400";
          let iconColor = "text-slate-500 fill-slate-300";
          let place = "2nd";
          
          if (index === 1) { // 1st place
            heightClass = "h-[65%]";
            bgGradient = "bg-gradient-to-t from-amber-400 to-amber-300 border-t-amber-500";
            iconColor = "text-amber-600 fill-amber-300";
            place = "1st";
          } else if (index === 2) { // 3rd place
            heightClass = "h-[35%]";
            bgGradient = "bg-gradient-to-t from-orange-400 to-orange-300 border-t-orange-500";
            iconColor = "text-orange-700 fill-orange-300";
            place = "3rd";
          }

          const rankNum = index === 1 ? 1 : index === 0 ? 2 : 3;

          return (
            <div key={`podium-${index}`} className={`flex flex-col items-center justify-end w-1/3 max-w-[160px] relative ${!user ? 'opacity-50 grayscale' : ''}`}>
              {/* Avatar & Name */}
              <motion.div 
                className="flex flex-col items-center mb-4 relative z-20"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 + (index * 0.2), type: "spring", bounce: 0.5 }}
              >
                  <div className={`relative flex items-center justify-center rounded-full mb-3 shadow-2xl ${user ? 'bg-white' : 'bg-slate-200'} p-4`}>
                    {rankNum === 1 && (
                      <motion.div 
                        initial={{ rotate: -15, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ delay: 1, type: "spring" }}
                        className="absolute -top-6 text-amber-500 drop-shadow-lg"
                      >
                         <Crown size={36} className="fill-amber-400" />
                      </motion.div>
                    )}
                    {user ? (
                      <Trophy size={rankNum === 1 ? 56 : 40} className={iconColor} strokeWidth={1.5} />
                    ) : ( 
                      <Trophy size={rankNum === 1 ? 56 : 40} className="text-slate-300" strokeWidth={1.5} />
                    )}
                  </div>
                  <div className={`text-center px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-slate-100 ${index===1 ? 'scale-110 mb-2' : ''}`}>
                    <p className={`font-black font-outfit uppercase tracking-wider ${index === 1 ? 'text-amber-600 text-sm' : 'text-slate-800 text-xs truncate max-w-[80px]'}`}>
                      {user ? user.name : 'TBD'}
                    </p>
                    {user && (
                      <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{user.score.toLocaleString()} PTS</p>
                    )}
                  </div>
              </motion.div>

              {/* Podium Block */}
              <motion.div 
                className={`w-full rounded-t-xl border-t-4 shadow-2xl relative flex items-start justify-center pt-4 ${bgGradient}`}
                style={{ height: '0%' }}
                animate={{ height: heightClass }}
                transition={{ duration: 0.8, delay: index * 0.2, type: 'spring', stiffness: 80 }}
              >
                <span className="text-3xl md:text-5xl font-black text-white/40 font-outfit drop-shadow-md">
                   {rankNum}
                </span>
                
                {/* 3D Box inner shadow effect layer */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-t-lg pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-1 bg-white/40 rounded-t-lg pointer-events-none" />
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
