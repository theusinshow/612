"use client";

import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { marcarPagamento } from "./actions";
import { useRouter } from "next/navigation";

interface Props {
  competenciaId: string;
  pagamento: {
    id: string;
    status: string;
    valor_pago: string | null;
    data_pagamento: string | null;
  };
  residenciaNome: string;
  valorTotal: string;
}

export function PagamentoCard({ competenciaId, pagamento, residenciaNome, valorTotal }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataPagamento, setDataPagamento] = useState(
    new Date().toISOString().split("T")[0]
  );

  const pago = pagamento.status === "pago";

  async function handleMarcarPago() {
    setLoading(true);
    await marcarPagamento(pagamento.id, competenciaId, {
      status: "pago",
      valor_pago: Number(valorTotal),
      data_pagamento: dataPagamento,
    });
    setLoading(false);
    setShowForm(false);
    router.refresh();
  }

  async function handleDesfazer() {
    setLoading(true);
    await marcarPagamento(pagamento.id, competenciaId, {
      status: "pendente",
      valor_pago: null,
      data_pagamento: null,
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2 py-3 border-b border-[#1A1A1A] last:border-0">
      <div className="flex items-center justify-between">
        {/* Residência + valor */}
        <div>
          <p className="text-sm text-[#FAFAFA] font-medium">{residenciaNome}</p>
          <p className="text-xs font-mono text-[#A1A1AA] mt-0.5">
            R$ {Number(valorTotal).toFixed(2).replace(".", ",")}
          </p>
        </div>

        {/* Status + ação */}
        <div className="flex items-center gap-2">
          {pago ? (
            <>
              <div className="flex items-center gap-1.5 bg-[#22C55E]/10 border border-[#22C55E]/20 px-2.5 py-1 rounded-[6px]">
                <Check size={11} className="text-[#22C55E]" />
                <span className="text-[11px] text-[#22C55E] font-medium">Pago</span>
              </div>
              <button
                onClick={handleDesfazer}
                disabled={loading}
                title="Desfazer pagamento"
                className="text-[#52525B] hover:text-[#A1A1AA] transition-colors disabled:opacity-40"
              >
                <RotateCcw size={13} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1.5 bg-[#1A1A1A] border border-[#1F1F1F] px-2.5 py-1 rounded-[6px] text-[11px] text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-[#2A2A2A] transition-colors"
            >
              <Check size={11} />
              Marcar pago
            </button>
          )}
        </div>
      </div>

      {/* Data do pagamento */}
      {pago && pagamento.data_pagamento && (
        <p className="text-[10px] text-[#52525B]">
          Recebido em {new Date(pagamento.data_pagamento + "T00:00:00").toLocaleDateString("pt-BR")}
        </p>
      )}

      {/* Formulário inline de confirmação */}
      {showForm && !pago && (
        <div className="flex items-center gap-2 mt-1">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-[10px] text-[#52525B]">Data do recebimento</label>
            <input
              type="date"
              value={dataPagamento}
              onChange={(e) => setDataPagamento(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-2.5 py-1.5 text-xs text-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors"
            />
          </div>
          <div className="flex gap-1.5 mt-4">
            <button
              onClick={() => setShowForm(false)}
              className="w-8 h-8 flex items-center justify-center bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] text-[#52525B] hover:text-[#A1A1AA] transition-colors"
            >
              <X size={13} />
            </button>
            <button
              onClick={handleMarcarPago}
              disabled={loading}
              className="w-8 h-8 flex items-center justify-center bg-[#22C55E] rounded-[6px] text-[#0A0A0A] hover:bg-[#16A34A] transition-colors disabled:opacity-50"
            >
              <Check size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
