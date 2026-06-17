"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '../../../../components/ui/Button';

/* ── Hardcoded quiz data ── */
const QUIZ_TITLE = 'Introduction to Neural Networks';

const QUESTIONS = [
  {
    id: 1,
    question: 'What is the primary purpose of an activation function in a neural network?',
    options: [
      'To store the weights of the network',
      'To introduce non-linearity into the output of a neuron',
      'To reduce the number of layers needed',
      'To normalize the input data',
    ],
    correct: 1,
    explanation:
      'Activation functions introduce non-linearity, allowing neural networks to learn complex patterns beyond simple linear transformations. Without them, stacking layers would be equivalent to a single linear transformation.',
    topic: 'Activation Functions',
  },
  {
    id: 2,
    question: 'Which algorithm is used to compute gradients for training multi-layer neural networks?',
    options: [
      'Forward propagation',
      'Gradient boosting',
      'Backpropagation',
      'Principal component analysis',
    ],
    correct: 2,
    explanation:
      'Backpropagation computes the gradient of the loss function with respect to each weight by applying the chain rule, propagating errors backward through the network layers.',
    topic: 'Backpropagation',
  },
  {
    id: 3,
    question: 'What is the main advantage of CNNs over fully connected networks for image tasks?',
    options: [
      'They require more parameters',
      'They are faster to train',
      'They exploit spatial structure through weight sharing and local connectivity',
      'They don\'t need activation functions',
    ],
    correct: 2,
    explanation:
      'CNNs use convolutional filters that share weights across spatial locations, dramatically reducing parameters while preserving the ability to detect local patterns regardless of position.',
    topic: 'CNNs',
  },
  {
    id: 4,
    question: 'What technique randomly sets neuron outputs to zero during training to prevent overfitting?',
    options: [
      'Batch normalization',
      'Learning rate decay',
      'Dropout',
      'Weight initialization',
    ],
    correct: 2,
    explanation:
      'Dropout randomly deactivates neurons during training, forcing the network to develop redundant representations and preventing co-adaptation of features, which helps generalization.',
    topic: 'Regularization',
  },
  {
    id: 5,
    question: 'What is the core mechanism that powers Transformer architectures?',
    options: [
      'Recurrent connections',
      'Convolutional filters',
      'Self-attention mechanism',
      'Max pooling layers',
    ],
    correct: 2,
    explanation:
      'The self-attention (scaled dot-product attention) mechanism allows transformers to weigh the importance of each token relative to every other token, enabling parallel processing and capturing long-range dependencies.',
    topic: 'Transformers',
  },
];

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  const question = QUESTIONS[currentQ];
  const progress = ((currentQ + (answered ? 1 : 0)) / QUESTIONS.length) * 100;

  const handleSelect = (optionIndex: number) => {
    if (answered) return;
    setSelected(optionIndex);
    setAnswered(true);
    setAnswers((prev) => {
      const copy = [...prev];
      copy[currentQ] = optionIndex;
      return copy;
    });
  };

  const handleNext = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRetake = () => {
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setAnswers(Array(QUESTIONS.length).fill(null));
    setShowResults(false);
  };

  /* ── Results calculation ── */
  const correctCount = answers.filter((a, i) => a === QUESTIONS[i].correct).length;
  const wrongCount = answers.filter((a, i) => a !== null && a !== QUESTIONS[i].correct).length;
  const skippedCount = answers.filter((a) => a === null).length;
  const scorePercent = Math.round((correctCount / QUESTIONS.length) * 100);

  // Weak topics: topics where answer was wrong
  const weakTopics = QUESTIONS
    .filter((q, i) => answers[i] !== null && answers[i] !== q.correct)
    .map((q) => q.topic);

  /* ── Results screen ── */
  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <button
          onClick={() => router.push(`/materials/${params.id}`)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back to Material
        </button>

        <div className="glass-card rounded-2xl p-8 text-center">
          {/* Score ring */}
          <div className="relative w-40 h-40 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(30,41,59,0.8)" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${scorePercent * 2.64} ${264 - scorePercent * 2.64}`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#2dd4bf" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-white">{scorePercent}%</span>
              <span className="text-xs text-slate-500">Score</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            {scorePercent >= 80 ? '🎉 Excellent!' : scorePercent >= 60 ? '👍 Good Job!' : '📚 Keep Studying!'}
          </h2>
          <p className="text-slate-400 mb-8">
            You answered {correctCount} out of {QUESTIONS.length} questions correctly
          </p>

          {/* Breakdown */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
              <span className="text-2xl font-bold text-emerald-300 block">{correctCount}</span>
              <span className="text-xs text-emerald-400/60">Correct</span>
            </div>
            <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
              <span className="text-2xl font-bold text-red-300 block">{wrongCount}</span>
              <span className="text-xs text-red-400/60">Wrong</span>
            </div>
            <div className="bg-slate-500/10 rounded-xl p-4 border border-slate-500/20">
              <span className="text-2xl font-bold text-slate-300 block">{skippedCount}</span>
              <span className="text-xs text-slate-400/60">Skipped</span>
            </div>
          </div>

          {/* Weak topics */}
          {weakTopics.length > 0 && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 mb-8 text-left">
              <h4 className="text-sm font-medium text-amber-300 mb-2 flex items-center gap-2">
                <span>⚠️</span> Weak Topics Identified
              </h4>
              <div className="flex flex-wrap gap-2">
                {weakTopics.map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <Button variant="primary" onClick={handleRetake}>
              🔄 Retake Quiz
            </Button>
            <Button variant="secondary" onClick={() => router.push(`/materials/${params.id}`)}>
              Back to Material
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Quiz question view ── */
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* ── Back ── */}
      <button
        onClick={() => router.push(`/materials/${params.id}`)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back to Material
      </button>

      {/* ── Title & Progress ── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🧠</span> Quiz: {QUIZ_TITLE}
          </h1>
          <span className="text-sm text-slate-400 font-mono">
            {currentQ + 1} / {QUESTIONS.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Question card ── */}
      <div className="glass-card rounded-2xl p-6 mb-6 animate-slide-up" key={currentQ}>
        {/* Topic badge */}
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 mb-4">
          {question.topic}
        </span>

        <h2 className="text-lg font-semibold text-white leading-relaxed mb-6">
          {question.question}
        </h2>

        {/* ── Options ── */}
        <div className="space-y-3">
          {question.options.map((option, i) => {
            const isSelected = selected === i;
            const isCorrect = i === question.correct;
            let optionStyle = 'bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/40 hover:bg-indigo-500/5 cursor-pointer';

            if (answered) {
              if (isCorrect) {
                optionStyle = 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
              } else if (isSelected && !isCorrect) {
                optionStyle = 'bg-red-500/10 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.1)]';
              } else {
                optionStyle = 'bg-slate-800/30 border-slate-800 opacity-50';
              }
            } else if (isSelected) {
              optionStyle = 'bg-indigo-500/10 border-indigo-500/40';
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={answered}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 ${optionStyle}`}
              >
                {/* Letter circle */}
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-300 ${
                  answered && isCorrect
                    ? 'bg-emerald-500/30 text-emerald-300'
                    : answered && isSelected && !isCorrect
                      ? 'bg-red-500/30 text-red-300'
                      : 'bg-slate-700/50 text-slate-400'
                }`}>
                  {answered && isCorrect ? '✓' : answered && isSelected && !isCorrect ? '✗' : String.fromCharCode(65 + i)}
                </span>

                <span className={`text-sm ${
                  answered && isCorrect
                    ? 'text-emerald-200 font-medium'
                    : answered && isSelected && !isCorrect
                      ? 'text-red-200'
                      : 'text-slate-300'
                }`}>
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Explanation ── */}
        {answered && (
          <div className="mt-6 animate-slide-up">
            <div className={`rounded-xl p-4 border ${
              selected === question.correct
                ? 'bg-emerald-500/5 border-emerald-500/20'
                : 'bg-amber-500/5 border-amber-500/20'
            }`}>
              <h4 className={`text-sm font-medium mb-1 flex items-center gap-1.5 ${
                selected === question.correct ? 'text-emerald-300' : 'text-amber-300'
              }`}>
                {selected === question.correct ? '✅ Correct!' : '💡 Explanation'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Next button ── */}
      {answered && (
        <div className="flex justify-end animate-slide-up">
          <Button variant="primary" size="lg" onClick={handleNext}>
            {currentQ < QUESTIONS.length - 1 ? 'Next Question →' : 'View Results →'}
          </Button>
        </div>
      )}
    </div>
  );
}
