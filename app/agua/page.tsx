import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { createClient } from "@/lib/supabase/server";
import { formatCompetencia, formatCurrency } from "@/lib/utils";
import type { ContaAgua, ContaAguaStatus, Residencia } from "@/types";
import { CalendarDays, Droplets, FileText, UserRound } from "lucide-react";
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

  const residenciasAtivas = residencias ?? [];
  const matriculasPorResidencia: Record<string, string> = {};
  const gruposPorMes = new Map<string, ContaAguaComResidencia[]>();

  for (const conta of contasAgua) {
    if (!matriculasPorResidencia[conta.residencia_id]) {
      matriculasPorResidencia[conta.residencia_id] = conta.matricula;
    }

    const chave = `${conta.ano}-${String(conta.mes).padStart(2, "0")}`;
    gruposPorMes.set(chave, [...(gruposPorMes.get(chave) ?? []), conta]);
  }

  const meses = Array.from(gruposPorMes.entries()).sort(([a], [b]) =>
    b.localeCompare(a)
  );

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
          residencias={residenciasAtivas}
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

      <div className="grid gap-4">
        {meses.length > 0 ? (
          meses.map(([chave, contasDoGrupo]) => {
            const [ano, mes] = chave.split("-").map(Number);
            const totalGrupo = contasDoGrupo.reduce(
              (acc, conta) => acc + Number(conta.valor),
              0
            );
            const pagasGrupo = contasDoGrupo.filter(
              (conta) => statusEfetivo(conta) === "pago"
            ).length;
            const vencidasGrupo = contasDoGrupo.filter(
              (conta) => statusEfetivo(conta) === "vencida"
            ).length;

            return (
              <Card key={chave}>
                <CardHeader
                  title={formatCompetencia(mes, ano)}
                  subtitle={`${contasDoGrupo.length} de ${residenciasAtivas.length} talões cadastrados`}
                  action={
                    <div className="text-right">
                      <p className="text-sm font-mono font-semibold text-[#FAFAFA]">
                        {formatCurrency(totalGrupo)}
                      </p>
                      <p className="text-[10px] text-[#71717A] mt-0.5">
                        {pagasGrupo} pago(s)
                        {vencidasGrupo > 0 ? ` · ${vencidasGrupo} vencida(s)` : ""}
                      </p>
                    </div>
                  }
                />

                <div className="overflow-x-auto rounded-[6px] border border-[#1F1F1F]">
                  <table className="w-full min-w-[840px] border-collapse text-left">
                    <thead className="bg-[#111111]">
                      <tr className="border-b border-[#1F1F1F]">
                        <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                          Casa
                        </th>
                        <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                          Matrícula
                        </th>
                        <th className="px-3 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                          Valor
                        </th>
                        <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                          Responsável
                        </th>
                        <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                          Vencimento
                        </th>
                        <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                          Status
                        </th>
                        <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                          Marcação
                        </th>
                        <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                          Arquivo
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {residenciasAtivas.map((residencia) => {
                        const conta = contasDoGrupo.find(
                          (item) => item.residencia_id === residencia.id
                        );
                        const status = conta ? statusEfetivo(conta) : null;

                        return (
                          <tr
                            key={residencia.id}
                            className="border-b border-[#1F1F1F] bg-[#151515] last:border-b-0"
                          >
                            <td className="px-3 py-3 text-sm font-medium text-[#FAFAFA]">
                              {residencia.nome}
                            </td>
                            <td className="px-3 py-3 text-xs text-[#A1A1AA]">
                              {conta ? conta.matricula : "Sem talão"}
                            </td>
                            <td className="px-3 py-3 text-right font-mono text-sm font-semibold text-[#FAFAFA]">
                              {conta ? formatCurrency(conta.valor) : "-"}
                            </td>
                            <td className="px-3 py-3 text-xs text-[#A1A1AA]">
                              {conta
                                ? RESPONSAVEL_LABEL[conta.responsavel_pagamento]
                                : "-"}
                            </td>
                            <td className="px-3 py-3 text-xs text-[#A1A1AA]">
                              {conta ? dataPtBR(conta.vencimento) : "-"}
                            </td>
                            <td className="px-3 py-3">
                              {status ? (
                                <StatusBadge status={status} />
                              ) : (
                                <span className="inline-flex rounded-[4px] border border-[#2A2A2A] px-2.5 py-1 text-[11px] font-medium text-[#71717A]">
                                  Sem talão
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-3 text-xs text-[#A1A1AA]">
                              {conta
                                ? status === "pago"
                                  ? `Pago ${dataPtBR(conta.data_pagamento)}`
                                  : "Aguardando baixa"
                                : "Cadastrar este ID"}
                            </td>
                            <td className="px-3 py-3">
                              {conta?.arquivo_url ? (
                                <a
                                  href={conta.arquivo_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs text-[#3B82F6] hover:text-[#60A5FA] focus-ring"
                                >
                                  <FileText size={12} />
                                  Ver talão
                                </a>
                              ) : (
                                <span className="text-xs text-[#71717A]">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardHeader
              title="Talões por mês"
              subtitle="Cada mês mostrará as 3 matrículas"
            />
          <div className="flex items-center justify-center h-24 text-xs text-[#71717A]">
            Nenhuma conta de água cadastrada.
          </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
