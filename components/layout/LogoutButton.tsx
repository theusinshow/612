"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-sm text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#111111] transition-colors w-full"
    >
      <LogOut size={15} />
      Sair
    </button>
  );
}
