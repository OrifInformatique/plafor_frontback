import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import DoughnutChart from "../doughnut-chart/DoughnutChart";
import ReportLine from "../report-line/ReportLine";

/**
 * ReportSection component
 *
 * Parent component that contains :
 *  - a section label
 *  - a DoughnutChart component
 *  - several ReportLine components
 *
 * How this component is displayed:
 *
 * - On large screens:
 *     The label spans the full width at the top.
 *     The DoughnutChart is positioned on the left.
 *     ReportLine components are displayed on the right.
 *
 * - On small screens:
 *     The label spans the full width at the top.
 *     The DoughnutChart is positioned on the left.
 *     ReportLine components are hidden and replaced by a toggle button on the right,
 *     which reveals the detailed ReportLines in a card layout when clicked.
 *
 * @param {Object} props
 * @param {string} props.label             - Section title received from the database.
 * @param {Array}  props.doughnutChartData - Data passed to DoughnutChart.
 * @param {Array}  props.reportLines       - Sets of Data for several ReportLine.
 */

export default function ReportSection({
  label = "",
  doughnutChartData = [],
  reportLines = [],
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="grid [grid-template-areas:'title_title'_'donut_lines'] grid-cols-[auto_1fr] grid-rows-[auto_1fr] pt-3 pr-[5px] pb-[30px] pl-0 gap-[30px] border-t border-[#d0d0d0] max-sm:[grid-template-areas:'title_title'_'donut_toggle'_'lines_lines'] max-sm:grid-cols-2 max-sm:grid-rows-[auto_auto_auto] max-sm:py-3 max-sm:px-0 max-sm:gap-0">
      <div
        className="[grid-area:title] font-semibold text-base overflow-hidden whitespace-nowrap text-ellipsis max-sm:whitespace-normal"
        title={label}
      >
        {label}
      </div>
      <div className="[grid-area:donut] flex items-start justify-center h-[200px] w-[300px] max-sm:h-auto max-sm:w-[130px] max-sm:justify-self-center">
        <DoughnutChart data={doughnutChartData} />
      </div>
      <div className="[grid-area:toggle] hidden max-sm:flex max-sm:justify-center max-sm:items-center">
        <button
          className="flex items-center justify-center w-[100px] py-[3px] border-2 border-[#1a56a0] rounded-[10px] bg-[#1a56a0] text-white text-[0.9rem] font-semibold cursor-pointer whitespace-nowrap [transition:background-color_150ms,color_150ms] hover:bg-white hover:text-[#1a56a0]"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
        >
          Détails {isOpen ? "▲" : "▼"}
        </button>
      </div>
      <div
        data-testid="lines-wrapper"
        className={`[grid-area:lines] flex flex-col justify-start min-h-[200px] gap-[10px] min-w-0 max-sm:min-h-0 max-sm:gap-2 ${isOpen ? "max-sm:grid max-sm:grid-cols-2" : "max-sm:hidden"}`}
      >
        {reportLines.map((reportLine) => (
          <ReportLine
            key={reportLine.label}
            label={reportLine.label}
            data={reportLine.data}
            className="max-sm:h-[200px] max-sm:w-auto max-sm:min-w-0 max-sm:p-[10px] max-sm:border max-sm:border-[#d0d0d0] max-sm:rounded-[8px] max-sm:bg-white"
            labelClassName="max-sm:leading-[1.5] max-sm:h-[9em] max-sm:overflow-auto"
          />
        ))}
      </div>
    </div>
  );
}

ReportSection.propTypes = {
  label: PropTypes.string,
  doughnutChartData: PropTypes.array,
  reportLines: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      data: PropTypes.array,
    }),
  ),
};
