import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3, TrendingUp, BrainCircuit, Target, PieChart as PieChartIcon } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, 
  PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';

export default function Analytics() {
  const { user, recommendation, roadmap } = useApp();

  const careerScoresData = recommendation ? Object.entries(recommendation.scores).map(([name, score]) => ({
    name,
    score
  })) : [];

  const completedTasks = roadmap.filter(t => t.status === 'completed').length;
  const inProgressTasks = roadmap.filter(t => t.status === 'in_progress').length;
  const notStartedTasks = roadmap.filter(t => t.status === 'not_started').length;
  
  const taskStatusData = [
    { name: 'Completed', value: completedTasks, color: '#10b981' },
    { name: 'In Progress', value: inProgressTasks, color: '#f59e0b' },
    { name: 'Not Started', value: notStartedTasks, color: '#e2e8f0' },
  ];

  // Dummy data for radar chart based on skills vs ideal profile
  const skillProfileData = [
    { subject: 'Programming', A: 85, B: 100, fullMark: 100 },
    { subject: 'DSA', A: 65, B: 90, fullMark: 100 },
    { subject: 'System Design', A: 40, B: 85, fullMark: 100 },
    { subject: 'Communication', A: 90, B: 80, fullMark: 100 },
    { subject: 'Projects', A: 60, B: 90, fullMark: 100 },
    { subject: 'CS Core', A: 75, B: 85, fullMark: 100 },
  ];

  if (!recommendation) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <PieChartIcon className="w-16 h-16 text-app-muted mb-4 opacity-50" />
        <h2 className="text-xl font-bold uppercase tracking-widest text-app-text mb-2">Insufficient Telemetry</h2>
        <p className="text-app-muted font-mono text-xs max-w-md">Complete your profile assessment and generate a roadmap to unlock full data analytics.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-app-text mb-2 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-app-accent" />
          Profile Analytics
        </h1>
        <p className="text-app-muted">Deep dive into your career trajectory data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Radar Chart */}
        <div className="bg-app-panel p-6 sm:p-8 rounded-3xl border border-app-border shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 text-indigo-500 rounded-xl flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="text-sm tracking-widest uppercase font-bold text-app-text">Competency Matrix</h3>
          </div>
          
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillProfileData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Your Profile" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Radar name="Target Role" dataKey="B" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '10px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-app-accent opacity-50 border border-app-accent"></div>
              <span className="text-[10px] font-mono uppercase text-app-muted">Your Profile</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500 opacity-20 border border-indigo-500"></div>
              <span className="text-[10px] font-mono uppercase text-app-muted">Target ({recommendation.primaryPath})</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Affinity Bar */}
          <div className="bg-app-panel p-6 rounded-3xl border border-app-border shadow-sm h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-app-accent/10 border border-app-accent/30 text-app-accent rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-sm tracking-widest uppercase font-bold text-app-text">Affinity Distribution</h3>
            </div>
            
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={careerScoresData} layout="vertical" margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} width={120} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#10b981' }}
                    formatter={(value) => [`${value}%`, 'Match']}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={16}>
                    {careerScoresData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#e2e8f0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Roadmap Task Status Chart */}
        <div className="bg-app-panel p-6 rounded-3xl border border-app-border shadow-sm">
          <h3 className="text-sm tracking-widest uppercase font-bold text-app-text mb-4 text-center">Execution Status</h3>
          <div className="h-[200px] w-full">
            {roadmap.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#0f172a' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-app-muted font-mono text-[10px] uppercase tracking-widest border border-dashed border-app-border rounded-xl">
                NO ROADMAP DATA.
              </div>
            )}
          </div>
          {roadmap.length > 0 && (
            <div className="flex flex-col gap-2 mt-4 items-center">
              {taskStatusData.map(status => (
                <div key={status.name} className="flex justify-between items-center w-full max-w-[150px]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: status.color }}></div>
                    <span className="text-[10px] font-mono uppercase text-app-muted">{status.name}</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-app-text">{status.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-2 bg-app-panel p-6 sm:p-8 rounded-3xl border border-app-border shadow-sm flex flex-col justify-center">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-app-accent/10 rounded-xl flex items-center justify-center shrink-0 border border-app-accent/30">
              <TrendingUp className="w-6 h-6 text-app-accent" />
            </div>
            <div>
              <h3 className="text-sm tracking-widest uppercase font-bold mb-2 text-app-text">Performance Diagnosis</h3>
              <p className="text-app-muted leading-relaxed font-mono text-xs mb-4">
                Based on your current metrics, you possess a strong baseline for <strong>{recommendation.primaryPath}</strong>. 
                However, to reach the target role matrix, your immediate priority should be elevating your 
                <strong> System Design</strong> and <strong>DSA</strong> competencies by approx. 30%.
              </p>
              
              <div className="bg-slate-50 border border-app-border p-4 rounded-xl">
                <h4 className="text-[10px] font-mono tracking-widest uppercase text-app-muted mb-2">Strengths Detected</h4>
                <div className="flex flex-wrap gap-2">
                  {recommendation.strengths.map(strength => (
                    <span key={strength} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-app-text uppercase">{strength}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
