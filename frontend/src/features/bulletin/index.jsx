import React, { useEffect, useState } from 'react';
import { getDataExemplePopup, getDataExempleINFRA, getDataExempleMEDIA, getDataExempleOPE, getDataExempleDEV } from "/src/common/services/dataService";
import Popup from './components/popup';
import ListeDeroulante from './components/listeDeroulante';

const BulletinInterface = ({ userData }) => {

    const [ligneOuverte, setLigneOuverte] = useState(null);
    const [data, setData] = useState(userData || null);
    const [dataExemplePopup, setDataExemplePopup] = useState(null);

    // Quel type de popup
    // null | "module" | "culture" | "cbe" | "tpi"
    const [popupType, setPopupType] = useState(null);

    
    useEffect(() => {
        async function loadData() {
            try {
                // Changer le getData pour voir les autres exemples
                const result = await getDataExempleDEV();
                setData(result.data);
            
            } catch(err) {
                console.error("Erreur de chargement des données : ", err);
                setData(null);
            }
        }

        async function loadDataExemplePopup() {
            try {
                const result = await getDataExemplePopup();
                setDataExemplePopup(result.data);
            
            } catch(err) {
                console.error("Erreur du chargement des données : ", err);
                setDataExemplePopup(null);
            }
        }

        loadData();
        loadDataExemplePopup();
    
    }, [userData]);

    if (!data) {
        return <div> Chargement... </div>;
    }

    const nom = data.user.last_name;
    const prenom = data.user.first_name;
    const formation = data.user_course.course_plan_official_name;
    const dateDebutFormation = data.user_course.date_begin;

    // Data TPI
    const dataTPI = data.teaching_domains
        .flatMap(domain => domain.teaching_subjects ?? [])
        .find(subject => subject.name === "Travail pratique individuel (TPI)");
    const moyenneTPI = dataTPI?.grades?.[0]?.grade ?? "N/A";

    // Data Culture générale
    const dataCultureGen = data.teaching_domains
        .find(domain => domain.title === "Culture générale");
    const matiereCultureGen = dataCultureGen?.teaching_subjects ?? [];

    // Data CBE
    const dataCBE = data.teaching_domains
        .find(domain => domain.title === "Compétences de base élargies");
    const matiereCBE = dataCBE?.teaching_subjects ?? [];

    // Data Modules école
    const dataModuleEcole = data.teaching_domains
        .flatMap(domain => domain.subgroups ?? [])
        .find(subject => subject.name === "Modules école");
    const matiereModuleEcole = dataModuleEcole?.teaching_modules ?? [];

    // Data Modules interentreprises
    const dataModuleInterentreprise = data.teaching_domains
        .flatMap(domain => domain.subgroups ?? [])
        .find(subject => subject.name === "Modules interentreprises");
    const matiereModuleInterentreprise = dataModuleInterentreprise?.teaching_modules ?? [];

    // Data pour popup
    const dataPopupModule = dataExemplePopup?.subjects
        .find(subject => subject.name === "Modules");
    const dataPopupModuleName = dataPopupModule?.teaching_module ?? [];


    //==================
    //      Modules
    //==================

    const fieldsModules = [
        {
            name: "module",
            label: "Module",
            type: "select",
            placeholder: "Sélectionner un module",
            options: dataPopupModuleName.map(module => ({
                value: module.id,
                label: `${module.module_number} : ${module.module_name}`,
            })),
        },
        {
            name: "note",
            label: "Note",
            type: "number",
            min: 1,
            max: 6,
            step: 0.1,
            placeholder: "Ex. 5.5",
        },
        {
            name: "date",
            label: "Date",
            type: "date",
        },
    ];

    //==========================
    //      Culture générale
    //==========================

    const fieldsCulture = [
        {
            name: "categorie",
            label: "Catégorie",
            type: "select",
            placeholder: "Sélectionner une matière",
            options: [
                {
                    value: "ECG",
                    label: "ECG",
                },
                {
                    value: "TPA",
                    label: "TPA",
                },
                {
                    value: "examen_final",
                    label: "Examen final",
                },
            ],
        },
        {
            name: "note",
            label: "Note",
            type: "number",
            min: 1,
            max: 6,
            step: 0.1,
            placeholder: "Ex. 5.5",
        },
        {
            name: "date",
            label: "Date",
            type: "date",
        },
    ];

    //==============
    //      CBE
    //==============

    const fieldsCBE = [
        {
            name: "matiere",
            label: "Matière",
            type: "select",
            placeholder: "Sélectionner une matière",
            options: [
                {
                    value: "math",
                    label: "Mathématiques",
                },
                {
                    value: "anglais",
                    label: "Anglais",
                },
                {
                    value: "allemand",
                    label: "Allemand",
                },
            ],
        },
        {
            name: "note",
            label: "Note",
            type: "number",
            min: 1,
            max: 6,
            step: 0.1,
            placeholder: "Ex. 5.5",
        },
        {
            name: "date",
            label: "Date",
            type: "date",
        },
    ];

    //==============
    //      TPI
    //==============

    const fieldsTPI = [
        {
            name: "note",
            label: "Note",
            type: "number",
            min: 1,
            max: 6,
            step: 0.1,
            placeholder: "Ex. 5.5",
        },
        {
            name: "date",
            label: "Date",
            type: "date",
        },
    ];

    //===================
    //      Fonctions
    //===================

    const toggleLigne = (id) => {
        setLigneOuverte(ligneOuverte === id ? null : id);
    };    

    function getSemestre(dateDebut, dateNote) {
        const debut = new Date(dateDebut);
        const note = new Date(dateNote);

        const moisEcoules = 
            (note.getFullYear() - debut.getFullYear()) * 12 +
            (note.getMonth() - debut.getMonth());

        const semestre = Math.floor(moisEcoules / 6) + 1;

        return Math.min(Math.max(semestre, 1), 8);
    }

    return (<>

        <div className="flex flex-row gap-10 mb-5">
            <h1 className="font-bold text-3xl">{nom} {prenom}</h1>
            <h1 className="font-bold text-lg align-center">{formation}</h1>
        </div>

        <div className="flex flex-row w-full justify-around">
            <table className="w-full max-w-2/3 border-collapse border mt-5">
                <tbody>
                    {/* Ligne TPI */}
                    <tr className="border-b p-5 bg-blue-200 hover:bg-blue-300">
                        <td className="p-4">
                            <button onClick={() => setPopupType("tpi")} className="w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600">+</button>
                        </td>
                        <td className="p-4 font-bold">
                            TPI
                        </td>
                        <td className="p-4 text-center font-bold"> 
                            {moyenneTPI}
                        </td>
                        <td className="p-4 text-center">
                            <button className="accordion-button w-8 h-8" disabled>
                                <span className={`inline-block transition-transform duration-200 ${ligneOuverte === 1 ? "rotate-180" : ""}`}></span>
                            </button>
                        </td>
                    </tr>

                    {/* Ligne Culture Générale */}
                    <tr className="border-b p-5 bg-blue-200 hover:bg-blue-300">
                        <td className="p-4">
                            <button onClick={() => setPopupType("culture")} className="w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600">+</button>
                        </td>
                        <td className="p-4 font-bold">
                            Culture Générale
                        </td>
                        <td className="p-4 text-center font-bold"> 
                            {dataCultureGen?.rounded_average ?? "N/A"}
                        </td>
                        <td className="p-4 text-center">
                            <button className="accordion-button w-8 h-8" onClick={() => toggleLigne(1)}>
                                <span className={`inline-block transition-transform duration-200 ${ligneOuverte === 1 ? "rotate-180" : ""}`}>▼</span>
                            </button>
                        </td>
                    </tr>

                    {/* Sous-tableau caché */}
                    {ligneOuverte === 1 && (
                        
                        <ListeDeroulante typeMatiere={matiereCultureGen} dateDebutFormation={dateDebutFormation} type="matiere"/>

                        /*
                        <tr className="w-full">
                            <td colSpan="4" className="p-4">
                                <table className="w-full">
                                    <tbody>

                                        {matiereCultureGen.map((matiere) => (
                                            <React.Fragment key={matiere.teaching_subject_id}>
                                                <tr>
                                                    <td className="text-left p-2 font-bold pt-3">
                                                        {matiere.name}
                                                    </td>
                                                    <td className="text-center p-2 font-bold pt-3 rounded-full bg-blue-200">
                                                        {matiere.rounded_average ?? "N/A"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="2">
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    {[1, 2, 3, 4, 5, 6, 7, 8]. map((semestre) => (
                                                                        <th key={semestre} className="border bg-gray-300 p-2">
                                                                            Sem {semestre}
                                                                        </th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((semestre) => {
                                                                        const note = matiere.grades?.find((note) => 
                                                                            getSemestre(dateDebutFormation, note.date) === semestre
                                                                        );

                                                                        return (
                                                                            <td key={semestre} className="border p-2 text-center">
                                                                                {note?.grade ?? "-"}
                                                                            </td>
                                                                        );
                                                                    })}
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
                        */
                    )}

                    {/* Ligne CBE */}
                    <tr className="border-b p-5 bg-blue-200 hover:bg-blue-300">
                        <td className="p-4">
                            <button onClick={() => setPopupType("cbe")} className="w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600">+</button>
                        </td>
                        <td className="p-4 font-bold">
                            CBE
                        </td>
                        <td className="p-4 text-center font-bold"> 
                            {dataCBE?.rounded_average ?? "N/A"}
                        </td>
                        <td className="p-4 text-center">
                            <button className="accordion-button w-8 h-8" onClick={() => toggleLigne(2)}>
                                <span className={`inline-block transition-transform duration-200 ${ligneOuverte === 2 ? "rotate-180" : ""}`}>▼</span>
                            </button>
                        </td>
                    </tr>

                    {/* Sous-tableau caché */}
                    {ligneOuverte === 2 && (
                        

                        <ListeDeroulante typeMatiere={matiereCBE} dateDebutFormation={dateDebutFormation} type="matiere"/>
                        /*
                        <tr className="w-full">
                            <td colSpan="4" className="p-4">
                                <table className="w-full">
                                    <tbody>

                                        {matiereCBE.map((matiere) => (
                                            <React.Fragment key={matiere.teaching_subject_id}>
                                                <tr>
                                                    <td className="text-left p-2 font-bold pt-3">
                                                        {matiere.name}
                                                    </td>
                                                    <td className="text-center p-2 font-bold pt-3 rounded-full bg-blue-200">
                                                        {matiere.rounded_average ?? "N/A"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="2">
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    {[1, 2, 3, 4, 5, 6, 7, 8]. map((semestre) => (
                                                                        <th key={semestre} className="border bg-gray-300 p-2">
                                                                            Sem {semestre}
                                                                        </th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((semestre) => {
                                                                        const note = matiere.grades?.find((note) => 
                                                                            getSemestre(dateDebutFormation, note.date) === semestre
                                                                        );

                                                                        return (
                                                                            <td key={semestre} className="border p-2 text-center">
                                                                                {note?.grade ?? "-"}
                                                                            </td>
                                                                        );
                                                                    })}
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
                        */
                    )}

                    {/* Ligne Modules */}
                    <tr className="border-b p-5 bg-blue-200 hover:bg-blue-300">
                        <td className="p-4">
                            <button onClick={() => setPopupType("module")} className="w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600">+</button>
                        </td>
                        <td className="p-4 font-bold">
                            Modules
                        </td>
                        <td className="p-4 text-center font-bold" /> 
                        <td className="p-4 text-center">
                            <button className="accordion-button w-8 h-8" onClick={() => toggleLigne(3)}>
                                <span className={`inline-block transition-transform duration-200 ${ligneOuverte === 3 ? "rotate-180" : ""}`}>▼</span>
                            </button>
                        </td>
                    </tr>

                    {/* Sous-tableau caché */}
                    {ligneOuverte === 3 && (
                        

                        <ListeDeroulante dataModuleEcole={dataModuleEcole} matiereModuleEcole={matiereModuleEcole} dataModuleInterentreprise={dataModuleInterentreprise} matiereModuleInterentreprise={matiereModuleInterentreprise} type="module"/>
                        /*
                        <tr className="w-full">
                            <td colSpan="4" className="p-4">
                                <table className="w-full">
                                    <tbody>

                                        <tr>
                                            <td className="text-left p-2 font-bold pt-3">
                                                Modules école
                                            </td>
                                            <td className="text-center p-2 font-bold pt-3 rounded-full bg-blue-200">
                                                {dataModuleEcole?.rounded_average ?? "N/A"}
                                            </td>
                                        </tr>

                                        {matiereModuleEcole.map((matiere) => (
                                            <React.Fragment key={matiere.teaching_module_id}>
                                                <tr>
                                                    <td className="text-left p-2 pt-3">
                                                        {matiere.module_number} {" : "} {matiere.official_name}
                                                    </td>
                                                    <td className="text-right p-2 font-bold pt-3">
                                                        {matiere.rounded_average ?? "N/A"}
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        ))}
                                        
                                        <tr>
                                            <td className="text-left p-2 font-bold pt-3">
                                                Modules interentreprise
                                            </td>
                                            <td className="text-center p-2 font-bold pt-3 rounded-full bg-blue-200">
                                                {dataModuleInterentreprise?.rounded_average ?? "N/A"}
                                            </td>
                                        </tr>

                                        {matiereModuleInterentreprise.map((matiere) => (
                                            <React.Fragment key={matiere.teaching_module_id}>
                                                <tr>
                                                    <td className="text-left p-2 pt-3">
                                                        {matiere.module_number} {" : "} {matiere.official_name}
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
                        */
                    )}
                </tbody>
            </table>
            <div className="flex flex-col mt-5">
                <h2 className="font-bold text-xl text-center">
                    Moyenne générale
                </h2>
                <p className="text-center self-center max-w-20 text-xl font-bold bg-gray-200 p-4 m-4 border border-black rounded-full">
                    5.6
                </p>
            </div>
        </div>

        <div className="fixed bottom-5 right-5 bg-black text-white p-4 rounded-lg">
                Popup ouvert : 
                
                <strong className="ml-2">
                    {popupType}
                </strong>
                <button className="ml-4" onClick={() => setPopupType(null)}> X </button>
            </div>

        {popupType && (
            <>
                {(() => {
                    switch (popupType) {
                        case "module":
                            return (
                                <Popup
                                    title="Nouvelle note - Module"
                                    fields={fieldsModules}
                                    onClose={() => setPopupType(null)}
                                    onSubmit={(values) => {
                                        console.log(values);
                                        setPopupType(null);
                                    }}
                                />
                            );
                        case "culture":
                            return (
                                <Popup
                                    title="Nouvelle note - Culture générale"
                                    fields={fieldsCulture}
                                    onClose={() => setPopupType(null)}
                                    onSubmit={(values) => {
                                        console.log(values);
                                        setPopupType(null);
                                    }}
                                />
                            );
                        case "cbe":
                            return (
                                <Popup
                                    title="Nouvelle note - CBE"
                                    fields={fieldsCBE}
                                    onClose={() => setPopupType(null)}
                                    onSubmit={(values) => {
                                        console.log(values);
                                        setPopupType(null);
                                    }}
                                />
                            );   
                        case "tpi":
                            return (
                                <Popup
                                    title="Nouvelle note - TPI"
                                    fields={fieldsTPI}
                                    onClose={() => setPopupType(null)}
                                    onSubmit={(values) => {
                                        console.log(values);
                                        setPopupType(null);
                                    }}
                                />
                            );    
                        default:
                            return null;                                                 
                    }
                })()}
            </>
        )}
    </>);
}

export default BulletinInterface;
