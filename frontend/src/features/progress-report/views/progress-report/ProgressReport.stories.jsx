import ProgressReport from "./ProgressReport";

const meta = {
  component: ProgressReport,
  tags: ["autodocs"],
  args: {
    coursePlans: [
      {
        id: "1",
        label:
          "Informaticienne / informaticien avec CFC, orientation développement d’applications",
        startDate: "01.08.2025",
        endDate: "31.07.2029",
        status: "En cours",
      },
      {
        id: "2",
        label:
          "[2014-2020] Informaticienne, informaticien avec CFC, orientation développement d’applications",
        startDate: "01.08.2020",
        endDate: "31.07.2022",
        status: "Abandonnée",
      },
    ],

    selectedCoursePlan: {
      id: "1",
      label:
        "Informaticienne / informaticien avec CFC, orientation développement d’applications",
      startDate: "01.08.2025",
      endDate: "31.07.2029",
      status: "En cours",
    },

    // Section A: full spectrum of mastery levels across its lines
    // Section B: a struggling domain, skewed towards "Non expliqué"
    // Section H: a strong domain, skewed towards "Autonome"
    sections: [
      {
        id: "A",
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
            // Not started yet — every level at 0
            label: "A2 Définir un modèle de procédure pour un projet ICT",
            data: [
              { label: "Autonome", value: 0 },
              { label: "Exercé", value: 0 },
              { label: "Expliqué", value: 0 },
              { label: "Non expliqué", value: 0 },
            ],
          },
          {
            // Strong mastery
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
            // Fully mastered — 100% Autonome
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
            // Polarized — only explained or not, nothing practiced yet
            label: "A5 Visualiser et présenter les variantes de solutions ICT",
            data: [
              { label: "Autonome", value: 0 },
              { label: "Exercé", value: 0 },
              { label: "Expliqué", value: 50 },
              { label: "Non expliqué", value: 50 },
            ],
          },
          {
            // Perfectly balanced across the four levels
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
            label:
              "A7 Remettre la solution ICT au client et clôturer le projet",
            data: [
              { label: "Autonome", value: 60 },
              { label: "Exercé", value: 10 },
              { label: "Expliqué", value: 15 },
              { label: "Non expliqué", value: 15 },
            ],
          },
        ],
      },
      {
        id: "B",
        label: "B Assistance et conseils dans l'environnement ICT",
        doughnutChartData: [
          { label: "Autonome", value: 15 },
          { label: "Exercé", value: 20 },
          { label: "Expliqué", value: 25 },
          { label: "Non expliqué", value: 40 },
        ],
        reportLines: [
          {
            // Not started yet
            label: "B1 Installer un PC monoposte",
            data: [
              { label: "Autonome", value: 0 },
              { label: "Exercé", value: 0 },
              { label: "Expliqué", value: 0 },
              { label: "Non expliqué", value: 0 },
            ],
          },
          {
            // One bright spot in an otherwise struggling section
            label: "B2 Configurer un réseau local",
            data: [
              { label: "Autonome", value: 80 },
              { label: "Exercé", value: 10 },
              { label: "Expliqué", value: 5 },
              { label: "Non expliqué", value: 5 },
            ],
          },
          {
            // Balanced
            label: "B3 Diagnostiquer une panne réseau",
            data: [
              { label: "Autonome", value: 25 },
              { label: "Exercé", value: 25 },
              { label: "Expliqué", value: 25 },
              { label: "Non expliqué", value: 25 },
            ],
          },
          {
            // Mostly unexplained — low mastery
            label: "B4 Sécuriser un poste de travail",
            data: [
              { label: "Autonome", value: 5 },
              { label: "Exercé", value: 10 },
              { label: "Expliqué", value: 15 },
              { label: "Non expliqué", value: 70 },
            ],
          },
        ],
      },
      {
        id: "H",
        label: "H Délivrance et fonctionnement des applications",
        doughnutChartData: [
          { label: "Autonome", value: 65 },
          { label: "Exercé", value: 20 },
          { label: "Expliqué", value: 10 },
          { label: "Non expliqué", value: 5 },
        ],
        reportLines: [
          {
            // Fully mastered
            label:
              "H1 Définir la plateforme appropriée pour la livraison des applications",
            data: [
              { label: "Autonome", value: 100 },
              { label: "Exercé", value: 0 },
              { label: "Expliqué", value: 0 },
              { label: "Non expliqué", value: 0 },
            ],
          },
          {
            // Mostly practiced, not yet fully autonomous
            label: "H2 Documenter les procédures de déploiement",
            data: [
              { label: "Autonome", value: 10 },
              { label: "Exercé", value: 70 },
              { label: "Expliqué", value: 15 },
              { label: "Non expliqué", value: 5 },
            ],
          },
          {
            // Extreme polarization — either fully mastered or not started
            label:
              "H3 Surveiller le fonctionnement des applications en production",
            data: [
              { label: "Autonome", value: 50 },
              { label: "Exercé", value: 0 },
              { label: "Expliqué", value: 0 },
              { label: "Non expliqué", value: 50 },
            ],
          },
        ],
      },
    ],
  },
};

export default meta;

// Default: a formation with several competency domains
export const Default = {};

// No course plan selected yet — selector shown, but no info/sections below
export const NoCoursePlanSelected = {
  args: {
    selectedCoursePlan: null,
    sections: [],
  },
};

// Only one competency domain — minimal case with real content
export const SingleSection = {
  args: {
    sections: [meta.args.sections[0]],
  },
};

// Many competency domains — tests page length and stacking of ReportSections
export const ManySections = {
  args: {
    sections: [
      ...meta.args.sections,
      {
        id: "C",
        label: "C Développement applicatif",
        doughnutChartData: [
          { label: "Autonome", value: 30 },
          { label: "Exercé", value: 30 },
          { label: "Expliqué", value: 25 },
          { label: "Non expliqué", value: 15 },
        ],
        reportLines: [
          {
            label: "C1 Analyser et structurer les besoins",
            data: [
              { label: "Autonome", value: 50 },
              { label: "Exercé", value: 30 },
              { label: "Expliqué", value: 15 },
              { label: "Non expliqué", value: 5 },
            ],
          },
        ],
      },
      {
        id: "D",
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
        ],
      },
      {
        id: "E",
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
        ],
      },
    ],
  },
};

// Selected formation is an old, abandoned course plan — view must still render normally
export const AbandonedCoursePlanSelected = {
  args: {
    selectedCoursePlan: {
      id: "2",
      label:
        "[2014-2020] Informaticienne, informaticien avec CFC, orientation développement d’applications",
      startDate: "01.08.2020",
      endDate: "31.07.2022",
      status: "Abandonnée",
    },
  },
};

// Only one formation available — CoursePlanSelector renders disabled/pre-selected
export const SingleCoursePlan = {
  args: {
    coursePlans: [meta.args.coursePlans[0]],
  },
};
