import React, { useEffect, useState } from 'react';
import { getDataExemplePopup, getDataExempleINFRA, getDataExempleMEDIA, getDataExempleOPE, getDataExempleDEV } from "/src/common/services/dataService";
import Popup from './components/popup';
import ListeDeroulante from './components/listeDeroulante';
import LigneTableauBulletin from './components/ligneTableauBulletin';

const BulletinInterface = ({ userData }) => {

    const [ligneOuverte, setLigneOuverte] = useState(null);
    const [data, setData] = useState(userData || null);
    const [dataExemplePopup, setDataExemplePopup] = useState(null);

    // Quel type de popup : null | "module" | "culture" | "cbe" | "tpi"
    const [popupType, setPopupType] = useState(null);

    
    useEffect(() => {
        async function loadData() {
            try {
                // Changer le getData pour voir les autres exemples
                //const result = await getDataExempleINFRA();
                //const result = await getDataExempleMEDIA();
                //const result = await getDataExempleOPE();
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
    const moyenneFormation = data.rounded_general_average;

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
            name: "typeModule",
            label: "Type de module",
            type: "radio",
            options: [
                {
                    value: "ecole",
                    label: "Module école"
                },
                {
                    value: "interentreprise",
                    label: "Module interentreprise"
                },
            ],
        },
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

    const toggleLigne = (id) => {
        setLigneOuverte(ligneOuverte === id ? null : id);
    };    

    return (<>

        <div className="flex flex-row gap-10 mb-5">
            <h1 className="font-bold text-3xl">{nom} {prenom}</h1>
            <h1 className="font-bold text-lg align-center">{formation}</h1>
        </div>

        <div className="flex flex-row w-full justify-around">
            <table className="w-full max-w-2/3 border-collapse border mt-5">
                <tbody>

                    {/* Ligne TPI */}
                    <LigneTableauBulletin 
                        id={0}
                        nom="TPI"
                        moyenne={moyenneTPI}
                        ligneOuverte={ligneOuverte}
                        toggleLigne={toggleLigne}
                        onAdd={() => setPopupType("tpi")}
                        showAccordeon={false}
                    />

                    {/* Ligne Culture générale */}
                    <LigneTableauBulletin
                        id={1}
                        nom="Culture générale"
                        moyenne={dataCultureGen?.rounded_average}
                        ligneOuverte={ligneOuverte}
                        toggleLigne={toggleLigne}
                        onAdd={() => setPopupType("culture")}
                    />
                    
                    {/* Sous-tableau de culture générale caché */}
                    {ligneOuverte === 1 && (
                        <ListeDeroulante typeMatiere={matiereCultureGen} dateDebutFormation={dateDebutFormation} type="matiere"/>
                    )}

                    {/* Ligne CBE */}
                    <LigneTableauBulletin
                        id={2}
                        nom="CBE"
                        moyenne={dataCBE?.rounded_average}
                        ligneOuverte={ligneOuverte}
                        toggleLigne={toggleLigne}
                        onAdd={() => setPopupType("cbe")}
                    />

                    {/* Sous-tableau de CBE caché */}
                    {ligneOuverte === 2 && (
                        <ListeDeroulante typeMatiere={matiereCBE} dateDebutFormation={dateDebutFormation} type="matiere"/>
                    )}

                    {/* Ligne Module */}
                    <LigneTableauBulletin
                        id={3}
                        nom="Modules"
                        ligneOuverte={ligneOuverte}
                        toggleLigne={toggleLigne}
                        onAdd={() => setPopupType("module")}
                        showMoyenne={false}
                    />                    

                    {/* Sous-tableau de modules caché */}
                    {ligneOuverte === 3 && (
                        <ListeDeroulante dataModuleEcole={dataModuleEcole} matiereModuleEcole={matiereModuleEcole} dataModuleInterentreprise={dataModuleInterentreprise} matiereModuleInterentreprise={matiereModuleInterentreprise} type="module"/>
                    )}

                </tbody>
            </table>
            <div className="flex flex-col mt-5">
                <h2 className="font-bold text-xl text-center">
                    Moyenne générale
                </h2>
                <p className="text-center self-center max-w-20 text-xl font-bold bg-gray-200 p-4 m-4 border border-black rounded-full">
                    {moyenneFormation}
                </p>
            </div>
        </div>

        <div className="fixed bottom-5 right-5 bg-black text-white p-4 rounded-lg">
            Popup ouvert : 
                
            <strong className="ml-2">
                {popupType}
            </strong>
            <button className="ml-4" onClick={() => setPopupType(null)}>
                X 
            </button>
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
