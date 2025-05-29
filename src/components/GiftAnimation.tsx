
import React, { useEffect, useState } from 'react';

interface GiftAnimationProps {
  type: 'kiss' | 'angry';
  onComplete?: () => void;
}

export const GiftAnimation: React.FC<GiftAnimationProps> = ({ type, onComplete }) => {
  const [visible, setVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // إظهار الأنيميشن فوراً
    setVisible(true);
    
    // Generate random particles positioned towards the left side (recipient's side)
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 30 + 10, // Position on left side (10-40% from left)
      y: Math.random() * 40 + 30, // Center vertically (30-70% from top)
      delay: Math.random() * 0.5,
    }));
    setParticles(newParticles);

    // إخفاء الأنيميشن بعد ثانيتين
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 2000);

    // استدعاء onComplete بعد إنتهاء الأنيميشن
    const completeTimer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 2500); // إضافة 500ms إضافية للتأكد من إنتهاء التأثير

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const emoji = type === 'kiss' ? '💋' : '😡';
  const bgColor = type === 'kiss' ? 'from-pink-400 to-red-400' : 'from-red-500 to-orange-500';

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Main animation positioned on the left side */}
      <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2">
        <div className={`text-8xl transition-all duration-500 ${visible ? 'animate-bounce scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
          {emoji}
        </div>
        
        {/* Particle effects */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute text-2xl transition-all duration-500 ${visible ? 'animate-[float_2s_ease-out_forwards] opacity-70' : 'opacity-0'}`}
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
      <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} transition-opacity duration-500 ${visible ? 'opacity-10' : 'opacity-0'}`} />
      
      {/* Ripple effect positioned on the left */}
      <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2">
        <div className={`w-32 h-32 border-4 border-white rounded-full transition-all duration-500 ${visible ? 'animate-[ripple_1.5s_ease-out] opacity-50' : 'opacity-0'}`} />
        <div className={`absolute top-4 left-4 w-24 h-24 border-2 border-white rounded-full transition-all duration-500 ${visible ? 'animate-[ripple_1.5s_ease-out_0.3s] opacity-30' : 'opacity-0'}`} />
      </div>
    </div>
  );
};
