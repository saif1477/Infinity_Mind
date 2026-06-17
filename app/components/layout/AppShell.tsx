"use client";

import React from 'react';
import { Sidebar } from './Sidebar';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden pt-8">
      {/* pt-8 accommodates the frameless window drag region */}
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 relative z-10">
        {children}
      </main>
    </div>
  );
};
