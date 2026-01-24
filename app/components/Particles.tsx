'use client';
import { useEffect, useState } from 'react';

interface Particle {
  size: number;
  top: number;
  left: number;
  duration: number;
  delay: number;
}

export default function Particles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, () => ({
      size: Math.random() * 8 + 4,       // 4px–12px
      top: Math.random() * 100,          // % of container height
      left: Math.random() * 100,         // % of container width
      duration: Math.random() * 10 + 5,  // 5s–15s float duration
      delay: Math.random() * 5,          // 0–5s delay
    }));
    setParticles(newParticles);
  }, []);

  return (
    <>
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute bg-white/40 rounded-full animate-float-right"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            top: `${p.top}%`,
            left: `${p.left}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </>
  );
}
