"use client";

import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  hover = false,
}) => {
  return (
    <div
      className={`glass-card rounded-2xl ${
        hover
          ? "transition-all duration-300 hover:border-indigo-500/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:scale-[1.02] hover:-translate-y-1"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};
