import ReportSection from "./ReportSection";

const meta = {
  component: ReportSection,
  tags: ["autodocs"],
  args: {
    label: "A Suivi des projets ICT",

    doughnutChartData: [
      { label: "Autonome", value: 40 },
      { label: "Exercé", value: 30 },
      { label: "Expliqué", value: 20 },
      { label: "Non expliqué", value: 10 },
    ],

    reportLines: [
      {
        label:
          "A1 Clarifier et documenter les besoins des parties prenantes dans le cadre d'un projet ICT",
        data: [
          { label: "Autonome", value: 40 },
          { label: "Exercé", value: 30 },
          { label: "Expliqué", value: 20 },
          { label: "Non expliqué", value: 10 },
        ],
      },
      {
        label: "A2 Définir un modèle de procédure pour un projet ICT",
        data: [
          { label: "Autonome", value: 0 },
          { label: "Exercé", value: 0 },
          { label: "Expliqué", value: 0 },
          { label: "Non expliqué", value: 0 },
        ],
      },
      {
        label:
          "A3 Rechercher des informations sur des solutions ICT et sur les innovations",
        data: [
          { label: "Autonome", value: 70 },
          { label: "Exercé", value: 22 },
          { label: "Expliqué", value: 5 },
          { label: "Non expliqué", value: 3 },
        ],
      },
      {
        label:
          "A4 Planifier les projets ICT et les tâches selon un modèle de procédure",
        data: [
          { label: "Autonome", value: 100 },
          { label: "Exercé", value: 0 },
          { label: "Expliqué", value: 0 },
          { label: "Non expliqué", value: 0 },
        ],
      },
      {
        label: "A5 Visualiser et présenter les variantes de solutions ICT",
        data: [
          { label: "Autonome", value: 0 },
          { label: "Exercé", value: 0 },
          { label: "Expliqué", value: 50 },
          { label: "Non expliqué", value: 50 },
        ],
      },
      {
        label:
          "A6 Vérifier l'avancement des projets ICT et des tâches et en faire état selon le modèle de procédure",
        data: [
          { label: "Autonome", value: 25 },
          { label: "Exercé", value: 25 },
          { label: "Expliqué", value: 25 },
          { label: "Non expliqué", value: 25 },
        ],
      },
      {
        label: "A7 Remettre la solution ICT au client et clôturer le projet",
        data: [
          { label: "Autonome", value: 60 },
          { label: "Exercé", value: 10 },
          { label: "Expliqué", value: 15 },
          { label: "Non expliqué", value: 15 },
        ],
      },
    ],
  },
};

export default meta;

// Default: standard section with 7 lines and varied mastery levels
export const Default = {};

// ── Normal situations ────────────────────────────────────────

// Section with only one line — minimal case
export const SingleLine = {
  args: {
    label: "B Sécurité des systèmes",
    doughnutChartData: [
      { label: "Autonome", value: 80 },
      { label: "Exercé", value: 10 },
      { label: "Expliqué", value: 5 },
      { label: "Non expliqué", value: 5 },
    ],
    reportLines: [
      {
        label: "B1 Installer et configurer un poste de travail sécurisé",
        data: [
          { label: "Autonome", value: 80 },
          { label: "Exercé", value: 10 },
          { label: "Expliqué", value: 5 },
          { label: "Non expliqué", value: 5 },
        ],
      },
    ],
  },
};

// All learners have the maximum mastery level (100% Autonomous)
export const AllAutonome = {
  args: {
    label: "C Développement applicatif",
    doughnutChartData: [
      { label: "Autonome", value: 100 },
      { label: "Exercé", value: 0 },
      { label: "Expliqué", value: 0 },
      { label: "Non expliqué", value: 0 },
    ],
    reportLines: [
      {
        label: "C1 Analyser et structurer les besoins",
        data: [
          { label: "Autonome", value: 100 },
          { label: "Exercé", value: 0 },
          { label: "Expliqué", value: 0 },
          { label: "Non expliqué", value: 0 },
        ],
      },
      {
        label: "C2 Concevoir l'architecture logicielle",
        data: [
          { label: "Autonome", value: 100 },
          { label: "Exercé", value: 0 },
          { label: "Expliqué", value: 0 },
          { label: "Non expliqué", value: 0 },
        ],
      },
      {
        label: "C3 Implémenter et tester les fonctionnalités",
        data: [
          { label: "Autonome", value: 100 },
          { label: "Exercé", value: 0 },
          { label: "Expliqué", value: 0 },
          { label: "Non expliqué", value: 0 },
        ],
      },
    ],
  },
};

// No mastery — subject not yet taught (100% Unexplained)
export const AllNonExplique = {
  args: {
    label: "D Réseaux avancés",
    doughnutChartData: [
      { label: "Autonome", value: 0 },
      { label: "Exercé", value: 0 },
      { label: "Expliqué", value: 0 },
      { label: "Non expliqué", value: 100 },
    ],
    reportLines: [
      {
        label: "D1 Configurer un réseau VLAN",
        data: [
          { label: "Autonome", value: 0 },
          { label: "Exercé", value: 0 },
          { label: "Expliqué", value: 0 },
          { label: "Non expliqué", value: 100 },
        ],
      },
      {
        label: "D2 Mettre en place un VPN site-à-site",
        data: [
          { label: "Autonome", value: 0 },
          { label: "Exercé", value: 0 },
          { label: "Expliqué", value: 0 },
          { label: "Non expliqué", value: 100 },
        ],
      },
      {
        label: "D3 Superviser le trafic réseau avec des outils de monitoring",
        data: [
          { label: "Autonome", value: 0 },
          { label: "Exercé", value: 0 },
          { label: "Expliqué", value: 0 },
          { label: "Non expliqué", value: 100 },
        ],
      },
    ],
  },
};

// Perfectly balanced distribution across the four levels
export const EqualSplit = {
  args: {
    label: "E Gestion de projet",
    doughnutChartData: [
      { label: "Autonome", value: 25 },
      { label: "Exercé", value: 25 },
      { label: "Expliqué", value: 25 },
      { label: "Non expliqué", value: 25 },
    ],
    reportLines: [
      {
        label: "E1 Planifier les jalons du projet",
        data: [
          { label: "Autonome", value: 25 },
          { label: "Exercé", value: 25 },
          { label: "Expliqué", value: 25 },
          { label: "Non expliqué", value: 25 },
        ],
      },
      {
        label: "E2 Gérer les risques et les ressources",
        data: [
          { label: "Autonome", value: 25 },
          { label: "Exercé", value: 25 },
          { label: "Expliqué", value: 25 },
          { label: "Non expliqué", value: 25 },
        ],
      },
    ],
  },
};

// ── Edge cases ───────────────────────────────────────────────

// No lines — empty reportLines array
export const NoLines = {
  args: {
    label: "F Section vide",
    doughnutChartData: [
      { label: "Autonome", value: 0 },
      { label: "Exercé", value: 0 },
      { label: "Expliqué", value: 0 },
      { label: "Non expliqué", value: 0 },
    ],
    reportLines: [],
  },
};

// Extremely long section title — tests truncation and line wrapping
export const VeryLongLabel = {
  args: {
    label:
      "Z Compétences transversales avancées en matière d'analyse, de conception, d'implémentation, de test et de documentation de solutions ICT complexes dans des environnements distribués",
    doughnutChartData: [
      { label: "Autonome", value: 30 },
      { label: "Exercé", value: 30 },
      { label: "Expliqué", value: 20 },
      { label: "Non expliqué", value: 20 },
    ],
    reportLines: [
      {
        label: "Z1 Appliquer une démarche d'analyse systémique",
        data: [
          { label: "Autonome", value: 30 },
          { label: "Exercé", value: 30 },
          { label: "Expliqué", value: 20 },
          { label: "Non expliqué", value: 20 },
        ],
      },
    ],
  },
};

// Very short section title — tests minimal alignment
export const ShortLabel = {
  args: {
    label: "G",
    doughnutChartData: [
      { label: "Autonome", value: 50 },
      { label: "Exercé", value: 50 },
      { label: "Expliqué", value: 0 },
      { label: "Non expliqué", value: 0 },
    ],
    reportLines: [
      {
        label: "G1 Installer un OS",
        data: [
          { label: "Autonome", value: 50 },
          { label: "Exercé", value: 50 },
          { label: "Expliqué", value: 0 },
          { label: "Non expliqué", value: 0 },
        ],
      },
    ],
  },
};

// Many lines — tests scrolling, density, and mobile grid rendering
export const ManyLines = {
  args: {
    label: "H Maintenance et support informatique",
    doughnutChartData: [
      { label: "Autonome", value: 35 },
      { label: "Exercé", value: 25 },
      { label: "Expliqué", value: 20 },
      { label: "Non expliqué", value: 20 },
    ],
    reportLines: [
      {
        label: "H1 Diagnostiquer les pannes matérielles",
        data: [
          { label: "Autonome", value: 60 },
          { label: "Exercé", value: 20 },
          { label: "Expliqué", value: 10 },
          { label: "Non expliqué", value: 10 },
        ],
      },
      {
        label: "H2 Diagnostiquer les pannes logicielles",
        data: [
          { label: "Autonome", value: 40 },
          { label: "Exercé", value: 30 },
          { label: "Expliqué", value: 20 },
          { label: "Non expliqué", value: 10 },
        ],
      },
      {
        label: "H3 Remplacer des composants défaillants",
        data: [
          { label: "Autonome", value: 80 },
          { label: "Exercé", value: 10 },
          { label: "Expliqué", value: 5 },
          { label: "Non expliqué", value: 5 },
        ],
      },
      {
        label: "H4 Mettre à jour les pilotes et microprogrammes",
        data: [
          { label: "Autonome", value: 20 },
          { label: "Exercé", value: 30 },
          { label: "Expliqué", value: 30 },
          { label: "Non expliqué", value: 20 },
        ],
      },
      {
        label: "H5 Gérer les tickets de support de niveau 1",
        data: [
          { label: "Autonome", value: 50 },
          { label: "Exercé", value: 25 },
          { label: "Expliqué", value: 15 },
          { label: "Non expliqué", value: 10 },
        ],
      },
      {
        label: "H6 Gérer les tickets de support de niveau 2",
        data: [
          { label: "Autonome", value: 10 },
          { label: "Exercé", value: 20 },
          { label: "Expliqué", value: 30 },
          { label: "Non expliqué", value: 40 },
        ],
      },
      {
        label: "H7 Documenter les interventions effectuées",
        data: [
          { label: "Autonome", value: 45 },
          { label: "Exercé", value: 25 },
          { label: "Expliqué", value: 20 },
          { label: "Non expliqué", value: 10 },
        ],
      },
      {
        label: "H8 Assurer la traçabilité du parc informatique",
        data: [
          { label: "Autonome", value: 30 },
          { label: "Exercé", value: 30 },
          { label: "Expliqué", value: 20 },
          { label: "Non expliqué", value: 20 },
        ],
      },
      {
        label: "H9 Former les utilisateurs aux outils bureautiques",
        data: [
          { label: "Autonome", value: 70 },
          { label: "Exercé", value: 15 },
          { label: "Expliqué", value: 10 },
          { label: "Non expliqué", value: 5 },
        ],
      },
      {
        label:
          "H10 Appliquer les procédures de sécurité lors des interventions",
        data: [
          { label: "Autonome", value: 55 },
          { label: "Exercé", value: 20 },
          { label: "Expliqué", value: 15 },
          { label: "Non expliqué", value: 10 },
        ],
      },
      {
        label: "H11 Gérer les sauvegardes et restaurations de données",
        data: [
          { label: "Autonome", value: 25 },
          { label: "Exercé", value: 35 },
          { label: "Expliqué", value: 25 },
          { label: "Non expliqué", value: 15 },
        ],
      },
      {
        label: "H12 Rédiger des rapports d'intervention techniques",
        data: [
          { label: "Autonome", value: 15 },
          { label: "Exercé", value: 20 },
          { label: "Expliqué", value: 30 },
          { label: "Non expliqué", value: 35 },
        ],
      },
    ],
  },
};

// Lines with extremely long labels — tests truncation inside ReportLine
export const VeryLongLineLabels = {
  args: {
    label: "I Compétences transversales",
    doughnutChartData: [
      { label: "Autonome", value: 20 },
      { label: "Exercé", value: 30 },
      { label: "Expliqué", value: 30 },
      { label: "Non expliqué", value: 20 },
    ],
    reportLines: [
      {
        label:
          "I1 Concevoir, implémenter, tester, documenter et adapter des solutions ICT complexes pour répondre aux besoins des parties prenantes dans le respect des processus et standards en vigueur dans l'entreprise. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        data: [
          { label: "Autonome", value: 20 },
          { label: "Exercé", value: 30 },
          { label: "Expliqué", value: 30 },
          { label: "Non expliqué", value: 20 },
        ],
      },
      {
        label:
          "I2 Analyser, concevoir et documenter des architectures de systèmes distribués hautement disponibles tout en garantissant la sécurité et la conformité aux réglementations applicables",
        data: [
          { label: "Autonome", value: 10 },
          { label: "Exercé", value: 20 },
          { label: "Expliqué", value: 40 },
          { label: "Non expliqué", value: 30 },
        ],
      },
    ],
  },
};

// Extreme mix — some lines at 100% Autonomous, others at 100% Unexplained
export const PolarizedLines = {
  args: {
    label: "J Programmation et bases de données",
    doughnutChartData: [
      { label: "Autonome", value: 50 },
      { label: "Exercé", value: 0 },
      { label: "Expliqué", value: 0 },
      { label: "Non expliqué", value: 50 },
    ],
    reportLines: [
      {
        label: "J1 Écrire des requêtes SQL simples",
        data: [
          { label: "Autonome", value: 100 },
          { label: "Exercé", value: 0 },
          { label: "Expliqué", value: 0 },
          { label: "Non expliqué", value: 0 },
        ],
      },
      {
        label: "J2 Optimiser des requêtes SQL complexes",
        data: [
          { label: "Autonome", value: 0 },
          { label: "Exercé", value: 0 },
          { label: "Expliqué", value: 0 },
          { label: "Non expliqué", value: 100 },
        ],
      },
      {
        label: "J3 Modéliser une base de données relationnelle",
        data: [
          { label: "Autonome", value: 100 },
          { label: "Exercé", value: 0 },
          { label: "Expliqué", value: 0 },
          { label: "Non expliqué", value: 0 },
        ],
      },
      {
        label: "J4 Mettre en place une base de données NoSQL",
        data: [
          { label: "Autonome", value: 0 },
          { label: "Exercé", value: 0 },
          { label: "Expliqué", value: 0 },
          { label: "Non expliqué", value: 100 },
        ],
      },
    ],
  },
};
