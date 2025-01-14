/**
 * Returns teaching domains data that don't have any subjects or modules.
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

/**
 * Returns a subject.
 *
 * @returns {Object}
 *
 */
export const getSubject = () =>
{
    return [
        {
            "id": 1,
            "name": "Mathématiques",
            "average": 4,
            "grades":
            [
                { "id": 1, "grade": 4 },
                { "id": 2, "grade": 3.5 },
                { "id": 3, "grade": 5 },
                { "id": 4, "grade": 5 },
                { "id": 5, "grade": 2.5 },
                { "id": 6, "grade": 6 },
                { "id": 7, "grade": 1.5 },
                { "id": 8, "grade": 5.5 },
            ]
        }
    ];
}

/**
 * Returns a subject having a few grades.
 *
 * @returns {Object}
 *
 */
export const getSubjectsWithoutGrades = () =>
{
    return [
        {
            "id": 1,
            "name": "Mathématiques",
            "average": 3.5
        }
    ];
}

/**
 * Returns a subject having too many grades.
 *
 * @returns {Object}
 *
 */
export const getSubjectsWithTooManyGrades = () =>
{
    return [
        {
            "id": 1,
            "name": "Mathématiques",
            "average": 4,
            "grades":
            [
                { "id": 1, "grade": 4 },
                { "id": 2, "grade": 4 },
                { "id": 3, "grade": 4 },
                { "id": 4, "grade": 4 },
                { "id": 5, "grade": 4 },
                { "id": 6, "grade": 4 },
                { "id": 7, "grade": 4 },
                { "id": 8, "grade": 4 },
                { "id": 9, "grade": 4 },
                { "id": 10, "grade": 4 },
            ]
        }
    ];
}

/**
 * Returns a school module.
 *
 * @returns {Object}
 *
 */
export const getSchoolModule = () =>
{
    return [
        {
            "id": 1,
            "module_number": 320,
            "name": "Programmer orienté objet",
            "grade": 4.5,
            "is_school": true
        }
    ];
}

/**
 * Returns a non school module.
 *
 * @returns {Object}
 *
 */
export const getNonSchoolModule = () =>
{
    return [
        {
            "id": 1,
            "module_number": 320,
            "name": "Programmer orienté objet",
            "grade": 4.5,
            "is_school": false
        }
    ];
}

/**
 * Returns a school and non school module.
 *
 * @returns {Object}
 *
 */
export const getSchoolAndNonSchoolModules = () =>
{
    return [
        {
            "id": 1,
            "module_number": 320,
            "name": "Programmer orienté objet",
            "grade": 4.5,
            "is_school": true
        },
        {
            "id": 2,
            "module_number": 163,
            "name": "Appliquer la protection des données",
            "grade": 2.5,
            "is_school": false
        }
    ];
}