"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function criarCompetencia(mes: number, ano: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("competencias")
    .insert({ mes, ano, status: "aberta" });

  if (error) {
    if (error.code === "23505") {
      return { error: "Já existe uma competência para este mês e ano." };
    }
    return { error: "Erro ao criar competência. Tente novamente." };
  }

  revalidatePath("/competencias");
  return { error: null };
}
