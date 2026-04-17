"use client";

import {
  Chart,
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  DoughnutController,
  Filler,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";

let registered = false;

export function ensureChartsRegistered() {
  if (registered) return;
  Chart.register(
    ArcElement,
    BarController,
    BarElement,
    CategoryScale,
    DoughnutController,
    Filler,
    LineController,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip,
  );

  Chart.defaults.font.family =
    'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif';
  Chart.defaults.font.size = 11;
  Chart.defaults.color = "#6E6E73";
  Chart.defaults.borderColor = "#ECECEF";

  registered = true;
}
