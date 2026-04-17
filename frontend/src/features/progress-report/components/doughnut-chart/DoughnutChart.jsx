/**
 * DoughnutChart.jsx
 *
 * Reusable doughnut chart component built with Chart.js + react-chartjs-2.
 * - Displays percentage bubbles using a custom plugin.
 * - Automatically normalizes incoming data.
 * - Fully responsive thanks to CSS container and Chart.js settings.
 */

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { percentagePlugin } from "./percentage-plugin";
import "./DoughnutChart.css";

// Register elements and the custom plugin once at module level
ChartJS.register(ArcElement, Tooltip, Legend, percentagePlugin);

// Default parameters
const DEFAULT_COLORS = ["#005BA9", "#4D8DC3", "#CCDEEE", "#F2F2F7"];
const CHART_DEFAULTS = {
  cutout: "70%",
  animationDuration: 800,
  percentage: {
    bubbleScale: 0.6,
    maxWidth: 120,
    maxHeight: 80,
    minPercentage: 3,
  },
};

/**
 * Ensures the incoming dataset is always valid.
 * If no data is provided, a doughnut is showed.
 */
function normalizeData(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return [
      {
        label: "No data or incorrect data",
        value: 100,
        color: "#E0E0E0",
        isEmpty: true,
      },
    ];
  }

  return data.map((item = {}, i) => {
    const rawValue = Number(item.value);
    const safeValue = Number.isFinite(rawValue) ? rawValue : 0;

    return {
      label: item.label ?? `Item ${i + 1}`,
      value: safeValue,
      color: item.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
      isEmpty: item.isEmpty === true,
    };
  });
}

/**
 * Main DoughnutChart component
 */
export default function DoughnutChart({ data = [], showLegend = false }) {
  const normalized = normalizeData(data);
  const isEmpty = normalized.length === 1 && normalized[0].isEmpty === true;

  // Build dataset for Chart.js
  const chartData = {
    labels: normalized.map((d) => d.label),
    datasets: [
      {
        data: normalized.map((d) => d.value),
        backgroundColor: normalized.map((d) => d.color),
        borderWidth: 0,
        cutout: CHART_DEFAULTS.cutout, // inner radius of the doughnut 70%
      },
    ],
  };

  // Chart.js configuration
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: CHART_DEFAULTS.animationDuration,
    },
    plugins: {
      legend: {
        display: showLegend && !isEmpty,
        position: "left",
      },
      tooltip: {
        enabled: true,
      },
      percentagePlugin: {
        ...CHART_DEFAULTS.percentage,
        isEmpty,
      },
    },
  };

  return (
    <Doughnut data={chartData} options={options} className="doughnut-shadow" />
  );
}
