/**
 * ReportBar.jsx
 *
 * Reusable progress bar component built with div elements and the CSS property "flex-basis".
 * - Automatically normalizes incoming data (strings → numbers, non-finite → 0, negatives → 0).
 * - Handles empty / invalid data by rendering a gray 100% fallback bar.
 * - Fully responsive: inherits the width of its container.
 *
 * Expected data order (exported as CATEGORY_ORDER for callers):
 *   Autonome → Exercé → Expliqué → Non expliqué
 */

import React from "react";
import { useTranslation } from "react-i18next";

// Default colors: autonome, exercé, expliqué, non expliqué
const DEFAULT_COLORS = ["#005BA9", "#4D8DC3", "#CCDEEE", "#F2F2F7"];

// Order of mastery levels (highest → lowest)
export const CATEGORY_ORDER = [
  "Autonome",
  "Exercé",
  "Expliqué",
  "Non expliqué",
];

/**
 * Ensures the incoming dataset is always valid.
 * If no data is provided, a gray 100% bar is returned.
 * Negative values are clamped to 0 (no visual meaning in a bar).
 * The fallback label is received already translated, so this stays a pure
 * function (shown in the title of the gray fallback bar).
 *
 * @param {Array}  data
 * @param {string} emptyLabel - Translated label of the fallback segment.
 * @returns {Array<{ label: string, value: number, color: string, isEmpty: boolean }>}
 */
function normalizeData(data, emptyLabel) {
  if (!Array.isArray(data) || data.length === 0) {
    return [
      {
        label: emptyLabel,
        value: 100,
        color: "#E0E0E0",
        isEmpty: true,
      },
    ];
  }

  return data.map((item = {}, i) => {
    const rawValue = Number(item.value);
    const safeValue = Number.isFinite(rawValue) ? Math.max(0, rawValue) : 0;

    return {
      label: item.label ?? `Item ${i + 1}`,
      value: safeValue,
      color: item.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
      isEmpty: item.isEmpty === true,
    };
  });
}

/**
 * ReportBar component
 *
 * @param {Object}  props
 * @param {Array}   props.data - Array of { label, value, color?, isEmpty? }
 */
export default function ReportBar({ data = [] }) {
  const { t } = useTranslation("progressReport");
  const segments = normalizeData(data, t("no_data"));
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="flex h-full min-h-4 min-w-[110px] rounded-[7px] overflow-hidden ring-[3px] ring-[#8e8e93]">
      {segments.map((segment, i) => {
        const width = total > 0 ? (segment.value / total) * 100 : 0;
        return (
          <div
            key={i}
            data-testid="report-bar-segment"
            className="shrink-0 [transition:flex-basis_600ms_ease]"
            style={{
              flexBasis: `${width}%`,
              backgroundColor: segment.color,
            }}
            title={`${segment.label}: ${Math.round(width)}%`}
          />
        );
      })}
    </div>
  );
}
