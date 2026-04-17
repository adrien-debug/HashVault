"use client";

import { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { ensureChartsRegistered } from "./ChartRegistry";

type Slice = { label: string; value: number; color: string };

type Props = { slices: Slice[]; height?: number };

export function AllocationDonut({ slices, height = 180 }: Props) {
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
            borderWidth: 0,
          },
        ],
      },
      options: {
        cutout: "68%",
        plugins: { legend: { display: false } },
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
