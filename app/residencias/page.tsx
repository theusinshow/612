import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { createClient } from "@/lib/supabase/server";
import { EditarResponsavelForm } from "./EditarResponsavelForm";

const TIPO_LABEL: Record<string, string> = {
  terrea: "Calculada automaticamente",
  andar: "Medidor acumulativo",
};

export default async function ResidenciasPage() {
  const supabase = await createClient();

  const { data: residencias } = await supabase
    .from("residencias")
    .select("*")
    .order("nome", { ascending: true });

  return (
    <AppShell pageTitle="Residências">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-[#FAFAFA]">Residências</h1>
        <p className="text-sm text-[#A1A1AA] mt-1">
          Unidades residenciais cadastradas
        </p>
      </div>

      <div className="grid gap-3">
        {(residencias ?? []).map((r) => (
          <Card key={r.id}>
            <CardHeader
              title={r.nome}
              subtitle={TIPO_LABEL[r.tipo] ?? r.tipo}
              action={<StatusBadge status={r.status} />}
            />
            <EditarResponsavelForm
              residenciaId={r.id}
              responsavelAtual={r.responsavel_nome}
            />
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
