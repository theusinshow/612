import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "bg-[#111111] border border-[#1F1F1F] rounded-[8px] p-5 flex flex-col gap-3",
        "transition-colors duration-150 hover:border-[#2A2A2A] hover:bg-[#151515]",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#A1A1AA] font-medium">{label}</span>
        {Icon && (
          <div className="w-7 h-7 flex items-center justify-center bg-[#3B82F6]/10 rounded-[6px]">
            <Icon size={14} className="text-[#3B82F6]" />
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-semibold text-[#FAFAFA] font-mono tracking-tight leading-none">
          {value}
        </p>
        {sub && (
          <p className="text-xs text-[#71717A] mt-1">{sub}</p>
        )}
      </div>
    </div>
  );
}
