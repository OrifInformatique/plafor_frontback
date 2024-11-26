import { roundNumber } from "../utils/numberUtils";
import { CalculateModulesAverage, CalculateSubjectAverage } from "../utils/teachingUtils";

/**
 * Displays the details of a teaching domain.
 *
 * @param {?array} subjects Subjects linked to the teaching domain.
 *
 * @param {?array} modules Mouldes linked to the teaching domain.
 *
 * @returns {JSX.Element}
 *
 */
const TeachingDomainTable = ({ subjects = null, modules = null }) =>
{
    let tableHeaders = [];
    let schoolModules = [];
    let nonSchoolModules = [];

    if(subjects && !modules)
    {
        tableHeaders.push("Matière");

        for(let i = 1; i <= 8; i++)
            tableHeaders.push(`Sem. ${i}`);

        tableHeaders.push("Moyenne");

        subjects.forEach(subject =>
        {
            if(subject.grades.length > 8)
            {
                console.error(`The subject ${subject.name} has more than 8 grades.`)
                return;
            }

            while(subject.grades.length < 8)
            {
                subject.grades.push(
                {
                    // Prevent duplicate keys
                    id: Math.random(),
                    grade: null,
                    date: null,
                });
            }

            subject.average = roundNumber(CalculateSubjectAverage(subject));
        })
    }

    else if(!subjects && modules)
    {
        tableHeaders.push("Numéro", "Titre", "Note");

        schoolModules.modules = modules.filter(module => module.is_school);
        nonSchoolModules.modules = modules.filter(module => !module.is_school);

        schoolModules.average = CalculateModulesAverage(schoolModules.modules);
        nonSchoolModules.average = CalculateModulesAverage(nonSchoolModules.modules);
    }

    else
    {
        console.error("The teaching domain has subjects and modules or none of them.")
        return;
    }

    return (
        <table className={`${subjects && "subject-table w-max"}`}>
            <thead>
                <tr>
                    {tableHeaders.map(col => (
                        <th key={col}>{col}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {subjects?.map(subject => (
                    <tr key={subject.id}>
                        <td>
                            {subject.name}
                        </td>

                        {subject.grades?.map(grade => (
                            <td key={grade.id}>
                                {grade.grade}
                            </td>
                        ))}

                        <td>
                            {subject.average}
                        </td>
                    </tr>
                ))}

                {modules && (
                    <>
                        {schoolModules && (
                            <>
                                <tr>
                                    <th colSpan={2}>
                                        Modules professionnels (80%)
                                    </th>

                                    <th>{schoolModules.average}</th>
                                </tr>

                                {schoolModules.modules.map(schoolModule => (
                                    <tr key={schoolModule.id}>
                                        <td>{schoolModule.module_number}</td>

                                        <td>{schoolModule.name}</td>

                                        <td>{schoolModule.grade}</td>
                                    </tr>
                                ))}
                            </>
                        )}

                        {nonSchoolModules && (
                            <>
                                <tr>
                                    <th colSpan={2}>
                                        Modules interentreprises (20%)
                                    </th>

                                    <th>{nonSchoolModules.average}</th>
                                </tr>

                                {nonSchoolModules.modules.map(nonSchoolModule => (
                                    <tr key={nonSchoolModule.id}>
                                        <td>{nonSchoolModule.module_number}</td>

                                        <td>{nonSchoolModule.name}</td>

                                        <td>{nonSchoolModule.grade}</td>
                                    </tr>
                                ))}
                            </>
                        )}
                    </>
                )}
            </tbody>
        </table>
    )
}

export default TeachingDomainTable;