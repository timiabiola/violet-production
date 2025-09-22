
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  element: HTMLDivElement;
}

const ParticleBackground = ({ count = 15 }: { count?: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const particles: Particle[] = [];
    
    // Create particles
    for (let i = 0; i < count; i++) {
      const element = document.createElement('div');
      element.className = 'particle';
      
      const size = Math.random() * 100 + 50;
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      
      // Random position
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      element.style.left = `${x}%`;
      element.style.top = `${y}%`;
      
      // Random opacity
      element.style.opacity = (Math.random() * 0.2 + 0.1).toString();
      
      // Random animation duration
      const duration = Math.random() * 20 + 10;
      element.style.animationDuration = `${duration}s`;
      
      // Random animation delay
      const delay = Math.random() * 5;
      element.style.animationDelay = `${delay}s`;
      
      container.appendChild(element);
      
      particles.push({
        x,
        y,
        size,
        speedX: Math.random() * 0.2 - 0.1,
        speedY: Math.random() * 0.2 - 0.1,
        element
      });
    }
    
    particlesRef.current = particles;
    
    return () => {
      particles.forEach(particle => {
        if (particle.element.parentNode) {
          particle.element.parentNode.removeChild(particle.element);
        }
      });
    };
  }, [count]);
  
  return <div ref={containerRef} className="particle-container" />;
};

export default ParticleBackground;
