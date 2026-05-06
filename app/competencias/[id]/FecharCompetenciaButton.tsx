"use client";

import { useState } from "react";
import { Lock, X, AlertTriangle } from "lucide-react";
import { fecharCompetencia } from "./actions";
import { useRouter } from "next/navigation";

interface Props {
  competenciaId: string;
  label: string; // ex: "Abril/2026"
  disabled: boolean;
  disabledReason?: string;
}

export function FecharCompetenciaButton({ competenciaId, label, disabled, disabledReason }: Props) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleFechar() {
    setErro(null);
    setLoading(true);
    const result = await fecharCompetencia(competenciaId);
    setLoading(false);

    if (result.error) {
      setErro(result.error);
      return;
    }

    setShowConfirm(false);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={disabled}
        title={disabledReason}
        className="flex items-center gap-2 border border-[#1F1F1F] text-[#A1A1AA] text-sm font-medium px-3 py-2 rounded-[6px] hover:border-[#EF4444]/40 hover:text-[#EF4444] transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#1F1F1F] disabled:hover:text-[#A1A1AA]"
      >
        <Lock size={14} />
        Fechar competência
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />

          <div className="relative w-full max-w-sm bg-[#111111] border border-[#1F1F1F] rounded-[8px] p-6 shadow-xl">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 flex items-center justify-center bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-[6px]">
                  <AlertTriangle size={15} className="text-[#EF4444]" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#FAFAFA]">Fechar competência</h2>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">{label}</p>
                </div>
              </div>
              <button onClick={() => setShowConfirm(false)} className="text-[#52525B] hover:text-[#A1A1AA] transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-3 py-3 mb-5">
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Ao fechar, esta competência se torna <strong className="text-[#FAFAFA]">imutável</strong>. Leituras, fatura e cálculos serão congelados e não poderão ser alterados.
              </p>
            </div>

            {erro && (
              <p className="text-xs text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-[6px] px-3 py-2 mb-4">
                {erro}
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-[#1A1A1A] border border-[#1F1F1F] text-[#A1A1AA] text-sm font-medium py-2.5 rounded-[6px] hover:text-[#FAFAFA] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleFechar}
                disabled={loading}
                className="flex-1 bg-[#EF4444] text-white text-sm font-medium py-2.5 rounded-[6px] hover:bg-[#DC2626] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Fechando..." : "Confirmar fechamento"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
