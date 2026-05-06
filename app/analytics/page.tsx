import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";
import { formatCompetencia } from "@/lib/utils";
import { ConsumoChart, ValorFaturaChart, RateioChart } from "./Charts";
import type { ConsumoData, RateioData } from "./Charts";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  // Todas as competências com fatura, ordem cronológica
  const { data: competencias } = await supabase
    .from("competencias")
    .select("id, mes, ano")
    .order("ano", { ascending: true })
    .order("mes", { ascending: true });

  const competenciaIds = (competencias ?? []).map((c) => c.id);

  // Faturas de todas as competências
  const { data: faturas } = competenciaIds.length > 0
    ? await supabase
        .from("faturas")
        .select("competencia_id, consumo_total_kwh, valor_total")
        .in("competencia_id", competenciaIds)
    : { data: [] };

  // Rateios de todas as competências com nome da residência
  const { data: rateios } = competenciaIds.length > 0
    ? await supabase
        .from("rateios")
        .select("competencia_id, valor_total, residencia:residencias(nome)")
        .in("competencia_id", competenciaIds)
    : { data: [] };

  // Monta dados para gráfico de consumo e valor da fatura
  const faturaMap = new Map(
    (faturas ?? []).map((f) => [f.competencia_id, f])
  );

  const consumoData: ConsumoData[] = (competencias ?? [])
    .filter((c) => faturaMap.has(c.id))
    .map((c) => {
      const f = faturaMap.get(c.id)!;
      return {
        label: formatCompetencia(c.mes, c.ano).replace("/", "/\n"),
        kwh: Number(f.consumo_total_kwh),
        valor: Number(f.valor_total),
      };
    });

  // Monta dados para gráfico de rateio por residência
  // Agrupa: { competenciaId -> { residenciaNome -> valor } }
  const rateioMap = new Map<string, Record<string, number>>();
  const residenciasSet = new Set<string>();

  for (const r of rateios ?? []) {
    const nome = (r.residencia as unknown as { nome: string })?.nome ?? "?";
    residenciasSet.add(nome);
    if (!rateioMap.has(r.competencia_id)) {
      rateioMap.set(r.competencia_id, {});
    }
    rateioMap.get(r.competencia_id)![nome] = Number(r.valor_total);
  }

  const residencias = Array.from(residenciasSet).sort();

  const rateioData: RateioData[] = (competencias ?? [])
    .filter((c) => rateioMap.has(c.id))
    .map((c) => ({
      label: formatCompetencia(c.mes, c.ano).replace("/", "/\n"),
      ...(rateioMap.get(c.id) ?? {}),
    }));

  // Totais para os cards de resumo
  const totalKwh = consumoData.reduce((acc, d) => acc + d.kwh, 0);
  const totalValor = consumoData.reduce((acc, d) => acc + d.valor, 0);
  const mediaKwh = consumoData.length > 0 ? totalKwh / consumoData.length : 0;
  const mediaValor = consumoData.length > 0 ? totalValor / consumoData.length : 0;

  return (
    <AppShell pageTitle="Analytics">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-[#FAFAFA]">Analytics</h1>
        <p className="text-sm text-[#A1A1AA] mt-1">
          Histórico de consumo e tendências
        </p>
      </div>

      {/* Resumo */}
      {consumoData.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <SummaryCard label="Competências" value={`${consumoData.length}`} sub="registradas" />
          <SummaryCard label="Média de consumo" value={`${mediaKwh.toFixed(0)} kWh`} sub="por mês" />
          <SummaryCard
            label="Média da fatura"
            value={mediaValor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            sub="por mês"
          />
          <SummaryCard
            label="Total acumulado"
            value={totalValor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            sub="em faturas"
          />
        </div>
      )}

      <div className="grid gap-3">
        {/* Consumo mensal em kWh */}
        <Card>
          <CardHeader
            title="Consumo mensal"
            subtitle="kWh por competência"
          />
          <ConsumoChart data={consumoData} />
        </Card>

        {/* Valor da fatura */}
        <Card>
          <CardHeader
            title="Valor da fatura"
            subtitle="R$ por competência"
          />
          <ValorFaturaChart data={consumoData} />
        </Card>

        {/* Rateio por residência */}
        <Card>
          <CardHeader
            title="Custo por residência"
            subtitle="Composição do rateio mensal"
          />
          <RateioChart data={rateioData} residencias={residencias} />
        </Card>
      </div>
    </AppShell>
  );
}

function SummaryCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="bg-[#111111] border border-[#1F1F1F] rounded-[8px] p-3">
      <p className="text-[10px] text-[#52525B] font-medium uppercase tracking-wide">{label}</p>
      <p className="text-sm font-mono text-[#FAFAFA] mt-1">{value}</p>
      <p className="text-[10px] text-[#3A3A3A] mt-0.5">{sub}</p>
    </div>
  );
}
