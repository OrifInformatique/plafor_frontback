

export function getPopupConfigs(dataPopupModuleName = []) {
    const moduleOptions = dataPopupModuleName.map((module) => ({
        value: module.id,
        label: `${module.module_number} : ${module.module_name}`,
    }));

    const gradeConfig = {
        enabled: true,
        name: "note",
        label: "Note",
        min: 1,
        max: 6,
        step: 0.1,
        placeholder: "Ex. 5.5",
    };

    const dateConfig = {
        enabled: true,
        name: "date",
        label: "Date",
    };

    return {
        module: {
            title: "Nouvelle note - Module",
            config: {
                radio: {
                    enabled: true,
                    name: "typeModule",
                    label: "Type de module",
                    options: [
                        { value: "ecole", label: "Module école" },
                        { value: "interentreprise", label: "Module interentreprise" },
                    ],
                },
                select: {
                    enabled: true,
                    name: "module",
                    label: "Module",
                    placeholder: "Sélectionnez un module",
                    options: moduleOptions,
                },
                date: dateConfig,
                grade: gradeConfig,
            },
        },

        culture: {
            title: "Nouvelle note - Culture générale",
            config: {
                select: {
                    enabled: true,
                    name: "categorie",
                    label: "Catégorie",
                    placeholder: "Sélectionnez une catégorie",
                    options: [
                        { value: "ECG", label: "ECG" },
                        { value: "TPA", label: "TPA" },
                        { value: "examen_final", label: "Examen final" },
                    ],
                },
                date: dateConfig,
                grade: gradeConfig,
            },
        },

        cbe: {
            title: "Nouvelle note - CBE",
            config: {
                select: {
                    enabled: true,
                    name: "matiere",
                    label: "Matière",
                    placeholder: "Sélectionnez une matière",
                    options: [
                        { value: "math", label: "Mathématiques" },
                        { value: "anglais", label: "Anglais" },
                        { value: "allemand", label: "Allemand" },
                    ],
                },
                date: dateConfig,
                grade: gradeConfig,
            },
        },    
        
        tpi: {
            title: "Nouvelle note - TPI",
            config: {
                date: dateConfig,
                grade: gradeConfig,
            },
        },
    };
}