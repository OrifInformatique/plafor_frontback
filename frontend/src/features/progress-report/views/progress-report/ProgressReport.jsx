import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import CoursePlanSelector from "../../components/course-plan-selector/CoursePlanSelector";
import ReportSection from "../../components/report-section/ReportSection";

/**
 * ProgressReport view
 *
 * Composes the "Avancement du plan de formation" screen:
 *  - a CoursePlanSelector (formation picker + dates/status)
 *  - a list of ReportSection, one per competency domain
 *
 * This view is purely presentational/controlled: it receives the course plan
 * list, the active selection and the section data, and forwards them to its
 * children. Data fetching and role-based navigation are handled by the
 * parent page, not by this component.
 *
 * @param {Object}   props
 * @param {Array}    props.coursePlans         - Formations available, forwarded to CoursePlanSelector.
 * @param {Object}   props.selectedCoursePlan  - Currently selected formation, forwarded to CoursePlanSelector.
 * @param {Function} props.onCoursePlanChange  - Called when the user picks another formation.
 * @param {Array}    props.sections            - One entry per competency domain: { id, label, doughnutChartData, reportLines }.
 * @param {boolean}  props.hasSectionsError    - When true, show an error in place of the sections; the selector stays usable.
 */
export default function ProgressReport({
  coursePlans = [],
  selectedCoursePlan = null,
  onCoursePlanChange,
  sections = [],
  hasSectionsError = false,
}) {
  const { t } = useTranslation("progressReport");

  return (
    <div className="flex flex-col gap-6">
      <CoursePlanSelector
        coursePlans={coursePlans}
        selectedCoursePlan={selectedCoursePlan}
        onCoursePlanChange={onCoursePlanChange}
      />

      <h2 className="text-[1.7rem] font-bold text-center py-6 max-sm:text-[1.2rem] max-sm:py-3">{t("title")}</h2>

      <div data-testid="progress-report-sections">
        {hasSectionsError ? (
          <p
            className="text-center"
            data-testid="progress-report-sections-error"
          >
            {t("sections_error")}
          </p>
        ) : (
          sections.map((section) => (
            <ReportSection
              key={section.id}
              label={section.label}
              doughnutChartData={section.doughnutChartData}
              reportLines={section.reportLines}
            />
          ))
        )}
      </div>
    </div>
  );
}

ProgressReport.propTypes = {
  coursePlans: PropTypes.array,
  selectedCoursePlan: PropTypes.object,
  onCoursePlanChange: PropTypes.func,
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string,
      doughnutChartData: PropTypes.array,
      reportLines: PropTypes.array,
    }),
  ),
  hasSectionsError: PropTypes.bool,
};
