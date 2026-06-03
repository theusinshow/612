"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Home,
  ReceiptText,
  BarChart3,
  Settings,
  Zap,
  Droplets,
  PanelsTopLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "./LogoutButton";

const navGroups = [
  {
    label: "Geral",
    items: [{ href: "/servicos", label: "Serviços", icon: PanelsTopLeft }],
  },
  {
    label: "Luz",
    items: [
      { href: "/dashboard", label: "Painel de luz", icon: LayoutDashboard },
      { href: "/competencias", label: "Competências", icon: CalendarDays },
      { href: "/faturas", label: "Faturas", icon: ReceiptText },
      { href: "/analytics", label: "Relatórios", icon: BarChart3 },
    ],
  },
  {
    label: "Água",
    items: [{ href: "/agua", label: "Talões de água", icon: Droplets }],
  },
  {
    label: "Base",
    items: [{ href: "/residencias", label: "Residências", icon: Home }],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex flex-col w-56 min-h-screen bg-[#0A0A0A] border-r border-[#1F1F1F] px-3 py-6 fixed top-0 left-0 z-40"
      aria-label="Navegação principal"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <div className="flex items-center justify-center w-7 h-7 bg-[#111111] border border-[#1F1F1F] rounded-[6px]">
          <Zap size={14} className="text-[#3B82F6]" />
        </div>
        <span className="font-mono text-sm font-semibold tracking-widest text-[#FAFAFA]">
          612
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-5 flex-1">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-sm transition-colors duration-150 focus-ring",
                      "border-l-2",
                      active
                        ? "bg-[#1A1A1A] text-[#FAFAFA] border-[#3B82F6]"
                        : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#111111] border-transparent"
                    )}
                  >
                    <Icon size={15} />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t border-[#1F1F1F] pt-3 flex flex-col gap-0.5">
        <Link
          href="/configuracoes"
          aria-current={pathname === "/configuracoes" ? "page" : undefined}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-sm transition-colors duration-150 focus-ring",
            pathname === "/configuracoes"
              ? "bg-[#1A1A1A] text-[#FAFAFA]"
              : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#111111]"
          )}
        >
          <Settings size={15} />
          Configurações
        </Link>
        <LogoutButton />
      </div>
    </aside>
  );
}
