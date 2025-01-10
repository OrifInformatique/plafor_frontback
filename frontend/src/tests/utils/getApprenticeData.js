/**
 * Returns apprentice data for testing.
 *
 * @returns {Object}
 *
 */
export const getApprenticeData = () =>
{
    return {
        "user_id": 1,
        "username": "Testing Apprentice",
        "fk_trainer": 1,
        "user_courses":
        [
            {
                "id": 1,
                "course_plan_id": 1,
                "official_name": "The official name for a test course plan.",
                "global_average": 1.0
            }
        ]
    }
}