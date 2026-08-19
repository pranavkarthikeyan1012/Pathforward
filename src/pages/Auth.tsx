import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { login } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(); // Uses default user for demo
    
    if (isLogin) {
      navigate('/dashboard');
    } else {
      navigate('/onboarding');
    }
  };

  const handleDemoGoogle = () => {
    login();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center p-4">
      <div className="bg-app-panel w-full max-w-md rounded-lg p-8 shadow-[0_0_50px_rgba(2,4,8,0.5)] border border-app-border relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-app-accent/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

        <div className="flex justify-center mb-8 relative z-10">
          <div className="w-12 h-12 rounded bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 flex items-center justify-center text-app-accent shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-bold text-center tracking-widest uppercase text-white mb-2 relative z-10">
          {isLogin ? 'Authenticate' : 'Initialize Profile'}
        </h2>
        <p className="text-center text-app-muted font-mono text-xs uppercase tracking-widest mb-8 relative z-10">
          {isLogin ? 'Enter credentials to access mainframe.' : 'Begin onboarding sequence.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-mono tracking-widest uppercase text-app-muted mb-1">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded bg-app-bg border border-app-border font-mono text-sm text-white focus:outline-none focus:border-app-accent focus:shadow-[0_0_15px_rgba(56,189,248,0.2)] transition-all uppercase tracking-widest placeholder-app-muted/50"
                placeholder="ALEX JOHNSON"
              />
            </div>
          )}
          
          <div>
            <label className="block text-[10px] font-mono tracking-widest uppercase text-app-muted mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded bg-app-bg border border-app-border font-mono text-sm text-white focus:outline-none focus:border-app-accent focus:shadow-[0_0_15px_rgba(56,189,248,0.2)] transition-all uppercase tracking-widest placeholder-app-muted/50"
              placeholder="ALEX@EXAMPLE.COM"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-mono tracking-widest uppercase text-app-muted mb-1">Security Key</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded bg-app-bg border border-app-border font-mono text-sm text-white focus:outline-none focus:border-app-accent focus:shadow-[0_0_15px_rgba(56,189,248,0.2)] transition-all tracking-widest placeholder-app-muted/50"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 text-app-accent rounded font-bold text-[10px] tracking-widest uppercase hover:bg-app-accent hover:text-white transition-all shadow-[0_0_15px_rgba(56,189,248,0.1)] mt-6"
          >
            {isLogin ? 'Initialize Session' : 'Create Record'}
          </button>
        </form>

        <div className="mt-6 flex items-center relative z-10">
          <div className="flex-1 h-px bg-app-border"></div>
          <span className="px-4 text-[10px] font-mono uppercase tracking-widest text-app-muted">or bypass</span>
          <div className="flex-1 h-px bg-app-border"></div>
        </div>

        <button 
          onClick={handleDemoGoogle}
          type="button"
          className="mt-6 w-full py-3 bg-app-bg border border-app-border text-app-muted rounded font-bold text-[10px] tracking-widest uppercase hover:text-white hover:border-app-accent transition-colors flex items-center justify-center gap-3 relative z-10"
        >
          <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Demo Google Login
        </button>

        <p className="mt-8 text-center text-[10px] font-mono tracking-widest uppercase text-app-muted relative z-10">
          {isLogin ? "No profile found? " : "Profile exists? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-app-accent font-bold hover:text-white transition-colors"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
