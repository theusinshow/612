import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { createClient } from "@/lib/supabase/server";
import { formatCompetencia, formatCurrency, formatKwh } from "@/lib/utils";
import { Zap, Receipt, CalendarDays, Check, Home, BarChart3 } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: competencias } = await supabase
    .from("competencias")
    .select("*")
    .order("ano", { ascending: false })
    .order("mes", { ascending: false })
    .limit(6);

  const competenciaAtual = competencias?.find((c) => c.status === "aberta")
    ?? competencias?.[0]
    ?? null;

  const { data: fatura } = competenciaAtual
    ? await supabase
        .from("faturas")
        .select("*")
        .eq("competencia_id", competenciaAtual.id)
        .single()
    : { data: null };

  const { data: rateios } = competenciaAtual
    ? await supabase
        .from("rateios")
        .select("*, residencia:residencias(nome, tipo)")
        .eq("competencia_id", competenciaAtual.id)
        .order("valor_total", { ascending: false })
    : { data: null };

  const { data: leituras } = competenciaAtual
    ? await supabase
        .from("leituras")
        .select("consumo_calculado")
        .eq("competencia_id", competenciaAtual.id)
    : { data: null };

  const rateiosInquilinos = (rateios ?? []).filter(
    (r) => (r.residencia as { tipo: string })?.tipo === "andar"
  );
  const rateioIdsInquilinos = rateiosInquilinos.map((r) => r.id);

  const { data: pagamentos } = rateioIdsInquilinos.length > 0
    ? await supabase
        .from("pagamentos")
        .select("rateio_id, status")
        .in("rateio_id", rateioIdsInquilinos)
    : { data: [] };

  const totalCompetencias = competencias?.length ?? 0;
  const consumoTotal = fatura ? Number(fatura.consumo_total_kwh) : null;
  const valorFatura = fatura ? Number(fatura.valor_total) : null;
  const totalPagamentos = pagamentos?.length ?? 0;
  const pagosCount = pagamentos?.filter((p) => p.status === "pago").length ?? 0;
  const pagamentoPorRateio = new Map(
    (pagamentos ?? []).map((p) => [p.rateio_id, p])
  );

  const flowSteps = [
    { label: "Fatura", done: !!fatura },
    { label: "Leituras", done: (leituras?.length ?? 0) >= 2 },
    { label: "Rateio", done: (rateios?.length ?? 0) > 0 },
    { label: "Fechada", done: competenciaAtual?.status === "fechada" },
  ];

  return (
    <AppShell pageTitle="Dashboard">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-xl font-semibold text-[#FAFAFA]">Dashboard</h1>
        <p className="text-sm text-[#A1A1AA] mt-1">
          {competenciaAtual
            ? `Competência: ${formatCompetencia(competenciaAtual.mes, competenciaAtual.ano)}`
            : "Nenhuma competência ativa"}
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Consumo total"
          value={consumoTotal ? formatKwh(consumoTotal) : "— kWh"}
          sub={consumoTotal ? "Fatura Celesc" : "Sem fatura"}
          icon={Zap}
        />
        <MetricCard
          label="Valor da fatura"
          value={valorFatura ? formatCurrency(valorFatura) : "R$ —"}
          sub={fatura?.vencimento
            ? `Vence ${new Date(fatura.vencimento + "T00:00:00").toLocaleDateString("pt-BR")}`
            : "Sem vencimento"}
          icon={Receipt}
        />
        <MetricCard
          label="Pagamentos"
          value={totalPagamentos > 0 ? `${pagosCount}/${totalPagamentos}` : "—"}
          sub={totalPagamentos > 0
            ? pagosCount === totalPagamentos ? "Todos recebidos" : "Pendentes"
            : "Sem rateio"}
          icon={Check}
        />
        <MetricCard
          label="Histórico"
          value={`${totalCompetencias} ${totalCompetencias === 1 ? "mês" : "meses"}`}
          sub="Competências registradas"
          icon={CalendarDays}
        />
      </div>

      {/* Competência atual + Rateio */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        {/* Competência */}
        <Card>
          <CardHeader
            title="Competência atual"
            subtitle={competenciaAtual
              ? formatCompetencia(competenciaAtual.mes, competenciaAtual.ano)
              : "Nenhuma competência"}
            action={
              competenciaAtual ? (
                <StatusBadge status={competenciaAtual.status} />
              ) : undefined
            }
          />

          {competenciaAtual ? (
            <div className="space-y-2.5">
              {flowSteps.map((step) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ring-1 ${
                    step.done
                      ? "bg-[#22C55E] ring-[#22C55E]/30"
                      : "bg-[#2A2A2A] ring-[#2A2A2A]"
                  }`} />
                  <span className={`text-xs flex-1 ${
                    step.done ? "text-[#A1A1AA]" : "text-[#71717A]"
                  }`}>
                    {step.label}
                  </span>
                  {step.done && (
                    <Check size={10} className="text-[#22C55E]" />
                  )}
                </div>
              ))}

              <Link
                href={`/competencias/${competenciaAtual.id}`}
                className="inline-block mt-3 text-xs text-[#3B82F6] hover:text-[#2563EB] transition-colors duration-150 focus-ring"
              >
                Ver detalhes →
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-xs text-[#71717A]">
                Nenhuma competência criada ainda.
              </p>
              <Link
                href="/competencias"
                className="inline-block mt-3 text-xs text-[#3B82F6] hover:text-[#2563EB] transition-colors duration-150 focus-ring"
              >
                Criar competência →
              </Link>
            </div>
          )}
        </Card>

        {/* Rateio */}
        <Card>
          <CardHeader
            title="Rateio"
            subtitle={competenciaAtual
              ? formatCompetencia(competenciaAtual.mes, competenciaAtual.ano)
              : "Distribuição por residência"}
          />

          {rateios && rateios.length > 0 ? (
            <div>
              {rateios.map((r) => {
                const residencia = r.residencia as { nome: string; tipo: string };
                const isInquilino = residencia?.tipo === "andar";
                const pagamento = pagamentoPorRateio.get(r.id);
                const pago = isInquilino ? pagamento?.status === "pago" : null;
                return (
                  <div
                    key={r.id}
                    className="flex items-center justify-between py-2.5 border-b border-[#1A1A1A] last:border-0"
                  >
                    <div className="flex items-center gap-2.5">
                      {pago !== null && (
                        <div className={`w-1.5 h-1.5 rounded-full ${pago ? "bg-[#22C55E]" : "bg-[#EAB308]"}`} />
                      )}
                      <span className="text-xs text-[#A1A1AA]">
                        {residencia?.nome}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#FAFAFA]">
                      {formatCurrency(Number(r.valor_total))}
                    </span>
                  </div>
                );
              })}

              <div className="flex items-center justify-between pt-3 mt-1">
                <span className="text-xs text-[#71717A] font-medium">Total</span>
                <span className="text-sm font-mono text-[#FAFAFA] font-semibold">
                  {formatCurrency(rateios.reduce((acc, r) => acc + Number(r.valor_total), 0))}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#71717A]">
              {competenciaAtual ? "Rateio ainda não calculado." : "Nenhum dado disponível."}
            </p>
          )}
        </Card>
      </div>

      {/* Atalhos operacionais */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Link href="/residencias" className="focus-ring rounded-[8px]">
          <Card className="h-full hover:bg-[#151515] hover:border-[#2A2A2A] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center bg-[#1A1A1A] rounded-[6px]">
                <Home size={16} className="text-[#A1A1AA]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#FAFAFA]">Residências</h2>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  Responsáveis, unidades e situação cadastral
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/analytics" className="focus-ring rounded-[8px]">
          <Card className="h-full hover:bg-[#151515] hover:border-[#2A2A2A] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center bg-[#1A1A1A] rounded-[6px]">
                <BarChart3 size={16} className="text-[#A1A1AA]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#FAFAFA]">Analytics</h2>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  Consumo, custo mensal e evolução do rateio
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Histórico de competências */}
      <Card>
        <CardHeader
          title="Histórico"
          subtitle="Últimas competências"
          action={
            <Link
              href="/competencias"
              className="text-xs text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors duration-150 focus-ring"
            >
              Ver todas
            </Link>
          }
        />

        {competencias && competencias.length > 0 ? (
          <div className="-mx-1">
            {competencias.map((c) => (
              <Link
                key={c.id}
                href={`/competencias/${c.id}`}
                className="flex items-center justify-between px-1 py-2.5 rounded-[6px] border-b border-[#1A1A1A] last:border-0 hover:bg-[#1A1A1A] transition-colors duration-150 focus-ring"
              >
                <div className="flex items-center gap-2.5">
                  <CalendarDays size={13} className="text-[#71717A]" />
                  <span className="text-xs text-[#A1A1AA]">
                    {formatCompetencia(c.mes, c.ano)}
                  </span>
                </div>
                <StatusBadge status={c.status} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-16 text-xs text-[#71717A]">
            Nenhuma competência registrada.
          </div>
        )}
      </Card>
    </AppShell>
  );
}
