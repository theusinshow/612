"use client";

import { useState } from "react";
import { Droplets, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Dialog } from "@/components/ui/Dialog";
import { salvarContaAgua } from "./actions";
import type { ContaAguaStatus, ResponsavelPagamentoAgua } from "@/types";

interface ResidenciaOption {
  id: string;
  nome: string;
}

interface Props {
  residencias: ResidenciaOption[];
  matriculasPorResidencia: Record<string, string>;
}

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril",
  "Maio", "Junho", "Julho", "Agosto",
  "Setembro", "Outubro", "Novembro", "Dezembro",
];

const anoAtual = new Date().getFullYear();

export function NovaContaAguaModal({
  residencias,
  matriculasPorResidencia,
}: Props) {
  const router = useRouter();
  const primeiraResidencia = residencias[0]?.id ?? "";
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [residenciaId, setResidenciaId] = useState(primeiraResidencia);
  const [matricula, setMatricula] = useState(
    primeiraResidencia ? matriculasPorResidencia[primeiraResidencia] ?? "" : ""
  );
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [ano, setAno] = useState(anoAtual);
  const [valor, setValor] = useState("");
  const [vencimento, setVencimento] = useState("");
  const [dataPagamento, setDataPagamento] = useState("");
  const [status, setStatus] = useState<ContaAguaStatus>("pendente");
  const [responsavel, setResponsavel] = useState<ResponsavelPagamentoAgua>("matheus");
  const [observacoes, setObservacoes] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);

  function handleResidenciaChange(value: string) {
    setResidenciaId(value);
    setMatricula(matriculasPorResidencia[value] ?? "");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErro(null);

    if (!residenciaId) {
      setErro("Selecione uma residência.");
      return;
    }

    setLoading(true);
    let arquivoUrl: string | null = null;

    if (arquivo) {
      const supabase = createClient();
      const nomeArquivo = `${ano}-${String(mes).padStart(2, "0")}/${residenciaId}/${Date.now()}-${arquivo.name}`;
      const { error: uploadError } = await supabase.storage
        .from("contas-agua")
        .upload(nomeArquivo, arquivo, { upsert: true });

      if (uploadError) {
        setLoading(false);
        setErro("Erro ao enviar o talão/comprovante.");
        return;
      }

      const { data } = supabase.storage
        .from("contas-agua")
        .getPublicUrl(nomeArquivo);
      arquivoUrl = data.publicUrl;
    }

    const result = await salvarContaAgua({
      residencia_id: residenciaId,
      matricula: matricula.trim(),
      mes,
      ano,
      valor: Number(valor),
      vencimento: vencimento || null,
      data_pagamento: status === "pago" ? dataPagamento || null : null,
      status,
      responsavel_pagamento: responsavel,
      arquivo_url: arquivoUrl,
      observacoes: observacoes.trim() || null,
    });

    setLoading(false);

    if (result.error) {
      setErro(result.error);
      return;
    }

    setOpen(false);
    setValor("");
    setDataPagamento("");
    setArquivo(null);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-[40px] items-center gap-2 rounded-[6px] bg-[#FAFAFA] px-3 py-2 text-sm font-medium text-[#0A0A0A] transition-colors hover:bg-[#E4E4E7] focus-ring"
      >
        <Droplets size={15} />
        Nova conta de água
      </button>

      {open && (
        <Dialog
          title="Nova conta de água"
          description="Cadastre um talão por matrícula"
          onClose={() => setOpen(false)}
          className="max-w-lg"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#A1A1AA] font-medium">Casa</label>
                <select
                  value={residenciaId}
                  onChange={(e) => handleResidenciaChange(e.target.value)}
                  required
                  className="w-full bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-3 py-3 text-sm text-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors"
                >
                  {residencias.map((residencia) => (
                    <option key={residencia.id} value={residencia.id}>
                      {residencia.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#A1A1AA] font-medium">Matrícula</label>
                <input
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  required
                  placeholder="ID do talão"
                  className="w-full bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-3 py-3 text-sm text-[#FAFAFA] placeholder-[#71717A] outline-none focus:border-[#3B82F6] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#A1A1AA] font-medium">Mês</label>
                <select
                  value={mes}
                  onChange={(e) => setMes(Number(e.target.value))}
                  className="w-full bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-3 py-3 text-sm text-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors"
                >
                  {MESES.map((nome, index) => (
                    <option key={nome} value={index + 1}>
                      {nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#A1A1AA] font-medium">Ano</label>
                <input
                  type="number"
                  value={ano}
                  onChange={(e) => setAno(Number(e.target.value))}
                  className="w-full bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-3 py-3 text-sm text-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#A1A1AA] font-medium">Valor</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="0,00"
                  className="w-full bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-3 py-3 text-sm text-[#FAFAFA] placeholder-[#71717A] outline-none focus:border-[#3B82F6] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#A1A1AA] font-medium">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ContaAguaStatus)}
                  className="w-full bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-3 py-3 text-sm text-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors"
                >
                  <option value="pendente">Pendente</option>
                  <option value="pago">Pago</option>
                  <option value="vencida">Vencida</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#A1A1AA] font-medium">Responsável</label>
                <select
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value as ResponsavelPagamentoAgua)}
                  className="w-full bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-3 py-3 text-sm text-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors"
                >
                  <option value="matheus">Matheus</option>
                  <option value="irmao">Irmão</option>
                </select>
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

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#A1A1AA] font-medium">Pagamento</label>
                <input
                  type="date"
                  value={dataPagamento}
                  onChange={(e) => setDataPagamento(e.target.value)}
                  disabled={status !== "pago"}
                  className="w-full bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-3 py-3 text-sm text-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors disabled:opacity-40"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#A1A1AA] font-medium">Talão ou comprovante</label>
              <label className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-[6px] border border-dashed border-[#1F1F1F] bg-[#1A1A1A] px-3 py-3 transition-colors hover:border-[#3B82F6]">
                <Upload size={14} className="text-[#71717A]" />
                <span className="truncate text-xs text-[#71717A]">
                  {arquivo ? arquivo.name : "Selecionar PDF ou imagem"}
                </span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#A1A1AA] font-medium">Observações</label>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={3}
                placeholder="Ex.: pago por Pix, talão entregue ao responsável..."
                className="w-full resize-none bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-3 py-3 text-sm text-[#FAFAFA] placeholder-[#71717A] outline-none focus:border-[#3B82F6] transition-colors"
              />
            </div>

            {erro && (
              <p className="text-xs text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-[6px] px-3 py-2">
                {erro}
              </p>
            )}

            <div className="flex gap-2 pt-2">
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
                {loading ? "Salvando..." : "Salvar conta"}
              </button>
            </div>
          </form>
        </Dialog>
      )}
    </>
  );
}
