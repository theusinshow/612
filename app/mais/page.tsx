import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  ReceiptText,
  Settings,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader } from "@/components/ui/Card";

const sections = [
  {
    title: "Luz",
    subtitle: "Rotinas mensais e análise das contas de energia",
    links: [
      { href: "/competencias", label: "Competências", icon: CalendarDays },
      { href: "/faturas", label: "Faturas", icon: ReceiptText },
      { href: "/analytics", label: "Relatórios", icon: BarChart3 },
    ],
  },
  {
    title: "Sistema",
    subtitle: "Preferências e ajustes do aplicativo",
    links: [{ href: "/configuracoes", label: "Configurações", icon: Settings }],
  },
];

export default function MaisPage() {
  return (
    <AppShell pageTitle="Mais">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-[#FAFAFA]">Mais</h1>
        <p className="mt-1 text-sm text-[#A1A1AA]">
          Atalhos de apoio separados por área.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader title={section.title} subtitle={section.subtitle} />
            <div className="grid gap-2">
              {section.links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex min-h-[48px] items-center gap-3 rounded-[6px] border border-[#1F1F1F] bg-[#151515] px-3 text-sm text-[#FAFAFA] transition-colors hover:border-[#2A2A2A] hover:bg-[#1A1A1A] focus-ring"
                >
                  <Icon size={16} className="text-[#71717A]" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
