import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Target, CheckCircle2, Circle, Clock, Users, Lightbulb, ArrowRight, BookOpen, MessageSquare, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie } from 'recharts';

export default function Dashboard() {
  const { user, recommendation, roadmap } = useApp();
  const navigate = useNavigate();

  const completedTasks = roadmap.filter(t => t.status === 'completed').length;
  const inProgressTasks = roadmap.filter(t => t.status === 'in_progress').length;
  const notStartedTasks = roadmap.filter(t => t.status === 'not_started').length;
  const totalTasks = roadmap.length || 1; // prevent div by zero
  const progressPercent = roadmap.length ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const careerScoresData = recommendation ? Object.entries(recommendation.scores).map(([name, score]) => ({
    name,
    score
  })) : [];

  const taskStatusData = [
    { name: 'Completed', value: completedTasks, color: '#10b981' },
    { name: 'In Progress', value: inProgressTasks, color: '#f59e0b' },
    { name: 'Not Started', value: notStartedTasks, color: '#475569' },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-app-text mb-2">{getGreeting()}, {user?.name.split(' ')[0] || 'Student'}</h1>
        <p className="text-app-muted">Here's where you stand on your career journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Career Fit */}
        <div className="bg-app-panel p-6 rounded-3xl border border-app-border shadow-sm cursor-pointer hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-shadow" onClick={() => navigate('/discover')}>
          <div className="text-[11px] font-bold text-app-accent mb-4 uppercase tracking-widest">Career Fit</div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-light text-app-text font-mono">{recommendation ? recommendation.primaryScore : '--'}%</span>
          </div>
          <div className="font-mono text-sm text-app-success">{recommendation ? recommendation.primaryPath : 'Not assessed'}</div>
        </div>

        {/* Roadmap Progress */}
        <div className="bg-app-panel p-6 rounded-3xl border border-app-border shadow-sm cursor-pointer hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-shadow" onClick={() => navigate('/roadmap')}>
          <div className="text-[11px] font-bold text-app-accent mb-4 uppercase tracking-widest">Roadmap</div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-light text-app-text font-mono">{progressPercent}%</span>
          </div>
          <div className="w-full bg-app-bg h-1.5 rounded-full mt-4 overflow-hidden border border-app-border">
            <div className="bg-app-accent h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.8)]" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        {/* Current Semester */}
        <div className="bg-app-panel p-6 rounded-3xl border border-app-border shadow-sm">
          <div className="text-[11px] font-bold text-app-accent mb-4 uppercase tracking-widest">Current Stage</div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-light text-app-text font-mono">Sem {user?.semester || '-'}</span>
          </div>
          <div className="font-mono text-sm text-app-muted truncate">{user?.branch || 'General Engineering'}</div>
        </div>

        {/* Skills */}
        <div className="bg-app-panel p-6 rounded-3xl border border-app-border shadow-sm cursor-pointer hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-shadow" onClick={() => navigate('/profile')}>
          <div className="text-[11px] font-bold text-app-accent mb-4 uppercase tracking-widest">Skills</div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-light text-app-text font-mono">{user?.skills.length || 0}</span>
          </div>
          <div className="flex gap-1 mt-2 overflow-hidden">
            {user?.skills.slice(0, 3).map(skill => (
              <span key={skill} className="text-[10px] uppercase font-mono bg-app-bg border border-app-border text-app-muted px-2 py-1 rounded-md whitespace-nowrap">{skill}</span>
            ))}
            {(user?.skills.length || 0) > 3 && <span className="text-[10px] uppercase font-mono bg-app-bg border border-app-border text-app-muted px-2 py-1 rounded-md">+{user!.skills.length - 3}</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          {/* AI Insight */}
          <div className="bg-app-panel rounded-3xl p-6 sm:p-8 border border-app-border relative overflow-hidden shadow-inner">
            <div className="absolute right-0 top-0 w-64 h-64 bg-app-accent/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="relative z-10 flex gap-4">
              <div className="w-12 h-12 bg-app-accent/10 rounded-xl flex items-center justify-center shrink-0 border border-app-accent/30">
                <Lightbulb className="w-6 h-6 text-app-accent" />
              </div>
              <div>
                <h3 className="text-sm tracking-widest uppercase font-bold mb-2 text-app-text">AI Insight // Telemetry Active</h3>
                <p className="text-app-muted leading-relaxed font-mono text-xs">
                  {recommendation 
                    ? `You're progressing well toward ${recommendation.primaryPath}. Your biggest opportunity right now is strengthening ${recommendation.improvements[0] || 'core fundamentals'} and building one production-level project.`
                    : 'Complete your career assessment to get personalized insights and a tailored roadmap for your future.'
                  }
                </p>
                {!recommendation && (
                  <button onClick={() => navigate('/onboarding')} className="mt-4 px-4 py-2 bg-app-accent hover:bg-emerald-600 text-white text-[10px] uppercase tracking-widest font-bold rounded shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-colors">
                    Initialize Scan
                  </button>
                )}
                {recommendation && (
                  <button onClick={() => navigate('/advisor')} className="mt-4 px-4 py-2 bg-app-bg hover:bg-app-border text-app-text text-[10px] font-bold uppercase tracking-widest rounded transition-colors border border-app-border flex items-center gap-2">
                    Open Channel <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Up Next in Roadmap */}
          <div className="bg-app-panel p-6 sm:p-8 rounded-3xl border border-app-border shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm tracking-widest uppercase font-bold text-app-text">Next Milestones</h3>
              <button onClick={() => navigate('/roadmap')} className="text-app-accent text-[10px] font-bold uppercase tracking-widest hover:underline">View Roadmap</button>
            </div>
            
            {roadmap.length > 0 ? (
              <div className="space-y-4">
                {roadmap.filter(t => t.status !== 'completed').slice(0, 3).map(task => (
                  <div key={task.id} className="flex items-start gap-4 p-4 rounded-xl border border-app-border hover:border-app-accent/30 transition-colors bg-app-bg">
                    <div className="w-8 h-8 rounded-full bg-app-panel border border-app-border flex items-center justify-center shrink-0 mt-0.5">
                      {task.status === 'in_progress' ? <Clock className="w-4 h-4 text-app-warning" /> : <Circle className="w-4 h-4 text-app-muted" />}
                    </div>
                    <div>
                      <h4 className="font-mono text-sm text-app-text">{task.title}</h4>
                      <p className="text-[10px] uppercase tracking-widest text-app-muted mt-1">Semester {task.semester}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-app-muted mx-auto mb-3 opacity-50" />
                <p className="text-app-muted font-mono text-xs">NO SIGNAL FOUND. Complete assessment.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          
          {/* Network Summary */}
          <div className="bg-app-panel p-6 rounded-3xl border border-app-border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm tracking-widest uppercase font-bold text-app-text">Network Array</h3>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-app-muted uppercase">Alumni</span>
                <span className="font-bold text-app-text">12</span>
              </div>
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-app-muted uppercase">Seniors</span>
                <span className="font-bold text-app-text">5</span>
              </div>
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-app-muted uppercase">Faculty</span>
                <span className="font-bold text-app-text">2</span>
              </div>
            </div>

            <button onClick={() => navigate('/network')} className="w-full py-2 bg-app-bg hover:bg-app-border text-app-muted hover:text-app-text border border-app-border uppercase tracking-widest font-bold rounded transition-colors text-[10px]">
              Scan Grid
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-app-panel p-6 rounded-3xl border border-app-border shadow-sm">
            <h3 className="text-sm tracking-widest uppercase font-bold text-app-text mb-4">Command Actions</h3>
            <div className="space-y-2">
              <button onClick={() => navigate('/advisor')} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-app-bg border border-transparent hover:border-app-border text-left transition-colors text-app-muted hover:text-app-text">
                <MessageSquare className="w-5 h-5 text-app-accent" />
                <span className="font-mono text-xs uppercase">Establish Link</span>
              </button>
              <button onClick={() => navigate('/discover')} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-app-bg border border-transparent hover:border-app-border text-left transition-colors text-app-muted hover:text-app-text">
                <BookOpen className="w-5 h-5 text-teal-400" />
                <span className="font-mono text-xs uppercase">View Archives</span>
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
