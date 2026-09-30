import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Briefcase, CheckCircle2, ChevronRight, Target, Lightbulb, GraduationCap, Building } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CareerTrack() {
  const { trackId } = useParams();
  const navigate = useNavigate();
  const { generateRoadmap } = useApp();

  const handleStartTrack = () => {
    generateRoadmap(data.title);
    navigate('/roadmap');
  };

  const getTrackDetails = (id: string) => {
    const defaultData = {
      title: 'Placement (Software)',
      description: 'Design, develop, and maintain software systems. This path offers high growth, flexibility, and continuous learning opportunities.',
      roles: ['Software Engineer', 'Data Analyst', 'AI/ML Engineer', 'Cybersecurity Analyst', 'Cloud Engineer'],
      skills: ['Data Structures & Algorithms', 'System Design', 'Web/App Development', 'Databases', 'Cloud Basics'],
      color: 'sky'
    };

    if (id === 'placement-core') return {
      title: 'Placement (Core)',
      description: 'Apply fundamental engineering principles to design and build physical systems, infrastructure, and machinery.',
      roles: ['Mechanical Engineer', 'Electrical Engineer', 'Civil Engineer', 'Manufacturing Engineer', 'Automation Specialist'],
      skills: ['CAD/CAM', 'Thermodynamics', 'Circuit Design', 'Structural Analysis', 'Project Management'],
      color: 'orange'
    };

    if (id === 'higher-studies') return {
      title: 'Higher Studies',
      description: 'Pursue advanced degrees (MS, M.Tech, MBA, PhD) to specialize in a niche area, enter academia, or shift into management.',
      roles: ['Research Assistant', 'Graduate Student', 'Management Trainee', 'PhD Candidate'],
      skills: ['Research Methodology', 'Academic Writing', 'Advanced Mathematics', 'Domain Expertise', 'Standardized Tests (GRE/GATE)'],
      color: 'indigo'
    };

    if (id === 'government-exams') return {
      title: 'Government Exams',
      description: 'Secure prestigious, stable roles in the public sector through competitive examinations.',
      roles: ['IAS/IPS Officer', 'IES Officer', 'PSU Engineer', 'State Service Officer'],
      skills: ['General Knowledge', 'Aptitude & Reasoning', 'Technical Core Subjects', 'Current Affairs', 'Time Management'],
      color: 'teal'
    };

    if (id === 'entrepreneurship') return {
      title: 'Entrepreneurship',
      description: 'Build your own company, solve real-world problems, and create value from the ground up.',
      roles: ['Founder/CEO', 'CTO', 'Product Lead'],
      skills: ['Market Research', 'MVP Development', 'Pitching & Fundraising', 'Leadership', 'Financial Modeling'],
      color: 'amber'
    };

    return defaultData;
  };

  const data = getTrackDetails(trackId || '');

  const colorClasses = {
    sky: { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-100', hover: 'hover:bg-sky-500 hover:text-app-text' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', hover: 'hover:bg-orange-500 hover:text-app-text' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', hover: 'hover:bg-indigo-500 hover:text-app-text' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100', hover: 'hover:bg-teal-500 hover:text-app-text' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', hover: 'hover:bg-amber-500 hover:text-app-text' },
  };

  const colors = colorClasses[data.color as keyof typeof colorClasses];

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-app-muted hover:text-app-text transition-colors mb-8 font-mono text-[10px] tracking-widest uppercase"
      >
        <ArrowLeft className="w-3 h-3" /> Back to Archives
      </button>

      {/* Hero Section */}
      <div className={`rounded-lg p-8 md:p-12 mb-8 bg-app-panel border border-app-border relative overflow-hidden shadow-inner`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-app-accent/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 max-w-2xl">
          <div className={`inline-flex items-center gap-2 px-2 py-0.5 rounded border border-app-accent/30 text-[9px] font-mono tracking-widest uppercase bg-app-accent/10 text-app-accent mb-6 shadow-sm`}>
            <Briefcase className="w-3 h-3" /> Trajectory Record
          </div>
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-app-text mb-6">{data.title}</h1>
          <p className="text-sm font-mono text-app-muted leading-relaxed mb-8">{data.description}</p>
          
          <button 
            onClick={handleStartTrack}
            className={`px-6 py-3 bg-app-accent/10 border border-app-accent/30 text-app-accent hover:bg-app-accent hover:text-app-text font-bold text-[10px] tracking-widest uppercase rounded shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all flex items-center gap-2`}
          >
            Initialize Sequence <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Typical Roles */}
        <div className="bg-app-panel rounded-lg p-8 border border-app-border shadow-inner">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded bg-app-accent/10 border border-app-accent/30 flex items-center justify-center text-app-accent`}>
              <Target className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-app-text">Target Designations</h2>
          </div>
          <div className="space-y-3">
            {data.roles.map(role => (
              <div key={role} className="flex items-center justify-between p-4 rounded bg-app-bg border border-app-border hover:border-app-accent/30 hover:shadow-[0_0_10px_rgba(16,185,129,0.1)] transition-all cursor-pointer group">
                <span className="font-mono text-xs text-app-muted group-hover:text-app-text uppercase tracking-widest">{role}</span>
                <ChevronRight className="w-4 h-4 text-app-muted group-hover:text-app-accent" />
              </div>
            ))}
          </div>
        </div>

        {/* Required Skills */}
        <div className="bg-app-panel rounded-lg p-8 border border-app-border shadow-inner">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded bg-app-accent/10 border border-app-accent/30 flex items-center justify-center text-app-accent`}>
              <Lightbulb className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-app-text">Required Protocols</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {data.skills.map(skill => (
              <div key={skill} className="flex items-center gap-2 px-3 py-2 rounded bg-app-bg border border-app-border text-app-muted font-mono text-[10px] tracking-widest uppercase hover:border-app-accent/30 transition-colors cursor-default">
                <CheckCircle2 className={`w-3 h-3 text-app-accent`} /> {skill}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
