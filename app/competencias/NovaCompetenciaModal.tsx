"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { criarCompetencia } from "./actions";
import { useRouter } from "next/navigation";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril",
  "Maio", "Junho", "Julho", "Agosto",
  "Setembro", "Outubro", "Novembro", "Dezembro",
];

const anoAtual = new Date().getFullYear();
const ANOS = [anoAtual - 1, anoAtual, anoAtual + 1];

export function NovaCompetenciaModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mes, setMes] = useState(new Date().getMonth()); // 0-indexed
  const [ano, setAno] = useState(anoAtual);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function abrirComMesAnterior() {
    const agora = new Date();
    const mesAnterior = agora.getMonth() === 0 ? 11 : agora.getMonth() - 1;
    const anoMesAnterior = agora.getMonth() === 0 ? agora.getFullYear() - 1 : agora.getFullYear();
    setMes(mesAnterior);
    setAno(anoMesAnterior);
    setErro(null);
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    const result = await criarCompetencia(mes + 1, ano); // banco usa 1-indexed

    setLoading(false);

    if (result.error) {
      setErro(result.error);
      return;
    }

    setOpen(false);
    router.refresh();
  }

  return (
    <>
      {/* Botão principal */}
      <button
        onClick={abrirComMesAnterior}
        className="flex items-center gap-2 bg-[#FAFAFA] text-[#0A0A0A] text-sm font-medium px-3 py-2 rounded-[6px] hover:bg-[#E4E4E7] transition-colors"
      >
        <Plus size={15} />
        Nova competência
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Dialog */}
          <div className="relative w-full max-w-sm bg-[#111111] border border-[#1F1F1F] rounded-[8px] p-6 shadow-xl">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-sm font-semibold text-[#FAFAFA]">
                  Nova competência
                </h2>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  Selecione o mês e ano do ciclo
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-[#52525B] hover:text-[#A1A1AA] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex gap-3">
                {/* Mês */}
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs text-[#A1A1AA] font-medium">
                    Mês
                  </label>
                  <select
                    value={mes}
                    onChange={(e) => setMes(Number(e.target.value))}
                    className="w-full bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-3 py-2.5 text-sm text-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors"
                  >
                    {MESES.map((nome, i) => (
                      <option key={i} value={i}>
                        {nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ano */}
                <div className="flex flex-col gap-1.5 w-28">
                  <label className="text-xs text-[#A1A1AA] font-medium">
                    Ano
                  </label>
                  <select
                    value={ano}
                    onChange={(e) => setAno(Number(e.target.value))}
                    className="w-full bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-3 py-2.5 text-sm text-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors"
                  >
                    {ANOS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-3 py-2.5">
                <p className="text-xs text-[#52525B]">Competência</p>
                <p className="text-sm font-mono text-[#FAFAFA] mt-0.5">
                  {MESES[mes]}/{ano}
                </p>
              </div>

              {/* Erro */}
              {erro && (
                <p className="text-xs text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-[6px] px-3 py-2">
                  {erro}
                </p>
              )}

              {/* Ações */}
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 bg-[#1A1A1A] border border-[#1F1F1F] text-[#A1A1AA] text-sm font-medium py-2.5 rounded-[6px] hover:text-[#FAFAFA] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#FAFAFA] text-[#0A0A0A] text-sm font-medium py-2.5 rounded-[6px] hover:bg-[#E4E4E7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Criando..." : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
