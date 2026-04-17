"use client";

import { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { ensureChartsRegistered } from "./ChartRegistry";

type Props = {
  labels: string[];
  values: number[];
  color?: string;
};

export function YieldBarChart({ labels, values, color = "#34C759" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    ensureChartsRegistered();
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let fill: string | CanvasGradient = color;
    if (ctx) {
      const g = ctx.createLinearGradient(0, 0, 0, 200);
      g.addColorStop(0, color);
      g.addColorStop(1, color + "AA");
      fill = g;
    }

    const chart = new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: fill,
            borderRadius: 6,
            borderSkipped: false,
            hoverBackgroundColor: color,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0F1115",
            padding: 10,
            cornerRadius: 10,
            titleFont: { size: 11, weight: 600 },
            bodyFont: { size: 12, weight: 600 },
            displayColors: false,
            callbacks: { label: (c) => "$" + Number(c.parsed.y).toLocaleString() },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: "#A1A1A6", padding: 6 },
          },
          y: {
            grid: { color: "rgba(236,236,239,0.6)" },
            border: { display: false },
            ticks: {
              color: "#A1A1A6",
              padding: 6,
              callback: (v) => "$" + Number(v).toLocaleString(),
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
    return () => chart.destroy();
  }, [labels, values, color]);

  return (
    <div style={{ position: "relative", width: "100%", height: 200 }}>
      <canvas ref={ref} />
    </div>
  );
}
