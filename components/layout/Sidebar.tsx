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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "./LogoutButton";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/competencias", label: "Competências", icon: CalendarDays },
  { href: "/residencias", label: "Residências", icon: Home },
  { href: "/faturas", label: "Faturas", icon: ReceiptText },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-56 min-h-screen bg-[#0A0A0A] border-r border-[#1F1F1F] px-3 py-6 fixed top-0 left-0 z-40">
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 mb-8">
        <div className="flex items-center justify-center w-7 h-7 bg-[#111111] border border-[#1F1F1F] rounded-[6px]">
          <Zap size={14} className="text-[#A1A1AA]" />
        </div>
        <span className="font-mono text-sm font-semibold tracking-widest text-[#FAFAFA]">
          612
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-sm transition-colors",
                active
                  ? "bg-[#1A1A1A] text-[#FAFAFA]"
                  : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#111111]"
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto flex flex-col gap-0.5">
        <Link
          href="/configuracoes"
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-sm transition-colors",
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
