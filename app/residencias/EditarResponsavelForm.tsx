"use client";

import { useState, useTransition } from "react";
import { atualizarResponsavel } from "./actions";
import { Pencil, Check, X } from "lucide-react";

interface Props {
  residenciaId: string;
  responsavelAtual: string | null;
}

export function EditarResponsavelForm({ residenciaId, responsavelAtual }: Props) {
  const [editing, setEditing] = useState(false);
  const [valor, setValor] = useState(responsavelAtual ?? "");
  const [isPending, startTransition] = useTransition();

  function salvar() {
    startTransition(async () => {
      await atualizarResponsavel(residenciaId, valor);
      setEditing(false);
    });
  }

  function cancelar() {
    setValor(responsavelAtual ?? "");
    setEditing(false);
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-[#71717A]">
          {responsavelAtual ?? "Sem responsável"}
        </span>
        <button
          onClick={() => setEditing(true)}
          className="flex items-center justify-center w-7 h-7 rounded-[6px] text-[#3B82F6] hover:text-[#2563EB] hover:bg-[#3B82F6]/10 transition-colors"
          title="Editar responsável"
        >
          <Pencil size={13} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      <input
        type="text"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") salvar();
          if (e.key === "Escape") cancelar();
        }}
        placeholder="Nome do responsável"
        autoFocus
        className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[6px] px-2.5 py-1.5 text-xs text-[#FAFAFA] placeholder-[#71717A] focus:outline-none focus:border-[#3B82F6] flex-1 min-w-0"
      />
      <button
        onClick={salvar}
        disabled={isPending}
        className="flex items-center justify-center w-7 h-7 rounded-[6px] text-[#22C55E] hover:text-[#16A34A] hover:bg-[#22C55E]/10 transition-colors disabled:opacity-50"
        title="Salvar"
      >
        <Check size={13} />
      </button>
      <button
        onClick={cancelar}
        disabled={isPending}
        className="flex items-center justify-center w-7 h-7 rounded-[6px] text-[#71717A] hover:text-[#A1A1AA] hover:bg-[#1A1A1A] transition-colors"
        title="Cancelar"
      >
        <X size={13} />
      </button>
    </div>
  );
}
