"use client";

import React, { useState, useEffect, useCallback } from 'react';

export default function BrainTrainingPage() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'score'>('menu');
  const [nBackLevel, setNBackLevel] = useState(2);
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [matchesAttempted, setMatchesAttempted] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);

  // 3x3 Grid (0-8)
  const [activeSquare, setActiveSquare] = useState<number | null>(null);

  const startGame = () => {
    // Generate a random sequence of 20 positions
    const newSeq: number[] = [];
    let possibleMatches = 0;
    
    for (let i = 0; i < 20; i++) {
      // 30% chance to force a match if i >= nBackLevel
      if (i >= nBackLevel && Math.random() < 0.3) {
        newSeq.push(newSeq[i - nBackLevel]);
        possibleMatches++;
      } else {
        newSeq.push(Math.floor(Math.random() * 9));
      }
    }
    
    setSequence(newSeq);
    setTotalMatches(possibleMatches);
    setScore(0);
    setMatchesAttempted(0);
    setCurrentIndex(0);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    if (currentIndex >= sequence.length) {
      setGameState('score');
      return;
    }

    setActiveSquare(sequence[currentIndex]);

    const timer = setTimeout(() => {
      setActiveSquare(null);
      setCurrentIndex(prev => prev + 1);
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentIndex, gameState, sequence]);

  const handleMatchClick = () => {
    if (gameState !== 'playing' || currentIndex < nBackLevel) return;
    
    setMatchesAttempted(prev => prev + 1);
    if (sequence[currentIndex] === sequence[currentIndex - nBackLevel]) {
      setScore(prev => prev + 1);
    } else {
      setScore(prev => prev - 1);
    }
  };

  if (gameState === 'playing') {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)] animate-fade-in space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Dual {nBackLevel}-Back</h2>
          <p className="text-slate-400">Does this position match the one {nBackLevel} turns ago?</p>
        </div>

        <div className="grid grid-cols-3 gap-2 w-64 h-64">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div 
              key={i} 
              className={`rounded-xl transition-all duration-300 ${activeSquare === i ? 'bg-indigo-500 scale-95 shadow-[0_0_20px_rgba(99,102,241,0.8)]' : 'bg-slate-800'}`}
            ></div>
          ))}
        </div>

        <div className="flex gap-4">
          <button 
            onClick={handleMatchClick}
            disabled={currentIndex < nBackLevel}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all cursor-pointer"
          >
            Position Match (A)
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'score') {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)] animate-fade-in space-y-6">
        <h2 className="text-4xl font-bold text-white">Session Complete!</h2>
        <div className="glass p-8 rounded-3xl text-center space-y-4">
          <p className="text-slate-400">Matches Found: <span className="text-white font-bold">{score} / {totalMatches}</span></p>
          <p className="text-slate-400">False Alarms: <span className="text-white font-bold">{matchesAttempted > score ? matchesAttempted - score : 0}</span></p>
          <div className="text-5xl font-extrabold text-indigo-400 mt-4">
            {Math.max(0, Math.round((score / (totalMatches || 1)) * 100))}%
          </div>
        </div>
        <button 
          onClick={() => setGameState('menu')}
          className="px-8 py-3 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
        >
          Back to Training Menu
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Brain Training</h1>
        <p className="text-slate-400 mt-1">Daily mini-games to improve working memory and processing speed.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* N-Back Game */}
        <div onClick={startGame} className="glass-card p-6 rounded-2xl border border-indigo-500/20 group hover:border-indigo-500/50 transition-colors cursor-pointer">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-2xl">🧠</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Dual N-Back</h3>
          <p className="text-sm text-slate-400 mb-4">Improve your working memory and fluid intelligence.</p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">Level {nBackLevel}</span>
            <span className="text-sm font-bold text-white">Play →</span>
          </div>
        </div>

        {/* Stroop Test */}
        <div className="glass-card p-6 rounded-2xl border border-teal-500/20 group hover:border-teal-500/50 transition-colors cursor-pointer opacity-50">
          <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-2xl">⚡</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Stroop Speed (Coming Soon)</h3>
          <p className="text-sm text-slate-400 mb-4">Enhance cognitive flexibility and processing speed.</p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-teal-400 bg-teal-500/10 px-2 py-1 rounded">Level 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
