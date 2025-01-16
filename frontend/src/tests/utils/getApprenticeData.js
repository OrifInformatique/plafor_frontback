/**
 * Returns apprentice summary data for testing.
 *
 * @returns {Object}
 *
 */
export const getApprenticeSummary = () =>
{
    return {
        apprentices:
        {
            "user_id": 1,
            "username": "Testing Apprentice",
            "fk_trainer": 1,
            "user_courses":
            {
                "id": 1,
                "course_plan_id": 1,
                "official_name": "The official name for a test course plan.",
                "global_average": 1.0
            }
        },

        trainers:
        [
            {
                "user_id": 1,
                "username": "Testing trainer"
            }
        ]
    }
}

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
        "user_course":
        {
            "id": 1,
            "course_plan_id": 1,
            "official_name": "The official name for a test course plan.",
            "global_average": 1.0,
            "teaching_domains":
            [
                {
                    "id": 1,
                    "title": "Testing Teaching Domain",
                    "weight": 1,
                    "average": 1.0,
                    "is_eliminatory": false,
                    "subjects":
                    [
                        {
                            "id": 1,
                            "name": "Testing Teaching Subject",
                            "average": 1,
                            "grades":
                            [
                                { "id": 1, "grade": 1 }
                            ]
                        }
                    ]
                },
            ]
        }
    }
}
