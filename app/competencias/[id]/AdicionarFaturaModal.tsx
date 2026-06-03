"use client";

import { useState } from "react";
import { FilePlus2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { salvarFatura } from "./actions";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/Dialog";

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
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-[36px] items-center gap-1.5 rounded-[6px] bg-[#FAFAFA] px-3 py-2 text-xs font-medium text-[#0A0A0A] transition-colors hover:bg-[#E4E4E7] focus-ring"
      >
        <FilePlus2 size={14} />
        {faturaExistente ? "Editar fatura" : "Cadastrar fatura"}
      </button>

      {open && (
        <Dialog
          title="Fatura Celesc"
          description="Dados da fatura do mês"
          onClose={() => setOpen(false)}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    className="w-full bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-3 py-3 text-sm text-[#FAFAFA] placeholder-[#71717A] outline-none focus:border-[#3B82F6] transition-colors"
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
                    className="w-full bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-3 py-3 text-sm text-[#FAFAFA] placeholder-[#71717A] outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    className="w-full bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-3 py-3 text-sm text-[#FAFAFA] placeholder-[#71717A] outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#A1A1AA] font-medium">Vencimento</label>
                  <input
                    type="date"
                    value={vencimento}
                    onChange={(e) => setVencimento(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-3 py-3 text-sm text-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
              </div>

              {/* Upload PDF */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#A1A1AA] font-medium">PDF da fatura (opcional)</label>
                <label className="flex items-center gap-2 bg-[#1A1A1A] border border-[#1F1F1F] border-dashed rounded-[6px] px-3 py-3 cursor-pointer hover:border-[#3B82F6] transition-colors">
                  <Upload size={14} className="text-[#71717A]" />
                  <span className="text-xs text-[#71717A]">
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
                  className="flex-1 bg-[#1A1A1A] border border-[#1F1F1F] text-[#A1A1AA] text-sm font-medium py-3 rounded-[6px] hover:text-[#FAFAFA] transition-colors focus-ring"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#FAFAFA] text-[#0A0A0A] text-sm font-medium py-3 rounded-[6px] hover:bg-[#E4E4E7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
                >
                  {loading ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
        </Dialog>
      )}
    </>
  );
}
