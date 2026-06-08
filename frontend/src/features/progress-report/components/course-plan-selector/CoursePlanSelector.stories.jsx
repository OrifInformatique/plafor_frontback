import CoursePlanSelector from "./CoursePlanSelector";

const meta = {
  component: CoursePlanSelector,
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
        "Informaticienne / informaticien avec CFC, orientation développement d'applications",
      startDate: "01.08.2025",
      endDate: "31.07.2029",
      status: "En cours",
    },
  },
};

export default meta;

// Default: Multiple courses available, one is selected
export const Default = {};

// No course plan selected yet — info section is empty
export const NoSelection = {
  args: {
    selectedCoursePlan: null,
  },
};

// Only one course plan available — selector is disabled, formation is pre-selected
export const SingleCoursePlan = {
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
    ],

    selectedCoursePlan: {
      id: "1",
      label:
        "Informaticienne / informaticien avec CFC, orientation développement d’applications",
      startDate: "01.08.2025",
      endDate: "31.07.2029",
      status: "En cours",
    },
  },
};

// Formation name exceeds typical length — tests label truncation in the dropdown
export const LongLabel = {
  args: {
    coursePlans: [
      {
        id: "1",
        label:
          "Informaticienne / informaticien avec CFC, orientation développement d’applications et des systèmes d’information complexes en environnement professionnel et multi-plateformes",
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
        "Informaticienne / informaticien avec CFC, orientation développement d’applications. Test for a very long Label : Pour lancer les tests de votre application React, ouvrez votre terminal à la racine du projet et exécutez la commande du script de test configuré dans votre fichier",
      startDate: "01.08.2025",
      endDate: "31.07.2029",
      status: "En cours",
    },
  },
};
