import React, { useEffect, useState } from "react";
import ProgressReport from "../../views/progress-report/ProgressReport";
import {
  getCoursePlans,
  getCoursePlanSections,
} from "../../../../services/api/course-plans";

/**
 * ProgressReportContainer
 *
 * "Smart" component of the progress-report feature. It owns the state
 * (selected course plan + sections), fetches the data through the
 * `course-plans` service, handles loading / errors, then feeds the dumb
 * <ProgressReport /> component. The view stays 100% presentational.
 */
export default function ProgressReportContainer() {
  const [coursePlans, setCoursePlans] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1) Load the list of course plans once, on mount.
  useEffect(() => {
    let ignore = false;

    getCoursePlans()
      .then((plans) => {
        if (ignore) return;
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
      return;
    }

    let ignore = false;

    getCoursePlanSections(selectedId)
      .then((data) => {
        if (!ignore) setSections(data);
      })
      .catch((err) => {
        if (!ignore) setError(err);
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
    setSelectedId(value);
  };

  // Edge states: to be replaced by dedicated components/translations.
  if (loading) {
    return <div data-testid="progress-report-loading">Chargement…</div>;
  }

  if (error) {
    return (
      <div data-testid="progress-report-error">
        Une erreur est survenue lors du chargement des formations.
      </div>
    );
  }

  return (
    <ProgressReport
      coursePlans={coursePlans}
      selectedCoursePlan={selectedCoursePlan}
      onCoursePlanChange={handleCoursePlanChange}
      sections={sections}
    />
  );
}
