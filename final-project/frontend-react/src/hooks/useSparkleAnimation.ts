import { useState, useEffect } from 'react';

export function useSparkleAnimation(count = 12) {
  const [sparkles, setSparkles] = useState<Array<{ id: number, x: number, y: number, scale: number, delay: number, duration: number }>>([]);

  useEffect(() => {
    const generate = () => Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: Math.random() * 0.8 + 0.4,
      delay: Math.random() * 2,
      duration: Math.random() * 1.5 + 1.5,
    }));
    
    setSparkles(generate());
    
    const interval = setInterval(() => {
       setSparkles(generate());
    }, 5000); // refresh positions every 5s so it doesn't get stale

    return () => clearInterval(interval);
  }, [count]);

  return sparkles;
}
