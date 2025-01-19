import * as Yup from "yup";

export const initialDocument = {docId: null,
    docNum: '', docName: '',  docUniqueCode:'',
    docTypeName: '', file: null, docDescription: '',
    docPath: ''};

export const initialDefautPrelevementDto = {adhesionId: null, motifDefaut: ''}
export const initialPrelevementDto = {
    prelevementId: null,
    nbrAdherant: null,
    montant: 0,
    montantLettre: '',
    active: true,
    echeanceId: null,
    nomEcheance: '',
    cotisationId: null,
    nomCotisation: '',
    motif: '',
    defautPrelevements: [],
    docs: []
}
export const initialCreatePaiementCotisationDTO =
    {
        reference: null,
        datePaiement: null,
        montant: 0,
        montantLettre: "",
        active: false,
        modePaiementCode: "ESPECE",
        modePaiement: null,
        typePaiementCode: "PAIE-COT",
        typePaiement: null,
        adhesionId: null,
        firstName: "",
        lastName: "",
        email: "",
        cotisationId: null,
        nomCotisation: "",
        motif: "",
        versementId: null,
        codeVersement: "",
        echeanceCoursPaiement: "",
        retardPaiement: 0.0,
        nbrEcheancesSoldeesParCeVersement: 0.0,
        prochaineEcheance: "",
        montantProchaineEcheance: 0.0,
        montantVersementSouhaite: 0.0,
        paiementId: null,
        currentDocument: initialDocument,

    };


export const paiementCotisationNotTouched=
{
    datePaiement: false,
    montant: false,
    modePaiementCode: false,
    adhesionId: false,
};

export const createPaiementCotisationValidationSchema = Yup.object(
{
        adhesionId: Yup.number().required('*'),
        montant: Yup.number().required('*'),
        modePaiementCode: Yup.string().required('*'),
        datePaiement: Yup.date().required("*"),
        cotisationId: Yup.number().required('*'),
        typePaiementCode: Yup.string().required('*'),
});


export const documentValidationSchema = Yup.object(
    {
            file: Yup.mixed()
                .required("Le fichier est obligatoire")
                .test("fileSize", "Le fichier est trop volumineux (maximum 5 Mo)", (value) => {

                    return value ? value.size <= 5000000 : false; // Vérifie si value existe
                })
                .test("fileType", "Seuls les fichiers PDF, JPG, JPEG et PNG sont autorisés", (value) => {

                        return value && ["application/pdf", 'JPG', 'JPEG', 'image/png', 'image/jpg', 'image/jpeg', '.png'].includes(value.type);
                }),
        docUniqueCode: Yup.string().required('*')
    })