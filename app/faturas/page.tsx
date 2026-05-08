import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { createClient } from "@/lib/supabase/server";
import { formatCompetencia, formatCurrency, formatKwh } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Receipt, FileText, DollarSign, Zap } from "lucide-react";
import Link from "next/link";

export default async function FaturasPage() {
  const supabase = await createClient();

  const { data: competencias } = await supabase
    .from("competencias")
    .select("id, mes, ano, status")
    .order("ano", { ascending: false })
    .order("mes", { ascending: false });

  const competenciaIds = (competencias ?? []).map((c) => c.id);

  const { data: faturas } = competenciaIds.length > 0
    ? await supabase
        .from("faturas")
        .select("*")
        .in("competencia_id", competenciaIds)
    : { data: [] };

  const competenciaMap = new Map(
    (competencias ?? []).map((c) => [c.id, c])
  );

  const faturasComComp = (faturas ?? [])
    .map((f) => ({ ...f, competencia: competenciaMap.get(f.competencia_id) }))
    .filter((f) => f.competencia)
    .sort((a, b) => {
      const ca = a.competencia!;
      const cb = b.competencia!;
      return cb.ano !== ca.ano ? cb.ano - ca.ano : cb.mes - ca.mes;
    });

  return (
    <AppShell pageTitle="Faturas">
      <div className="mb-10">
        <h1 className="text-xl font-semibold text-[#FAFAFA]">Faturas</h1>
        <p className="text-sm text-[#A1A1AA] mt-1">
          Faturas Celesc por competência
        </p>
      </div>

      {faturasComComp.length === 0 ? (
        <Card>
          <CardHeader
            title="Faturas"
            subtitle="PDFs e dados das faturas Celesc"
          />
          <div className="flex items-center justify-center h-32 text-xs text-[#71717A]">
            Nenhuma fatura registrada.
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {/* Resumo */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              label="Total de faturas"
              value={`${faturasComComp.length}`}
              sub="competências"
              icon={Receipt}
            />
            <MetricCard
              label="Total acumulado"
              value={formatCurrency(
                faturasComComp.reduce((acc, f) => acc + Number(f.valor_total), 0)
              )}
              sub="em faturas Celesc"
              icon={DollarSign}
            />
            <MetricCard
              label="Consumo total"
              value={formatKwh(
                faturasComComp.reduce((acc, f) => acc + Number(f.consumo_total_kwh), 0)
              )}
              sub="acumulado"
              icon={Zap}
            />
          </div>

          {/* Lista */}
          <Card>
            <CardHeader
              title="Todas as faturas"
              subtitle="Histórico completo"
            />
            <div className="flex flex-col">
              {faturasComComp.map((f) => {
                const comp = f.competencia!;
                const label = formatCompetencia(comp.mes, comp.ano);
                const vencimento = f.vencimento
                  ? new Date(f.vencimento + "T00:00:00").toLocaleDateString("pt-BR")
                  : null;

                return (
                  <Link
                    key={f.id}
                    href={`/competencias/${f.competencia_id}`}
                    className="flex items-start justify-between py-3.5 border-b border-[#1A1A1A] last:border-0 hover:bg-[#151515] transition-colors gap-3 -mx-5 px-5 rounded-[4px]"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="mt-0.5 flex-shrink-0">
                        <Receipt size={14} className="text-[#71717A]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-[#FAFAFA] font-medium">{label}</span>
                          <StatusBadge status={comp.status} />
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-xs text-[#71717A]">
                            {formatKwh(Number(f.consumo_total_kwh))}
                          </span>
                          <span className="text-xs text-[#52525B]">·</span>
                          <span className="text-xs text-[#71717A]">
                            COSIP {formatCurrency(Number(f.cosip))}
                          </span>
                          {vencimento && (
                            <>
                              <span className="text-xs text-[#52525B]">·</span>
                              <span className="text-xs text-[#71717A]">
                                Vence {vencimento}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {f.arquivo_pdf_url && (
                        <FileText size={12} className="text-[#3B82F6]" />
                      )}
                      <span className="text-sm font-mono text-[#FAFAFA]">
                        {formatCurrency(Number(f.valor_total))}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
