import PropTypes from "prop-types";

// PropTypes shapes shared across the progress-report feature.
// They live in their own module, not in the components, so that a parent can
// validate the data it forwards without importing (or, in tests, without
// un-mocking) the child component itself.

// Ids are strings: the container normalizes them at the API boundary, since a
// native <select> always reports its value as a string.
export const coursePlanShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  status: PropTypes.string,
});

export const reportLineShape = PropTypes.shape({
  label: PropTypes.string.isRequired,
  data: PropTypes.array,
});

// Unlike course plan ids, section ids are only used as React keys and are
// never compared to a <select> value, so the raw API id (string or number)
// is accepted as is.
export const reportSectionShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string,
  doughnutChartData: PropTypes.array,
  reportLines: PropTypes.arrayOf(reportLineShape),
});
