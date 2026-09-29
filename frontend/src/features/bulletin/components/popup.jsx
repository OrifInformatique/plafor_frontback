import React, { useEffect, useState } from "react";

const Popup = ({
    title,
    fields,
    onClose,
    onSubmit,
}) => {

    const [values, setValues] = useState({});
    const [error, setError] = useState("");
    
    const handleChange = (name, value) => {
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError("");
    };

    const handleSubmit = () => {
        for (const field of fields) {
            const value = values[field.name];

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


            if (field.type === "date" && value) {
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

                {/* Champs */}
                {fields.map((field) => (
                    <div key={field.name} className="mb-4">
                        <label className="mb-2 block font-medium">
                            {field.label}
                        </label>

                        {/* SELECT */}
                        {field.type === "select" ? (
                            <select
                                value={values[field.name] ?? ""}
                                onChange={(e) => 
                                    handleChange(
                                        field.name,
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                            >
                                <option value="">
                                    {field.placeholder ?? "Sélectionner..."}
                                </option>

                                {field.options?.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : (

                            /* INPUT */
                            <input 
                                type={field.type ?? "text"}
                                min={field.min}
                                max={field.max}
                                step={field.step}
                                placeholder={field.placeholder}
                                value={values[field.name] ?? ""}
                                onChange={(e) => 
                                    handleChange(
                                        field.name,
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            />
                        )}
                    </div>
                ))}

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