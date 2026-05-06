"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

export type ConsumoData = {
  label: string;
  kwh: number;
  valor: number;
};

export type RateioData = {
  label: string;
  [residencia: string]: number | string;
};

const COLORS = ["#3B82F6", "#22C55E", "#EAB308", "#F97316", "#A855F7"];

// Tooltip customizado dark mode
function TooltipDark({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: readonly any[];
  label?: string | number;
  formatter: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[6px] px-3 py-2 text-xs">
      <p className="text-[#A1A1AA] mb-1.5">{String(label)}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[#71717A]">{p.name}:</span>
          <span className="text-[#FAFAFA] font-mono">{formatter(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function ConsumoChart({ data }: { data: ConsumoData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-xs text-[#52525B]">
        Nenhum dado disponível.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#1F1F1F" />
        <XAxis
          dataKey="label"
          tick={{ fill: "#52525B", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#52525B", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}`}
        />
        <Tooltip
          content={({ active, payload, label }) => (
            <TooltipDark
              active={active}
              payload={payload}
              label={label}
              formatter={(v) => `${v} kWh`}
            />
          )}
          cursor={{ fill: "#1A1A1A" }}
        />
        <Bar dataKey="kwh" name="Consumo" fill="#3B82F6" radius={[3, 3, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ValorFaturaChart({ data }: { data: ConsumoData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-xs text-[#52525B]">
        Nenhum dado disponível.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#1F1F1F" />
        <XAxis
          dataKey="label"
          tick={{ fill: "#52525B", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#52525B", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `R$${v}`}
        />
        <Tooltip
          content={({ active, payload, label }) => (
            <TooltipDark
              active={active}
              payload={payload}
              label={label}
              formatter={(v) =>
                v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
              }
            />
          )}
          cursor={{ stroke: "#2A2A2A" }}
        />
        <Line
          dataKey="valor"
          name="Valor fatura"
          stroke="#22C55E"
          strokeWidth={2}
          dot={{ fill: "#22C55E", r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function RateioChart({
  data,
  residencias,
}: {
  data: RateioData[];
  residencias: string[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-xs text-[#52525B]">
        Nenhum dado disponível.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#1F1F1F" />
        <XAxis
          dataKey="label"
          tick={{ fill: "#52525B", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#52525B", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `R$${v}`}
        />
        <Tooltip
          content={({ active, payload, label }) => (
            <TooltipDark
              active={active}
              payload={payload}
              label={label}
              formatter={(v) =>
                v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
              }
            />
          )}
          cursor={{ fill: "#1A1A1A" }}
        />
        <Legend
          wrapperStyle={{ fontSize: 10, color: "#71717A", paddingTop: 12 }}
        />
        {residencias.map((nome, i) => (
          <Bar
            key={nome}
            dataKey={nome}
            stackId="a"
            fill={COLORS[i % COLORS.length]}
            radius={i === residencias.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0]}
            maxBarSize={48}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
