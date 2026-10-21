import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import CoursePlanSelector from "../../components/course-plan-selector/CoursePlanSelector";
import ReportSection from "../../components/report-section/ReportSection";
import StateMessage from "../../components/state-message/StateMessage";
import Loading from "../../../../components/Loading";
import { coursePlanShape, reportSectionShape } from "../../prop-types";

/**
 * ProgressReport view
 *
 * Composes the "Avancement du plan de formation" screen:
 *  - a CoursePlanSelector (formation picker + dates/status)
 *  - a list of ReportSection, one per competency domain
 *
 * This view is controlled: it receives the course plan list, the active
 * selection and the section data, and forwards them to its children. It holds
 * no state and fetches nothing; it only decides what the sections area shows
 * (loading indicator, error, empty state or the sections themselves) from the
 * flags it receives. Data fetching belongs to the parent container.
 *
 * @param {Object}      props
 * @param {Array}       props.coursePlans         - Formations available, forwarded to CoursePlanSelector.
 * @param {Object|null} props.selectedCoursePlan  - Currently selected formation, forwarded to CoursePlanSelector.
 * @param {Function}    props.onCoursePlanChange  - Called with the id of the formation the user picks.
 * @param {Array}       props.sections            - One entry per competency domain: { id, label, doughnutChartData, reportLines }.
 *                                                  When empty and a formation is selected, an empty-state message is shown.
 * @param {boolean}     props.isSectionsLoading   - When true, show a loading indicator in place of the sections.
 * @param {boolean}     props.hasSectionsError    - When true, show an error in place of the sections; the selector stays usable.
 */
export default function ProgressReport({
  coursePlans = [],
  selectedCoursePlan = null,
  onCoursePlanChange,
  sections = [],
  isSectionsLoading = false,
  hasSectionsError = false,
}) {
  const { t } = useTranslation("progressReport");

  // Default values only cover undefined: a null or malformed API payload
  // falls back to "no section" instead of crashing, like the charts do.
  const safeSections = Array.isArray(sections) ? sections : [];

  // Only the sections area varies: loading, then error, then the empty state,
  // then the data itself. The empty state must come after loading and error,
  // since sections are also [] while (re)loading and after a failed load.
  const showError = !isSectionsLoading && hasSectionsError;
  // Without a selected formation, "no competency for this formation" makes no sense.
  const showEmpty =
    !isSectionsLoading &&
    !hasSectionsError &&
    selectedCoursePlan !== null &&
    safeSections.length === 0;
  const showSections = !isSectionsLoading && !hasSectionsError;

  return (
    <div className="flex flex-col gap-6">
      <CoursePlanSelector
        coursePlans={coursePlans}
        selectedCoursePlan={selectedCoursePlan}
        onCoursePlanChange={onCoursePlanChange}
      />

      <h2 className="text-[1.7rem] font-bold text-center py-6 max-sm:text-[1.2rem] max-sm:py-3">
        {t("title")}
      </h2>

      {/* Groups the sections area so the always-mounted (often empty) live
          regions below do not add extra gaps to the flex column. */}
      <div>
        {/* Both live regions stay mounted and only their content changes:
            screen readers reliably announce changes inside a live region that
            already exists, not a region inserted together with its text.
            The loading and empty states are not urgent (status, polite);
            the error is (alert, assertive). */}
        <div role="status" data-testid="progress-report-sections-status">
          {isSectionsLoading && <Loading />}
          {showEmpty && (
            <StateMessage
              message={t("sections_empty")}
              testId="progress-report-sections-empty"
            />
          )}
        </div>

        <div role="alert" data-testid="progress-report-sections-alert">
          {showError && (
            <StateMessage
              message={t("sections_error")}
              testId="progress-report-sections-error"
            />
          )}
        </div>

        <div data-testid="progress-report-sections">
          {showSections &&
            safeSections.map((section) => (
              <ReportSection
                key={section.id}
                label={section.label}
                doughnutChartData={section.doughnutChartData}
                reportLines={section.reportLines}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

ProgressReport.propTypes = {
  coursePlans: PropTypes.arrayOf(coursePlanShape),
  selectedCoursePlan: coursePlanShape,
  onCoursePlanChange: PropTypes.func,
  sections: PropTypes.arrayOf(reportSectionShape),
  isSectionsLoading: PropTypes.bool,
  hasSectionsError: PropTypes.bool,
};
