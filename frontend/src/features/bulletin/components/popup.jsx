import React, { useEffect, useState } from "react";

const Popup = ({
    title = "Nouveau popup",
    onClose,
    onSubmit,
    config = {},
}) => {

    const [values, setValues] = useState({});
    const [error, setError] = useState("");
    
    const radioConfig = config.radio;
    const selectConfig = config.select;
    const dateConfig = config.date;
    const gradeConfig = config.grade;

    const handleChange = (name, value) => {
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError("");
    };

    const handleSubmit = () => {

        // Validation du radio
        if (radioConfig?.enabled) {
            const value = values[radioConfig.name];

            if (!value) {
                setError("Veuillez sélectionner un type de module");
                return;
            }
        }

        // Validation du select
        if (selectConfig?.enabled) {
            const value = values[selectConfig.name];

            if (value === undefined || value === "") {
                setError(`Veuillez sélectionner : ${selectConfig.label}`);
                return;
            }
        }

        // Validation de la note
        if (gradeConfig?.enabled) {
            const value = values[gradeConfig.name];

            if (value === undefined || value === "") {
                setError("Veuillez entrer une note");
                return;
            }

            const note = Number(value);

            if (!Number.isFinite(note) || note < 1 || note > 6) {
                setError("La note doit être comprise entre 1 et 6.");
                return;
            }
        }

        // Validation de la date
        if (dateConfig?.enabled) {
            const value = values[dateConfig.name];

            if (!value) {
                setError(`Veuillez entrer une date`);
                return;
            }

            const selectedDate = new Date(`${value}T00:00:00`);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (
                Number.isNaN(selectedDate.getTime()) ||
                selectedDate > today
            ) {
                setError("La date doit être valide et ne peut pas être dans le futur.");
                return;
            }
        }

        /*
        for (const field of fields) {
            const value = values[field.name];

            if (field.type === "radio" && (!value) || value === "") {
                setError(`Veuillez sélectionner un champs module`);
                return;
            }

            if (field.type === "select" && (!value || value === "")) {
                setError(`Veuillez sélectionner : ${field.label}`);
                return;
            }

            if (field.name === "note") {
                if (!value ||value === "") {
                    setError(`Veuillez entrer une note`);
                    return;                    
                }

                const note = Number(value);

                if (note < 1 || note > 6) {
                    setError(`La note doit être comprise entre 1 et 6`);
                    return;
                }
            }


            if (field.type === "date") {
                if (!value || value === "") {
                    setError(`Veuillez entrez une date`);
                    return;
                }

                const selectedDate = new Date(value);
                const today = new Date();

                selectedDate.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);

                if (selectedDate > today) {
                    setError(`La date ne peut pas être dans le futur.`);
                    return;
                }
            }
        }
            */

        setError("");
        onSubmit(values);
    };

    return(<>
    
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-96 rounded-xl bg-white p-6 shadow-xl">
                
                {/* Bouton fermer */}
                <button onClick={onClose} className="absolute right-4 top-4 text-xl text-gray-500 hover:text-gray-800"> x </button>

                {/* Titre */}
                <h2 className="mb-6 text-xl font-bold">
                    {title}
                </h2>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* RADIO */}
                {radioConfig?.enabled && (
                    <div className="mb-4">
                        <label className="mb-2 block font-medium">
                            {radioConfig.label}
                        </label>

                        <div className="flex gap-6">
                            {radioConfig.options.map((option) => (
                                <label
                                    key={option.value}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        type="radio"
                                        name={radioConfig.name}
                                        value={option.value}
                                        checked={
                                            values[radioConfig.name] ===
                                            option.value
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                radioConfig.name,
                                                e.target.value
                                            )
                                        }
                                    />

                                    {option.label}
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* SELECT */}
                {selectConfig?.enabled && (
                    <div className="mb-4">
                        <label
                            htmlFor={selectConfig.name}
                            className="mb-2 block font-medium"
                        >
                            {selectConfig.label}
                        </label>

                        <select
                            id={selectConfig.name}
                            value={values[selectConfig.name] ?? ""}
                            onChange={(e) =>
                                handleChange(
                                    selectConfig.name,
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                        >
                            <option value="">
                                {selectConfig.placeholder ?? "Sélectionner..."}
                            </option>

                            {(selectConfig.options ?? []).map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* DATE */}
                {dateConfig?.enabled && (
                    <div className="mb-4">
                        <label
                            htmlFor={dateConfig.name}
                            className="mb-2 block font-medium"
                        >
                            {dateConfig.label}
                        </label>

                        <input
                            id={dateConfig.name}
                            type="date"
                            value={values[dateConfig.name] ?? ""}
                            onChange={(e) =>
                                handleChange(
                                    dateConfig.name,
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                    </div>
                )}

                {/* NOTE */}
                {gradeConfig?.enabled && (
                    <div className="mb-4">
                        <label
                            htmlFor={gradeConfig.name}
                            className="mb-2 block font-medium"
                        >
                            {gradeConfig.label}
                        </label>

                        <input
                            id={gradeConfig.name}
                            type="number"
                            min={gradeConfig.min ?? 1}
                            max={gradeConfig.max ?? 6}
                            step={gradeConfig.step ?? 0.1}
                            placeholder={gradeConfig.placeholder ?? "Ex. 5.5"}
                            value={values[gradeConfig.name] ?? ""}
                            onChange={(e) =>
                                handleChange(
                                    gradeConfig.name,
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                    </div>
                )}

                {/* Boutons */}
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300">
                        Annuler
                    </button>
                    <button onClick={handleSubmit} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        Ajouter
                    </button>
                </div>
            </div>
        </div>
    </>);
}

export default Popup;