import React from "react";
import ReportBar from "../report-bar/ReportBar";
import "./ReportLine.css";

/**
 * ReportLine component
 *
 * Parent component that pairs a label with a ReportBar.
 * - On large screens: label on the left, bar on the right (single row).
 * - On small screens: label on top, bar below (stacked column).
 * - Long labels are truncated with an ellipsis.
 *
 * @param {Object} props
 * @param {string} props.label - Text label received from the database.
 * @param {Array}  props.data  - Array of { label, value, color?, isEmpty? } passed to ReportBar.
 */
export default function ReportLine({ label = "", data = [] }) {
  return (
    <div className="report-line">
      <span className="report-line__label" title={label}>
        {label}
      </span>
      <div className="report-line__bar-wrapper">
        <ReportBar data={data} />
      </div>
    </div>
  );
}
