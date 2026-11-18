import ReportLine from "./ReportLine";

const meta = {
  component: ReportLine,
  tags: ["autodocs"],
  args: {
    label: "A1 Clarifier et documenter les besoins des parties prenantes dans le cadre d’un projet ICT",
    data: [
      { label: "Autonome", value: 40 },
      { label: "Exercé", value: 30 },
      { label: "Expliqué", value: 20 },
      { label: "Non expliqué", value: 10 },
    ],
  },
};

export default meta;

// Default: long label with mixed mastery levels
export const Default = {};

// Short label
export const ShortLabel = {
  args: {
    label: "B1 Installer un PC monoposte",
  },
};

// Label so long it must be truncated
export const TruncatedLabel = {
  args: {
    label: "C3 Concevoir, implémenter, tester, documenter et adapter des solutions ICT pour répondre aux besoins des parties prenantes dans le respect des processus et standards en vigueur. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
};

// No data — shows the gray fallback bar
export const NoData = {
  args: {
    label: "Pas de données",
    data: [],
  },
};

// Strong mastery
export const MostlyAutonome = {
  args: {
    label: "A2 Définir un modèle de procédure pour un projet ICT",
    data: [
      { label: "Autonome", value: 70 },
      { label: "Exercé", value: 15 },
      { label: "Expliqué", value: 10 },
      { label: "Non expliqué", value: 5 },
    ],
  },
};

// Low mastery
export const MostlyNonExplique = {
  args: {
    label: "A2 Définir un modèle de procédure pour un projet ICT",
    data: [
      { label: "Autonome", value: 5 },
      { label: "Exercé", value: 10 },
      { label: "Expliqué", value: 15 },
      { label: "Non expliqué", value: 70 },
    ],
  },
};
