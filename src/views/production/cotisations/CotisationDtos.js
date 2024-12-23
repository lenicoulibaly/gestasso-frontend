import * as Yup from "yup";

export const initialCreateCotisationDTO =
{
    nomCotisation: "",
    montantCotisation: 0,
    motif: "",
    frequenceCotisationCode: "",
    frequenceCotisation: "",
    modePrelevementCode: "",
    modePrelevement: "",
    dateDebutCotisation: "2024-01-01",
    dateFinCotisation: "2024-12-31",
    delaiDeRigueurEnJours: 0,
    assoId: 0,
    sectionId: undefined,
};
export const cotisationNotTouched=
{
    nomCotisation: false,
    montantCotisation: false,
    motif: false,
    frequenceCotisation: false,
    modePrelevement: false,
    dateDebutCotisation: false,
    dateFinCotisation: false,
    delaiDeRigueurEnJours: false,
};
export const initialUpdateCotisationDTO =
{
    cotisationId: 0,
    nomCotisation: "",
    montantCotisation: 0,
    motif: "",
    frequenceCotisationCode: "",
    frequenceCotisation: "",
    modePrelevementCode: "",
    modePrelevement: "",
    dateDebutCotisation: "2024-01-01",
    dateFinCotisation: "2024-12-31",
    delaiDeRigueurEnJours: 0
};

export const createCotisationValidationSchema = Yup.object(
{
    nomCotisation: Yup.string().required('*'),
    montantCotisation: Yup.number().required('*'),
    frequenceCotisationCode: Yup.string().required('*'),
    modePrelevementCode: Yup.string().required('*'),
    dateDebutCotisation: Yup.date().required("*"),
    dateFinCotisation: Yup.date().required("*"),
    delaiDeRigueurEnJours: Yup.number().required('*'),
})