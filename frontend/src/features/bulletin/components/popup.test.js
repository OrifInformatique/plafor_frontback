/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from "@testing-library/react";
import Popup from "./popup";
import React from "react";
import "@testing-library/jest-dom";

// ============================================================ 
// DONNÉES DE TEST
// ============================================================

const fieldsModule = [
    {
        name: "typeModule",
        label: "Type de module",
        type: "radio",
        options: [
            {
                value: "ecole",
                label: "Module école",
            },
            {
                value: "interentreprise",
                label: "Module interentreprise",
            },
        ],
    },
    {
        name: "module",
        label: "Module",
        type: "select",
        placeholder: "Sélectionner un module",
        options: [
            {
                value: "1",
                label: "M100 : Module test",
            },
            {
                value: "2",
                label: "M101 : Autre module",
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
    },
    {
        name: "date",
        label: "Date",
        type: "date",
    },
];

const renderPopupModule = (
    onSubmit = jest.fn(),
    onClose = jest.fn()
) => {
    render(
        <Popup
            title="Nouvelle note - Module"
            fields={fieldsModule}
            onClose={onClose}
            onSubmit={onSubmit}
        />
    );

    return {
        onSubmit,
        onClose,
    };
};

describe("Popup component", () => {

    // ---------------------------------------------------------
    // AFFICHAGE
    // ---------------------------------------------------------

    test("Affiche le titre", () => {
        renderPopupModule();

        expect(screen.getByText("Nouvelle note - Module")).toBeInTheDocument();
    });

    test("Affiche les champs du formulaire - Module", () => {
        renderPopupModule();

        expect(screen.getByLabelText("Module école")).toBeInTheDocument();
        expect(screen.getByLabelText("Module interentreprise")).toBeInTheDocument();
        expect(screen.getByLabelText("Module")).toBeInTheDocument();
        expect(screen.getByLabelText("Note")).toBeInTheDocument();
        expect(screen.getByLabelText("Date")).toBeInTheDocument();
    });

    test("Affiche les deux types de module", () => {
        renderPopupModule();

        expect(screen.getByLabelText("Module école")).toBeInTheDocument();
        expect(screen.getByLabelText("Module interentreprise")).toBeInTheDocument();
    });

    // --------------------------------------------------
    // FERMETURE
    // --------------------------------------------------

    test("Le bouton Annuler appelle onClose", () => {
        const { onClose } = renderPopupModule();

        fireEvent.click(screen.getByText("Annuler"));

        expect(onClose).toHaveBeenCalledTimes(1);
    });


    test("Le bouton X appelle onClose", () => {
        const { onClose } = renderPopupModule();

        fireEvent.click(screen.getByText("x"));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    // --------------------------------------------------
    // VALIDATION DU RADIO
    // --------------------------------------------------

    test("Refuse un type de module non sélectionné", () => {
        renderPopupModule();

        fireEvent.change(screen.getByLabelText("Module"), { target: { value: "1", }, });
        fireEvent.change(screen.getByLabelText("Note"), { target: { value: "5", }, });
        fireEvent.change(screen.getByLabelText("Date"), { target: { value: "2026-09-20", }, });
        fireEvent.click(screen.getByText("Ajouter"));

        expect(screen.getByText("Veuillez sélectionner un champs module")).toBeInTheDocument();
    });

    // --------------------------------------------------
    // VALIDATION DU SELECT
    // --------------------------------------------------

    test("Refuse un module non sélectionné de la liste déroulante", () => {
        renderPopupModule();

        fireEvent.click(screen.getByLabelText("Module école"));
        fireEvent.change(screen.getByLabelText("Note"), { target: { value: "5", }, });
        fireEvent.change(screen.getByLabelText("Date"), { target: { value: "2026-09-20", }, });
        fireEvent.click(screen.getByText("Ajouter"));

        expect(screen.getByText("Veuillez sélectionner : Module")).toBeInTheDocument();
    });

    // --------------------------------------------------
    // VALIDATION DE LA NOTE
    // --------------------------------------------------

    test("Refuse une note vide", () => {
        renderPopupModule();

        fireEvent.click(screen.getByLabelText("Module école"));
        fireEvent.change(screen.getByLabelText("Module"), { target: { value: "1", }, });
        fireEvent.change(screen.getByLabelText("Date"), { target: { value: "2026-09-20", }, });
        fireEvent.click(screen.getByText("Ajouter"));

        expect(screen.getByText("Veuillez entrer une note")).toBeInTheDocument();
    });

    test("Refuse une note inférieure à 1", () => {
        renderPopupModule();

        fireEvent.click(screen.getByLabelText("Module école"));
        fireEvent.change(screen.getByLabelText("Module"), { target: { value: "1", }, });
        fireEvent.change(screen.getByLabelText("Note"), { target: { value: "0", }, });
        fireEvent.change(screen.getByLabelText("Date"), { target: { value: "2026-09-20", }, });
        fireEvent.click(screen.getByText("Ajouter"));

        expect(screen.getByText("La note doit être comprise entre 1 et 6")).toBeInTheDocument();
    });

    test("Refuse une note supérieure à 6", () => {
        renderPopupModule();

        fireEvent.click(screen.getByLabelText("Module école"));
        fireEvent.change(screen.getByLabelText("Module"), { target: { value: "1", }, });
        fireEvent.change(screen.getByLabelText("Note"), { target: { value: "7", }, });
        fireEvent.change(screen.getByLabelText("Date"), { target: { value: "2026-09-20", }, });
        fireEvent.click(screen.getByText("Ajouter"));

        expect(screen.getByText("La note doit être comprise entre 1 et 6")).toBeInTheDocument();
    });

    // --------------------------------------------------
    // VALIDATION DE LA DATE
    // --------------------------------------------------

    test("Refuse une date dans le futur", () => {
        renderPopupModule();

        fireEvent.click(screen.getByLabelText("Module école"));
        fireEvent.change(screen.getByLabelText("Module"), { target: { value: "1", }, });
        fireEvent.change(screen.getByLabelText("Note"), { target: { value: "5", }, });
        fireEvent.change(screen.getByLabelText("Date"), { target: { value: "2999-01-01", }, });
        fireEvent.click(screen.getByText("Ajouter"));

        expect(screen.getByText("La date ne peut pas être dans le futur.")).toBeInTheDocument();
    });

    // --------------------------------------------------
    // SOUMISSION
    // --------------------------------------------------

    test("Soumet correctement le formulaire", () => {
        const { onSubmit } = renderPopupModule();

        fireEvent.click(screen.getByLabelText("Module école"));
        fireEvent.change(screen.getByLabelText("Module"), { target: { value: "1", }, });
        fireEvent.change(screen.getByLabelText("Note"), { target: { value: "5.5", }, });
        fireEvent.change(screen.getByLabelText("Date"), { target: { value: "2026-09-20", }, });
        fireEvent.click(screen.getByText("Ajouter"));

        expect(onSubmit).toHaveBeenCalledTimes(1);

        expect(onSubmit).toHaveBeenCalledWith({
            typeModule: "ecole",
            module: "1",
            note: "5.5",
            date: "2026-09-20",
        });
    });

});    


