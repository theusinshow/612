"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { salvarFatura } from "./actions";
import { useRouter } from "next/navigation";

interface Props {
  competenciaId: string;
  faturaExistente?: {
    valor_total: string;
    consumo_total_kwh: string;
    cosip: string;
    vencimento: string | null;
  } | null;
}

export function AdicionarFaturaModal({ competenciaId, faturaExistente }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [valorTotal, setValorTotal] = useState(faturaExistente?.valor_total ?? "");
  const [consumo, setConsumo] = useState(faturaExistente?.consumo_total_kwh ?? "");
  const [cosip, setCosip] = useState(faturaExistente?.cosip ?? "");
  const [vencimento, setVencimento] = useState(faturaExistente?.vencimento ?? "");
  const [arquivo, setArquivo] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    let pdfUrl: string | null = null;

    // Upload do PDF se selecionado
    if (arquivo) {
      const supabase = createClient();
      const nomeArquivo = `${competenciaId}/${Date.now()}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from("faturas-pdf")
        .upload(nomeArquivo, arquivo, { upsert: true });

      if (uploadError) {
        setErro("Erro ao fazer upload do PDF.");
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("faturas-pdf")
        .getPublicUrl(nomeArquivo);
      pdfUrl = urlData.publicUrl;
    }

    const result = await salvarFatura(competenciaId, {
      valor_total: Number(valorTotal),
      consumo_total_kwh: Number(consumo),
      cosip: Number(cosip),
      vencimento: vencimento || null,
      arquivo_pdf_url: pdfUrl,
    });

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
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-[#3B82F6] hover:text-[#2563EB] transition-colors font-medium"
      >
        + Cadastrar fatura
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

          <div className="relative w-full max-w-sm bg-[#111111] border border-[#1F1F1F] rounded-[8px] p-6 shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-sm font-semibold text-[#FAFAFA]">Fatura Celesc</h2>
                <p className="text-xs text-[#A1A1AA] mt-0.5">Dados da fatura do mês</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-[#52525B] hover:text-[#A1A1AA] transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#A1A1AA] font-medium">Valor total (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={valorTotal}
                    onChange={(e) => setValorTotal(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-3 py-2.5 text-sm text-[#FAFAFA] placeholder-[#52525B] outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#A1A1AA] font-medium">Consumo (kWh)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={consumo}
                    onChange={(e) => setConsumo(e.target.value)}
                    placeholder="0"
                    className="w-full bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-3 py-2.5 text-sm text-[#FAFAFA] placeholder-[#52525B] outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#A1A1AA] font-medium">COSIP (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={cosip}
                    onChange={(e) => setCosip(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-3 py-2.5 text-sm text-[#FAFAFA] placeholder-[#52525B] outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#A1A1AA] font-medium">Vencimento</label>
                  <input
                    type="date"
                    value={vencimento}
                    onChange={(e) => setVencimento(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-3 py-2.5 text-sm text-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
              </div>

              {/* Upload PDF */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#A1A1AA] font-medium">PDF da fatura (opcional)</label>
                <label className="flex items-center gap-2 bg-[#1A1A1A] border border-[#1F1F1F] border-dashed rounded-[6px] px-3 py-3 cursor-pointer hover:border-[#3B82F6] transition-colors">
                  <Upload size={14} className="text-[#52525B]" />
                  <span className="text-xs text-[#52525B]">
                    {arquivo ? arquivo.name : "Selecionar PDF"}
                  </span>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>

              {erro && (
                <p className="text-xs text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-[6px] px-3 py-2">
                  {erro}
                </p>
              )}

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
                  {loading ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
