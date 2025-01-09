import * as Yup from "yup";
import {isValidDate} from "../../../utilities/DateUtils";

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
        assoName: false, situationGeo: false, sigle: false, droitAdhesion: false,logo: null,
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
        logo: Yup.mixed()

            .test("fileSize", "Fichier volumineux (max 5 Mo)", (value) => {
                    //console;
                console.log('value', value)
                console.log('value.size', value.size)
                console.log('value.type', value.type)
                return value ? value.size <= 5000000 : false; // Vérifie si value existe
            })
            .test("fileType", "Seuls les fichiers PDF, JPG, JPEG et PNG sont autorisés", (value) => {

                return value && ["application/pdf", 'JPG', 'JPEG', 'image/png', 'image/jpg', 'image/jpeg', '.png'].includes(value.type);
            }),
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
