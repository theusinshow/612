"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function atualizarResponsavel(
  residenciaId: string,
  responsavelNome: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("residencias")
    .update({ responsavel_nome: responsavelNome.trim() || null })
    .eq("id", residenciaId);

  if (error) throw new Error(error.message);

  revalidatePath("/residencias");
}
