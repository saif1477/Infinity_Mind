"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Splash screen visible for 2.5s, then redirect to onboarding
    const timer = setTimeout(() => {
      router.push('/welcome');
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950">
      <div className="relative animate-fade-in flex flex-col items-center">
        <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-tr from-indigo-600 to-teal-400 animate-glow flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)]">
          <span className="text-4xl font-bold text-white tracking-tighter">IM</span>
        </div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
          Infinity Mind
        </h1>
        <p className="mt-3 text-slate-400 animate-pulse-slow">
          Initializing neural pathways...
        </p>
      </div>
    </div>
  );
}
