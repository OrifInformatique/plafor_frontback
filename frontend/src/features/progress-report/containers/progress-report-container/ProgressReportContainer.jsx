import React, { useEffect, useState } from "react";
import ProgressReport from "../../views/progress-report/ProgressReport";
import {
  getCoursePlans,
  getCoursePlanSections,
} from "../../../../services/api/course-plans";
import { useTranslation } from "react-i18next";
import Loading from "../../../../components/Loading";

/**
 * ProgressReportContainer
 *
 * "Smart" component of the progress-report feature. It owns the state
 * (selected course plan + sections), fetches the data through the
 * `course-plans` service, handles loading / errors, then feeds the dumb
 * <ProgressReport /> component. The view stays 100% presentational.
 */
export default function ProgressReportContainer() {
  const { t } = useTranslation("progressReport");

  const [coursePlans, setCoursePlans] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  // Blocking error: the initial load failed, there is nothing to display.
  const [error, setError] = useState(null);
  // Non-blocking error: only the sections failed, the selector stays usable.
  const [sectionsError, setSectionsError] = useState(null);
  // Sections being (re)loaded after a course plan change.
  const [sectionsLoading, setSectionsLoading] = useState(false);

  // 1) Load the list of course plans once, on mount.
  useEffect(() => {
    let ignore = false;

    getCoursePlans()
      .then((data) => {
        if (ignore) return;
        // Normalize ids to strings once, here at the boundary: a native
        // <select> always reports its value as a string, so aligning the whole
        // feature on strings keeps comparisons (and PropTypes) consistent
        // whatever the API sends.
        const plans = data.map((plan) => ({ ...plan, id: String(plan.id) }));
        setCoursePlans(plans);
        // Convenience: preselect the first course plan if there is one.
        if (plans.length > 0) setSelectedId(plans[0].id);
      })
      .catch((err) => {
        if (!ignore) setError(err);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  // 2) Reload the sections whenever the selected course plan changes.
  useEffect(() => {
    if (!selectedId) {
      setSections([]);
      setSectionsError(null);
      setSectionsLoading(false);
      return;
    }

    let ignore = false;

    // New attempt: drop the previous plan's sections right away, so the old
    // competencies are never shown under the newly selected plan, and reset
    // the previous error.
    setSections([]);
    setSectionsError(null);
    setSectionsLoading(true);

    getCoursePlanSections(selectedId)
      .then((data) => {
        if (!ignore) setSections(data);
      })
      .catch((err) => {
        if (!ignore) setSectionsError(err);
      })
      .finally(() => {
        if (!ignore) setSectionsLoading(false);
      });

    // Safeguard: if the selection changes before the response arrives,
    // we ignore that response (protection against out-of-order responses).
    return () => {
      ignore = true;
    };
  }, [selectedId]);

  // 3) Derived (not state): we look up the full object from the id.
  //    Single source of truth = selectedId.
  const selectedCoursePlan =
    coursePlans.find((cp) => cp.id === selectedId) ?? null;

  // 4) The handler only changes the id; the effect above reloads
  //    the sections on its own.
  const handleCoursePlanChange = (value) => {
    // The native <select> already reports a string; String() states the
    // invariant explicitly in case the selector is ever swapped out.
    setSelectedId(String(value));
  };

  // Edge states.
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center" data-testid="progress-report-error">
        <strong className="text-lg">{t("loading_error")}</strong>
      </div>
    );
  }

  return (
    <ProgressReport
      coursePlans={coursePlans}
      selectedCoursePlan={selectedCoursePlan}
      onCoursePlanChange={handleCoursePlanChange}
      sections={sections}
      isSectionsLoading={sectionsLoading}
      hasSectionsError={Boolean(sectionsError)}
    />
  );
}
