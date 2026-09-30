import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Send, User as UserIcon, Bot, Mic, Loader2, Play, CircleDot, BrainCircuit, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

interface InterviewTurn {
  id: string;
  role: 'user' | 'model';
  content: string; // The user's answer or the AI's question
  feedback?: string;
  score?: number;
}

export default function Interview() {
  const { user, recommendation } = useApp();
  const location = useLocation();
  const targetRole = location.state?.role || recommendation?.primaryPath || user?.careerPath || 'Software Engineering';
  const targetSector = location.state?.sector || '';

  const [isActive, setIsActive] = useState(false);
  const [focus, setFocus] = useState<'Technical' | 'Behavioral'>('Technical');
  const [history, setHistory] = useState<InterviewTurn[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const endRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const startInterview = async () => {
    setIsActive(true);
    setIsLoading(true);
    setHistory([]);

    try {
      const response = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          careerPath: targetRole,
          focus,
          history: [] 
        })
      });

      if (!response.ok) throw new Error('Failed to start interview');
      
      const data = await response.json();
      
      setHistory([{
        id: Date.now().toString(),
        role: 'model',
        content: data.nextQuestion
      }]);
    } catch (error: any) {
      console.error(error);
      setIsActive(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userAnswer = input;
    const userTurn: InterviewTurn = { id: Date.now().toString(), role: 'user', content: userAnswer };
    setHistory(prev => [...prev, userTurn]);
    setInput('');
    setIsLoading(true);

    try {
      // Build API history
      const apiHistory = history.map(turn => ({
        role: turn.role,
        content: turn.role === 'model' ? JSON.stringify({ nextQuestion: turn.content }) : turn.content
      }));
      apiHistory.push({ role: 'user', content: userAnswer });

      const response = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          careerPath: targetRole,
          focus,
          history: apiHistory 
        })
      });

      if (!response.ok) throw new Error('Failed to fetch response');
      const data = await response.json();
      
      // Update the user's turn with the feedback and score returned by the AI
      setHistory(prev => {
        const newHistory = [...prev];
        const lastTurn = newHistory[newHistory.length - 1];
        if (lastTurn.role === 'user') {
          lastTurn.feedback = data.feedback;
          lastTurn.score = data.score;
        }
        return newHistory;
      });

      // Add the next question
      setHistory(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.nextQuestion
      }]);

    } catch (error: any) {
      console.error(error);
      setHistory(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: `System error. Could not connect to evaluator.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-6rem)] flex flex-col bg-app-panel rounded-lg border border-app-border shadow-sm overflow-hidden animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-app-border flex items-center justify-between bg-app-panel z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded border border-indigo-200 bg-indigo-50 flex items-center justify-center text-indigo-500">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold tracking-widest uppercase text-app-text text-sm">Mock Interview Module</h2>
            <p className="text-[10px] uppercase font-mono tracking-widest text-app-muted flex items-center gap-1 mt-0.5">
              Target: <span className="text-app-accent font-bold">{targetRole}</span>
              {targetSector && <span className="text-app-muted">({targetSector})</span>}
            </p>
          </div>
        </div>
      </div>

      {!isActive ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-app-bg text-center">
          <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mb-6">
            <BrainCircuit className="w-10 h-10 text-indigo-500" />
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-widest text-app-text mb-4">Initialize Interview</h2>
          <p className="text-app-muted font-mono text-xs max-w-md mb-8">
            Engage in a live, AI-driven interview simulation tailored to your profile. You will receive real-time scoring and constructive feedback on every answer.
          </p>
          
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setFocus('Technical')}
              className={cn("px-6 py-3 rounded border text-xs font-bold uppercase tracking-widest transition-all", focus === 'Technical' ? "bg-indigo-500 text-white border-indigo-600 shadow-md" : "bg-app-panel text-app-muted border-app-border hover:border-indigo-300")}
            >
              Technical Focus
            </button>
            <button 
              onClick={() => setFocus('Behavioral')}
              className={cn("px-6 py-3 rounded border text-xs font-bold uppercase tracking-widest transition-all", focus === 'Behavioral' ? "bg-indigo-500 text-white border-indigo-600 shadow-md" : "bg-app-panel text-app-muted border-app-border hover:border-indigo-300")}
            >
              Behavioral Focus
            </button>
          </div>

          <button 
            onClick={startInterview}
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-4 bg-app-accent/10 text-app-accent border border-app-accent/30 rounded font-bold tracking-widest text-xs uppercase hover:bg-app-accent hover:text-white transition-all shadow-sm"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Start Session
          </button>
        </div>
      ) : (
        <>
          {/* Interview Chat Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-app-bg">
            {history.map((turn, idx) => (
              <div key={turn.id} className={cn("flex flex-col gap-2", turn.role === 'user' ? "items-end" : "items-start")}>
                
                {turn.role === 'model' && (
                  <div className="flex items-start gap-4 max-w-[85%]">
                    <div className="w-8 h-8 rounded flex items-center justify-center shrink-0 mt-1 bg-indigo-50 border border-indigo-200 text-indigo-500">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="px-5 py-4 text-sm leading-relaxed font-mono bg-app-panel border border-app-border shadow-sm text-app-text rounded-r-xl rounded-bl-xl border-l-4 border-l-indigo-500">
                      <div className="font-bold text-[10px] text-indigo-500 mb-2 uppercase tracking-widest">Question {Math.floor(idx/2) + 1}</div>
                      <ReactMarkdown>{turn.content}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {turn.role === 'user' && (
                  <div className="flex flex-col items-end gap-3 max-w-[85%]">
                    <div className="flex items-start gap-4 flex-row-reverse">
                      <div className="w-8 h-8 rounded flex items-center justify-center shrink-0 mt-1 bg-app-panel border border-app-border text-app-text">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <div className="px-5 py-3.5 text-sm leading-relaxed font-mono bg-app-accent text-white rounded-l-xl rounded-br-xl shadow-sm">
                        {turn.content}
                      </div>
                    </div>
                    
                    {/* Feedback Card */}
                    {turn.feedback && (
                      <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm relative overflow-hidden mt-1 mr-12">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-400"></div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-1.5">
                            <CircleDot className="w-3 h-3" /> Evaluator Feedback
                          </h4>
                          {turn.score !== undefined && (
                            <span className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded border",
                              turn.score >= 8 ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                              turn.score >= 5 ? "bg-amber-50 text-amber-600 border-amber-200" :
                              "bg-red-50 text-red-600 border-red-200"
                            )}>
                              Score: {turn.score}/10
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-slate-600 leading-relaxed">{turn.feedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 max-w-[85%]">
                <div className="w-8 h-8 rounded bg-indigo-50 border border-indigo-200 text-indigo-500 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-5 py-3.5 bg-app-panel border border-app-border shadow-sm text-app-muted rounded-r-lg rounded-bl-lg border-l-2 border-l-indigo-500 flex items-center gap-2 font-mono text-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-500" /> EVALUATING...
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-app-panel border-t border-app-border">
            <div className="relative flex items-end gap-2">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your answer here..."
                className="w-full pl-4 pr-4 py-3 bg-app-bg border border-app-border rounded-lg text-app-text font-mono text-sm focus:outline-none focus:border-indigo-400 focus:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all placeholder-app-muted/50 resize-none min-h-[60px] max-h-[200px]"
                rows={2}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="shrink-0 p-3 h-[60px] w-[60px] flex items-center justify-center bg-indigo-50 hover:bg-indigo-500 disabled:bg-app-bg disabled:text-app-muted disabled:border-app-border border border-indigo-200 text-indigo-600 hover:text-white rounded-lg transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-center text-[9px] uppercase tracking-widest font-mono text-app-muted mt-3">
              Press Enter to submit, Shift+Enter for new line.
            </p>
          </div>
        </>
      )}

    </div>
  );
}
