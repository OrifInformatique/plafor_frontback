/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LigneTableauBulletin from "./ligneTableauBulletin";
import "@testing-library/jest-dom";

// ============================================================ 
// DONNÉES DE TEST
// ============================================================

const renderLigne = (props = {}) => {
    const defaultProps = {
        id: 1,
        nom: "Culture Générale",
        moyenne: 5.2,
        ligneOuverte: null,
        toggleLigne: jest.fn(),
        onAdd: jest.fn(),
        showAccordeon: true,
    };

    const finalProps = {
        ...defaultProps,
        ...props,
    };

    render(
        <table>
            <tbody>
                <LigneTableauBulletin {...finalProps} />
            </tbody>
        </table>
    );

    return finalProps;
};


describe("LigneTableauBulletin component", () => {

    // =============================
    //          AFFICHAGE
    // =============================

    test("Affiche le nom de la ligne", () => {
        renderLigne(
            {
                nom: "Culture Générale",
            }
        );

        expect(screen.getByText("Culture Générale")).toBeInTheDocument();
    });

    test("Affiche la moyenne", () => {
        renderLigne(
            {
                moyenne: 5.2,
            }
        );

        expect(screen.getByText("5.2")).toBeInTheDocument();
    });

    test("Affiche le bouton +", () => {
        renderLigne();

        expect(screen.getByRole("button", { name: "+" })).toBeInTheDocument();
    });

    test("Affiche le bouton accordéon par défaut", () => {
        renderLigne();

        expect(screen.getByRole("button", { name: /▼/ })).toBeInTheDocument();
    });

    test("N'affiche pas le bouton accordéon lorsque showAccordeon vaut false", () => {
        renderLigne(
            {
                showAccordeon: false,
            }
        );

        expect(screen.queryByRole("button", { name: /▼/ })).not.toBeInTheDocument();
    });

    test("Le TPI peut afficher son nom et sa moyenne sans accordéon", () => {
        renderLigne(
            {
                id: 0,
                nom: "TPI",
                moyenne: 5.5,
                showAccordeon: false,
            }
        );

        expect(screen.getByText("TPI")).toBeInTheDocument();
        expect(screen.getByText("5.5")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /▼/ })).not.toBeInTheDocument();
    });  

    test("Affiche une moyenne décimale", () => {
        renderLigne(
            {
                moyenne: 4.75,
            }
        );

        expect(screen.getByText("4.75")).toBeInTheDocument();
    });    

    test("Affiche une moyenne sous forme de texte", () => {
        renderLigne(
            {
                moyenne: "N/A",
            }
        );

        expect(screen.getByText("N/A")).toBeInTheDocument();
    });    



    // ==================================
    //          APPEL AUX FONCTIONS
    // ==================================

    test("Appelle onAdd lorsque le bouton + est cliqué", () => {
        const onAdd = jest.fn();

        renderLigne(
            {
                onAdd,
            }
        );

        fireEvent.click(screen.getByRole("button", { name: "+" }));

        expect(onAdd).toHaveBeenCalledTimes(1);
    });   
    
    test("Appelle toggleLigne avec le bon id lorsque l'accordéon est cliqué", () => {
        const toggleLigne = jest.fn();

        renderLigne(
            {
                id: 2,
                toggleLigne,
            }
        );

        fireEvent.click(screen.getByRole("button", { name: /▼/ }));

        expect(toggleLigne).toHaveBeenCalledTimes(1);
        expect(toggleLigne).toHaveBeenCalledWith(2);
    });    



    // =============================
    //          INTERACTION
    // =============================

    test("Ajoute la classe rotate-180 lorsque la ligne est ouverte", () => {
        renderLigne(
            {
                id: 2,
                ligneOuverte: 2,
            }
        );

        const fleche = screen.getByText("▼")

        expect(fleche).toHaveClass("rotate-180");
    });    

    test("N'ajoute pas la classe rotate-180 lorsque la ligne est fermée", () => {
        renderLigne(
            {
                id: 2,
                ligneOuverte: 1,
            }
        );

        const fleche = screen.getByText("▼");

        expect(fleche).not.toHaveClass("rotate-180");
    });

    test("N'appelle pas toggleLigne lorsque l'accordéon est désactivé", () => {
        const toggleLigne = jest.fn();

        renderLigne(
            {
                showAccordeon: false,
                toggleLigne,
            }
        );

        expect(toggleLigne).not.toHaveBeenCalled();
    });  
});


















