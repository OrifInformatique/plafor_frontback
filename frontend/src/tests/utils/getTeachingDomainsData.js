/**
 * Returns teaching domains data that only have subjects.
 *
 * @returns {Object}
 *
 */
export const getTeachingDomainsWithoutSubjectsAndModules = () =>
{
    return [
        {
            "id": 1,
            "title": "Compétences de base élargies",
            "average": 5
        }
    ];
}

/**
 * Returns teaching domains data that only have subjects.
 *
 * @returns {Object}
 *
 */
export const getTeachingDomainsWithSubjects = () =>
{
    return [
        {
            "id": 1,
            "title": "Compétences de base élargies",
            "average": 5,
            "subjects":
            [
                {
                    "id": 1,
                    "name": "Mathématiques",
                    "average": 4,
                    "grades":
                    [
                        { "id": 2, "grade": 4 }
                    ]
                }
            ]
        }
    ];
}

/**
 * Returns teaching domains data that only have modules.
 *
 * @returns {Object}
 *
 */
export const getTeachingDomainsWithModules = () =>
{
    return [
        {
            "id": 1,
            "title": "Compétences de base élargies",
            "average": 5,
            "modules":
            [
                {
                    "id": 1,
                    "module_number": 320,
                    "name": "Programmer orienté objet",
                    "grade": 4.5
                }
            ]
        }
    ];
}

/**
 * Returns teaching domains data that have subjects and modules.
 *
 * @returns {Object}
 *
 */
export const getTeachingDomainsWithSubjectsAndModules = () =>
{
    return [
        {
            "id": 1,
            "title": "Compétences de base élargies",
            "average": 5,
            "subjects":
            [
                {
                    "id": 1,
                    "name": "Mathématiques",
                    "average": 4,
                    "grades":
                    [
                        { "id": 2, "grade": 4 }
                    ]
                }
            ],
            "modules":
            [
                {
                    "id": 1,
                    "module_number": 320,
                    "name": "Programmer orienté objet",
                    "grade": 4.5
                }
            ]
        }
    ];
}

/**
 * Returns teaching domains data that is eliminatory.
 *
 * @returns {Object}
 *
 */
export const getEliminatoryTeachingDomain = () =>
{
    return {
        "id": 1,
        "title": "Compétences de base élargies",
        "is_eliminatory": true,
        "average": 5,
        "subjects":
        [
            {
                "id": 1,
                "name": "Mathématiques",
                "average": 4,
                "grades":
                [
                    { "id": 2, "grade": 4 }
                ]
            }
        ],
    };
}