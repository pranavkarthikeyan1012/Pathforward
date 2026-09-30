import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowRight, ArrowLeft, Check, Brain, Code, LineChart, Briefcase, Globe } from 'lucide-react';

export default function Onboarding() {
  const { updateUser, setRecommendation, generateRoadmap } = useApp();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    college: '',
    branch: '',
    semester: '',
    cgpa: '',
    skills: [] as string[],
    interests: [] as string[],
    preferences: [] as string[],
    goals: ''
  });

  const availableSkills = ['Python', 'Java', 'C++', 'JavaScript', 'SQL', 'Data Structures', 'Machine Learning', 'Electronics', 'CAD', 'Communication', 'Leadership', 'Business'];
  const availableInterests = ['Building software', 'Designing systems', 'Working with machines', 'Research', 'Teaching', 'Business', 'Problem solving', 'Leadership', 'Public service', 'Innovation'];
  const availablePreferences = ['Job stability', 'High Salary', 'Work-life balance', 'Higher education', 'Entrepreneurship', 'Government service', 'Technical work'];

  const toggleArrayItem = (field: 'skills' | 'interests' | 'preferences', item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item) 
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 6));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setLoadingText('Analyzing your profile...');
    
    // Update user profile
    updateUser({
      college: formData.college,
      branch: formData.branch,
      semester: formData.semester,
      cgpa: formData.cgpa,
      skills: formData.skills
    });

    try {
      setTimeout(() => setLoadingText('Evaluating career fit...'), 1500);
      setTimeout(() => setLoadingText('Building your personalized roadmap...'), 3000);
      
      const response = await fetch('/api/ai/analyze-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentData: formData })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to analyze assessment');
      }
      
      const data = await response.json();
      setRecommendation(data);
      
      // We don't generate the roadmap immediately, they have to accept it on the result page.
      // But we navigate to the result view (Discover page will handle it if recommendation exists)
      
      navigate('/discover');
    } catch (err: any) {
      console.error(err);
      alert(`SYSTEM ERROR: ${err.message || 'Connection failed'}. Please ensure your GEMINI_API_KEY is configured correctly.`);
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-app-bg flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 relative mb-8">
          <div className="absolute inset-0 border border-app-border rounded"></div>
          <div className="absolute inset-0 border border-app-accent rounded animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <Brain className="w-8 h-8 text-app-accent animate-pulse" />
          </div>
        </div>
        <h2 className="text-xl font-bold uppercase tracking-widest text-app-text mb-2">{loadingText}</h2>
        <p className="text-[10px] font-mono tracking-widest uppercase text-app-muted">System is processing your parameters...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-[10px] font-mono tracking-widest uppercase text-app-muted mb-2">
            <span>Phase {step} of 6</span>
            <span className="text-app-accent">{Math.round((step / 6) * 100)}%</span>
          </div>
          <div className="w-full h-1 bg-app-panel border border-app-border overflow-hidden">
            <div 
              className="h-full bg-app-accent transition-all duration-500 ease-out shadow-[0_0_10px_rgba(16,185,129,0.8)]"
              style={{ width: `${(step / 6) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-app-panel rounded-lg p-8 md:p-12 shadow-inner border border-app-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-app-accent/5 blur-3xl rounded-full pointer-events-none"></div>

          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-widest text-app-text mb-2">Node Identification</h2>
                <p className="text-[10px] font-mono tracking-widest uppercase text-app-muted">Establish base parameters.</p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-mono tracking-widest uppercase text-app-accent mb-2">Institution Origin</label>
                  <input type="text" value={formData.college} onChange={e => setFormData({...formData, college: e.target.value})} className="w-full p-3 rounded bg-app-bg text-app-text border border-app-border focus:ring-1 focus:ring-app-accent focus:border-app-accent outline-none font-mono text-xs transition-all" placeholder="E.G. NATIONAL INSTITUTE OF TECHNOLOGY" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-widest uppercase text-app-accent mb-2">Engineering Sector</label>
                  <input type="text" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} className="w-full p-3 rounded bg-app-bg text-app-text border border-app-border focus:ring-1 focus:ring-app-accent focus:border-app-accent outline-none font-mono text-xs transition-all" placeholder="E.G. COMPUTER SCIENCE" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-widest uppercase text-app-accent mb-2">Current Phase</label>
                  <select value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} className="w-full p-3 rounded bg-app-bg text-app-text border border-app-border focus:ring-1 focus:ring-app-accent focus:border-app-accent outline-none font-mono text-xs transition-all appearance-none">
                    <option value="" className="bg-app-panel text-app-muted">SELECT PHASE</option>
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s} className="bg-app-panel text-app-text">PHASE {s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-widest text-app-text mb-2">Academic Telemetry</h2>
                <p className="text-[10px] font-mono tracking-widest uppercase text-app-muted">Input current performance metrics.</p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-mono tracking-widest uppercase text-app-accent mb-2">Current CGPA (out of 10)</label>
                  <input type="number" step="0.1" value={formData.cgpa} onChange={e => setFormData({...formData, cgpa: e.target.value})} className="w-full p-3 rounded bg-app-bg text-app-text border border-app-border focus:ring-1 focus:ring-app-accent focus:border-app-accent outline-none font-mono text-xs transition-all" placeholder="E.G. 8.5" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-widest text-app-text mb-2">Skill Arsenal</h2>
                <p className="text-[10px] font-mono tracking-widest uppercase text-app-muted">Select acquired technical competencies.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {availableSkills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleArrayItem('skills', skill)}
                    className={`px-4 py-2 rounded text-[10px] font-mono tracking-widest uppercase border transition-all ${
                      formData.skills.includes(skill)
                        ? 'bg-app-accent/10 text-app-accent border-app-accent shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                        : 'bg-app-bg text-app-muted border-app-border hover:border-app-muted'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-widest text-app-text mb-2">Target Affinity</h2>
                <p className="text-[10px] font-mono tracking-widest uppercase text-app-muted">Identify core areas of interest.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {availableInterests.map(interest => (
                  <button
                    key={interest}
                    onClick={() => toggleArrayItem('interests', interest)}
                    className={`px-4 py-2 rounded text-[10px] font-mono tracking-widest uppercase border transition-all ${
                      formData.interests.includes(interest)
                        ? 'bg-app-accent/10 text-app-accent border-app-accent shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                        : 'bg-app-bg text-app-muted border-app-border hover:border-app-muted'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-widest text-app-text mb-2">Trajectory Priorities</h2>
                <p className="text-[10px] font-mono tracking-widest uppercase text-app-muted">Define variables for outcome optimization.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {availablePreferences.map(pref => (
                  <button
                    key={pref}
                    onClick={() => toggleArrayItem('preferences', pref)}
                    className={`px-4 py-2 rounded text-[10px] font-mono tracking-widest uppercase border transition-all ${
                      formData.preferences.includes(pref)
                        ? 'bg-[#10b981]/10 text-teal-400 border-teal-400/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                        : 'bg-app-bg text-app-muted border-app-border hover:border-app-muted'
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-widest text-app-text mb-2">Manual Override</h2>
                <p className="text-[10px] font-mono tracking-widest uppercase text-app-muted">Provide additional context in unstructured format.</p>
              </div>
              <div>
                <textarea 
                  value={formData.goals}
                  onChange={e => setFormData({...formData, goals: e.target.value})}
                  rows={4}
                  className="w-full p-4 rounded bg-app-bg text-app-text border border-app-border focus:ring-1 focus:ring-app-accent focus:border-app-accent outline-none font-mono text-xs resize-none transition-all"
                  placeholder="E.G. I WANT TO SECURE A POSITION AS A SYSTEMS ARCHITECT..."
                />
              </div>
            </div>
          )}

          <div className="mt-12 flex items-center justify-between pt-6 border-t border-app-border relative z-10">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded font-mono text-[10px] tracking-widest uppercase border transition-colors ${
                step === 1 ? 'text-app-bg border-app-bg cursor-not-allowed' : 'text-app-muted border-app-border hover:text-app-text hover:border-app-muted'
              }`}
            >
              <ArrowLeft className="w-3 h-3" /> Revert
            </button>
            
            {step < 6 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2.5 bg-app-bg text-app-text border border-app-border rounded font-mono text-[10px] tracking-widest uppercase hover:border-app-accent hover:text-app-accent transition-all"
              >
                Proceed <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-3 bg-app-accent/10 text-app-accent border border-app-accent/30 rounded font-bold text-xs tracking-widest uppercase hover:bg-app-accent hover:text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                Run Diagnostics <Brain className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
