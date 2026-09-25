import React, { useEffect, useState } from "react";



const popup = ({
    typePopup = 1,   // 1 si c'est pour le TPI, 2 si c'est pour La culture generale, 3 si c'est pour le CBE, 4 si c'est pour le module
    listeMatieres = [], // Liste de toute les matières
    setterClosePopup, // Fonction setter qui s'occupe de fermer le popup
    moduleName = "" // Nom des modules

}) => {



    return(<>
    
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="relative w-96 rounded-xl bg-white p-6 shadow-xl">
                <button onClick={() => {setterClosePopup}} className="absolute right-4 top-4 text-xl text-gray-500 hover:text-gray-800">X</button>
                <h2 className="mb-4 text-xl font-bold">Nouvelle note</h2>

                <select
                    value={listeMatieres?.id ?? ""}
                    onChange={(e) => {
                        const moduleSelection = moduleName.find(
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
                            {setterClosePopup};
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
                            console.log("Module : ", listeMatieres?.module_number, ":", listeMatieres?.module_name);
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



    
    
    
    
    </>);
}

export default popup;