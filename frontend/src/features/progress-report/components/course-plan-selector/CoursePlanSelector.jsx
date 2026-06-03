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
    <div className="course-plan-selector">
      <SingleSelect
        name="course-plan"
        label="Formation(s) suivie(s)"
        options={coursePlans.map((cp) => ({ value: cp.id, label: cp.label }))}
        selectedValue={selectedCoursePlan?.id}
        onChangeFunction={onCoursePlanChange}
      />
      <div className="course-plan-selector__info">
        <div className="course-plan-selector__info-block">
          <span className="course-plan-selector__info-block-label">
            Date début :
          </span>
          <span className="course-plan-selector__info-block-value">
            {selectedCoursePlan?.startDate}
          </span>
        </div>
        <div className="course-plan-selector__info-block">
          <span className="course-plan-selector__info-block-label">
            Date fin :
          </span>
          <span className="course-plan-selector__info-block-value">
            {selectedCoursePlan?.endDate}
          </span>
        </div>
        <div className="course-plan-selector__info-block">
          <span className="course-plan-selector__info-block-label">
            Status de la formation :
          </span>
          <span className="course-plan-selector__info-block-value">
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
