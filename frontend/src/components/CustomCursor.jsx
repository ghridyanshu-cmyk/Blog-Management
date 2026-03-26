import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('button, a, input, [role="button"]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div 
      className={`fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:block transition-transform duration-300 ease-out`}
      style={{ 
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        left: '-16px', 
        top: '-16px' 
      }}
    >
      {/* The "Liquid" Outer Ring */}
      <div className={`
        relative flex items-center justify-center
        rounded-full border transition-all duration-500
        ${isHovering 
          ? 'w-16 h-16 bg-green-500/10 border-green-500/50 scale-125' 
          : 'w-8 h-8 bg-transparent border-stone-400/30 dark:border-white/20'
        }
      `}>
        {/* The Core Dot */}
        <div className={`
          w-1 h-1 rounded-full bg-stone-900 dark:bg-white transition-transform duration-300
          ${isHovering ? 'scale-[2] bg-green-600' : 'scale-100'}
        `} />
      </div>
    </div>
  );
};

export default CustomCursor;