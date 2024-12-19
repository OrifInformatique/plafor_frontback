/**
 * Returns a userCourse object for testing.
 *
 * @returns {Object}
 *
 */
export const getMockedUserCourseData = () =>
{
    const currentYear = new Date().getFullYear();

    return {
        "id": 101,
        "course_plan_id": 88605,
        "official_name": "Opératrice en informatique / Opérateur en informatique avec CFC",
        "date_begin": `${currentYear}-08-01`,
        "date_end": `${currentYear + 4}-07-31`,
        "global_average": 5.0,
        "teaching_domains":
        [
            {
                "id": 1,
                "title": "Compétences de base élargies",
                "weight": 0.6,
                "average": 5,
                "is_eliminatory": false,
                "subjects":
                [
                    {
                        "id": 1,
                        "name": "Mathématiques",
                        "average": 2,
                        "grades":
                        [
                            { "id": 1, "grade": 5 },
                            { "id": 2, "grade": 4 }
                        ]
                    },
                    {
                        "id": 2,
                        "name": "Anglais",
                        "average": 3.5,
                        "grades":
                        [
                            { "id": 3, "grade": 1 },
                            { "id": 4, "grade": 6 }
                        ]
                    }
                ]
            },
            {
                "id": 301,
                "title": "Informatique",
                "weight": 0.4,
                "average": 5.5,
                "school_modules_average": 6,
                "non_school_modules_average": 4.5,
                "is_eliminatory": true,
                "modules":
                [
                    {
                        "id": 1,
                        "module_number": 320,
                        "name": "Programmer orienté objet",
                        "grade": 4.5,
                        "is_school": true
                    },
                    {
                        "id": 2,
                        "module_number": 431,
                        "name": "Exécuter des mandats demandés autonome dans son propre environnement professionnel",
                        "grade": 1,
                        "is_school": true
                    },
                    {
                        "id": 3,
                        "module_number": 187,
                        "name": "Mettre en service un poste de travail ICT avec le système d’exploitation",
                        "grade": 1,
                        "is_school": false
                    }
                ]
            }
        ],

        "yearly_reports":
        [
            {
                "year": 1,
                "yearly_average": 5,
                "teaching_domains":
                [
                    {
                        "id": 1,
                        "title": "Compétences de base élargies",
                        "average": 5,
                        "subjects":
                        [
                            {
                                "id": 1,
                                "name": "Mathématiques",
                                "average": 5,
                                "grades": [
                                { "id": 1, "grade": 5 }
                                ]
                            }
                        ]
                    },
                    {
                        "id": 301,
                        "title": "Informatique",
                        "average": 1,
                        "modules":
                        [
                            {
                                "id": 2,
                                "module_number": 431,
                                "name": "Exécuter des mandats demandés autonome dans son propre environnement professionnel",
                                "grade": 1
                            }
                        ]
                    }
                ]
            },
            {
                "year": 2,
                "yearly_average": 4.5,
                "teaching_domains":
                [
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
                            },
                            {
                                "id": 2,
                                "name": "Anglais",
                                "average": 3.5,
                                "grades":
                                [
                                    { "id": 3, "grade": 1 },
                                    { "id": 4, "grade": 6 }
                                ]
                            }
                        ]
                    },
                    {
                        "id": 301,
                        "title": "Informatique",
                        "average": 3,
                        "modules":
                        [
                            {
                                "id": 1,
                                "module_number": 320,
                                "name": "Programmer orienté objet",
                                "grade": 4.5
                            },
                            {
                                "id": 3,
                                "module_number": 187,
                                "name": "Mettre en service un poste de travail ICT avec le système d’exploitation",
                                "grade": 1
                            }
                        ]
                    }
                ]
            }
        ]
    }
}

/**
 * Returns a yearlyUserCourse object for testing.
 *
 * @returns {Object}
 *
 */
export const getMockedYearlyUserCourse = () =>
{
    return {
        "year": 2,
        "yearly_average": 4.5,
        "teaching_domains":
        [
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
                    },
                    {
                        "id": 2,
                        "name": "Anglais",
                        "average": 3.5,
                        "grades":
                        [
                            { "id": 3, "grade": 1 },
                            { "id": 4, "grade": 6 }
                        ]
                    }
                ]
            },
            {
                "id": 301,
                "title": "Informatique",
                "average": 3,
                "modules":
                [
                    {
                        "id": 1,
                        "module_number": 320,
                        "name": "Programmer orienté objet",
                        "grade": 4.5
                    },
                    {
                        "id": 3,
                        "module_number": 187,
                        "name": "Mettre en service un poste de travail ICT avec le système d’exploitation",
                        "grade": 1
                    }
                ]
            }
        ]
    }
}