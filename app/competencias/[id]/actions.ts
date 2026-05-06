"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function salvarFatura(
  competenciaId: string,
  data: {
    valor_total: number;
    consumo_total_kwh: number;
    cosip: number;
    vencimento: string | null;
    arquivo_pdf_url: string | null;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase.from("faturas").upsert({
    competencia_id: competenciaId,
    ...data,
  }, { onConflict: "competencia_id" });

  if (error) return { error: "Erro ao salvar fatura." };

  revalidatePath(`/competencias/${competenciaId}`);
  return { error: null };
}

export async function salvarLeitura(
  competenciaId: string,
  data: {
    residencia_id: string;
    leitura_anterior: number;
    leitura_atual: number;
    foto_url: string;
  }
) {
  const supabase = await createClient();

  if (data.leitura_atual < data.leitura_anterior) {
    return { error: "Leitura atual não pode ser menor que a anterior." };
  }

  const { error } = await supabase.from("leituras").upsert({
    competencia_id: competenciaId,
    ...data,
  }, { onConflict: "competencia_id,residencia_id" });

  if (error) return { error: "Erro ao salvar leitura." };

  revalidatePath(`/competencias/${competenciaId}`);
  return { error: null };
}

export async function calcularRateio(competenciaId: string) {
  const supabase = await createClient();

  // Buscar fatura
  const { data: fatura } = await supabase
    .from("faturas")
    .select("valor_total, consumo_total_kwh, cosip")
    .eq("competencia_id", competenciaId)
    .single();

  if (!fatura) return { error: "Fatura não cadastrada." };

  // Buscar leituras
  const { data: leituras } = await supabase
    .from("leituras")
    .select("residencia_id, consumo_calculado")
    .eq("competencia_id", competenciaId);

  if (!leituras || leituras.length < 2) {
    return { error: "Registre as leituras da Res. 2 e Res. 3 antes de calcular." };
  }

  // Buscar térrea
  const { data: terrea } = await supabase
    .from("residencias")
    .select("id")
    .eq("tipo", "terrea")
    .single();

  if (!terrea) return { error: "Residência térrea não encontrada." };

  // Cálculos
  const valorTotal = Number(fatura.valor_total);
  const consumoTotal = Number(fatura.consumo_total_kwh);
  const cosip = Number(fatura.cosip);

  const valorEnergia = valorTotal - cosip;
  const valorKwh = valorEnergia / consumoTotal;
  const cotaCosip = cosip / 3;

  const consumoMedido = leituras.reduce(
    (acc, l) => acc + Number(l.consumo_calculado),
    0
  );
  const consumoTerrea = consumoTotal - consumoMedido;

  // Rateios das residências com medidor
  const rateios = leituras.map((l) => ({
    competencia_id: competenciaId,
    residencia_id: l.residencia_id,
    valor_consumo: Number((Number(l.consumo_calculado) * valorKwh).toFixed(2)),
    valor_cosip: Number(cotaCosip.toFixed(2)),
  }));

  // Rateio da térrea
  rateios.push({
    competencia_id: competenciaId,
    residencia_id: terrea.id,
    valor_consumo: Number((consumoTerrea * valorKwh).toFixed(2)),
    valor_cosip: Number(cotaCosip.toFixed(2)),
  });

  // Salvar rateios
  const { error } = await supabase
    .from("rateios")
    .upsert(rateios, { onConflict: "competencia_id,residencia_id" });

  if (error) return { error: "Erro ao salvar rateio." };

  // Criar pagamentos pendentes
  const { data: rateiosSalvos } = await supabase
    .from("rateios")
    .select("id")
    .eq("competencia_id", competenciaId);

  if (rateiosSalvos) {
    await supabase
      .from("pagamentos")
      .upsert(
        rateiosSalvos.map((r) => ({ rateio_id: r.id, status: "pendente" })),
        { onConflict: "rateio_id" }
      );
  }

  revalidatePath(`/competencias/${competenciaId}`);
  return { error: null };
}
