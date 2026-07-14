import { apiGet } from "./http";

export const getCoursePlans = () => apiGet("/course-plans");
export const getCoursePlanSections = (id) =>
  apiGet(`/course-plans/${id}/sections`);
