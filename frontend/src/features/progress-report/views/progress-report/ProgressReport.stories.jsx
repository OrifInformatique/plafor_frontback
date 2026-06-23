import ProgressReport from "./ProgressReport";
import fixture from "./__fixtures__/progress-report-data.json";

const meta = {
  component: ProgressReport,
  tags: ["autodocs"],
  args: {
    coursePlans: fixture.coursePlans,
    selectedCoursePlan: fixture.selectedCoursePlan,
    sections: fixture.sections,
  },
};

export default meta;

// Default: a formation with several competency domains
export const Default = {};

// No course plan selected yet
export const NoCoursePlanSelected = {
  args: {
    selectedCoursePlan: null,
  },
};

// No section data yet (e.g. formation just started)
export const NoSections = {
  args: {
    sections: [],
  },
};
