"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../../../components/ui/Button';

/* ── Hardcoded material data ── */
const MATERIAL = {
  id: 'mat-1',
  title: 'Introduction to Neural Networks',
  subject: 'Machine Learning',
  fileType: 'PDF',
  pages: 48,
  chunks: 124,
  uploadDate: 'June 15, 2026',
  size: '12.4 MB',
  summary: `This document provides a comprehensive introduction to artificial neural networks, covering fundamental concepts from biological inspiration to modern deep learning architectures.\n\nKey areas explored include the perceptron model, multi-layer feedforward networks, backpropagation algorithms, activation functions (ReLU, sigmoid, tanh), and gradient descent optimization. The text also covers practical considerations such as overfitting prevention through dropout and regularization, batch normalization, and learning rate scheduling.\n\nAdvanced topics include convolutional neural networks (CNNs) for image recognition, recurrent neural networks (RNNs) for sequence data, and an introduction to transformer architectures. Each chapter includes worked examples and exercises.`,
  topics: [
    'Perceptrons',
    'Backpropagation',
    'Activation Functions',
    'CNNs',
    'RNNs',
    'Transformers',
    'Gradient Descent',
    'Regularization',
    'Batch Normalization',
    'Dropout',
  ],
  chunks_data: [
    {
      id: 1,
      title: 'Chapter 1: Biological Neurons',
      preview: 'The human brain contains approximately 86 billion neurons, each connected to thousands of others through synapses. An artificial neuron mimics this by taking weighted inputs, summing them, and passing the result through an activation function...',
    },
    {
      id: 2,
      title: 'Chapter 2: The Perceptron',
      preview: 'The perceptron, introduced by Frank Rosenblatt in 1958, is the simplest form of a neural network. It consists of a single layer of weights connected to inputs, with a threshold activation function...',
    },
    {
      id: 3,
      title: 'Chapter 3: Multi-Layer Networks',
      preview: 'By stacking multiple layers of neurons, we create what is known as a multi-layer perceptron (MLP). The key breakthrough came with the backpropagation algorithm, which allows efficient computation of gradients...',
    },
    {
      id: 4,
      title: 'Chapter 4: Convolutional Neural Networks',
      preview: 'CNNs exploit the spatial structure of data through shared weight kernels that slide across the input. This dramatically reduces the number of parameters while preserving translation invariance...',
    },
    {
      id: 5,
      title: 'Chapter 5: Recurrent Networks & Transformers',
      preview: 'For sequential data, recurrent neural networks maintain a hidden state that captures temporal dependencies. The attention mechanism, core to transformers, allows the model to focus on relevant parts of the input...',
    },
  ],
};

const STATS = [
  { label: 'Pages', value: MATERIAL.pages, icon: '📄' },
  { label: 'Chunks', value: MATERIAL.chunks, icon: '🧩' },
  { label: 'Topics', value: MATERIAL.topics.length, icon: '🏷️' },
  { label: 'Size', value: MATERIAL.size, icon: '💾' },
];

import { Suspense } from 'react';

function MaterialDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const [showAllChunks, setShowAllChunks] = useState(false);

  const visibleChunks = showAllChunks ? MATERIAL.chunks_data : MATERIAL.chunks_data.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* ── Back button ── */}
      <button
        onClick={() => router.push('/materials')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back to Library
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main content (2/3) ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header card */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-teal-500/20 flex items-center justify-center text-3xl flex-shrink-0">
                📄
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-white tracking-tight mb-1">{MATERIAL.title}</h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {MATERIAL.subject}
                  </span>
                  <span className="text-xs text-slate-500">{MATERIAL.fileType} · {MATERIAL.uploadDate}</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Ready
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
              {STATS.map((stat) => (
                <div key={stat.label} className="bg-slate-800/50 rounded-xl p-3 text-center hover:bg-slate-800 transition-colors">
                  <span className="text-lg block mb-1">{stat.icon}</span>
                  <span className="text-lg font-bold text-white block">{stat.value}</span>
                  <span className="text-xs text-slate-500">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── AI Summary ── */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <button
              onClick={() => setSummaryExpanded(!summaryExpanded)}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center">
                  <span className="text-sm">🤖</span>
                </div>
                <span className="font-semibold text-white">AI Summary</span>
              </div>
              <span className={`text-slate-400 transition-transform duration-300 ${summaryExpanded ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {summaryExpanded && (
              <div className="px-5 pb-5 animate-slide-up">
                <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                  <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line">
                    {MATERIAL.summary}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Key Topics ── */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <span>🏷️</span> Key Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {MATERIAL.topics.map((topic, i) => (
                <span
                  key={topic}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:border-indigo-500/40 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all cursor-default"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* ── Document Chunks ── */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <span>🧩</span> Document Chunks
            </h3>
            <div className="space-y-3">
              {visibleChunks.map((chunk, i) => (
                <div
                  key={chunk.id}
                  className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600/70 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-slate-600 bg-slate-800 px-2 py-0.5 rounded">#{chunk.id}</span>
                    <span className="font-medium text-sm text-slate-200 group-hover:text-white transition-colors">
                      {chunk.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {chunk.preview}
                  </p>
                </div>
              ))}
            </div>
            {!showAllChunks && MATERIAL.chunks_data.length > 3 && (
              <button
                onClick={() => setShowAllChunks(true)}
                className="w-full mt-4 py-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Show {MATERIAL.chunks_data.length - 3} more chunks ↓
              </button>
            )}
          </div>
        </div>

        {/* ── AI Tools Panel (1/3 sidebar) ── */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5 sticky top-6">
            <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center">
                <span className="text-sm">⚡</span>
              </div>
              AI Tools
            </h3>

            <div className="space-y-3">
              <button
                onClick={() => router.push(`/materials/detail/quiz?id=${id}`)}
                className="w-full glass rounded-xl p-4 text-left hover:border-indigo-500/40 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">🧠</span>
                  <div>
                    <span className="font-medium text-white block text-sm">Generate Quiz</span>
                    <span className="text-xs text-slate-500">Test your knowledge with AI</span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push(`/materials/detail/flashcards?id=${id}`)}
                className="w-full glass rounded-xl p-4 text-left hover:border-teal-500/40 hover:shadow-[0_0_20px_rgba(45,212,191,0.1)] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">🃏</span>
                  <div>
                    <span className="font-medium text-white block text-sm">Create Flashcards</span>
                    <span className="text-xs text-slate-500">Spaced repetition cards</span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push('/coach')}
                className="w-full glass rounded-xl p-4 text-left hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">💬</span>
                  <div>
                    <span className="font-medium text-white block text-sm">Ask AI Coach</span>
                    <span className="text-xs text-slate-500">Chat with material context</span>
                  </div>
                </div>
              </button>

              <button className="w-full glass rounded-xl p-4 text-left hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all group">
                <div className="flex items-center gap-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">🎯</span>
                  <div>
                    <span className="font-medium text-white block text-sm">Find Weak Topics</span>
                    <span className="text-xs text-slate-500">Identify knowledge gaps</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 pt-5 border-t border-slate-700/50">
              <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Study Progress</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Quiz Score</span>
                    <span className="text-indigo-300 font-medium">85%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Flashcard Mastery</span>
                    <span className="text-teal-300 font-medium">62%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[62%] bg-gradient-to-r from-teal-500 to-teal-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MaterialDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading material details...</div>}>
      <MaterialDetailContent />
    </Suspense>
  );
}
