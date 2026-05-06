"use client";

import { useState } from "react";
import { X, Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { salvarLeitura } from "./actions";
import { useRouter } from "next/navigation";

interface Residencia {
  id: string;
  nome: string;
}

interface Props {
  competenciaId: string;
  residencias: Residencia[];
}

export function AdicionarLeituraModal({ competenciaId, residencias }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [residenciaId, setResidenciaId] = useState(residencias[0]?.id ?? "");
  const [leituraAnterior, setLeituraAnterior] = useState("");
  const [leituraAtual, setLeituraAtual] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFoto(file);
    setFotoPreview(URL.createObjectURL(file));
  }

  function resetForm() {
    setLeituraAnterior("");
    setLeituraAtual("");
    setFoto(null);
    setFotoPreview(null);
    setErro(null);
    setResidenciaId(residencias[0]?.id ?? "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!foto) {
      setErro("Foto do medidor é obrigatória.");
      return;
    }

    setLoading(true);

    // Upload da foto
    const supabase = createClient();
    const nomeArquivo = `${competenciaId}/${residenciaId}/${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("fotos-leituras")
      .upload(nomeArquivo, foto, { upsert: true });

    if (uploadError) {
      setErro("Erro ao fazer upload da foto.");
      setLoading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("fotos-leituras")
      .getPublicUrl(nomeArquivo);

    const result = await salvarLeitura(competenciaId, {
      residencia_id: residenciaId,
      leitura_anterior: Number(leituraAnterior),
      leitura_atual: Number(leituraAtual),
      foto_url: urlData.publicUrl,
    });

    setLoading(false);

    if (result.error) {
      setErro(result.error);
      return;
    }

    setOpen(false);
    resetForm();
    router.refresh();
  }

  const consumoPreview =
    leituraAnterior && leituraAtual
      ? Math.max(0, Number(leituraAtual) - Number(leituraAnterior))
      : null;

  return (
    <>
      <button
        onClick={() => { resetForm(); setOpen(true); }}
        className="text-xs text-[#3B82F6] hover:text-[#2563EB] transition-colors font-medium"
      >
        + Registrar leitura
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

          <div className="relative w-full max-w-sm bg-[#111111] border border-[#1F1F1F] rounded-[8px] p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-sm font-semibold text-[#FAFAFA]">Registrar leitura</h2>
                <p className="text-xs text-[#A1A1AA] mt-0.5">Foto obrigatória</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-[#52525B] hover:text-[#A1A1AA] transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Residência */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#A1A1AA] font-medium">Residência</label>
                <select
                  value={residenciaId}
                  onChange={(e) => setResidenciaId(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-3 py-2.5 text-sm text-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors"
                >
                  {residencias.map((r) => (
                    <option key={r.id} value={r.id}>{r.nome}</option>
                  ))}
                </select>
              </div>

              {/* Leituras */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#A1A1AA] font-medium">Leitura anterior</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={leituraAnterior}
                    onChange={(e) => setLeituraAnterior(e.target.value)}
                    placeholder="0"
                    className="w-full bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-3 py-2.5 text-sm text-[#FAFAFA] placeholder-[#52525B] outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#A1A1AA] font-medium">Leitura atual</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={leituraAtual}
                    onChange={(e) => setLeituraAtual(e.target.value)}
                    placeholder="0"
                    className="w-full bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-3 py-2.5 text-sm text-[#FAFAFA] placeholder-[#52525B] outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
              </div>

              {/* Preview do consumo */}
              {consumoPreview !== null && (
                <div className="bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] px-3 py-2.5 flex items-center justify-between">
                  <span className="text-xs text-[#52525B]">Consumo calculado</span>
                  <span className="text-sm font-mono text-[#FAFAFA]">{consumoPreview} kWh</span>
                </div>
              )}

              {/* Foto obrigatória */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#A1A1AA] font-medium">
                  Foto do medidor <span className="text-[#EF4444]">*</span>
                </label>
                <label className="flex flex-col items-center justify-center bg-[#1A1A1A] border border-[#1F1F1F] border-dashed rounded-[6px] cursor-pointer hover:border-[#3B82F6] transition-colors overflow-hidden">
                  {fotoPreview ? (
                    <img
                      src={fotoPreview}
                      alt="Preview"
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-6">
                      <Camera size={20} className="text-[#52525B]" />
                      <span className="text-xs text-[#52525B]">Tirar foto ou selecionar</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFoto}
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
