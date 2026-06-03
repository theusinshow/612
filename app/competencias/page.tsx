import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { NovaCompetenciaModal } from "./NovaCompetenciaModal";
import { createClient } from "@/lib/supabase/server";
import { formatCompetencia } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import Link from "next/link";

export default async function CompetenciasPage() {
  const supabase = await createClient();

  const { data: competencias } = await supabase
    .from("competencias")
    .select("*")
    .order("ano", { ascending: false })
    .order("mes", { ascending: false });

  return (
    <AppShell pageTitle="Competências">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-xl font-semibold text-[#FAFAFA]">Competências</h1>
          <p className="text-sm text-[#A1A1AA] mt-1">
            Ciclos mensais de energia
          </p>
        </div>
        <NovaCompetenciaModal />
      </div>

      {/* Lista */}
      {!competencias || competencias.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 gap-3">
          <CalendarDays size={32} className="text-[#2A2A2A]" />
          <p className="text-sm text-[#71717A]">Nenhuma competência criada.</p>
          <p className="text-xs text-[#71717A]">
            Clique em &quot;Nova competência&quot; para começar.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {competencias.map((c) => (
            <Link key={c.id} href={`/competencias/${c.id}`} className="focus-ring rounded-[8px]">
              <Card className="flex items-center justify-between hover:bg-[#151515] hover:border-[#2A2A2A] transition-colors duration-150 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-[#1A1A1A] rounded-[6px]">
                    <CalendarDays size={15} className="text-[#A1A1AA]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#FAFAFA]">
                      {formatCompetencia(c.mes, c.ano)}
                    </p>
                    <p className="text-xs text-[#71717A] mt-0.5">
                      Criada em {new Date(c.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
