import * as Yup from "yup";

export const initialCreateMembreDTO =
    {
        matriculeFonctionnaire: "",
        email: "",
        tel: "",
        firstName: "",
        lastName: "",
        lieuNaissance: "",
        dateNaissance: "1990-01-01",
        codeCivilite: "",
        gradeCode: "",
        indiceFonctionnaire: 0,
        sectionId: 0,
        assoId: 0,

    };
export const membreNotTouched=
    {
        firstName: false,
        lastName: false,
        email: false,
        tel: false,
        lieuNaissance: false,
        dateNaissance: false,
        codeCivilite: false,
        codePays: false,
        matriculeFonctionnaire: false,
        gradeCode: false,
        indiceFonctionnaire: false,
        sectionId: false,
        assoId: false
};
export const initialUpdateMembreDTO =
    {
        assoId: null, sectionName: '', situationGeo: '',
        sigle: '', strId: ''
    };

export const createMembreValidationSchema = Yup.object({
        firstName: Yup.string().required('*'),
        lastName: Yup.string().required('*'),
        email: Yup.string().email('Mail invalide').required('*'),
        tel: Yup.string().required('*'),
        sectionId: Yup.number().required("*").min(1, "*")
})