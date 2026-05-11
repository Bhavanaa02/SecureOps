"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export function VulnChart({ data }: any) {
  if (!data) return null;

  const chartData = Object.entries(data)
    .filter(([k]) => !["score", "tools", "advice"].includes(k))
    .map(([tool, v]: any) => ({
      name: tool,
      critical: v.critical,
      high: v.high,
      medium: v.medium,
      low: v.low,
    }));

  return (
    <BarChart width={500} height={300} data={chartData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="critical" />
      <Bar dataKey="high" />
      <Bar dataKey="medium" />
      <Bar dataKey="low" />
    </BarChart>
  );
}