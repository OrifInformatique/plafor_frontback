import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDataBulletin, getDataExemplePopup } from '/src/common/services/dataService';
import { getPopupConfigs } from './config/popupConfigs';
import Popup from './components/popup';
import ListeDeroulante from './components/listeDeroulante';
import LigneTableauBulletin from './components/ligneTableauBulletin';


const BulletinInterface = ({}) => {
    const { id } = useParams();

    const [data, setData] = useState(null);
    const [dataExemplePopup, setDataExemplePopup] = useState(null);
    const [error, setError] = useState(null);
    const [ligneOuverte, setLigneOuverte] = useState(null);
    
    // Quel type de popup : null | "module" | "culture" | "cbe" | "tpi"
    const [popupType, setPopupType] = useState(null);

    
    useEffect(() => {
        async function loadData() {
            try {
                setError(null);
                setData(null);

                const result = await getDataBulletin(id);
                setData(result.data);
                
                const resultPopup = await getDataExemplePopup();
                setDataExemplePopup(resultPopup.data);

            } catch(err) {
                console.error("Erreur de chargement des données : ", err);
                setError("Impossible de charger les données du bulletin.");
            }
        }
        
        loadData();
    
    }, [id]);

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

    const popupConfigs = getPopupConfigs(dataPopupModuleName);
    const popupConfig = popupType ? popupConfigs[popupType] : null;

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
        
        {popupConfig && (
            <Popup
                title={popupConfig.title}
                config={popupConfig.config}
                onClose={() => setPopupType(null)}
                onSubmit={(values) => {
                    console.log(values);
                    setPopupType(null);
                }}
            />
        )}
    </>);
}

export default BulletinInterface;
