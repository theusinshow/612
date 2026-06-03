"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ContaAguaStatus, ResponsavelPagamentoAgua } from "@/types";

interface SalvarContaAguaInput {
  residencia_id: string;
  matricula: string;
  mes: number;
  ano: number;
  valor: number;
  vencimento: string | null;
  data_pagamento: string | null;
  status: ContaAguaStatus;
  responsavel_pagamento: ResponsavelPagamentoAgua;
  arquivo_url: string | null;
  observacoes: string | null;
}

export async function salvarContaAgua(input: SalvarContaAguaInput) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("contas_agua")
    .insert(input);

  if (error) {
    if (error.code === "23505") {
      return { error: "Já existe uma conta para esta matrícula nesta competência." };
    }

    return { error: "Erro ao salvar conta de água. Verifique os dados e tente novamente." };
  }

  revalidatePath("/agua");
  revalidatePath("/servicos");
  return { error: null };
}
