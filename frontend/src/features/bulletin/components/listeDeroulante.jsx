import React from "react";

const ListeDeroulante = ({
    typeMatiere,
    dateDebutFormation,
    type = "matiere",

    // Utilisés uniquement pour les modules
    dataModuleEcole,
    matiereModuleEcole,
    dataModuleInterentreprise,
    matiereModuleInterentreprise,
}) => {

    function getSemestre(dateDebut, dateNote) {
        const debut = new Date(dateDebut);
        const note = new Date(dateNote);

        let moisEcoules =
            (note.getFullYear() - debut.getFullYear()) * 12 +
            (note.getMonth() - debut.getMonth());

        // Supposant que la fin du semestre finis le 20 février
        if (note.getDate() < 20) {
            moisEcoules--;
        }

        const semestre = Math.floor(moisEcoules / 6) + 1;

        return Math.min(Math.max(semestre, 1), 8);
    }

    switch (type) {

        // ============================================================
        // MATIÈRES
        // ============================================================

        case "matiere":
            return (
                <tr className="w-full">
                    <td colSpan="4" className="p-4">
                        <table className="w-full">
                            <tbody>

                                {typeMatiere.map((matiere) => (
                                    <React.Fragment
                                        key={matiere.teaching_subject_id}
                                    >
                                        <tr>
                                            <td className="text-left p-2 font-bold pt-3">
                                                {matiere.name}
                                            </td>

                                            <td className="text-right p-2">
                                                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-200 px-4 py-2 font-bold">
                                                    {matiere.rounded_average ?? "N/A"}
                                                </span>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td colSpan="2">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(
                                                                (semestre) => (
                                                                    <th
                                                                        key={semestre}
                                                                        className="border bg-gray-300 p-2"
                                                                    >
                                                                        Sem {semestre}
                                                                    </th>
                                                                )
                                                            )}
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        <tr>
                                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(
                                                                (semestre) => {

                                                                    const note =
                                                                        matiere.grades?.find(
                                                                            (note) =>
                                                                                getSemestre(
                                                                                    dateDebutFormation,
                                                                                    note.date
                                                                                ) === semestre
                                                                        );


                                                                    return (
                                                                        <td
                                                                            key={semestre}
                                                                            className="border p-2 text-center"
                                                                        >
                                                                            {note?.grade ?? "-"}
                                                                        </td>
                                                                    );
                                                                }
                                                            )}
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))}

                            </tbody>
                        </table>
                    </td>
                </tr>
            );


        // ============================================================
        // MODULES
        // ============================================================

        case "module":
            return (
                <tr className="w-full">
                    <td colSpan="4" className="p-4">
                        <table className="w-full">
                            <tbody>

                                {/* Modules école */}
                                <tr>
                                    <td className="text-left p-2 font-bold pt-3">
                                        Modules école
                                    </td>

                                    <td className="text-center p-2 font-bold pt-3 rounded-full bg-blue-200">
                                        {dataModuleEcole?.rounded_average ?? "N/A"}
                                    </td>
                                </tr>

                                {matiereModuleEcole?.map((matiere) => (
                                    <React.Fragment
                                        key={matiere.teaching_module_id}
                                    >
                                        <tr>
                                            <td className="text-left p-2 pt-3">
                                                {matiere.module_number}
                                                {" : "}
                                                {matiere.official_name}
                                            </td>

                                            <td className="text-right p-2 font-bold pt-3">
                                                {matiere.rounded_average ?? "N/A"}
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))}

                                {/* Modules interentreprises */}
                                <tr>
                                    <td className="text-left p-2 font-bold pt-3">
                                        Modules interentreprise
                                    </td>

                                    <td className="text-center p-2 font-bold pt-3 rounded-full bg-blue-200">
                                        {dataModuleInterentreprise?.rounded_average ?? "N/A"}
                                    </td>
                                </tr>

                                {matiereModuleInterentreprise?.map((matiere) => (
                                    <React.Fragment
                                        key={matiere.teaching_module_id}
                                    >
                                        <tr>
                                            <td className="text-left p-2 pt-3">
                                                {matiere.module_number}
                                                {" : "}
                                                {matiere.official_name}
                                            </td>

                                            <td className="text-right p-2 font-bold pt-3">
                                                {matiere.rounded_average ?? "N/A"}
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))}

                            </tbody>
                        </table>
                    </td>
                </tr>
            );


        default:
            return null;
    }
};

export default ListeDeroulante;