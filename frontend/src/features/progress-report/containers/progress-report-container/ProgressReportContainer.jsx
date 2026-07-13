import React, { useState } from "react";
import ProgressReport from "../../views/progress-report/ProgressReport";

export default function ProgressReportContainer() {
  return (
    <ProgressReport
      coursePlans={[]}
      selectedCoursePlan={null}
      onCoursePlanChange={() => {}}
      sections={[]}
    />
  );
}
