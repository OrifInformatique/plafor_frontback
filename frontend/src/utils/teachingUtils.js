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
 * Calculates the average of all modules for a domain.
 *
 * @param {array} schoolModules
 *
 * @param {array} nonSchoolModules
 *
 * @returns {float} The average of the modules.
 *
 */
export const CalculateDomainModulesAverage = (schoolModules, nonSchoolModules) =>
{
    const schoolModulesAverage = CalculateModulesAverage(schoolModules);

    const nonSchoolModulesAverage = CalculateModulesAverage(nonSchoolModules);

    return schoolModulesAverage * 0.8 + nonSchoolModulesAverage * 0.2;
}

/**
 * Calculates the average of provided modules.
 * Does not distinguishes school modules from non-school modules.
 *
 * @param {array} modules
 *
 * @returns {float} The average.
 *
 */
export const CalculateModulesAverage = (modules) =>
{
    let modulesAverage = modules.reduce(
        (sum, module) => sum + module.grade, 0) / modules.length;

    modulesAverage = !isNaN(modulesAverage) ? modulesAverage : 0;

    return modulesAverage;
}