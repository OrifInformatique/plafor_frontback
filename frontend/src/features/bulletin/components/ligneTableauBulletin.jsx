import React from "react";


const LigneTableauBulletin = ({
    id,
    nom,
    moyenne,
    ligneOuverte,
    toggleLigne,
    onAdd,
    showMoyenne = true,
    showAccordeon = true,
}) => { 

    return (<>
    
        <tr className="border-b p-5 bg-blue-200 hover:bg-blue-300">

            {/* Bouton + */}
            <td className="p-4">
                <button onClick={onAdd} className="w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600">+</button>
            </td>

            {/* Nom */}
            <td className="p-4 font-bold">
                {nom}
            </td>

            {/* Moyenne */}
            <td className="p-4 text-center font-bold"> 
                {showMoyenne && (
                    moyenne ?? "N/A"
                )}
                
            </td>

            {/* Bouton accordéon */}
            <td className="p-4 text-center">
                {showAccordeon && (
                    <button className="accordion-button w-8 h-8" onClick={() => toggleLigne(id)}>
                        <span className={`inline-block transition-transform duration-200 ${ligneOuverte === id ? "rotate-180" : ""}`}>▼</span>
                    </button>
                )}
            </td>
        </tr>
    </>);
}

export default LigneTableauBulletin;