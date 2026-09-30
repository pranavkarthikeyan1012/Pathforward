import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Compass, 
  Map, 
  Users, 
  MessageSquare,
  PieChart,
  User, 
  Mic2,
  Settings,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';

export const Sidebar: React.FC = () => {
  const { logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Discover', icon: Compass, path: '/discover' },
    { name: 'My Roadmap', icon: Map, path: '/roadmap' },
    { name: 'Mock Interview', icon: Mic2, path: '/interview' },
    { name: 'Network', icon: Users, path: '/network' },
    { name: 'Analytics', icon: PieChart, path: '/analytics' },
    { name: 'AI Advisor', icon: MessageSquare, path: '/advisor' },
  ];

  const bottomItems = [
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <aside className="w-64 h-screen bg-app-bg border-r border-app-border flex flex-col hidden md:flex sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 text-app-text font-bold text-xl tracking-widest uppercase">
          <div className="w-8 h-8 rounded-sm bg-app-accent flex items-center justify-center text-app-text shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          PATHFORWARD
        </div>
      </div>
      
      <div className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono uppercase tracking-widest transition-all duration-200 border border-transparent",
                isActive 
                  ? "bg-app-panel border-app-border text-app-accent shadow-inner" 
                  : "text-app-muted hover:bg-app-panel hover:text-app-text hover:border-app-border"
              )
            }
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </NavLink>
        ))}
      </div>

      <div className="p-4 space-y-1 border-t border-app-border">
        {bottomItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono uppercase tracking-widest transition-all duration-200 border border-transparent",
                isActive 
                  ? "bg-app-panel border-app-border text-app-accent shadow-inner" 
                  : "text-app-muted hover:bg-app-panel hover:text-app-text hover:border-app-border"
              )
            }
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono uppercase tracking-widest text-app-muted hover:bg-app-danger/10 hover:text-app-danger hover:border-app-danger/30 border border-transparent transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};
