import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useFireAnimation } from '../hooks/useFireAnimation';

interface FireIconProps {
  color?: string;
  size?: number;
  streakActive?: boolean;
}

export function FireIcon({ color = 'text-orange-500', size = 20, streakActive = true }: FireIconProps) {
  const particles = useFireAnimation(streakActive, 5);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background Glow */}
      {streakActive && (
        <motion.div
          className="absolute inset-0 bg-orange-400 rounded-full blur-md"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Main Flame */}
      <motion.div
        className={`relative z-10 ${streakActive ? color : 'text-slate-400'}`}
        animate={streakActive ? {
          scale: [1, 1.15, 1],
          rotate: [-3, 3, -3],
        } : { scale: 1, rotate: 0 }}
        transition={streakActive ? {
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        } : {}}
      >
        <Flame size={size} fill={streakActive ? "currentColor" : "none"} />
      </motion.div>

      {/* Sparks / Particles */}
      {streakActive && particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-1/2 left-1/2 rounded-full bg-orange-300 z-20 pointer-events-none shadow-[0_0_4px_rgba(255,165,0,0.8)]"
          initial={{ 
            opacity: p.opacity, 
            y: 5, 
            x: '-50%',
            scale: 1 
          }}
          animate={{ 
            opacity: 0, 
            y: -30, 
            scale: 0.5,
            x: `calc(-50% + ${p.x}px)`
          }}
          transition={{ 
            duration: p.duration, 
            ease: "easeOut" 
          }}
          style={{
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
}
