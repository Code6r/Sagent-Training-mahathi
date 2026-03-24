import { useState, useEffect, useCallback } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
}

export function useFireAnimation(active: boolean, maxParticles = 5) {
  const [particles, setParticles] = useState<Particle[]>([]);

  const spawnParticle = useCallback(() => {
    return {
      id: Math.random(),
      x: Math.random() * 40 - 20, // Random X offset
      y: 0,
      size: Math.random() * 6 + 4, // 4-10px
      opacity: Math.random() * 0.5 + 0.5,
      duration: Math.random() * 0.8 + 0.6, // 0.6-1.4s
    };
  }, []);

  useEffect(() => {
    if (!active) return;

    let interval: ReturnType<typeof setInterval>;
    
    interval = setInterval(() => {
      setParticles((current) => {
        // Keep only top maxParticles, and add a new one
        const activeParticles = current.slice(-maxParticles + 1);
        return [...activeParticles, spawnParticle()];
      });
    }, 400);

    return () => clearInterval(interval);
  }, [active, maxParticles, spawnParticle]);

  return particles;
}
