
import React, { useEffect, useState } from 'react';

interface GiftAnimationProps {
  type: 'kiss' | 'angry';
}

export const GiftAnimation: React.FC<GiftAnimationProps> = ({ type }) => {
  const [visible, setVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    setVisible(true);
    
    // Generate random particles positioned towards the left side (recipient's side)
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 30 + 10, // Position on left side (10-40% from left)
      y: Math.random() * 40 + 30, // Center vertically (30-70% from top)
      delay: Math.random() * 0.5,
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => {
      setVisible(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const emoji = type === 'kiss' ? '💋' : '😡';
  const bgColor = type === 'kiss' ? 'from-pink-400 to-red-400' : 'from-red-500 to-orange-500';

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Main animation positioned on the left side */}
      <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2">
        <div className={`text-8xl animate-[scaleUp_1.5s_ease-out] ${visible ? 'animate-bounce' : ''}`}>
          {emoji}
        </div>
        
        {/* Particle effects */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute text-2xl animate-[float_2s_ease-out_forwards] opacity-0`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Background overlay - subtle */}
      <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-10 animate-pulse`} />
      
      {/* Ripple effect positioned on the left */}
      <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2">
        <div className="w-32 h-32 border-4 border-white rounded-full animate-[ripple_1.5s_ease-out] opacity-50" />
        <div className="absolute top-4 left-4 w-24 h-24 border-2 border-white rounded-full animate-[ripple_1.5s_ease-out_0.3s] opacity-30" />
      </div>
    </div>
  );
};
