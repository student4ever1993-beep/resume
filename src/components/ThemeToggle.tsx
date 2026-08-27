import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  style?: React.CSSProperties;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ style, className = '', size = 'md' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;
  const padding = size === 'sm' ? '5px 10px' : size === 'lg' ? '10px 16px' : '7px 14px';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      className={`theme-toggle-btn ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: size === 'sm' ? '11px' : '12px',
        fontWeight: 600,
        color: isDark ? '#c9a84c' : 'var(--accent-gold, #b8860b)',
        backgroundColor: isDark ? 'rgba(201, 168, 76, 0.08)' : 'rgba(184, 134, 11, 0.12)',
        border: `1px solid ${isDark ? 'rgba(201, 168, 76, 0.3)' : 'rgba(184, 134, 11, 0.35)'}`,
        borderRadius: '6px',
        padding: padding,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        backdropFilter: 'blur(8px)',
        outline: 'none',
        ...style,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.backgroundColor = isDark ? 'rgba(201, 168, 76, 0.18)' : 'rgba(184, 134, 11, 0.2)';
        el.style.transform = 'translateY(-1px)';
        el.style.boxShadow = isDark
          ? '0 4px 14px rgba(201, 168, 76, 0.25)'
          : '0 4px 14px rgba(184, 134, 11, 0.2)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.backgroundColor = isDark ? 'rgba(201, 168, 76, 0.08)' : 'rgba(184, 134, 11, 0.12)';
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(360deg) scale(1)',
        }}
      >
        {isDark ? <Sun size={iconSize} /> : <Moon size={iconSize} />}
      </span>
      <span style={{ letterSpacing: '0.5px' }}>
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  );
};

export default ThemeToggle;
