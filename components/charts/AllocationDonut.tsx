"use client";

import { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { ensureChartsRegistered } from "./ChartRegistry";

type Slice = { label: string; value: number; color: string };

type Props = { slices: Slice[]; height?: number };

export function AllocationDonut({ slices, height = 200 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    ensureChartsRegistered();
    const canvas = ref.current;
    if (!canvas) return;
    const chart = new Chart(canvas, {
      type: "doughnut",
      data: {
        labels: slices.map((s) => s.label),
        datasets: [
          {
            data: slices.map((s) => s.value),
            backgroundColor: slices.map((s) => s.color),
            borderColor: "#fff",
            borderWidth: 3,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        cutout: "72%",
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0F1115",
            padding: 10,
            cornerRadius: 10,
            titleFont: { size: 11, weight: 600 },
            bodyFont: { size: 12, weight: 600 },
            displayColors: true,
            boxPadding: 4,
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`,
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
    return () => chart.destroy();
  }, [slices]);

  return (
    <div style={{ position: "relative", height, maxWidth: height, margin: "auto" }}>
      <canvas ref={ref} />
    </div>
  );
}
