"use client";

import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/Button';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6">
      <div className="glass-card max-w-lg w-full p-8 rounded-2xl flex flex-col items-center text-center animate-slide-up">
        <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6">
          <span className="text-3xl">✨</span>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">Welcome to Infinity Mind</h1>
        
        <p className="text-slate-300 mb-8 leading-relaxed">
          Your personal cognitive performance and study optimization platform. 
          Everything runs entirely on your device for absolute privacy and zero latency.
        </p>

        <div className="flex flex-col w-full gap-4">
          <Button 
            variant="glow" 
            size="lg" 
            onClick={() => router.push('/setup-profile')}
            className="w-full"
          >
            Create Your Profile
          </Button>
          
          <p className="text-xs text-slate-500 mt-4">
            Requires 8GB+ RAM. No internet required after setup.
          </p>
        </div>
      </div>
    </div>
  );
}
