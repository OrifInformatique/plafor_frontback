import api from "../../../template/auth/apiClient";

// Goes through the template's shared client: it targets BACKEND_API_URL,
// attaches the Bearer token and refreshes the session on a 401.
//
// Unlike the template's own api modules, errors are NOT caught here: the
// container relies on a rejected promise to show its error states. Returning
// [] instead would display "no course plan" when the request actually failed.

/**
 * Gets the course plans of the current user.
 *
 * @returns {Promise<Array>}
 */
export const getCoursePlans = async () => {
  const response = await api.get("/course-plans");
  return response.data;
};

/**
 * Gets the report sections (skills) of a course plan.
 *
 * @param {string} id ID of the course plan.
 * @returns {Promise<Array>}
 */
export const getCoursePlanSections = async (id) => {
  const response = await api.get(`/course-plans/${id}/sections`);
  return response.data;
};
