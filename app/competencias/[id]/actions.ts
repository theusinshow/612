"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function salvarFatura(
  competenciaId: string,
  data: {
    valor_total: number;
    consumo_total_kwh: number;
    cosip: number;
    cosip_divisao: number;
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

export async function salvarLeituras(
  competenciaId: string,
  foto_url: string,
  leituras: Array<{
    residencia_id: string;
    leitura_anterior: number;
    leitura_atual: number;
  }>
) {
  const supabase = await createClient();

  for (const l of leituras) {
    if (l.leitura_atual < l.leitura_anterior) {
      return { error: "Leitura atual não pode ser menor que a anterior." };
    }
  }

  const registros = leituras.map((l) => ({
    competencia_id: competenciaId,
    residencia_id: l.residencia_id,
    leitura_anterior: l.leitura_anterior,
    leitura_atual: l.leitura_atual,
    foto_url,
  }));

  const { error } = await supabase
    .from("leituras")
    .upsert(registros, { onConflict: "competencia_id,residencia_id" });

  if (error) return { error: "Erro ao salvar leituras." };

  revalidatePath(`/competencias/${competenciaId}`);
  return { error: null };
}

export async function garantirPagamentos(competenciaId: string) {
  const supabase = await createClient();

  const { data: rateios } = await supabase
    .from("rateios")
    .select("id")
    .eq("competencia_id", competenciaId);

  if (!rateios || rateios.length === 0) return;

  await supabase
    .from("pagamentos")
    .upsert(
      rateios.map((r) => ({ rateio_id: r.id, status: "pendente" })),
      { onConflict: "rateio_id" }
    );
}

export async function fecharCompetencia(competenciaId: string) {
  const supabase = await createClient();

  // Verificar pré-requisitos
  const { data: fatura } = await supabase
    .from("faturas")
    .select("id")
    .eq("competencia_id", competenciaId)
    .single();

  if (!fatura) return { error: "Cadastre a fatura antes de fechar." };

  const { data: leituras } = await supabase
    .from("leituras")
    .select("id")
    .eq("competencia_id", competenciaId);

  if (!leituras || leituras.length < 2) {
    return { error: "Registre as leituras antes de fechar." };
  }

  const { data: rateios } = await supabase
    .from("rateios")
    .select("id")
    .eq("competencia_id", competenciaId);

  if (!rateios || rateios.length === 0) {
    return { error: "Calcule o rateio antes de fechar." };
  }

  // Fechar competência
  const { error } = await supabase
    .from("competencias")
    .update({ status: "fechada", closed_at: new Date().toISOString() })
    .eq("id", competenciaId);

  if (error) return { error: "Erro ao fechar competência." };

  // Log de auditoria
  await supabase.from("audit_logs").insert({
    acao: "fechar_competencia",
    entidade: "competencias",
    descricao: `Competência ${competenciaId} fechada.`,
  });

  revalidatePath(`/competencias/${competenciaId}`);
  revalidatePath("/dashboard");
  revalidatePath("/competencias");
  return { error: null };
}

export async function buscarLeituraAnterior(
  competenciaId: string,
  residenciaId: string
): Promise<{ leitura_atual: number | null }> {
  const supabase = await createClient();

  // Buscar mês/ano da competência atual
  const { data: competencia } = await supabase
    .from("competencias")
    .select("mes, ano")
    .eq("id", competenciaId)
    .single();

  if (!competencia) return { leitura_atual: null };

  // Calcular mês anterior
  const mesAnterior = competencia.mes === 1 ? 12 : competencia.mes - 1;
  const anoAnterior = competencia.mes === 1 ? competencia.ano - 1 : competencia.ano;

  // Buscar competência anterior
  const { data: compAnterior } = await supabase
    .from("competencias")
    .select("id")
    .eq("mes", mesAnterior)
    .eq("ano", anoAnterior)
    .single();

  if (!compAnterior) return { leitura_atual: null };

  // Buscar leitura atual da residência naquela competência
  const { data: leitura } = await supabase
    .from("leituras")
    .select("leitura_atual")
    .eq("competencia_id", compAnterior.id)
    .eq("residencia_id", residenciaId)
    .single();

  return { leitura_atual: leitura ? Number(leitura.leitura_atual) : null };
}

export async function marcarPagamento(
  pagamentoId: string,
  competenciaId: string,
  data: { status: "pago" | "pendente"; valor_pago: number | null; data_pagamento: string | null }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("pagamentos")
    .update(data)
    .eq("id", pagamentoId);

  if (error) return { error: "Erro ao atualizar pagamento." };

  revalidatePath(`/competencias/${competenciaId}`);
  return { error: null };
}

export async function calcularRateio(competenciaId: string) {
  const supabase = await createClient();

  // Buscar fatura
  const { data: fatura } = await supabase
    .from("faturas")
    .select("valor_total, consumo_total_kwh, cosip, cosip_divisao")
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

  // Divisão do COSIP:
  // - modo 3 (padrão): cada uma das 3 residências paga cosip/3
  // - modo 2 (irmão nas duas de cima): térrea paga cosip/2 e cada residência
  //   com medidor (Res. 2 e Res. 3) paga cosip/4, somando cosip/2 para o irmão
  const divisao = Number(fatura.cosip_divisao) === 2 ? 2 : 3;
  const cotaCosipTerrea = divisao === 2 ? cosip / 2 : cosip / 3;
  const cotaCosipMedidor = divisao === 2 ? cosip / 4 : cosip / 3;

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
    valor_cosip: Number(cotaCosipMedidor.toFixed(2)),
  }));

  // Rateio da térrea
  rateios.push({
    competencia_id: competenciaId,
    residencia_id: terrea.id,
    valor_consumo: Number((consumoTerrea * valorKwh).toFixed(2)),
    valor_cosip: Number(cotaCosipTerrea.toFixed(2)),
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
