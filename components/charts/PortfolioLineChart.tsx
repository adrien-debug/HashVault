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

    const ctx = canvas.getContext("2d");
    let gradient: string | CanvasGradient = "rgba(52,199,89,.10)";
    if (ctx) {
      const g = ctx.createLinearGradient(0, 0, 0, 260);
      g.addColorStop(0, "rgba(52,199,89,0.22)");
      g.addColorStop(1, "rgba(52,199,89,0.00)");
      gradient = g;
    }

    const chart = new Chart(canvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            data: values,
            borderColor: "#1FAE45",
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#1FAE45",
            pointHoverBorderColor: "#fff",
            pointHoverBorderWidth: 2,
            borderWidth: 2.5,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0F1115",
            borderColor: "rgba(255,255,255,0.1)",
            borderWidth: 1,
            padding: 10,
            cornerRadius: 10,
            titleFont: { size: 11, weight: 600 },
            bodyFont: { size: 12, weight: 600 },
            displayColors: false,
            callbacks: {
              label: (ctx) => "$" + Number(ctx.parsed.y).toLocaleString(),
            },
          },
        },
        interaction: { mode: "index", intersect: false },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: "#A1A1A6", padding: 8 },
          },
          y: {
            grid: { color: "rgba(236,236,239,0.6)" },
            border: { display: false },
            ticks: {
              color: "#A1A1A6",
              padding: 8,
              callback: (v) => "$" + (Number(v) / 1000).toFixed(0) + "k",
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
