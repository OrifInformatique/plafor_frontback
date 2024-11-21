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
    // TODO : Let the possibility to have multiple tables (e.g. for modules) : add table title.
    // TODO : Create function for code below ???
    let tableHeaders = [];

    if(subjects && !modules)
    {
        tableHeaders.push("Matière");

        for(let i = 1; i <= 8; i++)
        {
            tableHeaders.push(`Sem. ${i}`);
        }

        tableHeaders.push("Moyenne");

        /* TODO : Fill subjects grades array with empty values for UI */
        /* TODO : Prevent having more than 8 grades for subjects */
    }

    else if(!subjects && modules)
        tableHeaders.push("Numéro", "Titre", "Note");

    else
    {
        return;
    }

    return (
        /* TODO : Add table title and subject average */
        /* TODO : Make the first column stay when scrolling */
        <table className={`${subjects && "w-max"}`}>
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
                            N/A
                        </td>
                    </tr>
                ))}

                {modules?.map(module => (
                    <tr key={module.id}>
                        <td>
                            {module.module_number}
                        </td>

                        <td>
                            {module.name}
                        </td>

                        <td>
                            {module.grade}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default TeachingDomainTable;