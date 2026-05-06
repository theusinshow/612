import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { createClient } from "@/lib/supabase/server";
import { formatCompetencia } from "@/lib/utils";
import { notFound } from "next/navigation";
import { CalendarDays, Receipt, Zap, Home } from "lucide-react";
import Link from "next/link";
import { AdicionarFaturaModal } from "./AdicionarFaturaModal";
import { RegistrarLeiturasModal } from "./RegistrarLeiturasModal";
import { CalcularRateioButton } from "./CalcularRateioButton";
import { PagamentoCard } from "./PagamentoCard";
import { FecharCompetenciaButton } from "./FecharCompetenciaButton";
import { garantirPagamentos } from "./actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CompetenciaPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: competencia } = await supabase
    .from("competencias")
    .select("*")
    .eq("id", id)
    .single();

  if (!competencia) notFound();

  const { data: fatura } = await supabase
    .from("faturas")
    .select("*")
    .eq("competencia_id", id)
    .single();

  const { data: leituras } = await supabase
    .from("leituras")
    .select("*, residencia:residencias(nome, tipo)")
    .eq("competencia_id", id);

  const { data: rateios } = await supabase
    .from("rateios")
    .select("*, residencia:residencias(nome, tipo), pagamento:pagamentos(*)")
    .eq("competencia_id", id);

  // Residências com medidor (excluir térrea — calculada automaticamente)
  const { data: residenciasComMedidor } = await supabase
    .from("residencias")
    .select("id, nome")
    .eq("tipo", "andar")
    .eq("status", "ativa");

  // Garante que pagamentos existem para todos os rateios
  if (rateios && rateios.length > 0) {
    const temPagamentos = rateios.some(
      (r) => (r.pagamento as unknown[])?.length > 0
    );
    if (!temPagamentos) await garantirPagamentos(id);
  }

  const label = formatCompetencia(competencia.mes, competencia.ano);
  const aberta = competencia.status === "aberta";
  const podeCalcular = aberta && !!fatura && (leituras?.length ?? 0) >= 2;
  const podeFechar = aberta && !!fatura && (leituras?.length ?? 0) >= 2 && (rateios?.length ?? 0) > 0;

  return (
    <AppShell pageTitle={label}>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-semibold text-[#FAFAFA]">{label}</h1>
            <StatusBadge status={competencia.status} />
          </div>
          <p className="text-sm text-[#A1A1AA]">
            {competencia.closed_at
              ? `Fechada em ${new Date(competencia.closed_at).toLocaleDateString("pt-BR")}`
              : `Criada em ${new Date(competencia.created_at).toLocaleDateString("pt-BR")}`}
          </p>
        </div>
        {aberta && (
          <FecharCompetenciaButton
            competenciaId={id}
            label={label}
            disabled={!podeFechar}
            disabledReason={
              !fatura ? "Cadastre a fatura primeiro" :
              (leituras?.length ?? 0) < 2 ? "Registre as leituras primeiro" :
              (rateios?.length ?? 0) === 0 ? "Calcule o rateio primeiro" :
              undefined
            }
          />
        )}
      </div>

      {/* Progresso do fluxo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StepCard icon={Receipt} label="Fatura" done={!!fatura} value={fatura ? "Cadastrada" : "Pendente"} />
        <StepCard icon={Zap} label="Leituras" done={(leituras?.length ?? 0) >= 2} value={`${leituras?.length ?? 0} de 2`} />
        <StepCard icon={Home} label="Rateio" done={(rateios?.length ?? 0) > 0} value={(rateios?.length ?? 0) > 0 ? "Calculado" : "Pendente"} />
        <StepCard icon={CalendarDays} label="Status" done={competencia.status === "fechada"} value={competencia.status === "fechada" ? "Fechada" : "Aberta"} />
      </div>

      {/* Fatura */}
      <Card className="mb-3">
        <CardHeader
          title="Fatura Celesc"
          subtitle="Dados da fatura do mês"
          action={
            aberta ? (
              <AdicionarFaturaModal
                competenciaId={id}
                faturaExistente={fatura}
              />
            ) : undefined
          }
        />
        {fatura ? (
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div>
              <p className="text-xs text-[#52525B]">Valor total</p>
              <p className="text-sm font-mono text-[#FAFAFA] mt-0.5">
                R$ {Number(fatura.valor_total).toFixed(2).replace(".", ",")}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#52525B]">Consumo</p>
              <p className="text-sm font-mono text-[#FAFAFA] mt-0.5">
                {fatura.consumo_total_kwh} kWh
              </p>
            </div>
            <div>
              <p className="text-xs text-[#52525B]">COSIP</p>
              <p className="text-sm font-mono text-[#FAFAFA] mt-0.5">
                R$ {Number(fatura.cosip).toFixed(2).replace(".", ",")}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-[#52525B] mt-2">
            Nenhuma fatura cadastrada ainda.
          </p>
        )}
      </Card>

      {/* Leituras */}
      <Card className="mb-3">
        <CardHeader
          title="Leituras"
          subtitle="Medidores — Res. 2 e Res. 3 (térrea calculada automaticamente)"
          action={
            aberta ? (
              <RegistrarLeiturasModal
                competenciaId={id}
                residencias={residenciasComMedidor ?? []}
              />
            ) : undefined
          }
        />
        {leituras && leituras.length > 0 ? (
          <div className="flex flex-col gap-0 mt-2">
            {leituras.map((l) => (
              <div
                key={l.id}
                className="flex items-center justify-between py-2.5 border-b border-[#1A1A1A] last:border-0"
              >
                <span className="text-xs text-[#A1A1AA]">
                  {(l.residencia as { nome: string })?.nome}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-[#52525B]">
                    {l.leitura_anterior} → {l.leitura_atual}
                  </span>
                  <span className="text-xs font-mono text-[#FAFAFA]">
                    {l.consumo_calculado} kWh
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#52525B] mt-2">
            Nenhuma leitura registrada ainda.
          </p>
        )}
      </Card>

      {/* Rateio + Pagamentos */}
      <Card>
        <CardHeader
          title="Rateio e pagamentos"
          subtitle="Valor por residência"
          action={
            aberta ? (
              <CalcularRateioButton
                competenciaId={id}
                disabled={!podeCalcular}
                disabledReason={
                  !fatura ? "Cadastre a fatura primeiro" :
                  (leituras?.length ?? 0) < 2 ? "Registre as leituras primeiro" :
                  undefined
                }
              />
            ) : undefined
          }
        />
        {rateios && rateios.length > 0 ? (
          <div className="mt-3 flex flex-col gap-3">
            {rateios.map((r) => {
              const residencia = r.residencia as { nome: string; tipo: string };
              const pagamento = (r.pagamento as unknown as Array<{
                id: string;
                status: string;
                valor_pago: string | null;
                data_pagamento: string | null;
              }>)?.[0];
              const temMedidor = residencia?.tipo === "andar";

              return (
                <div
                  key={r.id}
                  className="bg-[#151515] border border-[#1F1F1F] rounded-[6px] p-3 flex flex-col gap-3"
                >
                  {/* Nome + valor */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#FAFAFA]">{residencia?.nome}</span>
                    <span className="text-sm font-mono text-[#FAFAFA]">
                      R$ {Number(r.valor_total).toFixed(2).replace(".", ",")}
                    </span>
                  </div>

                  {/* Botões de ação */}
                  <div className="flex items-center gap-2">
                    {/* Pagamento */}
                    {pagamento ? (
                      <PagamentoCard
                        competenciaId={id}
                        pagamento={pagamento}
                        residenciaNome={residencia?.nome}
                        valorTotal={r.valor_total}
                      />
                    ) : (
                      <span className="text-xs text-[#52525B]">Sem registro de pagamento</span>
                    )}

                    {/* Mini fatura */}
                    {temMedidor && (
                      <Link
                        href={`/competencias/${id}/mini-fatura/${r.residencia_id}`}
                        className="ml-auto flex items-center gap-1.5 bg-[#1A1A1A] border border-[#1F1F1F] text-xs text-[#A1A1AA] px-2.5 py-1.5 rounded-[6px] hover:text-[#FAFAFA] hover:border-[#2A2A2A] transition-colors whitespace-nowrap"
                      >
                        Mini fatura
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-[#52525B] mt-2">
            Rateio ainda não calculado.
          </p>
        )}
      </Card>
    </AppShell>
  );
}

function StepCard({
  icon: Icon,
  label,
  done,
  value,
}: {
  icon: React.ElementType;
  label: string;
  done: boolean;
  value: string;
}) {
  return (
    <div className="bg-[#111111] border border-[#1F1F1F] rounded-[8px] p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Icon size={14} className={done ? "text-[#22C55E]" : "text-[#52525B]"} />
        <span className={`w-1.5 h-1.5 rounded-full ${done ? "bg-[#22C55E]" : "bg-[#2A2A2A]"}`} />
      </div>
      <div>
        <p className="text-[10px] text-[#52525B] font-medium">{label}</p>
        <p className="text-xs text-[#FAFAFA] mt-0.5">{value}</p>
      </div>
    </div>
  );
}
