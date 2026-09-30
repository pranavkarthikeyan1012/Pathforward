import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, Code, GraduationCap, Building, Lightbulb } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const tracks = [
    { name: 'Placement (Software)', icon: Code, color: 'text-sky-500', bg: 'bg-sky-50' },
    { name: 'Placement (Core)', icon: Building, color: 'text-orange-500', bg: 'bg-orange-50' },
    { name: 'Higher Studies', icon: GraduationCap, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { name: 'Government Exams', icon: Compass, color: 'text-teal-500', bg: 'bg-teal-50' },
    { name: 'Entrepreneurship', icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="min-h-screen bg-app-bg">
      {/* Navbar for Landing */}
      <nav className="border-b border-app-border flex items-center justify-between px-8 py-4 bg-app-bg">
        <div className="flex items-center gap-2 font-bold text-xl uppercase tracking-widest text-app-text">
          <div className="w-8 h-8 rounded bg-app-accent/10 border border-app-accent/30 flex items-center justify-center text-app-accent shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          PathForward
        </div>
        <div>
          <button 
            onClick={() => navigate('/auth')}
            className="px-5 py-2.5 text-[10px] font-mono tracking-widest uppercase text-app-muted hover:text-app-text transition-colors"
          >
            Authenticate
          </button>
          <button 
            onClick={handleGetStarted}
            className="px-5 py-2.5 bg-app-accent/10 text-app-accent border border-app-accent/30 rounded text-[10px] font-bold tracking-widest uppercase hover:bg-app-accent hover:text-app-text transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            Initialize
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-app-accent/5 blur-3xl rounded-full pointer-events-none"></div>
        <div className="flex-1 space-y-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest text-app-text leading-tight">
            Trajectory <br />
            <span className="text-app-accent">Calculated.</span><br />
            Future Set.
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-app-muted max-w-xl leading-relaxed">
            Discover the engineering trajectory that fits your parameters, build a personalized roadmap, and sync with nodes in the network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleGetStarted}
              className="px-6 py-4 bg-app-accent/10 text-app-accent border border-app-accent/30 rounded font-bold tracking-widest text-[10px] uppercase hover:bg-app-accent hover:text-app-text transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              Start Diagnostic <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => navigate('/discover')}
              className="px-6 py-4 bg-app-panel text-app-text border border-app-border rounded font-bold text-[10px] tracking-widest uppercase hover:border-app-accent transition-all"
            >
              Explore Sectors
            </button>
          </div>
        </div>

        <div className="flex-1 relative w-full aspect-square max-w-lg z-10">
          {/* Orbital Visualization */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Center Node */}
            <div className="w-24 h-24 rounded bg-app-bg border border-app-accent shadow-[0_0_30px_rgba(16,185,129,0.3)] z-10 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-app-accent" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            
            {/* Orbit Rings */}
            <div className="absolute w-64 h-64 border border-app-border rounded-full animate-[spin_20s_linear_infinite]"></div>
            <div className="absolute w-96 h-96 border border-app-border rounded-full animate-[spin_30s_linear_infinite_reverse]"></div>
            
            {/* Satellite Nodes */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-10 h-10 bg-app-panel rounded flex items-center justify-center border border-app-accent/30 text-app-accent shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              <Code className="w-4 h-4" />
            </div>
            <div className="absolute bottom-16 right-16 w-10 h-10 bg-app-panel rounded flex items-center justify-center border border-app-accent/30 text-app-accent shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="absolute bottom-16 left-16 w-10 h-10 bg-app-panel rounded flex items-center justify-center border border-app-accent/30 text-app-accent shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              <Compass className="w-4 h-4" />
            </div>
            <div className="absolute top-32 -left-4 w-10 h-10 bg-app-panel rounded flex items-center justify-center border border-app-accent/30 text-app-accent shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              <Building className="w-4 h-4" />
            </div>
            <div className="absolute top-32 -right-4 w-10 h-10 bg-app-panel rounded flex items-center justify-center border border-app-accent/30 text-app-accent shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              <Lightbulb className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Five Paths Section */}
      <div className="bg-app-panel py-24 border-y border-app-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold uppercase tracking-widest text-app-text mb-4">Five Sectors. Infinite Trajectories.</h2>
          <p className="text-[10px] font-mono tracking-widest uppercase text-app-muted max-w-2xl mx-auto mb-16">
            Navigate the complex landscape of engineering via defined core routes.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {tracks.map((track) => (
              <div key={track.name} className="bg-app-bg p-6 rounded border border-app-border hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:border-app-accent/40 transition-all duration-300 text-center group cursor-pointer" onClick={() => navigate('/discover')}>
                <div className={`w-12 h-12 mx-auto rounded bg-app-accent/10 border border-app-accent/30 text-app-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <track.icon className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-app-text mb-2">{track.name}</h3>
                <p className="text-[9px] font-mono uppercase tracking-widest text-app-muted">Scan sector data</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Process Section */}
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-xl font-bold tracking-widest uppercase text-app-text mb-4">Execution Protocol</h2>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center relative">
          <div className="absolute hidden md:block top-1/2 left-0 w-full h-px bg-app-border -z-10"></div>
          
          {['Scan', 'Formulate', 'Execute', 'Validate'].map((step, i) => (
            <div key={step} className="flex flex-col items-center bg-app-bg p-4 relative z-10">
              <div className="w-10 h-10 rounded bg-app-accent/10 border border-app-accent/30 text-app-accent flex items-center justify-center font-bold text-sm mb-4 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                0{i + 1}
              </div>
              <h3 className="font-bold text-xs uppercase tracking-widest text-app-text">{step}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Network Section */}
      <div className="bg-app-panel text-app-text py-24 border-y border-app-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-4">Tri-Tier Network Protocol</h2>
          <p className="text-[10px] font-mono tracking-widest uppercase text-app-muted max-w-2xl mx-auto mb-16">
            Synchronize with established nodes for optimal trajectory calculation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-8 rounded bg-app-bg border border-app-border">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-2 text-app-accent">Alumni Nodes</h3>
              <p className="text-app-muted font-mono text-[9px] uppercase tracking-widest">Outcome validation & real-world telemetry.</p>
            </div>
            <div className="p-8 rounded bg-app-bg border border-app-border">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-2 text-app-accent">Senior Peers</h3>
              <p className="text-app-muted font-mono text-[9px] uppercase tracking-widest">Immediate tactical assistance & course correction.</p>
            </div>
            <div className="p-8 rounded bg-app-bg border border-app-border">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-2 text-app-accent">Faculty Authority</h3>
              <p className="text-app-muted font-mono text-[9px] uppercase tracking-widest">Core structural guidance & research pathways.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 text-center">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-app-text mb-8">Execute your sequence.</h2>
        <button 
          onClick={handleGetStarted}
          className="px-8 py-4 bg-app-accent/10 text-app-accent border border-app-accent/30 rounded font-bold text-xs tracking-widest uppercase hover:bg-app-accent hover:text-app-text shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all inline-block"
        >
          Initialize Now
        </button>
      </div>
    </div>
  );
}
