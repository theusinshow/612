"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Home,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/competencias", label: "Competências", icon: CalendarDays },
  { href: "/residencias", label: "Residências", icon: Home },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-sm border-t border-[#1F1F1F] flex items-center justify-around px-2 h-16 safe-area-bottom"
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
              "flex flex-col items-center gap-1 px-3 py-2 rounded-[6px] transition-colors duration-150 min-w-[52px] min-h-[44px] justify-center focus-ring",
              active
                ? "bg-[#1A1A1A] text-[#FAFAFA]"
                : "text-[#71717A] hover:text-[#A1A1AA]"
            )}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium leading-none">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
