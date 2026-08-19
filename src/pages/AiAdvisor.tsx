import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Send, User as UserIcon, Bot, Lightbulb, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

export default function AiAdvisor() {
  const { user, roadmap, recommendation } = useApp();
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    role: 'model',
    content: `Hi ${user?.name.split(' ')[0] || 'there'}! I'm PathForward AI. How can I help you with your career journey today?`
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "Analyze my progress",
    "What should I learn next?",
    "Am I on track?",
    "Suggest a project"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const context = {
        profile: user,
        roadmapProgress: roadmap,
        recommendation: recommendation
      };

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: text,
          history: messages.map(m => ({ role: m.role, content: m.content })),
          context 
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch response');
      }
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.text || "I'm sorry, I couldn't process that request."
      }]);
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: `SYSTEM ERROR: ${error.message || 'Connection failed'}. Please ensure your API keys are configured correctly.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-6rem)] flex flex-col bg-app-panel rounded-lg border border-app-border shadow-inner overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-app-border flex items-center justify-between bg-app-panel z-10 shadow-[0_5px_15px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded border border-[#0ea5e9]/30 bg-[#0ea5e9]/10 flex items-center justify-center text-app-accent shadow-[0_0_15px_rgba(14,165,233,0.2)]">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold tracking-widest uppercase text-white text-sm">PathForward AI</h2>
            <p className="text-[10px] uppercase font-mono tracking-widest text-app-accent flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-app-accent animate-pulse shadow-[0_0_8px_rgba(56,189,248,1)]"></span> Link Active
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-app-bg">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-4 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
            
            <div className={cn(
              "w-8 h-8 rounded flex items-center justify-center shrink-0 mt-1 border",
              msg.role === 'user' ? "bg-app-panel border-app-border text-white" : "bg-[#0ea5e9]/10 border-[#0ea5e9]/30 text-app-accent"
            )}>
              {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            
            <div className={cn(
              "px-5 py-3.5 text-sm leading-relaxed font-mono",
              msg.role === 'user' 
                ? "bg-app-panel text-white rounded-l-lg rounded-br-lg border border-app-border shadow-inner" 
                : "bg-app-bg border border-app-border shadow-inner text-app-muted rounded-r-lg rounded-bl-lg border-l-2 border-l-app-accent"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 max-w-[85%]">
            <div className="w-8 h-8 rounded bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 text-app-accent flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4" />
            </div>
            <div className="px-5 py-3.5 bg-app-bg border border-app-border shadow-inner text-app-muted rounded-r-lg rounded-bl-lg border-l-2 border-l-app-accent flex items-center gap-2 font-mono text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-app-accent" /> PROCESSING...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-app-panel border-t border-app-border">
        
        {/* Quick Prompts */}
        <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
          {quickPrompts.map(prompt => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="shrink-0 px-4 py-2 bg-app-bg hover:bg-[#0ea5e9]/10 text-app-muted hover:text-white text-[10px] uppercase font-mono tracking-widest rounded border border-app-border hover:border-[#0ea5e9]/40 transition-colors flex items-center gap-1.5"
            >
              <Lightbulb className="w-3 h-3 text-app-accent" /> {prompt}
            </button>
          ))}
        </div>

        <form 
          onSubmit={e => { e.preventDefault(); handleSend(input); }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="ENTER COMMAND OR INQUIRY..."
            className="w-full pl-4 pr-14 py-4 bg-app-bg border border-app-border rounded text-white font-mono text-xs focus:outline-none focus:border-app-accent focus:shadow-[0_0_15px_rgba(56,189,248,0.2)] transition-all placeholder-app-muted/50 uppercase tracking-widest"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2.5 bg-[#0ea5e9]/10 hover:bg-app-accent disabled:bg-app-bg disabled:text-app-muted disabled:border-app-border border border-[#0ea5e9]/30 text-app-accent hover:text-white rounded transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
