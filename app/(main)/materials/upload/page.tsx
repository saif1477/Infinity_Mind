"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/Button';

/* ── Pipeline steps ── */
const PIPELINE_STEPS = [
  { label: 'Extracting text...', icon: '📖', duration: 1600 },
  { label: 'Chunking content...', icon: '✂️', duration: 1400 },
  { label: 'Generating embeddings...', icon: '🧬', duration: 2000 },
  { label: 'AI Analysis...', icon: '🤖', duration: 1800 },
  { label: 'Ready!', icon: '✅', duration: 0 },
];

const SUPPORTED_FORMATS = [
  { ext: 'PDF', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
  { ext: 'DOCX', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { ext: 'PPTX', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { ext: 'TXT', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
];

export default function UploadPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [pipelineActive, setPipelineActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Simulate pipeline progression ── */
  useEffect(() => {
    if (!pipelineActive) return;

    let step = 0;
    setCurrentStep(0);

    const advanceStep = () => {
      step++;
      if (step < PIPELINE_STEPS.length) {
        setCurrentStep(step);
        if (step < PIPELINE_STEPS.length - 1) {
          setTimeout(advanceStep, PIPELINE_STEPS[step].duration);
        }
      }
    };

    const timer = setTimeout(advanceStep, PIPELINE_STEPS[0].duration);
    return () => clearTimeout(timer);
  }, [pipelineActive]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file.name);
    }
  }, []);

  const handleFileSelect = () => {
    // Simulate file selection
    setSelectedFile('Introduction_to_Neural_Networks.pdf');
  };

  const startProcessing = () => {
    setPipelineActive(true);
  };

  const pipelineDone = currentStep === PIPELINE_STEPS.length - 1;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* ── Back button ── */}
      <button
        onClick={() => router.push('/materials')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back to Library
      </button>

      <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Upload Material</h1>
      <p className="text-slate-400 mb-8">Upload documents to generate AI summaries, quizzes, and flashcards</p>

      {!pipelineActive ? (
        <>
          {/* ── Drop zone ── */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={handleFileSelect}
            className={`
              relative rounded-2xl border-2 border-dashed p-16 flex flex-col items-center justify-center cursor-pointer transition-all duration-300
              ${isDragging
                ? 'border-teal-400 bg-teal-500/5 shadow-[0_0_40px_rgba(45,212,191,0.15)]'
                : selectedFile
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : 'border-slate-700 hover:border-indigo-500/50 hover:bg-indigo-500/5 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)]'
              }
            `}
          >
            {/* Animated glow ring on drag */}
            {isDragging && (
              <div className="absolute inset-0 rounded-2xl animate-pulse bg-gradient-to-r from-teal-500/10 via-transparent to-indigo-500/10" />
            )}

            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
              selectedFile
                ? 'bg-emerald-500/20 scale-110'
                : isDragging
                  ? 'bg-teal-500/20 scale-110 animate-bounce'
                  : 'bg-slate-800/80'
            }`}>
              <span className="text-4xl">{selectedFile ? '📄' : isDragging ? '🎯' : '☁️'}</span>
            </div>

            {selectedFile ? (
              <>
                <p className="text-lg font-semibold text-emerald-300 mb-1">{selectedFile}</p>
                <p className="text-sm text-slate-500">Click to change file</p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium text-slate-200 mb-1">
                  {isDragging ? 'Drop it here!' : 'Drop files here or click to browse'}
                </p>
                <p className="text-sm text-slate-500">
                  Drag & drop your study materials to get started
                </p>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.docx,.pptx,.txt"
            />
          </div>

          {/* ── Supported formats ── */}
          <div className="flex items-center gap-3 mt-6 justify-center">
            <span className="text-xs text-slate-500 mr-1">Supported:</span>
            {SUPPORTED_FORMATS.map((fmt) => (
              <span
                key={fmt.ext}
                className={`px-3 py-1 rounded-full text-xs font-medium border ${fmt.color} transition-all hover:scale-105`}
              >
                {fmt.ext}
              </span>
            ))}
          </div>

          {/* ── Size limit ── */}
          <p className="text-center text-xs text-slate-600 mt-3">
            Max 100MB per file · 2GB total library
          </p>

          {/* ── Upload button ── */}
          {selectedFile && (
            <div className="flex justify-center mt-8 animate-slide-up">
              <Button variant="glow" size="lg" onClick={startProcessing}>
                <span className="mr-2">🚀</span>
                Process Material
              </Button>
            </div>
          )}
        </>
      ) : (
        /* ── Processing pipeline ── */
        <div className="glass-card rounded-2xl p-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <span className="text-xl">📄</span>
            </div>
            <div>
              <p className="font-semibold text-white">{selectedFile}</p>
              <p className="text-xs text-slate-500">{pipelineDone ? 'Processing complete' : 'Processing...'}</p>
            </div>
          </div>

          {/* ── Steps ── */}
          <div className="space-y-4">
            {PIPELINE_STEPS.map((step, i) => {
              const isActive = i === currentStep && !pipelineDone;
              const isComplete = i < currentStep || pipelineDone;
              const isPending = i > currentStep;

              return (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                    isActive
                      ? 'glass border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                      : isComplete
                        ? 'bg-emerald-500/5 border border-emerald-500/20'
                        : 'opacity-40'
                  }`}
                >
                  {/* Step icon / spinner */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isComplete
                      ? 'bg-emerald-500/20'
                      : isActive
                        ? 'bg-indigo-500/20'
                        : 'bg-slate-800'
                  }`}>
                    {isActive ? (
                      <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : isComplete ? (
                      <span className="text-emerald-400 text-lg">✓</span>
                    ) : (
                      <span className="text-lg">{step.icon}</span>
                    )}
                  </div>

                  {/* Label */}
                  <span className={`font-medium text-sm ${
                    isComplete ? 'text-emerald-300' : isActive ? 'text-white' : 'text-slate-500'
                  }`}>
                    {step.label}
                  </span>

                  {/* Progress bar for active step */}
                  {isActive && (
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden ml-4">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 rounded-full animate-shimmer"
                        style={{ width: '60%', backgroundSize: '200% 100%' }}
                      />
                    </div>
                  )}

                  {isComplete && (
                    <span className="ml-auto text-xs text-emerald-500/60">Done</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Done actions ── */}
          {pipelineDone && (
            <div className="flex gap-4 mt-8 justify-center animate-slide-up">
              <Button variant="primary" onClick={() => router.push('/materials/detail?id=mat-1')}>
                View Material →
              </Button>
              <Button variant="secondary" onClick={() => router.push('/materials')}>
                Back to Library
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
