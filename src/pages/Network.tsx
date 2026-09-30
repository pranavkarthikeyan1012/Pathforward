import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Filter, UserPlus, MessageSquare, Briefcase, GraduationCap, Building2 } from 'lucide-react';
import { Mentor } from '../types';

const demoMentors: Mentor[] = [
  { id: '1', name: 'Sarah Chen', role: 'Software Engineer', company: 'Google', year: '2021', branch: 'Computer Science', type: 'alumni', skills: ['React', 'System Design'] },
  { id: '2', name: 'Raj Patel', role: 'Product Manager', company: 'Microsoft', year: '2020', branch: 'Electronics', type: 'alumni', skills: ['Product', 'Agile'] },
  { id: '3', name: 'Emily Wong', role: 'Data Scientist', company: 'Amazon', year: '2022', branch: 'Computer Science', type: 'alumni', skills: ['Python', 'Machine Learning'] },
  { id: '4', name: 'David Kim', role: 'Mechanical Engineer', company: 'Tesla', year: '2019', branch: 'Mechanical', type: 'alumni', skills: ['CAD', 'Manufacturing'] },
  { id: '5', name: 'Aisha Sharma', role: 'SDE Intern', company: 'Meta', year: '4th Year', branch: 'Computer Science', type: 'senior', skills: ['DSA', 'Web Dev'] },
  { id: '6', name: 'Michael Chang', role: 'Research Intern', company: 'MIT', year: '4th Year', branch: 'Electronics', type: 'senior', skills: ['IoT', 'Research'] },
  { id: '7', name: 'Dr. Robert Steele', role: 'Professor', company: 'CS Dept', year: 'Faculty', branch: 'Computer Science', type: 'faculty', skills: ['AI', 'Computer Vision'] },
];

export default function Network() {
  const [filter, setFilter] = useState<'all' | 'alumni' | 'senior' | 'faculty'>('all');
  const [search, setSearch] = useState('');
  const [requested, setRequested] = useState<Record<string, boolean>>({});

  const filteredMentors = demoMentors.filter(m => {
    const matchFilter = filter === 'all' || m.type === filter;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                        m.role.toLowerCase().includes(search.toLowerCase()) ||
                        m.company.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleConnect = (id: string) => {
    setRequested(prev => ({ ...prev, [id]: true }));
  };

  const getTypeIcon = (type: string) => {
    if (type === 'alumni') return <Briefcase className="w-4 h-4" />;
    if (type === 'senior') return <GraduationCap className="w-4 h-4" />;
    return <Building2 className="w-4 h-4" />;
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-xl font-bold tracking-widest uppercase text-app-text mb-2">Network Grid</h1>
        <p className="text-app-muted font-mono text-xs uppercase tracking-widest">Establish connections with alumni, seniors, and faculty.</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="SEARCH BY NAME, ROLE, OR COMPANY..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-app-bg border border-app-border rounded font-mono text-xs text-app-text focus:outline-none focus:border-app-accent focus:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all placeholder-app-muted/50 tracking-widest uppercase"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {(['all', 'alumni', 'senior', 'faculty'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-3 rounded text-[10px] font-mono tracking-widest uppercase whitespace-nowrap transition-colors border ${
                filter === f ? 'bg-app-accent/10 text-app-accent border-app-accent/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-app-bg text-app-muted border-app-border hover:bg-app-panel hover:text-app-text'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Mentor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map(mentor => (
          <div key={mentor.id} className="bg-app-panel rounded-lg p-6 border border-app-border shadow-inner hover:border-app-accent/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all flex flex-col group">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded border border-app-border bg-app-bg flex items-center justify-center text-sm font-mono text-app-muted shrink-0 group-hover:border-app-accent group-hover:text-app-accent transition-colors">
                {getInitials(mentor.name)}
              </div>
              <div>
                <h3 className="font-bold tracking-widest uppercase text-app-text leading-tight text-sm">{mentor.name}</h3>
                <p className="text-[10px] font-mono uppercase tracking-widest text-app-accent mt-1">{mentor.role}</p>
                <p className="text-[10px] font-mono uppercase tracking-widest text-app-muted mt-1">{mentor.company} // {mentor.year}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6 text-[9px] font-mono tracking-widest uppercase px-2 py-1 bg-app-bg border border-app-border rounded w-fit text-app-muted">
              {getTypeIcon(mentor.type)} {mentor.type}
            </div>

            <div className="flex flex-wrap gap-2 mb-6 mt-auto">
              {mentor.skills.map(skill => (
                <span key={skill} className="text-[9px] font-mono uppercase tracking-widest px-2 py-1 bg-app-bg border border-app-border rounded text-app-muted">
                  {skill}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-auto">
              <button 
                onClick={() => handleConnect(mentor.id)}
                disabled={requested[mentor.id]}
                className={`flex items-center justify-center gap-2 py-2 rounded text-[10px] font-bold tracking-widest uppercase transition-all border ${
                  requested[mentor.id] 
                    ? 'bg-[#10b981]/10 text-app-success border-[#10b981]/30 opacity-70' 
                    : 'bg-app-accent/10 text-app-accent hover:bg-app-accent hover:text-app-text border-app-accent/30'
                }`}
              >
                {requested[mentor.id] ? 'Pending' : <><UserPlus className="w-3 h-3" /> Connect</>}
              </button>
              <button className="flex items-center justify-center gap-2 py-2 bg-app-bg border border-app-border text-app-muted hover:text-app-text hover:border-app-accent rounded text-[10px] font-bold tracking-widest uppercase transition-colors">
                <MessageSquare className="w-3 h-3" /> Message
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredMentors.length === 0 && (
        <div className="text-center py-24 bg-app-panel rounded-lg border border-app-border shadow-inner">
          <Search className="w-10 h-10 text-app-muted mx-auto mb-4 opacity-50" />
          <h3 className="text-sm tracking-widest uppercase font-bold text-app-text mb-2">No signals found</h3>
          <p className="text-app-muted font-mono text-xs">Adjust telemetry parameters to scan again.</p>
        </div>
      )}

    </div>
  );
}
