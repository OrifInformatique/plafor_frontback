import React from "react";
import PropTypes from "prop-types";
import ReportBar from "../report-bar/ReportBar";

/**
 * ReportLine component
 *
 * Parent component that pairs a label with a ReportBar.
 * - On large screens: label on the left, bar on the right (single row).
 * - On small screens: label on top, bar below (stacked column).
 * - Long labels are truncated with an ellipsis.
 *
 * @param {Object} props
 * @param {string} props.label          - Text label received from the database.
 * @param {Array}  props.data           - Array of { label, value, color?, isEmpty? } passed to ReportBar.
 * @param {string} props.className      - Extra classes applied to the outer wrapper (e.g. card styles from a parent).
 * @param {string} props.labelClassName - Extra classes applied to the label span (e.g. height constraint in card mode).
 */
export default function ReportLine({ label = "", data = [], className = "", labelClassName = "" }) {
  return (
    <div className={`flex flex-row items-center gap-10 w-full max-sm:flex-col max-sm:justify-between max-sm:items-start max-sm:gap-[15px] ${className}`}>
      <span
        className={`flex-1 basis-0 min-w-[100px] overflow-hidden whitespace-nowrap text-ellipsis max-sm:flex-none max-sm:whitespace-normal max-sm:w-full ${labelClassName}`}
        title={label}
      >
        {label}
      </span>
      <div className="shrink-0 grow-0 basis-[200px] h-5 max-sm:flex-none max-sm:w-full max-sm:h-[18px]">
        <ReportBar data={data} />
      </div>
    </div>
  );
}

ReportLine.propTypes = {
  label: PropTypes.string,
  data: PropTypes.array,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
};
