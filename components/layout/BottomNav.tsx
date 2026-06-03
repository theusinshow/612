"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  ReceiptText,
  Droplets,
  PanelsTopLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/servicos", label: "Serviços", icon: PanelsTopLeft },
  { href: "/dashboard", label: "Luz", icon: LayoutDashboard },
  { href: "/agua", label: "Água", icon: Droplets },
  { href: "/competencias", label: "Competências", icon: CalendarDays },
  { href: "/faturas", label: "Faturas", icon: ReceiptText },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-sm border-t border-[#1F1F1F] grid grid-cols-5 px-1 h-16 safe-area-bottom"
      aria-label="Navegação principal"
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-col items-center gap-1 px-1 py-2 rounded-[6px] transition-colors duration-150 min-h-[44px] justify-center focus-ring",
              active
                ? "bg-[#1A1A1A] text-[#FAFAFA]"
                : "text-[#71717A] hover:text-[#A1A1AA]"
            )}
          >
            <Icon size={20} />
            <span className="text-[9px] font-medium leading-none truncate max-w-full">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
