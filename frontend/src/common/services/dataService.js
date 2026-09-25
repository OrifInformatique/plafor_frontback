import axios from 'axios';

let pathJSON = "/data/plafor_exemple_A_INFRA";
let pathExemplePopup = "/data/exemple_matiere";

export async function getDataExempleINFRA() {

    const resultData = await axios.get(pathJSON + ".json");


    if (!resultData) {
        throw new Error ("Données introuvables");
    }

    //console.log(resultData);

    return resultData;
}

export async function getDataExemplePopup() {

    const resultData = await axios.get(pathExemplePopup + ".json");

    if (!resultData) {
        throw new Error ("Données exemple introuvables");
    }

    //console.log(resultData);

    return resultData;
}



