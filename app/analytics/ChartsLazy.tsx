"use client";

import dynamic from "next/dynamic";

// Os gráficos carregam a biblioteca recharts (pesada). Fazemos lazy load
// client-side (ssr: false) para não incluí-la no bundle inicial da rota —
// a página abre antes, os gráficos hidratam em seguida.
// ssr: false só é permitido dentro de um Client Component (Next.js 16).

function ChartSkeleton() {
  return (
    <div className="flex items-center justify-center h-[200px] text-xs text-[#71717A]">
      Carregando gráfico…
    </div>
  );
}

export const ConsumoChart = dynamic(
  () => import("./Charts").then((m) => m.ConsumoChart),
  { ssr: false, loading: ChartSkeleton }
);

export const ValorFaturaChart = dynamic(
  () => import("./Charts").then((m) => m.ValorFaturaChart),
  { ssr: false, loading: ChartSkeleton }
);

export const RateioChart = dynamic(
  () => import("./Charts").then((m) => m.RateioChart),
  { ssr: false, loading: ChartSkeleton }
);
