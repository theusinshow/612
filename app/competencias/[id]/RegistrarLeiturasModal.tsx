"use client";

import { useState } from "react";
import { X, Camera, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { salvarLeituras, buscarLeituraAnterior } from "./actions";
import { useRouter } from "next/navigation";

interface Residencia {
  id: string;
  nome: string;
}

interface LeituraState {
  residenciaId: string;
  nome: string;
  anterior: string;
  atual: string;
  autoPreenchido: boolean;
}

interface Props {
  competenciaId: string;
  residencias: Residencia[]; // as duas com medidor
}

export function RegistrarLeiturasModal({ competenciaId, residencias }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  const [leituras, setLeituras] = useState<LeituraState[]>(
    residencias.map((r) => ({
      residenciaId: r.id,
      nome: r.nome,
      anterior: "",
      atual: "",
      autoPreenchido: false,
    }))
  );

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFoto(file);
    setFotoPreview(URL.createObjectURL(file));
  }

  function updateLeitura(index: number, field: "anterior" | "atual", value: string) {
    setLeituras((prev) =>
      prev.map((l, i) =>
        i === index
          ? { ...l, [field]: value, autoPreenchido: field === "anterior" ? false : l.autoPreenchido }
          : l
      )
    );
  }

  async function handleAbrir() {
    // Reset
    setFoto(null);
    setFotoPreview(null);
    setErro(null);
    setLeituras(residencias.map((r) => ({
      residenciaId: r.id,
      nome: r.nome,
      anterior: "",
      atual: "",
      autoPreenchido: false,
    })));

    setOpen(true);

    // Buscar leituras anteriores em paralelo
    setBuscando(true);
    const resultados = await Promise.all(
      residencias.map((r) => buscarLeituraAnterior(competenciaId, r.id))
    );
    setBuscando(false);

    setLeituras(residencias.map((r, i) => ({
      residenciaId: r.id,
      nome: r.nome,
      anterior: resultados[i].leitura_atual !== null ? String(resultados[i].leitura_atual) : "",
      atual: "",
      autoPreenchido: resultados[i].leitura_atual !== null,
    })));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!foto) {
      setErro("Foto dos medidores é obrigatória.");
      return;
    }

    for (const l of leituras) {
      if (!l.anterior || !l.atual) {
        setErro(`Preencha as leituras de ${l.nome}.`);
        return;
      }
    }

    setLoading(true);

    // Upload da foto (uma só para ambas)
    const supabase = createClient();
    const nomeArquivo = `${competenciaId}/ambas/${Date.now()}.jpg`;
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

    const result = await salvarLeituras(
      competenciaId,
      urlData.publicUrl,
      leituras.map((l) => ({
        residencia_id: l.residenciaId,
        leitura_anterior: Number(l.anterior),
        leitura_atual: Number(l.atual),
      }))
    );

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
        onClick={handleAbrir}
        className="text-xs text-[#3B82F6] hover:text-[#2563EB] transition-colors font-medium"
      >
        + Registrar leituras
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

          <div className="relative w-full max-w-md bg-[#111111] border border-[#1F1F1F] rounded-[8px] p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-sm font-semibold text-[#FAFAFA]">Registrar leituras</h2>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  Res. 2 e Res. 3 — uma foto para ambas
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="text-[#52525B] hover:text-[#A1A1AA] transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Foto única */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#A1A1AA] font-medium">
                  Foto dos medidores <span className="text-[#EF4444]">*</span>
                </label>
                <label className="flex flex-col items-center justify-center bg-[#1A1A1A] border border-[#1F1F1F] border-dashed rounded-[6px] cursor-pointer hover:border-[#3B82F6] transition-colors overflow-hidden">
                  {fotoPreview ? (
                    <img src={fotoPreview} alt="Preview" className="w-full h-44 object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-8">
                      <Camera size={22} className="text-[#52525B]" />
                      <span className="text-xs text-[#52525B]">Tirar foto ou selecionar</span>
                      <span className="text-[10px] text-[#3A3A3A]">Ambos os medidores na mesma foto</span>
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

              {/* Leituras lado a lado */}
              <div className="grid grid-cols-2 gap-3">
                {leituras.map((l, i) => {
                  const consumo = l.anterior && l.atual
                    ? Math.max(0, Number(l.atual) - Number(l.anterior))
                    : null;

                  return (
                    <div key={l.residenciaId} className="flex flex-col gap-2.5 bg-[#1A1A1A] border border-[#1F1F1F] rounded-[6px] p-3">
                      <p className="text-xs font-medium text-[#FAFAFA]">{l.nome}</p>

                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <label className="text-[10px] text-[#52525B]">Anterior</label>
                          {buscando && <RefreshCw size={9} className="text-[#52525B] animate-spin" />}
                          {l.autoPreenchido && !buscando && (
                            <span className="text-[9px] text-[#22C55E]">auto</span>
                          )}
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          value={l.anterior}
                          onChange={(e) => updateLeitura(i, "anterior", e.target.value)}
                          placeholder="0"
                          className="w-full bg-[#111111] border border-[#1F1F1F] rounded-[4px] px-2 py-1.5 text-xs text-[#FAFAFA] placeholder-[#52525B] outline-none focus:border-[#3B82F6] transition-colors"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-[#52525B]">Atual</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          value={l.atual}
                          onChange={(e) => updateLeitura(i, "atual", e.target.value)}
                          placeholder="0"
                          className="w-full bg-[#111111] border border-[#1F1F1F] rounded-[4px] px-2 py-1.5 text-xs text-[#FAFAFA] placeholder-[#52525B] outline-none focus:border-[#3B82F6] transition-colors"
                        />
                      </div>

                      {consumo !== null && (
                        <div className="pt-1 border-t border-[#1F1F1F]">
                          <p className="text-[10px] text-[#52525B]">Consumo</p>
                          <p className="text-sm font-mono text-[#FAFAFA] mt-0.5">{consumo} kWh</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {erro && (
                <p className="text-xs text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-[6px] px-3 py-2">
                  {erro}
                </p>
              )}

              <div className="flex gap-2">
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
                  {loading ? "Salvando..." : "Salvar ambas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
