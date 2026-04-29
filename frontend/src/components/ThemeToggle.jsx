import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <button 
      className="theme-toggle-btn"
      onClick={onToggle}
      title={isDark ? 'Chuyển sang Light Mode' : 'Chuyển sang Dark Mode'}
      aria-label="Toggle theme"
    >
      <div className={`theme-toggle-track ${isDark ? 'dark' : 'light'}`}>
        <div className="theme-toggle-thumb">
          {isDark ? <Moon size={14} /> : <Sun size={14} />}
        </div>
        <div className="theme-toggle-icons">
          <Sun size={12} className="theme-icon-sun" />
          <Moon size={12} className="theme-icon-moon" />
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
