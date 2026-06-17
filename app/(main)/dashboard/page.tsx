"use client";

import React, { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      if (typeof window !== 'undefined' && window.electronAPI) {
        try {
          const p = await window.electronAPI.getActiveProfile();
          setProfile(p);
        } catch (error) {
          console.error("Failed to load profile:", error);
        }
      }
    }
    loadProfile();
  }, []);

  return (
    <div className="animate-fade-in space-y-6">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Welcome back, {profile?.display_name || 'Student'}
          </h1>
          <p className="text-slate-400 mt-1">Ready to crush your study goals today?</p>
        </div>
        <div className="glass px-4 py-2 rounded-lg flex items-center gap-3">
          <div className="text-xl">🔥</div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Day Streak</div>
            <div className="text-lg font-bold text-orange-400">{profile?.streak_current || 0} Days</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Plan */}
        <div className="glass-card p-6 rounded-2xl col-span-2">
          <h2 className="text-xl font-bold text-white mb-4">Today's Plan</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">📚</div>
                <div>
                  <h3 className="font-medium text-white">Data Structures Review</h3>
                  <p className="text-sm text-slate-400">AI-generated flashcards from Lecture 4</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">Start</button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400">🧠</div>
                <div>
                  <h3 className="font-medium text-white">Cognitive Assessment</h3>
                  <p className="text-sm text-slate-400">Pattern recognition daily test</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">Start</button>
            </div>
          </div>
        </div>

        {/* AI Coach Quick Action */}
        <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-slate-900 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-2">AI Coach</h2>
          <p className="text-sm text-slate-400 mb-6">Need help understanding a difficult concept?</p>
          <div className="mt-auto">
            <button className="w-full py-3 bg-white text-slate-950 font-bold rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] transition-all cursor-pointer">
              Ask Coach
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
