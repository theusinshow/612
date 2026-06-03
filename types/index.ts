// ============================================================
// 612 — Tipos do sistema
// ============================================================

export type UserRole = "admin" | "viewer";

export type ResidenciaStatus = "ativa" | "inativa";
export type ResidenciaTipo = "terrea" | "andar";

export type CompetenciaStatus = "aberta" | "fechada";

export type PagamentoStatus = "pendente" | "pago";
export type ContaAguaStatus = "pendente" | "pago" | "vencida";
export type ResponsavelPagamentoAgua = "matheus" | "irmao";

// ============================================================
// Entidades do banco
// ============================================================

export interface Profile {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Residencia {
  id: string;
  nome: string;
  tipo: ResidenciaTipo;
  status: ResidenciaStatus;
  responsavel_nome: string | null;
  created_at: string;
}

export interface Competencia {
  id: string;
  mes: number; // 1–12
  ano: number;
  status: CompetenciaStatus;
  created_at: string;
  closed_at: string | null;
}

export interface Fatura {
  id: string;
  competencia_id: string;
  arquivo_pdf_url: string | null;
  valor_total: string; // NUMERIC — armazenado como string para precisão
  consumo_total_kwh: string;
  cosip: string;
  vencimento: string | null;
  created_at: string;
}

export interface Leitura {
  id: string;
  competencia_id: string;
  residencia_id: string;
  leitura_anterior: string;
  leitura_atual: string;
  consumo_calculado: string;
  foto_url: string;
  created_at: string;
  // Joins
  residencia?: Residencia;
}

export interface Rateio {
  id: string;
  competencia_id: string;
  residencia_id: string;
  valor_consumo: string;
  valor_cosip: string;
  valor_total: string;
  created_at: string;
  // Joins
  residencia?: Residencia;
}

export interface Pagamento {
  id: string;
  rateio_id: string;
  status: PagamentoStatus;
  valor_pago: string | null;
  data_pagamento: string | null;
  created_at: string;
}

export interface ContaAgua {
  id: string;
  residencia_id: string;
  matricula: string;
  mes: number;
  ano: number;
  valor: string;
  vencimento: string | null;
  data_pagamento: string | null;
  status: ContaAguaStatus;
  responsavel_pagamento: ResponsavelPagamentoAgua;
  arquivo_url: string | null;
  observacoes: string | null;
  created_at: string;
  residencia?: Residencia;
}

export interface AuditLog {
  id: string;
  user_id: string;
  acao: string;
  entidade: string;
  descricao: string;
  created_at: string;
}

// ============================================================
// Tipos compostos para UI
// ============================================================

export interface CompetenciaComFatura extends Competencia {
  fatura: Fatura | null;
}

export interface RateioComPagamento extends Rateio {
  pagamento: Pagamento | null;
}

export interface CompetenciaCompleta extends Competencia {
  fatura: Fatura | null;
  leituras: Leitura[];
  rateios: RateioComPagamento[];
}

// ============================================================
// Resultados de cálculo
// ============================================================

export interface ResultadoRateio {
  residencia_id: string;
  consumo_kwh: number;
  valor_consumo: number;
  valor_cosip: number;
  valor_total: number;
}

export interface SnapshotCalculo {
  valor_total: number;
  consumo_total_kwh: number;
  cosip: number;
  valor_kwh: number;
  residencias: ResultadoRateio[];
}
