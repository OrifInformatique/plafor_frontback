import DoughnutChart from "./DoughnutChart";

const meta = {
  component: DoughnutChart,
  tags: ["autodocs"],
  args: {
    showLegend: false,
    data: [
      { label: "Autonome", value: 25 },
      { label: "Exercé", value: 25 },
      { label: "Expliqué", value: 25 },
      { label: "Non expliqué", value: 25 },
    ],
  },
};

export default meta;

// Variant with legend
export const Default = {};

// No data or data incorrect
export const NoData = {
  args: {
    data: [{ label: "No data or incorrect data", value: 100, color: "#E0E0E0", isEmpty: true }],
  },
};

export const WithLegend = {
  args: {
    showLegend: true,
  },
};

// Variant with other data
export const CustomData = {
  args: {
    data: [
      { label: "Front-end", value: 50 },
      { label: "Back-end", value: 20 },
      { label: "DevOps", value: 15 },
      { label: "Autres", value: 15 },
    ],
  },
};

// This story tests how the DoughnutChart behaves when one segment is extremely small.
// Useful for checking label visibility, percentage bubbles, rendering precision and edge cases.
export const VerySmallValue = {
  args: {
    data: [
      { label: "Large part", value: 80 },
      { label: "Medium part", value: 15 },
      { label: "Tiny part", value: 1 }, // too small to display clearly
      { label: "Small part", value: 4 },
    ],
    showLegend: true,
  },
};

// This story checks extreme imbalance: one huge segment and several tiny ones.
export const ExtremeImbalance = {
  args: {
    data: [
      { label: "Main part", value: 97 },
      { label: "Tiny A", value: 1 },
      { label: "Tiny B", value: 1 },
      { label: "Tiny C", value: 1 },
    ],
    showLegend: true,
  },
};

// Ensures the chart still renders properly and the plugin handles zeros safely.
export const SingleFullValue = {
  args: {
    data: [
      { label: "Full part", value: 100 },
      { label: "Empty A", value: 0 },
      { label: "Empty B", value: 0 },
      { label: "Empty C", value: 0 },
    ],
    showLegend: true,
  },
};
