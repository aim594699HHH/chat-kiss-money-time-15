
import React, { useEffect, useState } from 'react';

interface GiftAnimationProps {
  type: 'kiss' | 'angry';
}

export const GiftAnimation: React.FC<GiftAnimationProps> = ({ type }) => {
  const [visible, setVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    setVisible(true);
    
    // Generate random particles
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
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
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      {/* Main animation */}
      <div className="relative">
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

      {/* Background overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-20 animate-pulse`} />
      
      {/* Ripple effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 border-4 border-white rounded-full animate-[ripple_1.5s_ease-out]" />
        <div className="absolute w-24 h-24 border-2 border-white rounded-full animate-[ripple_1.5s_ease-out_0.3s]" />
      </div>
    </div>
  );
};
