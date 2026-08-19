import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Circle, Clock, ArrowRight, Target, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Roadmap() {
  const { roadmap, updateRoadmapTask, user, recommendation } = useApp();
  const navigate = useNavigate();

  // Group tasks by semester
  const tasksBySemester = useMemo(() => {
    const grouped = roadmap.reduce((acc, task) => {
      if (!acc[task.semester]) acc[task.semester] = [];
      acc[task.semester].push(task);
      return acc;
    }, {} as Record<number, typeof roadmap>);
    
    return Object.entries(grouped).sort(([a], [b]) => Number(a) - Number(b));
  }, [roadmap]);

  const handleToggleTask = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'not_started' 
                     : currentStatus === 'not_started' ? 'in_progress' 
                     : 'completed';
    updateRoadmapTask(id, nextStatus as any);
  };

  const completedCount = roadmap.filter(t => t.status === 'completed').length;
  const progressPercent = roadmap.length ? Math.round((completedCount / roadmap.length) * 100) : 0;

  if (roadmap.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-app-panel border border-app-border rounded-xl flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(56,189,248,0.1)]">
          <Target className="w-10 h-10 text-app-muted" />
        </div>
        <h1 className="text-xl font-bold tracking-widest uppercase text-white mb-4">No Roadmap Found</h1>
        <p className="text-app-muted font-mono text-sm mb-8">
          NO SIGNAL FOUND. Complete your career assessment to generate a targeted path sequence.
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

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-widest uppercase text-white mb-2">Target Sequence</h1>
          <p className="text-app-muted font-mono text-xs">Tracking sequence alignment for <span className="text-app-accent">{user?.careerPath || recommendation?.primaryPath}</span>.</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-light text-white font-mono">{progressPercent}%</div>
          <div className="text-[10px] text-app-muted uppercase font-mono">Sequence Completion</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-app-bg h-2 border border-app-border rounded-full mb-12 overflow-hidden shadow-inner">
        <div 
          className="h-full bg-app-accent rounded-full transition-all duration-1000 ease-out relative shadow-[0_0_10px_rgba(56,189,248,0.8)]"
          style={{ width: `${progressPercent}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>

      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-app-border before:border-l before:border-dashed before:border-[#1e293b]">
        
        {tasksBySemester.map(([semester, tasks]) => {
          const semNum = Number(semester);
          const isCurrentSem = user?.semester === semester;
          const isPastSem = Number(user?.semester || 1) > semNum;
          const semProgress = tasks.filter(t => t.status === 'completed').length / tasks.length;
          
          return (
            <div key={semester} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              
              {/* Timeline dot */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full border border-app-border bg-app-bg shadow-[0_0_15px_rgba(14,165,233,0.1)] absolute left-0 md:left-1/2 -translate-x-1/2 z-10">
                {semProgress === 1 ? (
                  <CheckCircle2 className="w-5 h-5 text-app-success" />
                ) : isCurrentSem ? (
                  <div className="w-3 h-3 rounded-full bg-app-accent animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-app-muted opacity-50" />
                )}
              </div>

              {/* Content Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] ml-16 md:ml-0 p-6 rounded-lg bg-app-panel border border-app-border shadow-inner transition-all hover:border-[#0ea5e9]/40">
                <div className="flex justify-between items-center mb-6 border-b border-app-border pb-2">
                  <h3 className="text-xs font-bold tracking-widest uppercase text-app-accent">Phase {semester}</h3>
                  {isCurrentSem && <span className="px-2 py-0.5 bg-[#0ea5e9]/10 text-app-accent text-[9px] font-mono border border-[#0ea5e9]/30 uppercase tracking-widest rounded">Active</span>}
                </div>

                <div className="space-y-3">
                  {tasks.map(task => (
                    <div 
                      key={task.id} 
                      onClick={() => handleToggleTask(task.id, task.status)}
                      className={`flex items-center gap-3 p-3 rounded bg-app-bg border cursor-pointer transition-all ${
                        task.status === 'completed' 
                          ? 'border-[#10b981]/30 opacity-70' 
                          : task.status === 'in_progress'
                            ? 'border-[#f59e0b]/40 shadow-[0_0_8px_rgba(245,158,11,0.1)]'
                            : 'border-app-border hover:border-app-accent/50'
                      }`}
                    >
                      <button className="shrink-0">
                        {task.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-app-success" />
                        ) : task.status === 'in_progress' ? (
                          <Clock className="w-5 h-5 text-app-warning animate-pulse" />
                        ) : (
                          <Circle className="w-5 h-5 text-app-muted" />
                        )}
                      </button>
                      <span className={`flex-1 font-mono text-[11px] transition-colors ${task.status === 'completed' ? 'text-app-muted line-through' : 'text-white'}`}>
                        {task.title}
                      </span>
                      {task.status === 'completed' && (
                        <div className="shrink-0 flex items-center gap-1 text-[8px] font-mono tracking-widest text-[#f59e0b] border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-2 py-0.5 rounded uppercase shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                           <Award className="w-3 h-3" /> Badge Earned
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
