import * as Yup from "yup";
import {isValidDate} from "../../../utilities/DateUtils";


export const initialCreateCotisationDTO = {
    nomCotisation: '',
    montantCotisation: '',
    frequenceCotisation: '',
    modePrelevement: '',
    dateDebutCotisation: '',
    dateFinCotisation: '',
    delaiDeRigueurEnJours: 0,
};
    export const initialCreateSectionDTO =
    {
        assoId: null, sectionName: '', situationGeo: '',
        sigle: '', strId: ''
    };

    export const initialCreateAssoDTO =
    {
        assoName: '', situationGeo: '', sigle: '', droitAdhesion: '',
        createInitialSectionDTO:initialCreateSectionDTO,
        createSectionDTOS: []
    };



    export const createAssoFormNotTouched =
    {
        assoName: false, situationGeo: false, sigle: false, droitAdhesion: false,
        createCotisationDTO: false,
        createInitialSectionDTO: false,
        createSectionDTOS: false
    }

    export const initialUpdateSectionDTO =
    {
        sectionId: null, sectionName: '', situationGeo: '',
        sigle: '', strId: null,
    };

    export const initialUpdateAssoDTO =
    {
        assoId: null, assoName: '', situationGeo: '',
        sigle: '', droitAdhesion: null
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
