import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
  rotation: number;
  rotationSpeed: number;
}

const ConfettiExplosion: React.FC<{ trigger: boolean }> = ({ trigger }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const colors = [
    '#8B5CF6', // violet-500
    '#A78BFA', // violet-400
    '#C4B5FD', // violet-300
    '#EC4899', // pink-500
    '#F472B6', // pink-400
    '#10B981', // emerald-500
    '#FBBF24', // amber-400
    '#3B82F6', // blue-500
  ];

  useEffect(() => {
    if (trigger) {
      const newParticles: Particle[] = [];
      const particleCount = 100;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
        const velocity = 5 + Math.random() * 10;
        const size = 4 + Math.random() * 8;

        newParticles.push({
          id: i,
          x: centerX,
          y: centerY,
          color: colors[Math.floor(Math.random() * colors.length)],
          size,
          velocity: {
            x: Math.cos(angle) * velocity,
            y: Math.sin(angle) * velocity - Math.random() * 5,
          },
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 10 - 5,
        });
      }

      setParticles(newParticles);

      // Clear particles after animation
      setTimeout(() => {
        setParticles([]);
      }, 3000);
    }
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: 1,
              rotate: particle.rotation,
              scale: 0,
            }}
            animate={{
              x: particle.velocity.x * 50,
              y: particle.velocity.y * 50 + 200, // gravity effect
              opacity: 0,
              rotate: particle.rotation + particle.rotationSpeed * 50,
              scale: [0, 1.5, 1],
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 2.5,
              ease: "easeOut",
            }}
          />
        ))}
      </AnimatePresence>

      {/* Fireworks effect */}
      <AnimatePresence>
        {trigger && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`firework-${i}`}
                className="absolute"
                style={{
                  left: `${30 + i * 20}%`,
                  top: '30%',
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: [0, 2, 3],
                  opacity: [1, 0.5, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.3,
                  ease: "easeOut",
                }}
              >
                <div className="relative">
                  {[...Array(12)].map((_, j) => (
                    <motion.div
                      key={j}
                      className="absolute w-1 h-12 bg-gradient-to-t from-transparent to-violet-400"
                      style={{
                        transformOrigin: 'bottom center',
                        rotate: `${j * 30}deg`,
                      }}
                      animate={{
                        scaleY: [0, 1, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConfettiExplosion;