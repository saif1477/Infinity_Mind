"use client";

import React from "react";

interface ProgressProps {
  value: number;
  color?: "indigo" | "teal" | "amber" | "emerald";
  size?: "sm" | "md" | "lg";
  label?: string;
  showPercent?: boolean;
}

const COLOR_MAP = {
  indigo: {
    bar: "bg-gradient-to-r from-indigo-600 to-indigo-400",
    glow: "shadow-[0_0_12px_rgba(99,102,241,0.5)]",
    text: "text-indigo-400",
  },
  teal: {
    bar: "bg-gradient-to-r from-teal-500 to-teal-300",
    glow: "shadow-[0_0_12px_rgba(45,212,191,0.5)]",
    text: "text-teal-400",
  },
  amber: {
    bar: "bg-gradient-to-r from-amber-500 to-amber-300",
    glow: "shadow-[0_0_12px_rgba(245,158,11,0.5)]",
    text: "text-amber-400",
  },
  emerald: {
    bar: "bg-gradient-to-r from-emerald-500 to-emerald-300",
    glow: "shadow-[0_0_12px_rgba(16,185,129,0.5)]",
    text: "text-emerald-400",
  },
};

const SIZE_MAP = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export const Progress: React.FC<ProgressProps> = ({
  value,
  color = "indigo",
  size = "md",
  label,
  showPercent = false,
}) => {
  const clamped = Math.min(100, Math.max(0, value));
  const colors = COLOR_MAP[color];
  const height = SIZE_MAP[size];

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-sm font-medium text-slate-300">{label}</span>
          )}
          {showPercent && (
            <span className={`text-sm font-semibold ${colors.text}`}>
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full ${height} rounded-full bg-slate-800/80 overflow-hidden`}
      >
        <div
          className={`${height} rounded-full ${colors.bar} ${colors.glow} transition-all duration-700 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
