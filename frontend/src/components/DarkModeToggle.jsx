import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  return (
    <div 
      onClick={toggleTheme}
      className="relative w-10 h-10 flex items-center justify-center cursor-pointer group"
    >
      {/* 1. Ambient Hover Glow (Invisible until hover) */}
      <div className="absolute inset-0 bg-stone-100 dark:bg-stone-800 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" />

      {/* 2. The Morphing Icons */}
      <div className="relative z-10 transition-all duration-500 ease-spring">
        {isDark ? (
          <FiMoon 
            size={22} 
            className="text-blue-400 fill-blue-400/20 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)] animate-in zoom-in rotate-12 duration-500" 
          />
        ) : (
          <FiSun 
            size={22} 
            className="text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-in zoom-in -rotate-12 duration-500" 
          />
        )}
      </div>
    </div>
  );
};

export default DarkModeToggle;