import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";
import { formatCompetencia, formatCurrency } from "@/lib/utils";
import { ArrowRight, Droplets, Zap } from "lucide-react";

export default async function ServicosPage() {
  const supabase = await createClient();
  const hoje = new Date();
  const mesAtual = hoje.getMonth() + 1;
  const anoAtual = hoje.getFullYear();

  const { data: competenciaAtual } = await supabase
    .from("competencias")
    .select("id, mes, ano, status")
    .eq("status", "aberta")
    .order("ano", { ascending: false })
    .order("mes", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: faturaAtual } = competenciaAtual
    ? await supabase
        .from("faturas")
        .select("valor_total")
        .eq("competencia_id", competenciaAtual.id)
        .maybeSingle()
    : { data: null };

  const { data: contasAguaMes } = await supabase
    .from("contas_agua")
    .select("valor, status")
    .eq("mes", mesAtual)
    .eq("ano", anoAtual);

  const totalAgua = (contasAguaMes ?? []).reduce(
    (acc, conta) => acc + Number(conta.valor),
    0
  );
  const pendenciasAgua = (contasAguaMes ?? []).filter(
    (conta) => conta.status !== "pago"
  ).length;

  return (
    <AppShell pageTitle="Serviços">
      <div className="mb-10">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#71717A]">
          612
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[#FAFAFA]">
          Escolha o painel de controle
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#A1A1AA]">
          Luz mantém o fluxo de competência, leituras e rateio. Água organiza os
          três talões independentes por matrícula.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Link href="/dashboard" className="focus-ring rounded-[8px]">
          <Card className="relative min-h-[260px] overflow-hidden hover:bg-[#151515] hover:border-[#2A2A2A] transition-colors">
            <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-[8px] border border-[#3B82F6]/20 bg-[#3B82F6]/10">
              <Zap size={20} className="text-[#3B82F6]" />
            </div>
            <div className="flex min-h-[220px] flex-col justify-between pr-10">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#71717A]">
                  Energia
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-[#FAFAFA]">Luz</h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#A1A1AA]">
                  Competências, fatura Celesc, leituras, rateio e pagamentos.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-[6px] border border-[#1F1F1F] bg-[#1A1A1A] px-3 py-3">
                  <p className="text-[10px] uppercase tracking-wider text-[#71717A]">
                    Competência
                  </p>
                  <p className="mt-1 text-sm text-[#FAFAFA]">
                    {competenciaAtual
                      ? formatCompetencia(competenciaAtual.mes, competenciaAtual.ano)
                      : "Sem ciclo aberto"}
                  </p>
                </div>
                <div className="rounded-[6px] border border-[#1F1F1F] bg-[#1A1A1A] px-3 py-3">
                  <p className="text-[10px] uppercase tracking-wider text-[#71717A]">
                    Fatura
                  </p>
                  <p className="mt-1 text-sm font-mono text-[#FAFAFA]">
                    {faturaAtual ? formatCurrency(faturaAtual.valor_total) : "R$ --"}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2 text-sm text-[#3B82F6]">
              Abrir painel de luz
              <ArrowRight size={15} />
            </div>
          </Card>
        </Link>

        <Link href="/agua" className="focus-ring rounded-[8px]">
          <Card className="relative min-h-[260px] overflow-hidden hover:bg-[#151515] hover:border-[#2A2A2A] transition-colors">
            <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-[8px] border border-[#22C55E]/20 bg-[#22C55E]/10">
              <Droplets size={20} className="text-[#22C55E]" />
            </div>
            <div className="flex min-h-[220px] flex-col justify-between pr-10">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#71717A]">
                  Saneamento
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-[#FAFAFA]">Água</h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#A1A1AA]">
                  Três matrículas, três talões e responsáveis de pagamento separados.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-[6px] border border-[#1F1F1F] bg-[#1A1A1A] px-3 py-3">
                  <p className="text-[10px] uppercase tracking-wider text-[#71717A]">
                    Mês atual
                  </p>
                  <p className="mt-1 text-sm font-mono text-[#FAFAFA]">
                    {formatCurrency(totalAgua)}
                  </p>
                </div>
                <div className="rounded-[6px] border border-[#1F1F1F] bg-[#1A1A1A] px-3 py-3">
                  <p className="text-[10px] uppercase tracking-wider text-[#71717A]">
                    Pendências
                  </p>
                  <p className="mt-1 text-sm text-[#FAFAFA]">
                    {pendenciasAgua} {pendenciasAgua === 1 ? "talão" : "talões"}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2 text-sm text-[#22C55E]">
              Abrir painel de água
              <ArrowRight size={15} />
            </div>
          </Card>
        </Link>
      </div>
    </AppShell>
  );
}
