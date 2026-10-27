import axios from 'axios';

const pathData = "/data";
const pathExemplePopup = "/data/exemple_matiere";


export async function getDataBulletin(id) {

    if (!/^[1-9]\d*$/.test(String(id))) {
        throw new Error("Identifiant utilisateur invalide");
    }

    const pathJSON = `${pathData}/grade_user_${id}.json`;

    const resultData = await axios.get(pathJSON);

    return resultData;
}

export async function getDataExemplePopup() {
    const resultData = await axios.get(pathExemplePopup + ".json");

    if (!resultData) {
        throw new Error ("Données exemple introuvables");
    }

    return resultData;
}




