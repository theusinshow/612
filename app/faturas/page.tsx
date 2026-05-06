import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader } from "@/components/ui/Card";

export default function FaturasPage() {
  return (
    <AppShell pageTitle="Faturas">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-[#FAFAFA]">Faturas</h1>
        <p className="text-sm text-[#A1A1AA] mt-1">
          Faturas Celesc por competência
        </p>
      </div>

      <Card>
        <CardHeader
          title="Faturas"
          subtitle="PDFs e dados das faturas Celesc"
        />
        <div className="flex items-center justify-center h-32 text-xs text-[#52525B]">
          Nenhuma fatura registrada.
        </div>
      </Card>
    </AppShell>
  );
}
