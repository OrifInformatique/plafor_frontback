import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Loading component
 *
 * Loading indicator of the progress-report feature: a text and a spinner.
 * It has no live region role on purpose: its parents already wrap it in a
 * role="status" region, and nesting them would make screen readers announce
 * the text twice.
 */
export default function Loading() {
  const { t } = useTranslation("progressReport");

  return (
    <div className="text-center" data-testid="loading">
      <strong className="text-lg">{t("loading")}</strong>
      <div
        aria-hidden="true"
        className="mx-auto mt-6 size-10 rounded-full border-4 border-[#CCDEEE] border-t-[#005BA9] animate-spin motion-reduce:animate-none"
      />
    </div>
  );
}
