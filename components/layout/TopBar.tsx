"use client";

import { usePathname, useRouter } from "next/navigation";
import { Zap, ChevronLeft } from "lucide-react";

interface TopBarProps {
  title?: string;
}

export function TopBar({ title }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isInnerPage = pathname.split("/").filter(Boolean).length > 1;

  return (
    <header
      className="lg:hidden relative sticky top-0 z-30 flex items-center h-14 px-3 bg-[#0A0A0A]/90 backdrop-blur-sm border-b border-[#1F1F1F]"
      aria-label="Barra de navegação"
    >
      {/* Left: logo (top-level) ou botão voltar (página interna) */}
      {isInnerPage ? (
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-9 h-9 -ml-1 rounded-[6px] text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#1A1A1A] transition-colors focus-ring"
          aria-label="Voltar"
        >
          <ChevronLeft size={20} />
        </button>
      ) : (
        <div className="flex items-center gap-1.5">
          <div className="flex items-center justify-center w-6 h-6 bg-[#111111] border border-[#1F1F1F] rounded-[6px]">
            <Zap size={12} className="text-[#3B82F6]" />
          </div>
          <span className="font-mono text-xs font-semibold tracking-widest text-[#FAFAFA]">
            612
          </span>
        </div>
      )}

      {/* Título absoluto para centralização real */}
      {title && (
        <span className="absolute left-1/2 -translate-x-1/2 text-sm text-[#FAFAFA] font-medium pointer-events-none truncate max-w-[55%]">
          {title}
        </span>
      )}

      {/* Spacer direito simétrico */}
      <div className="ml-auto w-9" aria-hidden="true" />
    </header>
  );
}
