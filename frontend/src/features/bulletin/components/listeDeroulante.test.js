/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import ListeDeroulante from "./listeDeroulante";
import React from "react";
import "@testing-library/jest-dom";

// ============================================================ 
// DONNÉES DE TEST
// ============================================================

const dateDebutFormation = "2025-01-01";

const typeMatiere = [ 
    { 
        teaching_subject_id: 1,
        name: "Mathématiques", 
        rounded_average: 5.2, 
        grades: [ 
            { date: "2025-02-15", grade: 5.5, }, 
            { date: "2025-08-15", grade: 4.5, }, 
            { date: "2026-02-15", grade: 5.0, }, 
        ], 
    }, 
    { 
        teaching_subject_id: 2, 
        name: "Français", 
        rounded_average: 4.8, 
        grades: [ 
            { date: "2025-03-10", grade: 4.5, },
        ], 
    }, 
];

const dataModuleEcole = { rounded_average: 5.1, };

const matiereModuleEcole = [ 
    { 
        teaching_module_id: 1, 
        module_number: "M100", 
        official_name: "Module test", 
        rounded_average: 5.5, 
    }, 
    { 
        teaching_module_id: 2, 
        module_number: "M101", 
        official_name: "Autre module", 
        rounded_average: 4.8, 
    }, 
];

const dataModuleInterentreprise = { rounded_average: 4.7, };

const matiereModuleInterentreprise = [ 
    { 
        teaching_module_id: 3, 
        module_number: "M200", 
        official_name: "Module interentreprise test", 
        rounded_average: 4.5, 
    }, 
    { 
        teaching_module_id: 4, 
        module_number: "M201", 
        official_name: "Autre module interentreprise", 
        rounded_average: 5.0, 
    }, 
];


// ============================================================ 
// MODE MATIERE 
// ============================================================

describe("Mode matière", () => {

    test("affiche les matières", () => {
        render( 
            <table> 
                <tbody> 
                    <ListeDeroulante 
                        type="matiere" 
                        typeMatiere={typeMatiere} 
                        dateDebutFormation={dateDebutFormation} 
                    /> 
                </tbody>
            </table> 
        ); 
        
        expect(screen.getByText("Mathématiques")).toBeInTheDocument();
        expect(screen.getByText("Français")).toBeInTheDocument();
    });

    test("affiche la moyenne de chaque matière", () => {
        render( 
            <table>
                <tbody>
                    <ListeDeroulante 
                        type="matiere"
                        typeMatiere={typeMatiere}
                        dateDebutFormation={dateDebutFormation} 
                    />
                </tbody>
            </table>
        ); 
        
        expect(screen.getByText("5.2")).toBeInTheDocument();
        expect(screen.getByText("4.8")).toBeInTheDocument(); 
    });

    test("affiche les 8 semestres", () => {
        render(
            <table>
                <tbody>
                    <ListeDeroulante
                        type="matiere"
                        typeMatiere={typeMatiere}
                        dateDebutFormation={dateDebutFormation}
                    />
                </tbody>
            </table>
        );
        
        for (let semestre = 1; semestre <= 8; semestre++) {
            expect(screen.getAllByText(`Sem ${semestre}`)).toHaveLength(2);
        }
    });

    test("place les notes dans le bon semestre", () => {
        render(
            <table>
                <tbody>
                    <ListeDeroulante 
                        type="matiere" 
                        typeMatiere={typeMatiere} 
                        dateDebutFormation={dateDebutFormation} 
                    />
                </tbody>
            </table>
        ); 
        
        /* 
            Formation : 
            01.01.2025 
            
            15.02.2025 -> Semestre 1 -> 5.5 
            15.08.2025 -> Semestre 2 -> 4.5 
            15.02.2026 -> Semestre 3 -> 5.0    
        */ 
       
        expect(screen.getByText("5.5")).toBeInTheDocument(); 
        expect(screen.getAllByText("4.5")).toHaveLength(2); 
        expect(screen.getByText("5")).toBeInTheDocument(); 
    });    

    test("affiche un tiret lorsqu'une matière n'a pas de note pour un semestre", () => {
        render(
            <table> 
                <tbody>
                    <ListeDeroulante 
                        type="matiere" 
                        typeMatiere={typeMatiere} 
                        dateDebutFormation={dateDebutFormation} 
                    /> 
                </tbody> 
            </table> 
        ); 
        
        const tiret = screen.getAllByText("-");
        
        expect(tiret.length).toBeGreaterThan(0); 
    });

    test("affiche N/A si la moyenne d'une matière est absente", () => { 
        const matieres = [ 
            { 
                teaching_subject_id: 10, 
                name: "Physique", 
                rounded_average: null, 
                grades: [], 
            }, 
        ]; 
        
        render( 
            <table> 
                <tbody> 
                    <ListeDeroulante 
                        type="matiere" 
                        typeMatiere={matieres} 
                        dateDebutFormation={dateDebutFormation} 
                    /> 
                </tbody> 
            </table> 
        ); 
        
        expect(screen.getByText("Physique")).toBeInTheDocument(); 
        expect(screen.getByText("N/A")).toBeInTheDocument(); 
    });

});


// ============================================================ 
// MODE MODULE 
// ============================================================

describe("Mode module", () => {

    test("affiche la section Modules école", () => {
        render(
            <table>
                <tbody>
                    <ListeDeroulante 
                        type="module"
                        dataModuleEcole={dataModuleEcole}
                        matiereModuleEcole={matiereModuleEcole}
                        dataModuleInterentreprise={dataModuleInterentreprise}
                        matiereModuleInterentreprise={matiereModuleInterentreprise}
                    />
                </tbody> 
            </table>
        );
        
        expect(screen.getByText("Modules école")).toBeInTheDocument();
    });

    test("affiche la moyenne des Modules école", () => { 
        render( 
            <table> 
                <tbody> 
                    <ListeDeroulante 
                        type="module"
                        dataModuleEcole={dataModuleEcole}
                        matiereModuleEcole={matiereModuleEcole}
                        dataModuleInterentreprise={dataModuleInterentreprise}
                        matiereModuleInterentreprise={matiereModuleInterentreprise}
                    />
                </tbody>
            </table>
        );
        
        expect(screen.getByText("5.1")).toBeInTheDocument(); 
    });

    test("affiche les modules école", () => {
        render(
            <table>
                <tbody>
                    <ListeDeroulante type="module"
                    dataModuleEcole={dataModuleEcole}
                    matiereModuleEcole={matiereModuleEcole}
                    dataModuleInterentreprise={dataModuleInterentreprise}
                    matiereModuleInterentreprise={matiereModuleInterentreprise}
                />
            </tbody>
        </table>
        );
        
        expect(screen.getByText("M100 : Module test")).toBeInTheDocument(); 
        expect(screen.getByText("M101 : Autre module")).toBeInTheDocument(); 
    });

    test("affiche la section Modules interentreprise", () => {
        render(
            <table>
                <tbody>
                    <ListeDeroulante 
                        type="module"
                        dataModuleEcole={dataModuleEcole}
                        matiereModuleEcole={matiereModuleEcole}
                        dataModuleInterentreprise={dataModuleInterentreprise}
                        matiereModuleInterentreprise={matiereModuleInterentreprise}
                    />
                </tbody>
            </table>
        );
        
        expect(screen.getByText("Modules interentreprise")).toBeInTheDocument(); 
    });

    test("affiche la moyenne des Modules interentreprise", () => { 
        render( 
            <table> 
                <tbody> 
                    <ListeDeroulante 
                        type="module" 
                        dataModuleEcole={dataModuleEcole} 
                        matiereModuleEcole={matiereModuleEcole} 
                        dataModuleInterentreprise={dataModuleInterentreprise} 
                        matiereModuleInterentreprise={matiereModuleInterentreprise} 
                    /> 
                </tbody> 
            </table> 
        ); 
        
        expect(screen.getByText("4.7")).toBeInTheDocument(); 
    });

    test("affiche les modules interentreprise", () => { 
        render( 
            <table> 
                <tbody> 
                    <ListeDeroulante 
                        type="module" 
                        dataModuleEcole={dataModuleEcole} 
                        matiereModuleEcole={matiereModuleEcole} 
                        dataModuleInterentreprise={dataModuleInterentreprise} 
                        matiereModuleInterentreprise={matiereModuleInterentreprise} 
                    /> 
                </tbody> 
            </table> 
        ); 
        
        expect(screen.getByText("M200 : Module interentreprise test")).toBeInTheDocument(); 
        expect(screen.getByText("M201 : Autre module interentreprise")).toBeInTheDocument(); 
    });

    test("affiche N/A si la moyenne des modules école est absente", () => { 
        render( 
            <table> 
                <tbody> 
                    <ListeDeroulante 
                        type="module" 
                        dataModuleEcole={null} 
                        matiereModuleEcole={matiereModuleEcole} 
                        dataModuleInterentreprise={dataModuleInterentreprise} 
                        matiereModuleInterentreprise={matiereModuleInterentreprise} 
                    /> 
                </tbody> 
            </table> 
        ); 
        
        expect(screen.getAllByText("N/A").length).toBeGreaterThan(0); 
    });

    test("affiche N/A si la moyenne des modules interentreprise est absente", () => { 
        render( 
            <table> 
                <tbody> 
                    <ListeDeroulante 
                        type="module" 
                        dataModuleEcole={dataModuleEcole} 
                        matiereModuleEcole={matiereModuleEcole} 
                        dataModuleInterentreprise={null} 
                        matiereModuleInterentreprise={matiereModuleInterentreprise} 
                    /> 
                </tbody> 
            </table> 
        ); 
        
        expect(screen.getAllByText("N/A").length).toBeGreaterThan(0); 
    });
});

// ============================================================ 
// VALEURS PAR DÉFAUT / CAS PARTICULIERS 
// ============================================================

describe("Cas particuliers", () => {

    test("utilise le mode matière par défaut", () => { 
        render( 
            <table> 
                <tbody> 
                    <ListeDeroulante 
                        typeMatiere={typeMatiere} 
                        dateDebutFormation={dateDebutFormation} 
                    /> 
                </tbody>
            </table>
        ); 
        
        expect(screen.getByText("Mathématiques")).toBeInTheDocument();
    });

    test("retourne null avec un type inconnu", () => { 
        const { container } = 
            render( 
                <ListeDeroulante 
                    type="inconnu" 
                    typeMatiere={typeMatiere} 
                    dateDebutFormation={dateDebutFormation}
                /> 
            );
        
        expect(container.firstChild).toBeNull(); 
    });

    test("fonctionne avec une liste de matières vide", () => { 
        render( 
            <table> 
                <tbody> 
                    <ListeDeroulante 
                        type="matiere" 
                        typeMatiere={[]} 
                        dateDebutFormation={dateDebutFormation} 
                    /> 
                </tbody> 
            </table> 
        ); 
        
        expect(screen.queryByText("Mathématiques")).not.toBeInTheDocument(); 
    });

    test("fonctionne avec une liste de modules vide", () => { 
        render( 
            <table> 
                <tbody> 
                    <ListeDeroulante 
                        type="module" 
                        dataModuleEcole={dataModuleEcole} 
                        matiereModuleEcole={[]} 
                        dataModuleInterentreprise={dataModuleInterentreprise} 
                        matiereModuleInterentreprise={[]} 
                    /> 
                </tbody> 
            </table> 
        );
        
        expect(screen.getByText("Modules école")).toBeInTheDocument();
        expect(screen.getByText("Modules interentreprise")).toBeInTheDocument(); 
    });
});






