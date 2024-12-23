import * as Yup from "yup";
import {isValidDate} from "../../../utilities/DateUtils";


export const initialCreateAdhesionDTO = {
    nomCotisation: '',
    montantCotisation: '',
    frequenceCotisation: '',
    modePrelevement: '',
    dateDebutCotisation: '',
    dateFinCotisation: '',
    delaiDeRigueurEnJours: 0,
};
    export const initialUpdateAdhesionDTO =
    {
        assoId: null, sectionName: '', situationGeo: '',
        sigle: '', strId: ''
    };



    export const createAssoValidationSchema =Yup.object(
    {
        assoName: Yup.string().required('Champ obligatoire'),
        createInitialSectionDTO: Yup.object({
            sectionName: Yup.string().required('Champ obligatoire'),
        }),
    })

    /*
    createCotisationDTO: Yup.object({
            nomCotisation: Yup.string().required('Champ obligatoire'),
            montantCotisation: Yup.number().required('Champ obligatoire'),
            frequenceCotisation: Yup.string().required('Champ obligatoire'),
            modePrelevement: Yup.string().required('Champ obligatoire'),
            dateDebutCotisation: Yup.date().required('Champ obligatoire')
        }),
     */

    export const updateAssoValidationSchema =
            Yup.object
            ({
                assoId: Yup.number().required("Veuillez selectionner l'association à modifier"),
                assoName: Yup.string().required('Champ obligatoire'),
                droitAdhesion: Yup.number()
            })

    export const sectionValidationSchema =
    {
        sectionName: Yup.string().required('Champ obligatoire'),
    }
