import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <button 
      className="theme-toggle-btn"
      onClick={onToggle}
      title={isDark ? 'Chuyển sang Light Mode' : 'Chuyển sang Dark Mode'}
      aria-label="Toggle theme"
    >
      <div className="theme-toggle-track">
        <Sun size={14} className="theme-icon-sun" />
        <Moon size={14} className="theme-icon-moon" />
      </div>
      <div className="theme-toggle-thumb">
        {isDark ? <Moon size={12} /> : <Sun size={12} />}
      </div>
    </button>
  );
};

export default ThemeToggle;
