import React, { useState } from "react";
import ProgressReport from "../../views/progress-report/ProgressReport";

export default function ProgressReportContainer() {
  const [coursePlans, setCoursePlans] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [sections, setSections] = useState([]);

  const selectedCoursePlan =
    coursePlans.find((cp) => cp.id === selectedId) ?? null;

  return (
    <ProgressReport
      coursePlans={coursePlans}
      selectedCoursePlan={selectedCoursePlan}
      onCoursePlanChange={() => {}}
      sections={sections}
    />
  );
}
