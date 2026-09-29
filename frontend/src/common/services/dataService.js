import axios from 'axios';

let pathJSONINFRA = "/data/plafor_exemple_A_INFRA";
let pathJSONMEDIA = "/data/plafor_exemple_B_MEDIA";
let pathJSONOPE = "/data/plafor_exemple_C_OPE";
let pathJSONDEV = "/data/plafor_exemple_D_DEV";
let pathExemplePopup = "/data/exemple_matiere";

export async function getDataExempleINFRA() {
    const resultData = await axios.get(pathJSONINFRA + ".json");

    if (!resultData) {
        throw new Error ("Données introuvables");
    }

    return resultData;
}

export async function getDataExempleMEDIA() {
    const resultData = await axios.get(pathJSONMEDIA + ".json");

    if (!resultData) {
        throw new Error ("Données introuvables");
    }

    return resultData;
}

export async function getDataExempleOPE() {
    const resultData = await axios.get(pathJSONOPE + ".json");

    if (!resultData) {
        throw new Error ("Données introuvables");
    }

    return resultData;
}

export async function getDataExempleDEV() {
    const resultData = await axios.get(pathJSONDEV + ".json");

    if (!resultData) {
        throw new Error ("Données introuvables");
    }

    return resultData;
}

export async function getDataExemplePopup() {
    const resultData = await axios.get(pathExemplePopup + ".json");

    if (!resultData) {
        throw new Error ("Données exemple introuvables");
    }

    return resultData;
}



