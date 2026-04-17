"use client";

import { useEffect, useRef } from "react";

type Props = {
  values: number[];
  color?: string;
  height?: number;
  className?: string;
};

export function Sparkline({ values, color = "#34C759", height = 36, className = "" }: Props) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg || values.length < 2) return;

    const W = svg.clientWidth || 120;
    const H = height;
    const pad = 2;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const pts = values.map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (W - pad * 2);
      const y = pad + (1 - (v - min) / range) * (H - pad * 2);
      return `${x},${y}`;
    });

    /* smooth polyline via catmull-rom approximation */
    const d = pts.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt}`;
      const prev = pts[i - 1].split(",").map(Number);
      const cur  = pt.split(",").map(Number);
      const cpx  = (prev[0] + cur[0]) / 2;
      return `${acc} C ${cpx},${prev[1]} ${cpx},${cur[1]} ${cur[0]},${cur[1]}`;
    }, "");

    /* area fill */
    const lastPt = pts[pts.length - 1].split(",");
    const firstPt = pts[0].split(",");
    const fillD = `${d} L ${lastPt[0]},${H} L ${firstPt[0]},${H} Z`;

    svg.innerHTML = `
      <defs>
        <linearGradient id="sg-${color.replace('#','')}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="${color}" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="${fillD}" fill="url(#sg-${color.replace('#','')})" />
      <path d="${d}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    `;
  }, [values, color, height]);

  return (
    <svg
      ref={ref}
      className={`sparkline ${className}`}
      style={{ height }}
      aria-hidden
      viewBox={`0 0 120 ${height}`}
      preserveAspectRatio="none"
    />
  );
}
