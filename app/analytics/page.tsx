import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { createClient } from "@/lib/supabase/server";
import { formatCompetencia } from "@/lib/utils";
import { ConsumoChart, ValorFaturaChart, RateioChart } from "./ChartsLazy";
import type { ConsumoData, RateioData } from "./Charts";
import { BarChart3, TrendingUp, Zap, DollarSign } from "lucide-react";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const { data: competencias } = await supabase
    .from("competencias")
    .select("id, mes, ano")
    .order("ano", { ascending: true })
    .order("mes", { ascending: true });

  const competenciaIds = (competencias ?? []).map((c) => c.id);

  // faturas e rateios dependem só de competenciaIds — rodam em paralelo.
  const [{ data: faturas }, { data: rateios }] = competenciaIds.length > 0
    ? await Promise.all([
        supabase
          .from("faturas")
          .select("competencia_id, consumo_total_kwh, valor_total")
          .in("competencia_id", competenciaIds),
        supabase
          .from("rateios")
          .select("competencia_id, valor_total, residencia:residencias(nome)")
          .in("competencia_id", competenciaIds),
      ])
    : [{ data: [] }, { data: [] }];

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

  const totalKwh = consumoData.reduce((acc, d) => acc + d.kwh, 0);
  const totalValor = consumoData.reduce((acc, d) => acc + d.valor, 0);
  const mediaKwh = consumoData.length > 0 ? totalKwh / consumoData.length : 0;
  const mediaValor = consumoData.length > 0 ? totalValor / consumoData.length : 0;

  return (
    <AppShell pageTitle="Analytics">
      <div className="mb-10">
        <h1 className="text-xl font-semibold text-[#FAFAFA]">Analytics</h1>
        <p className="text-sm text-[#A1A1AA] mt-1">
          Histórico de consumo e tendências
        </p>
      </div>

      {/* Resumo */}
      {consumoData.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            label="Competências"
            value={`${consumoData.length}`}
            sub="registradas"
            icon={BarChart3}
          />
          <MetricCard
            label="Média de consumo"
            value={`${mediaKwh.toFixed(0)} kWh`}
            sub="por mês"
            icon={Zap}
          />
          <MetricCard
            label="Média da fatura"
            value={mediaValor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            sub="por mês"
            icon={TrendingUp}
          />
          <MetricCard
            label="Total acumulado"
            value={totalValor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            sub="em faturas"
            icon={DollarSign}
          />
        </div>
      )}

      <div className="grid gap-4">
        <Card>
          <CardHeader
            title="Consumo mensal"
            subtitle="kWh por competência"
          />
          <ConsumoChart data={consumoData} />
        </Card>

        <Card>
          <CardHeader
            title="Valor da fatura"
            subtitle="R$ por competência"
          />
          <ValorFaturaChart data={consumoData} />
        </Card>

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
