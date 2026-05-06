import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader } from "@/components/ui/Card";

export default function CompetenciasPage() {
  return (
    <AppShell pageTitle="Competências">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-[#FAFAFA]">Competências</h1>
        <p className="text-sm text-[#A1A1AA] mt-1">
          Gestão dos ciclos mensais de energia
        </p>
      </div>

      <Card>
        <CardHeader
          title="Competências"
          subtitle="Ciclos mensais registrados"
        />
        <div className="flex items-center justify-center h-32 text-xs text-[#52525B]">
          Nenhuma competência registrada.
        </div>
      </Card>
    </AppShell>
  );
}
