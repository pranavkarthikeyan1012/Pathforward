import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, GraduationCap, BookOpen, Award, CheckCircle2, Edit2, Save, X } from 'lucide-react';

export default function Profile() {
  const { user, updateUser, recommendation } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user || {} as any);

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user || {});
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
      
      {/* Profile Header */}
      <div className="bg-app-panel rounded-lg p-8 border border-app-border shadow-inner relative mb-8">
        <div className="absolute top-8 right-8">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-app-bg hover:bg-app-accent/10 text-app-muted hover:text-app-text font-mono text-[10px] tracking-widest uppercase border border-app-border rounded transition-colors">
              <Edit2 className="w-3 h-3" /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleCancel} className="p-2 text-app-muted hover:text-app-text transition-colors bg-app-bg border border-app-border rounded">
                <X className="w-4 h-4" />
              </button>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-app-accent/10 hover:bg-app-accent border border-app-accent/30 text-app-accent hover:text-app-text font-mono text-[10px] tracking-widest uppercase rounded transition-colors shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <Save className="w-3 h-3" /> Save
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="w-24 h-24 rounded bg-app-bg text-app-accent flex items-center justify-center text-3xl font-mono font-bold border border-app-border shadow-[0_0_15px_rgba(16,185,129,0.2)] shrink-0">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 space-y-4">
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-app-accent font-mono tracking-widest uppercase">Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 bg-app-bg text-app-text border border-app-border rounded mt-1 font-mono text-sm focus:outline-none focus:border-app-accent" />
                </div>
                <div>
                  <label className="text-[10px] text-app-accent font-mono tracking-widest uppercase">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2 bg-app-bg text-app-text border border-app-border rounded mt-1 font-mono text-sm focus:outline-none focus:border-app-accent" />
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold tracking-widest uppercase text-app-text mb-1">{user.name}</h1>
                <p className="text-app-muted font-mono text-xs flex items-center gap-2"><Mail className="w-3 h-3" /> {user.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-8">
          
          <div className="bg-app-panel rounded-lg p-8 border border-app-border shadow-inner">
            <h2 className="text-sm font-bold tracking-widest uppercase text-app-text mb-6 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-app-accent" /> Academic Info
            </h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] text-app-muted font-mono tracking-widest uppercase mb-1">College/University</p>
                {isEditing ? (
                  <input type="text" value={formData.college} onChange={e => setFormData({...formData, college: e.target.value})} className="w-full p-2 bg-app-bg text-app-text border border-app-border rounded font-mono text-sm focus:outline-none focus:border-app-accent" />
                ) : (
                  <p className="font-mono text-sm text-app-text uppercase">{user.college}</p>
                )}
              </div>
              <div>
                <p className="text-[10px] text-app-muted font-mono tracking-widest uppercase mb-1">Branch</p>
                {isEditing ? (
                  <input type="text" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} className="w-full p-2 bg-app-bg text-app-text border border-app-border rounded font-mono text-sm focus:outline-none focus:border-app-accent" />
                ) : (
                  <p className="font-mono text-sm text-app-text uppercase">{user.branch}</p>
                )}
              </div>
              <div>
                <p className="text-[10px] text-app-muted font-mono tracking-widest uppercase mb-1">Semester</p>
                {isEditing ? (
                  <input type="text" value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} className="w-full p-2 bg-app-bg text-app-text border border-app-border rounded font-mono text-sm focus:outline-none focus:border-app-accent" />
                ) : (
                  <p className="font-mono text-sm text-app-text uppercase">{user.semester}</p>
                )}
              </div>
              <div>
                <p className="text-[10px] text-app-muted font-mono tracking-widest uppercase mb-1">CGPA</p>
                {isEditing ? (
                  <input type="text" value={formData.cgpa} onChange={e => setFormData({...formData, cgpa: e.target.value})} className="w-full p-2 bg-app-bg text-app-text border border-app-border rounded font-mono text-sm focus:outline-none focus:border-app-accent" />
                ) : (
                  <p className="font-mono text-sm text-app-text uppercase">{user.cgpa}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-app-panel rounded-lg p-8 border border-app-border shadow-inner">
            <h2 className="text-sm font-bold tracking-widest uppercase text-app-text mb-6 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-400" /> Skills & Expertise
            </h2>
            
            {isEditing ? (
              <div className="space-y-2">
                <p className="text-[10px] text-app-muted font-mono tracking-widest uppercase mb-1">Comma separated skills</p>
                <input 
                  type="text" 
                  value={formData.skills.join(', ')} 
                  onChange={e => setFormData({...formData, skills: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean)})} 
                  className="w-full p-2 bg-app-bg text-app-text border border-app-border rounded font-mono text-sm focus:outline-none focus:border-app-accent" 
                />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.skills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-app-bg border border-app-border rounded text-[10px] font-mono tracking-widest uppercase text-app-muted">
                    {skill}
                  </span>
                ))}
                {user.skills.length === 0 && <p className="text-app-muted font-mono text-xs italic">NO SKILLS REGISTERED.</p>}
              </div>
            )}
          </div>

          <div className="bg-app-panel rounded-lg p-8 border border-app-border shadow-inner mt-8">
            <h2 className="text-sm font-bold tracking-widest uppercase text-app-text mb-6 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" /> Certifications
            </h2>
            
            {isEditing ? (
              <div className="space-y-2">
                <p className="text-[10px] text-app-muted font-mono tracking-widest uppercase mb-1">Comma separated certifications</p>
                <input 
                  type="text" 
                  value={formData.certifications.join(', ')} 
                  onChange={e => setFormData({...formData, certifications: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean)})} 
                  className="w-full p-2 bg-app-bg text-app-text border border-app-border rounded font-mono text-sm focus:outline-none focus:border-app-accent" 
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {user.certifications.map(cert => (
                  <div key={cert} className="flex items-center gap-2 px-3 py-2 bg-app-bg border border-app-border rounded text-xs font-mono uppercase text-app-muted">
                    <CheckCircle2 className="w-4 h-4 text-app-accent shrink-0" /> {cert}
                  </div>
                ))}
                {user.certifications.length === 0 && <p className="text-app-muted font-mono text-xs italic">NO CERTIFICATIONS REGISTERED.</p>}
              </div>
            )}
          </div>

          <div className="bg-app-panel rounded-lg p-8 border border-app-border shadow-inner mt-8">
            <h2 className="text-sm font-bold tracking-widest uppercase text-app-text mb-6 flex items-center gap-2">
              <Award className="w-4 h-4 text-app-warning" /> Earned Badges
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {user.badges && user.badges.length > 0 ? (
                user.badges.map(badge => (
                  <div key={badge.id} className="bg-app-bg border border-[#f59e0b]/30 rounded p-4 flex flex-col items-center text-center shadow-[0_0_15px_rgba(245,158,11,0.05)] hover:border-[#f59e0b]/60 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(245,158,11,0.2)] text-app-warning">
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="text-[10px] font-bold tracking-widest uppercase text-app-text mb-1">{badge.name}</h3>
                    <p className="text-[8px] font-mono uppercase tracking-widest text-app-muted line-clamp-2">{badge.description}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-6 text-center border border-dashed border-app-border rounded">
                  <p className="text-app-muted font-mono text-xs uppercase tracking-widest italic">NO BADGES EARNED YET. COMPLETE TASKS IN ROADMAP.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          <div className="bg-app-panel rounded-lg p-6 border border-app-border shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-app-accent/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <h3 className="font-bold text-sm tracking-widest uppercase mb-4 text-app-text relative z-10">Career Profile</h3>
            {recommendation ? (
              <div className="space-y-4 relative z-10">
                <div>
                  <p className="text-[10px] text-app-muted font-mono tracking-widest uppercase mb-1">Primary Match</p>
                  <p className="text-lg font-bold tracking-widest uppercase text-app-accent">{recommendation.primaryPath}</p>
                </div>
                <div>
                  <p className="text-[10px] text-app-muted font-mono tracking-widest uppercase mb-1">Fit Score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-app-bg rounded-full overflow-hidden border border-app-border">
                      <div className="h-full bg-app-accent rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" style={{width: `${recommendation.primaryScore}%`}}></div>
                    </div>
                    <span className="font-mono text-sm text-app-text">{recommendation.primaryScore}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs font-mono text-app-muted">Complete the career assessment to see your profile.</p>
            )}
          </div>

          <div className="bg-app-panel rounded-lg p-6 border border-app-border shadow-inner">
            <h3 className="font-bold text-sm tracking-widest uppercase text-app-text mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-app-warning" /> Achievements
            </h3>
            <div className="space-y-3">
              {user.projects.map(proj => (
                <div key={proj} className="flex items-start gap-2 text-xs font-mono text-app-muted">
                  <CheckCircle2 className="w-3 h-3 text-app-accent shrink-0 mt-0.5" /> {proj}
                </div>
              ))}
              {user.projects.length === 0 && <p className="text-xs font-mono text-app-muted italic">No records found.</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
