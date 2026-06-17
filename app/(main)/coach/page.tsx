"use client";

import React, { useState, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function CoachPage() {
  const [profile, setProfile] = useState<any>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function init() {
      if (typeof window !== 'undefined' && window.electronAPI) {
        const p = await window.electronAPI.getActiveProfile();
        setProfile(p);
        setMessages([{
          role: 'ai',
          content: `Hi ${p?.display_name || 'there'}! How can I help you study today?`
        }]);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      if (typeof window !== 'undefined' && window.electronAPI) {
        const aiResponse = await window.electronAPI.aiChat(userMsg, messages);
        setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', content: 'Oops, something went wrong with the AI engine.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-fade-in">
      <header className="mb-6 flex-shrink-0">
        <h1 className="text-3xl font-bold text-white tracking-tight">AI Coach</h1>
        <p className="text-slate-400 mt-1">Your personal tutor powered by Gemma 4.</p>
      </header>

      <div className="flex-1 glass-card rounded-2xl flex flex-col overflow-hidden relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'ai' ? (
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center flex-shrink-0 text-white font-bold">IM</div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 text-slate-300 font-bold">U</div>
              )}
              <div className={`p-4 rounded-2xl text-slate-200 max-w-[80%] ${
                msg.role === 'ai' 
                  ? 'glass bg-slate-800/80 rounded-tl-sm' 
                  : 'bg-indigo-600 rounded-tr-sm'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center flex-shrink-0 text-white font-bold">IM</div>
              <div className="glass bg-slate-800/80 p-4 rounded-2xl rounded-tl-sm text-slate-200 flex items-center gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <div className="relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about Data Structures or anything else..." 
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="text-white text-sm">↑</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
