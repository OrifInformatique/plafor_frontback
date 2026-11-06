import React from "react";
import PropTypes from "prop-types";

/**
 * StateMessage component
 *
 * Centered, bold message shown in place of content that cannot be displayed
 * (empty data, loading error...). It uses the same markup as the text of the
 * shared <Loading /> component, so that a message replacing the loading
 * indicator keeps the same look and position.
 *
 * @param {Object} props
 * @param {string} props.message - Already translated text to display.
 * @param {string} props.testId  - data-testid of the wrapper, so each state stays targetable in tests.
 */
export default function StateMessage({ message = "", testId }) {
  return (
    <div className="text-center" data-testid={testId}>
      <strong className="text-lg">{message}</strong>
    </div>
  );
}

StateMessage.propTypes = {
  message: PropTypes.string,
  testId: PropTypes.string,
};
