"use client";

import { useState } from "react";

import { MaterialIcon } from "@/components/material-icon";
import { cn } from "@/lib/utils";

type RangeKey = "year" | "sixMonths" | "month";

type ChartRange = {
  button: string;
  labels: string[];
  visitors: string;
  area: string;
  downloads: string;
  nodes: {
    x: number;
    y: number;
    fill: string;
    r: number;
    stroke?: string;
  }[];
};

const RANGES: Record<RangeKey, ChartRange> = {
  year: {
    button: "Tahun Ini",
    labels: [
      "Nov 2024",
      "Des 2024",
      "Jan 2025",
      "Feb 2025",
      "Mar 2025",
      "Apr 2025",
      "Mei (Live)",
    ],
    visitors: "20,130 116,110 212,140 308,80 404,65 500,40 580,25",
    area: "20,180 20,130 116,110 212,140 308,80 404,65 500,40 580,25 580,180",
    downloads: "20,165 116,155 212,160 308,135 404,115 500,90 580,70",
    nodes: [
      { x: 308, y: 80, fill: "#005baf", r: 5 },
      { x: 500, y: 40, fill: "#005baf", r: 5 },
      { x: 580, y: 25, fill: "#00c4fd", r: 6, stroke: "#ffffff" },
      { x: 580, y: 70, fill: "#006685", r: 5 },
    ],
  },
  sixMonths: {
    button: "6 Bulan",
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
    visitors: "20,150 132,132 244,118 356,95 468,68 580,40",
    area: "20,180 20,150 132,132 244,118 356,95 468,68 580,40 580,180",
    downloads: "20,172 132,164 244,152 356,138 468,118 580,100",
    nodes: [
      { x: 356, y: 95, fill: "#005baf", r: 5 },
      { x: 468, y: 68, fill: "#00c4fd", r: 5 },
      { x: 580, y: 40, fill: "#00c4fd", r: 6, stroke: "#ffffff" },
      { x: 580, y: 100, fill: "#006685", r: 5 },
    ],
  },
  month: {
    button: "30 Hari",
    labels: ["1 Apr", "7 Apr", "13 Apr", "19 Apr", "25 Apr", "30 Apr"],
    visitors: "20,165 132,150 244,158 356,125 468,92 580,60",
    area: "20,180 20,165 132,150 244,158 356,125 468,92 580,60 580,180",
    downloads: "20,176 132,168 244,160 356,148 468,132 580,118",
    nodes: [
      { x: 356, y: 125, fill: "#005baf", r: 5 },
      { x: 468, y: 92, fill: "#00c4fd", r: 5 },
      { x: 580, y: 60, fill: "#00c4fd", r: 6, stroke: "#ffffff" },
      { x: 580, y: 118, fill: "#006685", r: 5 },
    ],
  },
};

const RANGE_ORDER: RangeKey[] = ["year", "sixMonths", "month"];

export function AnalyticsChart() {
  const [range, setRange] = useState<RangeKey>("year");
  const active = RANGES[range];

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-surface-container-lowest p-7 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <MaterialIcon name="ssid_chart" size={20} className="text-primary" />
            <h2 className="font-title-card text-title-card text-on-surface">
              Aktivitas Kunjungan &amp; Unduhan CV
            </h2>
          </div>
          <p className="mt-0.5 font-body-muted text-body-muted text-on-surface-variant">
            Tinjauan analitik 6 bulan terakhir dengan korelasi minat rekruter
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-surface-container-low p-1">
          {RANGE_ORDER.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={range === key}
              onClick={() => setRange(key)}
              className={cn(
                "rounded-lg px-3 py-1 font-tech-tag text-tech-tag transition-colors",
                range === key
                  ? "bg-surface-container-lowest font-semibold text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface",
              )}
            >
              {RANGES[key].button}
            </button>
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col gap-4">
        <div className="relative flex h-64 w-full flex-col justify-between rounded-xl bg-surface-container-low/50 p-4">
          <div className="absolute inset-x-6 top-8 h-px bg-surface-container-high/60" />
          <div className="absolute inset-x-6 top-24 h-px bg-surface-container-high/60" />
          <div className="absolute inset-x-6 top-40 h-px bg-surface-container-high/60" />
          <div className="absolute inset-x-6 top-52 h-px bg-surface-container-high/60" />

          <svg
            role="img"
            aria-label="Grafik aktivitas kunjungan dan unduhan CV"
            viewBox="0 0 600 200"
            preserveAspectRatio="none"
            className="relative z-10 h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient id="visitorsGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#0074db" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#0074db" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="downloadsGradient"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#00c4fd" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#00c4fd" stopOpacity="0" />
              </linearGradient>
            </defs>

            <polygon fill="url(#visitorsGradient)" points={active.area} />
            <polyline
              fill="none"
              points={active.visitors}
              stroke="#005baf"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              fill="none"
              points={active.downloads}
              stroke="#00c4fd"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="4 4"
            />

            {active.nodes.map((node) => (
              <circle
                key={`${node.x}-${node.y}-${node.fill}`}
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill={node.fill}
                stroke={node.stroke}
                strokeWidth={node.stroke ? 2 : undefined}
              />
            ))}
          </svg>

          <div className="flex items-center justify-between px-3 pt-2 font-tech-tag text-tech-tag text-on-surface-variant">
            {active.labels.map((label, index) => (
              <span
                key={label}
                className={cn(
                  index === active.labels.length - 1 &&
                    "font-bold text-primary",
                )}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 px-2 pt-2">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-primary" />
              <span className="font-body-muted text-body-muted text-on-surface">
                Pageviews Portfolio
              </span>
              <span className="ml-1 font-stat-number text-stat-number text-primary">
                14.8k
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-3 rounded-sm bg-secondary-container" />
              <span className="font-body-muted text-body-muted text-on-surface">
                Unduhan CV PDF
              </span>
              <span className="ml-1 font-stat-number text-stat-number text-secondary">
                284
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 font-tech-tag text-tech-tag text-on-surface-variant">
            <MaterialIcon name="insights" size={16} className="text-secondary" />
            <span>
              Rasio konversi unduhan: <strong>1.91%</strong> (Optimal)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
