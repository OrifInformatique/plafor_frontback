/**
 * Calculates the average of a subject.
 *
 * @param {array} subject
 *
 * @returns {number} The average of the subject.
 *
 */
export const CalculateSubjectAverage = (subject) =>
{
    if(subject.grades?.length < 1)
        return 0;

    // Ignore the null values to correctly calculate the average.
    const gradesFiltered = subject.grades.filter(grade => grade && grade.grade !== null);

    if(gradesFiltered.length < 1)
        return 0;

    return gradesFiltered.reduce(
        (sum, grade) => sum + grade.grade, 0) / gradesFiltered.length;
}

/**
 * Calculates the average of modules.
 *
 * @param {array} schoolModules
 *
 * @param {array} nonSchoolModules
 *
 * @returns {float} The average of the modules.
 *
 */
export const CalculateModulesAverage = (schoolModules, nonSchoolModules) =>
{
    let schoolModulesAverage = schoolModules.reduce(
        (sum, module) => sum + module.grade, 0) / schoolModules.length;

    schoolModulesAverage = !isNaN(schoolModulesAverage) ? schoolModulesAverage : 0;

    let nonSchoolModulesAverage = nonSchoolModules.reduce(
        (sum, module) => sum + module.grade, 0) / nonSchoolModules.length;

    nonSchoolModulesAverage = !isNaN(nonSchoolModulesAverage) ? nonSchoolModulesAverage : 0;

    return schoolModulesAverage * 0.8 + nonSchoolModulesAverage * 0.2;
}