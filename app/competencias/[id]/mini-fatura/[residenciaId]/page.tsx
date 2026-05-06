import { createClient } from "@/lib/supabase/server";
import { formatCompetencia, formatCurrency } from "@/lib/utils";
import { notFound } from "next/navigation";
import { MiniFaturaView } from "./MiniFaturaView";

interface Props {
  params: Promise<{ id: string; residenciaId: string }>;
}

export default async function MiniFaturaPage({ params }: Props) {
  const { id: competenciaId, residenciaId } = await params;
  const supabase = await createClient();

  const { data: competencia } = await supabase
    .from("competencias")
    .select("*")
    .eq("id", competenciaId)
    .single();

  if (!competencia) notFound();

  const { data: residencia } = await supabase
    .from("residencias")
    .select("*")
    .eq("id", residenciaId)
    .single();

  if (!residencia) notFound();

  const { data: fatura } = await supabase
    .from("faturas")
    .select("*")
    .eq("competencia_id", competenciaId)
    .single();

  const { data: leitura } = await supabase
    .from("leituras")
    .select("*")
    .eq("competencia_id", competenciaId)
    .eq("residencia_id", residenciaId)
    .single();

  const { data: rateio } = await supabase
    .from("rateios")
    .select("*")
    .eq("competencia_id", competenciaId)
    .eq("residencia_id", residenciaId)
    .single();

  if (!rateio) notFound();

  const { data: pagamento } = await supabase
    .from("pagamentos")
    .select("*")
    .eq("rateio_id", rateio.id)
    .single();

  const label = formatCompetencia(competencia.mes, competencia.ano);

  // Texto para copiar/compartilhar
  const textoFatura = [
    `📊 *Energia — ${label}*`,
    `📍 ${residencia.nome}`,
    ``,
    `⚡ Consumo: ${leitura ? `${leitura.consumo_calculado} kWh` : "—"}`,
    `💡 Energia: ${formatCurrency(Number(rateio.valor_consumo))}`,
    `🏙️ COSIP: ${formatCurrency(Number(rateio.valor_cosip))}`,
    ``,
    `*Total: ${formatCurrency(Number(rateio.valor_total))}*`,
    fatura?.vencimento
      ? `📅 Vencimento: ${new Date(fatura.vencimento + "T00:00:00").toLocaleDateString("pt-BR")}`
      : "",
  ].filter(Boolean).join("\n");

  return (
    <MiniFaturaView
      competenciaId={competenciaId}
      label={label}
      residencia={residencia}
      fatura={fatura}
      leitura={leitura}
      rateio={rateio}
      pagamento={pagamento ?? null}
      textoFatura={textoFatura}
    />
  );
}
