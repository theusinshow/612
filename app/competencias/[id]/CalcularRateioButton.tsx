"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { calcularRateio } from "./actions";
import { useRouter } from "next/navigation";

interface Props {
  competenciaId: string;
  disabled: boolean;
  disabledReason?: string;
}

export function CalcularRateioButton({ competenciaId, disabled, disabledReason }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleClick() {
    setErro(null);
    setLoading(true);
    const result = await calcularRateio(competenciaId);
    setLoading(false);

    if (result.error) {
      setErro(result.error);
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleClick}
        disabled={disabled || loading}
        title={disabledReason}
        className="flex items-center gap-2 bg-[#FAFAFA] text-[#0A0A0A] text-sm font-medium px-3 py-2 rounded-[6px] hover:bg-[#E4E4E7] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Calculator size={14} />
        {loading ? "Calculando..." : "Calcular rateio"}
      </button>
      {erro && (
        <p className="text-xs text-[#EF4444]">{erro}</p>
      )}
    </div>
  );
}
