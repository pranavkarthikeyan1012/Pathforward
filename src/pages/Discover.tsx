import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowRight, CheckCircle2, ChevronRight, BarChart3, TrendingUp, Compass, Building, Code, GraduationCap, Lightbulb } from 'lucide-react';

export default function Discover() {
  const { recommendation, user, generateRoadmap } = useApp();
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  // If no recommendation exists yet, they should take the assessment
  if (!recommendation) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-app-panel border border-app-border rounded-xl flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(14,165,233,0.1)]">
          <Compass className="w-10 h-10 text-app-accent" />
        </div>
        <h1 className="text-xl font-bold tracking-widest uppercase text-white mb-4">Discover Your Path</h1>
        <p className="text-app-muted font-mono text-sm mb-8">
          Initialize telemetry assessment to calculate optimal trajectory.
        </p>
        <button 
          onClick={() => navigate('/onboarding')}
          className="px-6 py-3 bg-app-accent text-white rounded text-xs font-bold uppercase tracking-widest hover:bg-[#0284c7] transition-all flex items-center gap-2 shadow-[0_0_10px_rgba(56,189,248,0.3)]"
        >
          Initialize Scan <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const handleAccept = () => {
    generateRoadmap(recommendation.primaryPath);
    navigate('/roadmap');
  };

  const getIcon = (name: string) => {
    if (name.includes('Software')) return <Code className="w-6 h-6" />;
    if (name.includes('Core')) return <Building className="w-6 h-6" />;
    if (name.includes('Higher')) return <GraduationCap className="w-6 h-6" />;
    if (name.includes('Government')) return <Compass className="w-6 h-6" />;
    return <Lightbulb className="w-6 h-6" />;
  };

  if (showAll) {
    return (
      <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setShowAll(false)} className="p-2 hover:bg-app-bg rounded transition-colors text-app-muted hover:text-white border border-transparent hover:border-app-border">
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
          <h1 className="text-xl tracking-widest uppercase font-bold text-white">All Career Paths</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(recommendation.scores)
            .sort((a, b) => b[1] - a[1])
            .map(([path, score]) => (
            <div key={path} className="bg-app-panel p-6 rounded-lg border border-app-border shadow-inner hover:border-[#0ea5e9]/40 hover:shadow-[0_0_15px_rgba(56,189,248,0.1)] transition-all cursor-pointer group" onClick={() => navigate(`/career/${path.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)}>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-app-bg border border-app-border text-app-accent rounded flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getIcon(path)}
                </div>
                <div className="px-2 py-0.5 bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 text-app-accent text-[9px] font-mono tracking-widest rounded uppercase">
                  {score}% Match
                </div>
              </div>
              <h3 className="text-sm font-bold tracking-widest uppercase text-white mb-2">{path}</h3>
              <p className="text-xs font-mono text-app-muted mb-4">Explore requirements, roles, and preparation strategies for this path.</p>
              <div className="flex items-center text-app-accent font-bold text-[10px] tracking-widest uppercase group-hover:gap-2 transition-all">
                View Details <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-xl font-bold tracking-widest uppercase text-white mb-2">Analysis Results</h1>
        <p className="text-app-muted font-mono text-xs">Based on telemetry, here is the optimal trajectory.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Primary Recommendation */}
        <div className="md:col-span-2 bg-app-panel rounded-lg p-8 relative overflow-hidden shadow-inner border border-app-border">
          <div className="absolute top-0 right-0 w-64 h-64 bg-app-accent/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-[#0ea5e9]/10 rounded border border-[#0ea5e9]/30 text-app-accent text-[9px] font-mono tracking-widest uppercase mb-6">
              <CheckCircle2 className="w-3 h-3" /> Primary Trajectory
            </div>
            
            <h2 className="text-2xl font-bold tracking-widest uppercase text-white mb-2">{recommendation.primaryPath}</h2>
            <div className="text-4xl font-light text-app-accent font-mono mb-8">{recommendation.primaryScore}% <span className="text-xs text-app-muted uppercase tracking-widest">Alignment</span></div>
            
            <p className="text-app-muted font-mono text-sm leading-relaxed mb-8 max-w-lg">
              {recommendation.reasoning}
            </p>

            <div className="flex flex-wrap gap-4">
              <button onClick={handleAccept} className="px-6 py-3 bg-app-accent hover:bg-[#0284c7] text-white text-[10px] font-bold tracking-widest uppercase rounded shadow-[0_0_10px_rgba(56,189,248,0.3)] transition-colors">
                Accept & Generate Roadmap
              </button>
              <button onClick={() => navigate(`/career/${recommendation.primaryPath.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)} className="px-6 py-3 bg-app-bg hover:bg-app-border text-app-muted hover:text-white border border-app-border text-[10px] font-bold tracking-widest uppercase rounded transition-colors">
                View Data
              </button>
            </div>
          </div>
        </div>

        {/* Backup Recommendation */}
        <div className="bg-app-panel rounded-lg p-6 border border-app-border shadow-inner flex flex-col">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-app-bg border border-app-border rounded text-app-muted text-[9px] font-mono tracking-widest uppercase mb-4 w-fit">
            <Compass className="w-3 h-3" /> Alternate Trajectory
          </div>
          <h3 className="text-sm font-bold tracking-widest uppercase text-white mb-1">{recommendation.backupPath}</h3>
          <div className="text-2xl font-light font-mono text-app-accent mb-auto">{recommendation.backupScore}%</div>
          
          <div className="mt-8 pt-6 border-t border-app-border">
            <button onClick={() => setShowAll(true)} className="w-full py-2 bg-app-bg hover:bg-app-border text-app-muted hover:text-white border border-app-border text-[10px] font-bold tracking-widest uppercase rounded transition-colors flex items-center justify-center gap-2">
              Explore All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-app-panel p-8 rounded-lg border border-app-border shadow-inner">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded border border-[#10b981]/30 bg-[#10b981]/10 flex items-center justify-center text-app-success">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-white">Analyzed Strengths</h3>
          </div>
          <ul className="space-y-4">
            {recommendation.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-app-muted font-mono text-xs">
                <CheckCircle2 className="w-4 h-4 text-app-success shrink-0 mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="bg-app-panel p-8 rounded-lg border border-app-border shadow-inner">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded border border-[#f59e0b]/30 bg-[#f59e0b]/10 flex items-center justify-center text-app-warning">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-white">Improvement Targets</h3>
          </div>
          <ul className="space-y-4">
            {recommendation.improvements.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-app-muted font-mono text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-app-warning mt-1.5 shrink-0 shadow-[0_0_5px_rgba(245,158,11,0.5)]"></div>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Next Step */}
      <div className="mt-6 bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 p-6 rounded-lg flex items-start gap-4">
        <div className="w-10 h-10 rounded bg-app-accent flex items-center justify-center text-white shrink-0 mt-1 shadow-[0_0_10px_rgba(56,189,248,0.5)]">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold tracking-widest uppercase text-[10px] text-app-accent mb-1">Recommended Action</h4>
          <p className="text-app-muted font-mono text-xs">{recommendation.nextStep}</p>
        </div>
      </div>

    </div>
  );
}
