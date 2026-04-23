import { useTheme } from '../context/ThemeContext';

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span>⚡</span>
      </div>
      <div className="sidebar-bottom">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" alt="User avatar" style={{width:40,height:40,borderRadius:"50%",border:"2px solid var(--text-muted)",objectFit:"cover"}} />
      </div>
    </aside>
  );
}
