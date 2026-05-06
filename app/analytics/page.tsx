import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader } from "@/components/ui/Card";

export default function AnalyticsPage() {
  return (
    <AppShell pageTitle="Analytics">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-[#FAFAFA]">Analytics</h1>
        <p className="text-sm text-[#A1A1AA] mt-1">
          Histórico de consumo e tendências
        </p>
      </div>

      <div className="grid gap-3">
        <Card>
          <CardHeader
            title="Consumo mensal"
            subtitle="kWh por competência"
          />
          <div className="flex items-center justify-center h-48 text-xs text-[#52525B]">
            Dados insuficientes para exibir gráfico.
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Custo por residência"
            subtitle="R$ por competência"
          />
          <div className="flex items-center justify-center h-48 text-xs text-[#52525B]">
            Dados insuficientes para exibir gráfico.
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
