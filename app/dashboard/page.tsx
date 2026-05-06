import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Zap, Receipt, Home, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <AppShell pageTitle="Dashboard">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-[#FAFAFA]">Dashboard</h1>
        <p className="text-sm text-[#A1A1AA] mt-1">
          Visão geral da competência atual
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <MetricCard
          label="Consumo total"
          value="— kWh"
          sub="Aguardando leituras"
          icon={Zap}
        />
        <MetricCard
          label="Valor da fatura"
          value="R$ —"
          sub="Aguardando fatura"
          icon={Receipt}
        />
        <MetricCard
          label="Residências"
          value="3"
          sub="Térrea + 2 andares"
          icon={Home}
        />
        <MetricCard
          label="Histórico"
          value="0 meses"
          sub="Nenhuma competência"
          icon={TrendingUp}
        />
      </div>

      {/* Competência atual */}
      <div className="grid lg:grid-cols-2 gap-3 mb-6">
        <Card>
          <CardHeader
            title="Competência atual"
            subtitle="Nenhuma competência aberta"
          />
          <div className="flex items-center gap-2 mt-2">
            <StatusBadge status="aberta" />
            <span className="text-xs text-[#52525B]">—</span>
          </div>
          <p className="text-xs text-[#52525B] mt-4">
            Crie uma nova competência para começar o ciclo mensal.
          </p>
        </Card>

        <Card>
          <CardHeader
            title="Rateio"
            subtitle="Distribuição por residência"
          />
          <div className="space-y-2 mt-2">
            {["Térrea", "Residência 2", "Residência 3"].map((nome) => (
              <div
                key={nome}
                className="flex items-center justify-between py-2 border-b border-[#1A1A1A] last:border-0"
              >
                <span className="text-xs text-[#A1A1AA]">{nome}</span>
                <span className="text-xs font-mono text-[#52525B]">R$ —</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Histórico de competências */}
      <Card>
        <CardHeader
          title="Competências"
          subtitle="Histórico mensal"
        />
        <div className="flex items-center justify-center h-24 text-xs text-[#52525B]">
          Nenhuma competência registrada ainda.
        </div>
      </Card>
    </AppShell>
  );
}
