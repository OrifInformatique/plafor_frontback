import React from "react";
import PropTypes from "prop-types";
import ReportBar from "../report-bar/ReportBar";

/**
 * ReportLine component
 *
 * Parent component that pairs a label with a ReportBar.
 * - On large screens (lg and up): label on the left, bar on the right (single row).
 * - On small and medium screens (below lg, tablets included): label on top, bar below (stacked column).
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
    <div className={`flex flex-row items-center gap-10 w-full max-lg:flex-col max-lg:justify-between max-lg:items-start max-lg:gap-[15px] ${className}`}>
      <span
        className={`flex-1 basis-0 min-w-[100px] overflow-hidden whitespace-nowrap text-ellipsis max-lg:flex-none max-lg:whitespace-normal max-lg:w-full ${labelClassName}`}
        title={label}
      >
        {label}
      </span>
      <div className="shrink-0 grow-0 basis-[200px] h-5 max-lg:flex-none max-lg:w-full max-lg:h-[18px]">
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
