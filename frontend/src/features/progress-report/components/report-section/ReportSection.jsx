import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { reportLineShape } from "../../prop-types";
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
 * - On large screens (lg and up):
 *     The label spans the full width at the top.
 *     The DoughnutChart is positioned on the left.
 *     ReportLine components are displayed on the right.
 *
 * - On small and medium screens (below lg, tablets included, where the
 *   desktop layout would make the bars overflow):
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
  const { t } = useTranslation("progressReport");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="grid [grid-template-areas:'title_title'_'donut_lines'] grid-cols-[auto_1fr] grid-rows-[auto_1fr] pt-3 pr-[5px] pb-[30px] pl-0 gap-[30px] border-t border-[#d0d0d0] max-lg:[grid-template-areas:'title_title'_'donut_toggle'_'lines_lines'] max-lg:grid-cols-2 max-lg:grid-rows-[auto_auto_auto] max-lg:py-3 max-lg:px-0 max-lg:gap-0">
      {/* h3: sits under the h2 title of the ProgressReport view, so screen
          reader users can jump from one competency domain to the next. */}
      <h3
        className="[grid-area:title] font-semibold text-base overflow-hidden whitespace-nowrap text-ellipsis max-lg:whitespace-normal"
        title={label}
      >
        {label}
      </h3>
      <div className="[grid-area:donut] flex items-start justify-center h-[200px] w-[300px] max-lg:h-auto max-lg:w-[130px] max-lg:justify-self-center">
        <DoughnutChart data={doughnutChartData} />
      </div>
      <div className="[grid-area:toggle] hidden max-lg:flex max-lg:justify-center max-lg:items-center">
        <button
          className="flex items-center justify-center w-[100px] py-[3px] border-2 border-[#1a56a0] rounded-[10px] bg-[#1a56a0] text-white text-[0.9rem] font-semibold cursor-pointer whitespace-nowrap [transition:background-color_150ms,color_150ms] hover:bg-white hover:text-[#1a56a0]"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
        >
          {t("details")}{" "}
          {/* Decorative: aria-expanded already tells the open/closed state,
              so screen readers must not read "black up-pointing triangle". */}
          <span aria-hidden="true">{isOpen ? "▲" : "▼"}</span>
        </button>
      </div>
      <div
        data-testid="lines-wrapper"
        className={`[grid-area:lines] flex flex-col justify-start min-h-[200px] gap-[10px] min-w-0 max-lg:min-h-0 max-lg:gap-2 ${isOpen ? "max-lg:grid max-lg:grid-cols-2" : "max-lg:hidden"}`}
      >
        {reportLines.map((reportLine) => (
          <ReportLine
            key={reportLine.label}
            label={reportLine.label}
            data={reportLine.data}
            className="max-lg:h-[200px] max-lg:w-auto max-lg:min-w-0 max-lg:p-[10px] max-lg:border max-lg:border-[#d0d0d0] max-lg:rounded-[8px] max-lg:bg-white"
            labelClassName="max-lg:leading-[1.5] max-lg:h-[9em] max-lg:overflow-auto"
          />
        ))}
      </div>
    </div>
  );
}

ReportSection.propTypes = {
  label: PropTypes.string,
  doughnutChartData: PropTypes.array,
  reportLines: PropTypes.arrayOf(reportLineShape),
};
