import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader } from "@/components/ui/Card";
import { LogoutButton } from "@/components/layout/LogoutButton";

export default function ConfiguracoesPage() {
  return (
    <AppShell pageTitle="Configurações">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-[#FAFAFA]">Configurações</h1>
        <p className="text-sm text-[#A1A1AA] mt-1">
          Configurações do sistema
        </p>
      </div>

      <Card>
        <CardHeader
          title="Sistema"
          subtitle="612 — Gestão residencial de energia"
        />
        <div className="space-y-3 mt-2">
          <div className="flex items-center justify-between py-2 border-b border-[#1A1A1A]">
            <span className="text-xs text-[#A1A1AA]">Versão</span>
            <span className="text-xs font-mono text-[#71717A]">0.1.0</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-[#1A1A1A]">
            <span className="text-xs text-[#A1A1AA]">Supabase</span>
            <span className="text-xs font-mono text-[#71717A]">Não configurado</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-xs text-[#A1A1AA]">Residências</span>
            <span className="text-xs font-mono text-[#71717A]">3 cadastradas</span>
          </div>
        </div>
      </Card>

      <Card className="mt-4 lg:hidden">
        <CardHeader
          title="Sessão"
          subtitle="Encerrar acesso neste dispositivo"
        />
        <LogoutButton />
      </Card>
    </AppShell>
  );
}
