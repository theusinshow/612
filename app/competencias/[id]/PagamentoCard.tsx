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
  valorTotal: string;
}

export function PagamentoCard({ competenciaId, pagamento, valorTotal }: Props) {
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

  if (pago) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-[#22C55E]/10 border border-[#22C55E]/20 px-2.5 py-1.5 rounded-[6px]">
          <Check size={12} className="text-[#22C55E]" />
          <span className="text-xs text-[#22C55E] font-medium">
            Pago{pagamento.data_pagamento
              ? ` em ${new Date(pagamento.data_pagamento + "T00:00:00").toLocaleDateString("pt-BR")}`
              : ""}
          </span>
        </div>
        <button
          onClick={handleDesfazer}
          disabled={loading}
          title="Desfazer pagamento"
          className="flex items-center justify-center w-8 h-8 rounded-[6px] text-[#71717A] hover:text-[#A1A1AA] hover:bg-[#1A1A1A] transition-colors disabled:opacity-40"
        >
          <RotateCcw size={13} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 bg-[#1A1A1A] border border-[#1F1F1F] px-3 py-2.5 rounded-[6px] text-xs text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-[#2A2A2A] transition-colors w-full min-h-[44px]"
      >
        <Check size={13} />
        Marcar como pago
      </button>

      {showForm && (
        <div className="flex items-end gap-2">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs text-[#71717A]">Data do recebimento</label>
            <input
              type="date"
              value={dataPagamento}
              onChange={(e) => setDataPagamento(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-2.5 py-2.5 text-xs text-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors min-h-[44px]"
            />
          </div>
          <div className="flex gap-1.5 pb-0.5">
            <button
              onClick={() => setShowForm(false)}
              className="w-10 h-10 flex items-center justify-center bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] text-[#71717A] hover:text-[#A1A1AA] transition-colors"
            >
              <X size={13} />
            </button>
            <button
              onClick={handleMarcarPago}
              disabled={loading}
              className="w-10 h-10 flex items-center justify-center bg-[#22C55E] rounded-[6px] text-[#0A0A0A] hover:bg-[#16A34A] transition-colors disabled:opacity-50"
            >
              <Check size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
