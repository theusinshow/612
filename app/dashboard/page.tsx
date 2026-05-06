import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { createClient } from "@/lib/supabase/server";
import { formatCompetencia, formatCurrency, formatKwh } from "@/lib/utils";
import { Zap, Receipt, CalendarDays, Check } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Competência mais recente (aberta primeiro, depois fechada)
  const { data: competencias } = await supabase
    .from("competencias")
    .select("*")
    .order("ano", { ascending: false })
    .order("mes", { ascending: false })
    .limit(6);

  const competenciaAtual = competencias?.find((c) => c.status === "aberta")
    ?? competencias?.[0]
    ?? null;

  // Dados da competência atual
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
        .select("*, residencia:residencias(nome, tipo), pagamento:pagamentos(status)")
        .eq("competencia_id", competenciaAtual.id)
        .order("valor_total", { ascending: false })
    : { data: null };

  const { data: leituras } = competenciaAtual
    ? await supabase
        .from("leituras")
        .select("consumo_calculado")
        .eq("competencia_id", competenciaAtual.id)
    : { data: null };

  // Métricas
  const totalCompetencias = competencias?.length ?? 0;
  const consumoTotal = fatura ? Number(fatura.consumo_total_kwh) : null;
  const valorFatura = fatura ? Number(fatura.valor_total) : null;

  const pagamentos = rateios?.flatMap((r) =>
    (r.pagamento as Array<{ status: string }>) ?? []
  ) ?? [];
  const totalPagamentos = pagamentos.length;
  const pagosCount = pagamentos.filter((p) => p.status === "pago").length;

  return (
    <AppShell pageTitle="Dashboard">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-[#FAFAFA]">Dashboard</h1>
        <p className="text-sm text-[#A1A1AA] mt-1">
          {competenciaAtual
            ? `Competência: ${formatCompetencia(competenciaAtual.mes, competenciaAtual.ano)}`
            : "Nenhuma competência ativa"}
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
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
      <div className="grid lg:grid-cols-2 gap-3 mb-6">
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
            <div className="mt-3 space-y-3">
              {/* Barra de progresso do fluxo */}
              {[
                { label: "Fatura", done: !!fatura },
                { label: "Leituras", done: (leituras?.length ?? 0) >= 2 },
                { label: "Rateio", done: (rateios?.length ?? 0) > 0 },
                { label: "Fechada", done: competenciaAtual.status === "fechada" },
              ].map((step) => (
                <div key={step.label} className="flex items-center gap-2.5">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${step.done ? "bg-[#22C55E]" : "bg-[#2A2A2A]"}`} />
                  <span className={`text-xs ${step.done ? "text-[#A1A1AA]" : "text-[#3A3A3A]"}`}>
                    {step.label}
                  </span>
                  {step.done && (
                    <Check size={10} className="text-[#22C55E] ml-auto" />
                  )}
                </div>
              ))}

              <Link
                href={`/competencias/${competenciaAtual.id}`}
                className="block mt-4 text-xs text-[#3B82F6] hover:text-[#2563EB] transition-colors"
              >
                Ver detalhes →
              </Link>
            </div>
          ) : (
            <div className="mt-3">
              <p className="text-xs text-[#52525B]">
                Nenhuma competência criada ainda.
              </p>
              <Link
                href="/competencias"
                className="block mt-3 text-xs text-[#3B82F6] hover:text-[#2563EB] transition-colors"
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
            <div className="mt-2">
              {rateios.map((r) => {
                const pagamento = (r.pagamento as Array<{ status: string }>)?.[0];
                const pago = pagamento?.status === "pago";
                return (
                  <div
                    key={r.id}
                    className="flex items-center justify-between py-2.5 border-b border-[#1A1A1A] last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${pago ? "bg-[#22C55E]" : "bg-[#EAB308]"}`} />
                      <span className="text-xs text-[#A1A1AA]">
                        {(r.residencia as { nome: string })?.nome}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#FAFAFA]">
                      {formatCurrency(Number(r.valor_total))}
                    </span>
                  </div>
                );
              })}

              {/* Total */}
              <div className="flex items-center justify-between pt-3 mt-1">
                <span className="text-xs text-[#52525B] font-medium">Total</span>
                <span className="text-sm font-mono text-[#FAFAFA] font-semibold">
                  {formatCurrency(rateios.reduce((acc, r) => acc + Number(r.valor_total), 0))}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#52525B] mt-3">
              {competenciaAtual ? "Rateio ainda não calculado." : "Nenhum dado disponível."}
            </p>
          )}
        </Card>
      </div>

      {/* Histórico de competências */}
      <Card>
        <CardHeader
          title="Histórico"
          subtitle="Últimas competências"
          action={
            <Link href="/competencias" className="text-xs text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors">
              Ver todas
            </Link>
          }
        />

        {competencias && competencias.length > 0 ? (
          <div className="mt-2">
            {competencias.map((c) => (
              <Link
                key={c.id}
                href={`/competencias/${c.id}`}
                className="flex items-center justify-between py-2.5 border-b border-[#1A1A1A] last:border-0 hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-2.5">
                  <CalendarDays size={13} className="text-[#52525B]" />
                  <span className="text-xs text-[#A1A1AA]">
                    {formatCompetencia(c.mes, c.ano)}
                  </span>
                </div>
                <StatusBadge status={c.status} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-16 text-xs text-[#52525B]">
            Nenhuma competência registrada.
          </div>
        )}
      </Card>
    </AppShell>
  );
}
