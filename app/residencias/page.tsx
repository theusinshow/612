import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";

const residencias = [
  { nome: "Térrea", tipo: "Calculada automaticamente", status: "ativa" as const },
  { nome: "Residência 2", tipo: "Medidor acumulativo", status: "ativa" as const },
  { nome: "Residência 3", tipo: "Medidor acumulativo", status: "ativa" as const },
];

export default function ResidenciasPage() {
  return (
    <AppShell pageTitle="Residências">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-[#FAFAFA]">Residências</h1>
        <p className="text-sm text-[#A1A1AA] mt-1">
          Unidades residenciais cadastradas
        </p>
      </div>

      <div className="grid gap-3">
        {residencias.map((r) => (
          <Card key={r.nome}>
            <CardHeader
              title={r.nome}
              subtitle={r.tipo}
              action={<StatusBadge status={r.status} />}
            />
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
