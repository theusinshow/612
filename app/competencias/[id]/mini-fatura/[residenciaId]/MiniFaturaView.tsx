"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, Copy, Check, Zap, Home } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import Link from "next/link";

interface Props {
  competenciaId: string;
  label: string;
  residencia: { id: string; nome: string; responsavel_nome: string | null };
  fatura: { valor_total: string; consumo_total_kwh: string; cosip: string; vencimento: string | null } | null;
  leitura: { leitura_anterior: string; leitura_atual: string; consumo_calculado: string; foto_url: string } | null;
  rateio: { valor_consumo: string; valor_cosip: string; valor_total: string };
  pagamento: { status: string; data_pagamento: string | null } | null;
  textoFatura: string;
}

export function MiniFaturaView({
  competenciaId,
  label,
  residencia,
  fatura,
  leitura,
  rateio,
  pagamento,
  textoFatura,
}: Props) {
  const [copiado, setCopiado] = useState(false);

  async function copiarTexto() {
    await navigator.clipboard.writeText(textoFatura);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  const pago = pagamento?.status === "pago";

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-4 py-6 max-w-sm mx-auto">
      {/* Voltar */}
      <Link
        href={`/competencias/${competenciaId}`}
        className="flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors mb-6"
      >
        <ArrowLeft size={13} />
        Voltar
      </Link>

      {/* Card principal */}
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-[8px] overflow-hidden">
        {/* Header do card */}
        <div className="px-5 py-4 border-b border-[#1A1A1A]">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Zap size={12} className="text-[#A1A1AA]" />
                <span className="text-[10px] font-mono text-[#A1A1AA] tracking-widest">612</span>
              </div>
              <p className="text-xs text-[#71717A]">{label}</p>
            </div>
            {pago ? (
              <StatusBadge status="pago" />
            ) : (
              <StatusBadge status="pendente" />
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center bg-[#1A1A1A] rounded-[6px]">
              <Home size={13} className="text-[#A1A1AA]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#FAFAFA]">{residencia.nome}</p>
              {residencia.responsavel_nome && (
                <p className="text-xs text-[#71717A]">{residencia.responsavel_nome}</p>
              )}
            </div>
          </div>
        </div>

        {/* Leitura */}
        {leitura && (
          <div className="px-5 py-4 border-b border-[#1A1A1A]">
            <p className="text-[10px] text-[#71717A] font-medium uppercase tracking-wider mb-2">Medição</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-[10px] text-[#71717A]">Anterior</p>
                <p className="text-sm font-mono text-[#A1A1AA] mt-0.5">{leitura.leitura_anterior}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#71717A]">Atual</p>
                <p className="text-sm font-mono text-[#FAFAFA] mt-0.5">{leitura.leitura_atual}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#71717A]">Consumo</p>
                <p className="text-sm font-mono text-[#FAFAFA] mt-0.5">{leitura.consumo_calculado} kWh</p>
              </div>
            </div>

            {/* Foto do medidor */}
            {leitura.foto_url && (
              <a href={leitura.foto_url} target="_blank" rel="noopener noreferrer" className="block mt-3">
                <Image
                  src={leitura.foto_url}
                  alt="Foto do medidor"
                  width={512}
                  height={112}
                  unoptimized
                  className="w-full h-28 object-cover rounded-[6px] border border-[#1A1A1A]"
                />
                <p className="text-[10px] text-[#71717A] mt-1 text-center">Foto do medidor</p>
              </a>
            )}
          </div>
        )}

        {/* Valores */}
        <div className="px-5 py-4 border-b border-[#1A1A1A]">
          <p className="text-[10px] text-[#71717A] font-medium uppercase tracking-wider mb-3">Composição</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#A1A1AA]">Energia</span>
              <span className="text-xs font-mono text-[#FAFAFA]">
                {formatCurrency(Number(rateio.valor_consumo))}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#A1A1AA]">COSIP</span>
              <span className="text-xs font-mono text-[#FAFAFA]">
                {formatCurrency(Number(rateio.valor_cosip))}
              </span>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="px-5 py-4 border-b border-[#1A1A1A]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#FAFAFA]">Total</span>
            <span className="text-xl font-mono font-bold text-[#FAFAFA]">
              {formatCurrency(Number(rateio.valor_total))}
            </span>
          </div>
          {fatura?.vencimento && (
            <p className="text-xs text-[#71717A] mt-1 text-right">
              Vencimento: {new Date(fatura.vencimento + "T00:00:00").toLocaleDateString("pt-BR")}
            </p>
          )}
          {pago && pagamento?.data_pagamento && (
            <p className="text-xs text-[#22C55E] mt-1 text-right">
              Pago em {new Date(pagamento.data_pagamento + "T00:00:00").toLocaleDateString("pt-BR")}
            </p>
          )}
        </div>

        {/* Ação: copiar */}
        <div className="px-5 py-4">
          <button
            type="button"
            onClick={copiarTexto}
            className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] border border-[#1F1F1F] text-sm text-[#A1A1AA] font-medium py-2.5 rounded-[6px] hover:text-[#FAFAFA] hover:border-[#2A2A2A] transition-colors focus-ring"
          >
            {copiado ? (
              <>
                <Check size={14} className="text-[#22C55E]" />
                <span className="text-[#22C55E]">Copiado!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                Copiar para WhatsApp
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
