"use client";

import { Zap } from "lucide-react";

interface TopBarProps {
  title?: string;
}

export function TopBar({ title }: TopBarProps) {
  return (
    <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-[#0A0A0A] border-b border-[#1F1F1F]">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-6 h-6 bg-[#111111] border border-[#1F1F1F] rounded-[6px]">
          <Zap size={12} className="text-[#A1A1AA]" />
        </div>
        <span className="font-mono text-xs font-semibold tracking-widest text-[#FAFAFA]">
          612
        </span>
      </div>
      {title && (
        <span className="text-sm text-[#A1A1AA] font-medium">{title}</span>
      )}
      <div className="w-16" />
    </header>
  );
}
