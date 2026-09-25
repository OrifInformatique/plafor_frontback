import React, { useEffect, useState } from 'react';
import { getDataExemplePopup, getDataExempleINFRA } from "/src/common/services/dataService";

const BulletinInterface = ({ userData }) => {

    const [ligneOuverte, setLigneOuverte] = useState(null);
    const [data, setData] = useState(userData || null);
    const [dataExemplePopup, setDataExemplePopup] = useState(null);
    const [newGrade, setNewGrade] = useState(false);

    // Popup
    const [matiereSelectionner, setMatiereSelectionner] = useState(null);
    const [popupNote, setPopupNote] = useState("");
    const [popupDate, setPopupDate] = useState("");


    useEffect(() => {
        async function loadData() {
            try {
                const result = await getDataExempleINFRA();
                setData(result.data);

            } catch(err) {
                setData(null);
            }
        }

        async function loadDataExemplePopup() {
            try {
                const result = await getDataExemplePopup();
                setDataExemplePopup(result.data);

            } catch(err) {
                setDataExemplePopup(null);
            }
        }

        loadData();
        loadDataExemplePopup();
    }, [userData]);

    if (!data) return <div>Chargement...</div>;

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

    // Data Modules
    const dataModuleEcole = data.teaching_domains
        .flatMap(domain => domain.subgroups ?? [])
        .find(subject => subject.name === "Modules école");
    const matiereModuleEcole = dataModuleEcole?.teaching_modules ?? [];

    const dataModuleInterentreprise = data.teaching_domains
        .flatMap(domain => domain.subgroups ?? [])
        .find(subject => subject.name === "Modules interentreprises");
    const matiereModuleInterentreprise = dataModuleInterentreprise?.teaching_modules ?? [];

    // Exemple popup
    const dataPopupModule = dataExemplePopup.subjects
        .find(subject => subject.name === "Modules");
    const dataPopupModuleName = dataPopupModule?.teaching_module ?? [];


    // Fonctions
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
                            <button className="w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600">+</button>
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
                            <button className="w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600">+</button>
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
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th className="border bg-gray-300 p-2">Sem 1</th>
                                                                <th className="border bg-gray-300 p-2">Sem 2</th>
                                                                <th className="border bg-gray-300 p-2">Sem 3</th>
                                                                <th className="border bg-gray-300 p-2">Sem 4</th>
                                                                <th className="border bg-gray-300 p-2">Sem 5</th>
                                                                <th className="border bg-gray-300 p-2">Sem 6</th>
                                                                <th className="border bg-gray-300 p-2">Sem 7</th>
                                                                <th className="border bg-gray-300 p-2">Sem 8</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                {[1, 2, 3, 4, 5, 6, 7, 8].map((semestre) => {
                                                                    const note = matiere.grades?.find((note) => {
                                                                        return getSemestre(
                                                                            dateDebutFormation,
                                                                            note.date
                                                                        ) === semestre;
                                                                    });

                                                                    return (
                                                                        <td
                                                                            key={semestre}
                                                                            className="border p-2 text-center"
                                                                        >
                                                                            {note?.grade ?? "-"}
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </tr>
                                            </React.Fragment>
                                        ))}

                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    )}

                    {/* Ligne CBE */}
                    <tr className="border-b p-5 bg-blue-200 hover:bg-blue-300">
                        <td className="p-4">
                            <button className="w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600">+</button>
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
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th className="border bg-gray-300 p-2">Sem 1</th>
                                                                <th className="border bg-gray-300 p-2">Sem 2</th>
                                                                <th className="border bg-gray-300 p-2">Sem 3</th>
                                                                <th className="border bg-gray-300 p-2">Sem 4</th>
                                                                <th className="border bg-gray-300 p-2">Sem 5</th>
                                                                <th className="border bg-gray-300 p-2">Sem 6</th>
                                                                <th className="border bg-gray-300 p-2">Sem 7</th>
                                                                <th className="border bg-gray-300 p-2">Sem 8</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                {[1, 2, 3, 4, 5, 6, 7, 8].map((semestre) => {
                                                                    const note = matiere.grades?.find((note) => {
                                                                        return getSemestre(
                                                                            dateDebutFormation,
                                                                            note.date
                                                                        ) === semestre;
                                                                    });

                                                                    return (
                                                                        <td
                                                                            key={semestre}
                                                                            className="border p-2 text-center"
                                                                        >
                                                                            {note?.grade ?? "-"}
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </tr>
                                            </React.Fragment>
                                        ))}

                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    )}

                    {/* Ligne Modules */}
                    <tr className="border-b p-5 bg-blue-200 hover:bg-blue-300">
                        <td className="p-4">
                            <button className="w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600" onClick={(() => setNewGrade(true))}>+</button>

                            {newGrade && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                                    <div className="relative w-96 rounded-xl bg-white p-6 shadow-xl">
                                        <button onClick={() => setNewGrade(false)} className="absolute right-4 top-4 text-xl text-gray-500 hover:text-gray-800">X</button>
                                        <h2 className="mb-4 text-xl font-bold">Nouvelle note</h2>

                                        <select
                                            value={matiereSelectionner?.id ?? ""}
                                            onChange={(e) => {
                                                const moduleSelection = dataPopupModuleName.find(
                                                    (matiere) => String(matiere.id) === e.target.value
                                                );
                                                setMatiereSelectionner(moduleSelection ?? null);
                                            }}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                                        >
                                            <option value="">
                                                Sélectionner une matière
                                            </option>

                                            {dataPopupModuleName.map((matiere) => (
                                                <option key={matiere.id} value={matiere.id}>
                                                    {matiere.module_number} : {matiere.module_name}
                                                </option>
                                            ))}
                                        </select>

                                        <div className="mb-4">
                                            <label className="mb-2 block font-medium">Note</label>
                                            <input 
                                                type="number" 
                                                min="1" 
                                                max="6" 
                                                step="0.1"
                                                value={popupNote}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === "" || (Number(val) >= 1 && Number(val) <= 6)) {
                                                        setPopupNote(val);
                                                    }
                                                }}
                                                placeholder="Ex. 5.5"
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                            />
                                        </div>

                                        <div className="mb-6">
                                            <label className="mb-2 block font-medium">
                                                Date
                                            </label>
                                            <input
                                                type="date"
                                                value={popupDate}
                                                onChange={(e) => setPopupDate(e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                            />
                                        </div>

                                        <div className="flex justify-end gap-3">
                                            <button onClick={() => {
                                                    setNewGrade(false);
                                                    setMatiereSelectionner(null);
                                                    setPopupNote("");
                                                    setPopupDate("");
                                                }}
                                                className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
                                            >    
                                                Annuler
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    console.log("Module : ", matiereSelectionner?.module_number, ":", matiereSelectionner?.module_name);
                                                    console.log("Note : ", popupNote);
                                                    console.log("Date : ", popupDate);
                                                }}
                                                className="rounded-lg bg-blue-600 px-4 py-2 text-white jover:bg-blue-700"
                                            >
                                                Ajouter
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </td>
                        <td className="p-4 font-bold">
                            Modules
                        </td>
                        <td className="p-4 text-center font-bold"> 
                            
                        </td>
                        <td className="p-4 text-center">
                            <button className="accordion-button w-8 h-8" data-target="details-2" onClick={() => toggleLigne(3)}>
                                <span className={`inline-block transition-transform duration-200 ${ligneOuverte === 3 ? "rotate-180" : ""}`}>▼</span>
                            </button>
                        </td>
                    </tr>

                    {/* Sous-tableau caché */}
                    {ligneOuverte === 3 && (
                        
                        <tr className="w-full">
                            <td colSpan="4" className="p-4">
                                <table className="w-full">
                                    <tbody>
                                        <tr>
                                            <td className="text-left p-2 font-bold pt-3">
                                                Modules école
                                            </td>
                                            <td className="text-center p-2 font-bold pt-3 rounded-full bg-blue-200">
                                                {dataModuleEcole.rounded_average ?? "N/A"}
                                            </td>
                                        </tr>

                                        {matiereModuleEcole.map((matiere) => (
                                            <React.Fragment key={matiere.teaching_module_id}>
                                                <tr>
                                                    <td className="text-left p-2 pt-3">
                                                        {matiere.module_number} : {matiere.official_name}
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
                                                {dataModuleInterentreprise.rounded_average ?? "N/A"}
                                            </td>
                                        </tr>

                                        {matiereModuleInterentreprise.map((matiere) => (
                                            <React.Fragment key={matiere.teaching_module_id}>
                                                <tr>
                                                    <td className="text-left p-2 pt-3">
                                                        {matiere.module_number} : {matiere.official_name}
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
                    )}
                </tbody>
            </table>
            <div className="flex flex-col mt-5">
                <h2 className="font-bold text-xl text-center">Moyenne générale</h2>
                <p className="text-center self-center max-w-20 text-xl font-bold bg-gray-200 p-4 m-4 border border-black rounded-full">5.6</p>
            </div>

        </div>
    
    
    
    
    
    
    
    </>);
}

export default BulletinInterface;
