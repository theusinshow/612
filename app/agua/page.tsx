import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { createClient } from "@/lib/supabase/server";
import { formatCompetencia, formatCurrency } from "@/lib/utils";
import type { ContaAgua, ContaAguaStatus, Residencia } from "@/types";
import { CalendarDays, Droplets, FileText, Home, UserRound } from "lucide-react";
import { NovaContaAguaModal } from "./NovaContaAguaModal";

type ContaAguaComResidencia = ContaAgua & {
  residencia: Residencia | null;
};

const RESPONSAVEL_LABEL: Record<ContaAgua["responsavel_pagamento"], string> = {
  matheus: "Matheus",
  irmao: "Irmão",
};

function statusEfetivo(conta: ContaAgua): ContaAguaStatus {
  if (conta.status === "pago") return "pago";
  if (!conta.vencimento) return conta.status;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const vencimento = new Date(`${conta.vencimento}T00:00:00`);

  return vencimento < hoje ? "vencida" : conta.status;
}

function dataPtBR(data: string | null) {
  return data ? new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR") : "Sem data";
}

export default async function AguaPage() {
  const supabase = await createClient();
  const hoje = new Date();
  const mesAtual = hoje.getMonth() + 1;
  const anoAtual = hoje.getFullYear();

  const { data: residencias } = await supabase
    .from("residencias")
    .select("id, nome")
    .eq("status", "ativa")
    .order("nome", { ascending: true });

  const { data: contas } = await supabase
    .from("contas_agua")
    .select("*, residencia:residencias(id, nome, tipo, status, responsavel_nome, created_at)")
    .order("ano", { ascending: false })
    .order("mes", { ascending: false })
    .order("created_at", { ascending: false });

  const contasAgua = (contas ?? []) as unknown as ContaAguaComResidencia[];
  const contasDoMes = contasAgua.filter(
    (conta) => conta.mes === mesAtual && conta.ano === anoAtual
  );
  const contasMatheus = contasDoMes.filter(
    (conta) => conta.responsavel_pagamento === "matheus"
  );
  const contasIrmao = contasDoMes.filter(
    (conta) => conta.responsavel_pagamento === "irmao"
  );
  const pendentes = contasDoMes.filter((conta) => statusEfetivo(conta) !== "pago");
  const vencidas = contasDoMes.filter((conta) => statusEfetivo(conta) === "vencida");
  const totalMes = contasDoMes.reduce((acc, conta) => acc + Number(conta.valor), 0);
  const totalMatheus = contasMatheus.reduce((acc, conta) => acc + Number(conta.valor), 0);
  const totalIrmao = contasIrmao.reduce((acc, conta) => acc + Number(conta.valor), 0);

  const latestPorResidencia = new Map<string, ContaAguaComResidencia>();
  const matriculasPorResidencia: Record<string, string> = {};

  for (const conta of contasAgua) {
    if (!latestPorResidencia.has(conta.residencia_id)) {
      latestPorResidencia.set(conta.residencia_id, conta);
    }

    if (!matriculasPorResidencia[conta.residencia_id]) {
      matriculasPorResidencia[conta.residencia_id] = conta.matricula;
    }
  }

  return (
    <AppShell pageTitle="Água">
      <div className="flex items-start justify-between flex-wrap gap-3 mb-10">
        <div>
          <h1 className="text-xl font-semibold text-[#FAFAFA]">Água</h1>
          <p className="text-sm text-[#A1A1AA] mt-1">
            Três talões independentes por matrícula
          </p>
        </div>
        <NovaContaAguaModal
          residencias={residencias ?? []}
          matriculasPorResidencia={matriculasPorResidencia}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Total do mês"
          value={formatCurrency(totalMes)}
          sub={formatCompetencia(mesAtual, anoAtual)}
          icon={Droplets}
        />
        <MetricCard
          label="Matheus"
          value={formatCurrency(totalMatheus)}
          sub={`${contasMatheus.length} ${contasMatheus.length === 1 ? "talão" : "talões"}`}
          icon={UserRound}
        />
        <MetricCard
          label="Irmão"
          value={formatCurrency(totalIrmao)}
          sub={`${contasIrmao.length} ${contasIrmao.length === 1 ? "talão" : "talões"}`}
          icon={UserRound}
        />
        <MetricCard
          label="Pendências"
          value={`${pendentes.length}`}
          sub={vencidas.length > 0 ? `${vencidas.length} vencida(s)` : "Dentro do controle"}
          icon={CalendarDays}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        {(residencias ?? []).map((residencia) => {
          const conta = latestPorResidencia.get(residencia.id);
          const status = conta ? statusEfetivo(conta) : null;

          return (
            <Card key={residencia.id} className="min-h-[178px]">
              <CardHeader
                title={residencia.nome}
                subtitle={conta ? `Matrícula ${conta.matricula}` : "Sem matrícula cadastrada"}
                action={status ? <StatusBadge status={status} /> : undefined}
              />

              {conta ? (
                <div className="space-y-3">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-[#71717A]">Último talão</p>
                      <p className="text-sm text-[#FAFAFA] mt-0.5">
                        {formatCompetencia(conta.mes, conta.ano)}
                      </p>
                    </div>
                    <p className="font-mono text-lg font-semibold text-[#FAFAFA]">
                      {formatCurrency(conta.valor)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 border-t border-[#1A1A1A] pt-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#71717A]">
                        Responsável
                      </p>
                      <p className="text-xs text-[#A1A1AA] mt-1">
                        {RESPONSAVEL_LABEL[conta.responsavel_pagamento]}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#71717A]">
                        Vencimento
                      </p>
                      <p className="text-xs text-[#A1A1AA] mt-1">
                        {dataPtBR(conta.vencimento)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-[#71717A]">
                  <Home size={13} />
                  Cadastre o primeiro talão desta casa.
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader
          title="Histórico de talões"
          subtitle="Contas cadastradas por casa e matrícula"
        />

        {contasAgua.length > 0 ? (
          <div className="flex flex-col">
            {contasAgua.map((conta) => {
              const status = statusEfetivo(conta);
              return (
                <div
                  key={conta.id}
                  className="flex items-start justify-between gap-3 py-3.5 border-b border-[#1A1A1A] last:border-0"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[6px] bg-[#1A1A1A]">
                      <Droplets size={14} className="text-[#A1A1AA]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-[#FAFAFA]">
                          {conta.residencia?.nome ?? "Casa"}
                        </p>
                        <StatusBadge status={status} />
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-[#71717A]">
                          {formatCompetencia(conta.mes, conta.ano)}
                        </span>
                        <span className="text-xs text-[#71717A]">·</span>
                        <span className="text-xs text-[#71717A]">
                          Matrícula {conta.matricula}
                        </span>
                        <span className="text-xs text-[#71717A]">·</span>
                        <span className="text-xs text-[#71717A]">
                          {RESPONSAVEL_LABEL[conta.responsavel_pagamento]}
                        </span>
                        {conta.arquivo_url && (
                          <>
                            <span className="text-xs text-[#71717A]">·</span>
                            <a
                              href={conta.arquivo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-[#3B82F6] hover:text-[#60A5FA] focus-ring"
                            >
                              <FileText size={11} />
                              Arquivo
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-mono text-[#FAFAFA]">
                      {formatCurrency(conta.valor)}
                    </p>
                    <p className="text-xs text-[#71717A] mt-1">
                      {status === "pago"
                        ? `Pago ${dataPtBR(conta.data_pagamento)}`
                        : `Vence ${dataPtBR(conta.vencimento)}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-24 text-xs text-[#71717A]">
            Nenhuma conta de água cadastrada.
          </div>
        )}
      </Card>
    </AppShell>
  );
}
