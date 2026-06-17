"use client";

import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

const VARIANT_MAP = {
  default:
    "bg-slate-700/60 text-slate-300 border-slate-600/50",
  success:
    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  warning:
    "bg-amber-500/15 text-amber-400 border-amber-500/30",
  danger:
    "bg-red-500/15 text-red-400 border-red-500/30",
  info:
    "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
}) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${VARIANT_MAP[variant]}`}
    >
      {children}
    </span>
  );
};
