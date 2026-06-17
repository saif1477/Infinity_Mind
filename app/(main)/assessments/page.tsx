"use client";

import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';

export default function AssessmentsPage() {
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const questions = [
    {
      q: "If all Zorks are Borks, and some Borks are Dorks, are all Zorks definitely Dorks?",
      options: ["Yes", "No", "Cannot be determined"],
      answer: "Cannot be determined"
    },
    {
      q: "Which number comes next in the sequence: 2, 6, 12, 20, 30, ...?",
      options: ["36", "40", "42", "48"],
      answer: "42"
    },
    {
      q: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?",
      options: ["$0.10", "$0.05", "$1.00"],
      answer: "$0.05"
    }
  ];

  const handleAnswer = (option: string) => {
    if (option === questions[currentQuestion].answer) {
      setScore(s => s + 1);
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)] animate-fade-in space-y-6">
        <h2 className="text-4xl font-bold text-white">Diagnostic Complete!</h2>
        <div className="glass p-8 rounded-3xl text-center space-y-4">
          <p className="text-slate-400">Your Cognitive Baseline Score:</p>
          <div className="text-5xl font-extrabold text-indigo-400 mt-4">
            {Math.round((score / questions.length) * 100)}
          </div>
        </div>
        <Button 
          variant="glow" 
          onClick={() => {
            setIsTestRunning(false);
            setIsFinished(false);
            setCurrentQuestion(0);
            setScore(0);
          }}
        >
          Return to Assessments
        </Button>
      </div>
    );
  }

  if (isTestRunning) {
    const q = questions[currentQuestion];
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)] animate-fade-in space-y-8 max-w-2xl mx-auto">
        <div className="text-center w-full">
          <div className="flex justify-between text-slate-400 text-sm font-medium mb-4">
            <span>Diagnostic Progress</span>
            <span>{currentQuestion + 1} / {questions.length}</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mb-8">
            <div 
              className="bg-indigo-500 h-2 rounded-full transition-all" 
              style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
            ></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-8">{q.q}</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 w-full">
          {q.options.map((opt, i) => (
            <button 
              key={i}
              onClick={() => handleAnswer(opt)}
              className="p-4 bg-slate-800 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors text-left border border-slate-700 hover:border-indigo-500 cursor-pointer"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Cognitive Assessment</h1>
        <p className="text-slate-400 mt-1">Measure your memory, focus, and logical reasoning.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-8 rounded-2xl border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6">
            <span className="text-3xl">🧩</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Full Diagnostic</h2>
          <p className="text-slate-400 mb-6 line-clamp-3">
            A comprehensive 15-minute test covering working memory, pattern recognition, spatial reasoning, and sustained focus. 
            Used to calibrate your baseline cognitive profile.
          </p>
          <Button variant="primary" size="lg" className="w-full cursor-pointer" onClick={() => setIsTestRunning(true)}>
            Start Full Diagnostic
          </Button>
        </div>

        <div className="space-y-4">
          {['Working Memory', 'Pattern Recognition', 'Spatial Reasoning'].map(type => (
            <div key={type} className="glass-card p-5 rounded-xl flex items-center justify-between hover:bg-slate-800/50 transition-colors opacity-50">
              <div>
                <h3 className="font-bold text-white">{type} Test (Coming Soon)</h3>
                <p className="text-sm text-slate-400">Quick 3-minute check-in</p>
              </div>
              <Button variant="ghost" size="sm" disabled>Start</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
