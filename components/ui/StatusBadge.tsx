import { cn } from "@/lib/utils";

type StatusVariant =
  | "aberta"
  | "fechada"
  | "pendente"
  | "pago"
  | "vencida"
  | "ativa"
  | "inativa";

const variantStyles: Record<StatusVariant, string> = {
  aberta: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20",
  fechada: "bg-[#A1A1AA]/10 text-[#A1A1AA] border-[#A1A1AA]/20",
  pendente: "bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20",
  pago: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20",
  vencida: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
  ativa: "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20",
  inativa: "bg-[#A1A1AA]/10 text-[#A1A1AA] border-[#A1A1AA]/20",
};

const variantLabels: Record<StatusVariant, string> = {
  aberta: "Aberta",
  fechada: "Fechada",
  pendente: "Pendente",
  pago: "Pago",
  vencida: "Vencida",
  ativa: "Ativa",
  inativa: "Inativa",
};

interface StatusBadgeProps {
  status: StatusVariant;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-[4px] text-[11px] font-medium border",
        variantStyles[status],
        className
      )}
    >
      {variantLabels[status]}
    </span>
  );
}
