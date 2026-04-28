import ReportBar from "./ReportBar";

const meta = {
  component: ReportBar,
  tags: ["autodocs"],
  args: {
    data: [
      { label: "Autonome", value: 25 },
      { label: "Exercé", value: 25 },
      { label: "Expliqué", value: 25 },
      { label: "Non expliqué", value: 25 },
    ],
  },
};

export default meta;

// Equal distribution (25% each)
export const Default = {};

// No data or data incorrect
export const NoData = {
  args: {
    data: [],
  },
};

// Strong mastery: most competencies are autonomous
export const MostlyAutonome = {
  args: {
    data: [
      { label: "Autonome", value: 70 },
      { label: "Exercé", value: 15 },
      { label: "Expliqué", value: 10 },
      { label: "Non expliqué", value: 5 },
    ],
  },
};

// Low mastery: most competencies are unexplained
export const MostlyNonExplique = {
  args: {
    data: [
      { label: "Autonome", value: 5 },
      { label: "Exercé", value: 10 },
      { label: "Expliqué", value: 15 },
      { label: "Non expliqué", value: 70 },
    ],
  },
};

// Ensures a fully mastered skill set renders correctly (single 100% dark-blue segment)
export const FullyAutonome = {
  args: {
    data: [
      { label: "Autonome", value: 100 },
      { label: "Exercé", value: 0 },
      { label: "Expliqué", value: 0 },
      { label: "Non expliqué", value: 0 },
    ],
  },
};

// Tests a very small segment (1%) — checks rendering precision at the edges
export const VerySmallValue = {
  args: {
    data: [
      { label: "Autonome", value: 97 },
      { label: "Exercé", value: 1 },
      { label: "Expliqué", value: 1 },
      { label: "Non expliqué", value: 1 },
    ],
  },
};
