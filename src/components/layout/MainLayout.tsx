import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useApp } from '../../context/AppContext';
import { Menu } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const { isAuthenticated } = useApp();
  const location = useLocation();

  if (!isAuthenticated && location.pathname !== '/' && location.pathname !== '/auth' && location.pathname !== '/onboarding') {
    return <Navigate to="/" replace />;
  }

  // If on a public page and not authenticated, just render outlet
  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <div className="flex min-h-screen bg-app-bg text-app-text">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden pb-16 md:pb-0">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-app-border bg-app-panel flex items-center justify-between px-4 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-2 font-bold text-sm text-app-text tracking-widest uppercase">
            <div className="w-6 h-6 rounded-sm bg-app-accent flex items-center justify-center text-app-text shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            PATHFORWARD
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <Outlet />
        </main>
        
        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-app-panel border-t border-app-border flex items-center justify-around px-2 z-50 pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.3)]">
          {[
            { path: '/dashboard', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg> },
            { path: '/discover', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg> },
            { path: '/roadmap', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg> },
            { path: '/advisor', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg> },
            { path: '/profile', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> }
          ].map((item, i) => (
            <a 
              key={i} 
              href={item.path}
              className={`p-2 rounded-lg transition-all ${location.pathname === item.path ? 'text-app-accent border border-app-border bg-app-bg shadow-inner' : 'text-app-muted'}`}
            >
              {item.icon}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};
