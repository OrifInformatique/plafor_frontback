import StateMessage from "./StateMessage";

const meta = {
  component: StateMessage,
  tags: ["autodocs"],
  args: {
    message: "Aucune compétence n'est encore définie pour cette formation.",
  },
};

export default meta;

// Default: empty state of a formation without competency
export const Default = {};

// Error message — same look, only the text changes
export const ErrorMessage = {
  args: {
    message:
      "Une erreur est survenue lors du chargement des compétences de cette formation.",
  },
};
