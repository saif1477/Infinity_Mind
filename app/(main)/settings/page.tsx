"use client";

import React from 'react';
import { Button } from '../../components/ui/Button';

export default function SettingsPage() {
  return (
    <div className="animate-fade-in space-y-6 max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
      </header>

      <div className="glass-card p-6 rounded-2xl space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white mb-2">AI Models</h2>
          <p className="text-sm text-slate-400 mb-4">Manage downloaded local models.</p>
          
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <div>
              <div className="font-medium text-white">Gemma 4 (e2b)</div>
              <div className="text-xs text-green-400">Downloaded • Active</div>
            </div>
            <Button variant="ghost" size="sm" className="cursor-pointer">Remove</Button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-700/50">
          <h2 className="text-lg font-bold text-white mb-2">Storage</h2>
          <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <p className="text-xs text-slate-400">900 MB / 2 GB used</p>
        </div>
      </div>
    </div>
  );
}
