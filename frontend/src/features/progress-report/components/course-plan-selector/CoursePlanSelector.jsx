import React from "react";
import { SingleSelect } from "@orif-informatique/react-components-library";
import PropTypes from "prop-types";
import "./CoursePlanSelector.css";

export default function CoursePlanSelector({
  coursePlans = [],
  selectedCoursePlan = null,
  onCoursePlanChange,
}) {
  return (
    <div className="course-plan-selector flex flex-col gap-2">
      <SingleSelect
        name="course-plan"
        label="Formation(s) suivie(s)"
        options={coursePlans.map((cp) => ({ value: cp.id, label: cp.label }))}
        selectedValue={selectedCoursePlan?.id}
        onChangeFunction={onCoursePlanChange}
      />
      <div className="flex flex-row justify-between max-sm:flex-col max-sm:gap-1">
        <div className="flex flex-col gap-1 max-sm:flex-row max-sm:justify-between max-sm:items-center">
          <span className="font-semibold text-[0.9rem]">
            Date début :
          </span>
          <span className="text-[0.95rem]">
            {selectedCoursePlan?.startDate}
          </span>
        </div>
        <div className="flex flex-col gap-1 max-sm:flex-row max-sm:justify-between max-sm:items-center">
          <span className="font-semibold text-[0.9rem]">
            Date fin :
          </span>
          <span className="text-[0.95rem]">
            {selectedCoursePlan?.endDate}
          </span>
        </div>
        <div className="flex flex-col gap-1 max-sm:flex-row max-sm:justify-between max-sm:items-center">
          <span className="font-semibold text-[0.9rem]">
            Status de la formation :
          </span>
          <span className="text-[0.95rem]">
            {selectedCoursePlan?.status}
          </span>
        </div>
      </div>
    </div>
  );
}

CoursePlanSelector.propTypes = {
  coursePlans: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      status: PropTypes.string,
    }),
  ),
  selectedCoursePlan: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    status: PropTypes.string,
  }),
  onCoursePlanChange: PropTypes.func,
};
