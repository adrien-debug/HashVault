"use client";

import { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { ensureChartsRegistered } from "./ChartRegistry";

type Props = {
  labels: string[];
  values: number[];
};

export function PortfolioLineChart({ labels, values }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    ensureChartsRegistered();
    const canvas = ref.current;
    if (!canvas) return;
    const chart = new Chart(canvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            data: values,
            borderColor: "#34C759",
            backgroundColor: "rgba(52,199,89,.08)",
            fill: true,
            tension: 0.35,
            pointRadius: 0,
            borderWidth: 2,
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: {
            ticks: {
              callback: (v) =>
                "$" + (Number(v) / 1000).toFixed(0) + "k",
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
    return () => chart.destroy();
  }, [labels, values]);

  return (
    <div style={{ position: "relative", width: "100%", height: 260 }}>
      <canvas ref={ref} />
    </div>
  );
}
