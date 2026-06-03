import React from "react";
import { SingleSelect } from "@orif-informatique/react-components-library";
import PropTypes from "prop-types";

export default function CoursePlanSelector({
  coursePlans = [],
  selectedCoursePlan = null,
  onCoursePlanChange,
}) {
  return (
    <div className="course-plan-selector">
      <SingleSelect
        name="course-plan"
        label="Formation(s) suivie(s)"
        options={coursePlans.map((cp) => ({ value: cp.id, label: cp.label }))}
        selectedValue={selectedCoursePlan?.id}
        onChangeFunction={onCoursePlanChange}
      />
      <div className="course-plan-selector__info">
        <span>Date début</span>
        <span>{selectedCoursePlan?.startDate}</span>
        <span>Date fin</span>
        <span>{selectedCoursePlan?.endDate}</span>
        <span>Status de la formation</span>
        <span>{selectedCoursePlan?.status}</span>
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
