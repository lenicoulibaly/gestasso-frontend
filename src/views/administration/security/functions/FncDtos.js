import * as Yup from "yup";
import {isValidDate} from "../../../utilities/DateUtils";

export const initialCreateFncDTO =
    {
        fncId: null, userId: null, assoId: null,
        name: '', startsAt: '',
        endsAt: '', roleCodes: []
    };
export const initialUpdateFncDTO = {
    fncId: null, userId: null, assoId: null, name: "",
    sectionId: null, typeCode: null,
    startsAt: null, endsAt: null, roleCodes: []
}

export const fncValidationSchema = {
    name: Yup.string().required('Champ obligatoire'),
    startsAt: Yup.string().required('Champ obligatoire')
        .test('validStartingDate', 'Format incorrect', (value)=>
        {
            return isValidDate(value)
        })
        .test('NotTooLateStartingDate', 'La date de début doit être antérieure à la date de fin', function startingDateIsValid(startsAt)
        {
            const {endsAt} = this.parent
            return new Date(startsAt) <= new Date(endsAt);
        }),

    endsAt: Yup.date().required('Champ obligatoire')
        .test('validEndingDate', 'Format incorrect', (value)=>
        {
            return isValidDate(value)
        })
        .test('NotTooEarlyEndingDate', 'La date de fin doit être ultérieure à la date de début', function endDateIsValid(endsAt)
        {
            const {startsAt} = this.parent
            return new Date(startsAt) <= new Date(endsAt);
        }),
    roleCodes : Yup.array().required('Champ obligatoire').test((roleCodes)=>
    {
        return !(roleCodes == null || roleCodes == undefined || roleCodes.length == 0)
    })}

