import {initialCreateFncDTO, initialUpdateFncDTO} from "../functions/FncDtos";

export const initialCreateUserDTO = {
    email: '', tel: '', firstName: '', lastName: ''
}

export const initialCreateUserAndFunctionDTO =
{
    createUserDTO: initialCreateUserDTO,
    createInitialFncDTO: initialCreateFncDTO,
    createFncDTOS: []
}
export const initialUpdateUserDTO = {
    userId: 0, tel: '', firstName: '', lastName: ''
}
export const initialUpdateUserAndFunctionDTO =
{
    updateUserDTO : initialUpdateUserDTO,
    updateFncDTOS : [initialUpdateFncDTO]
}


export const initialReadUserDTO =
{
    "userId": 0,
    "firstName": "",
    "lastName": "",
    "email": "",
    "tel": "",
    "lieuNaissance": "",
    "dateNaissance": null,
    "idEcole": null,
    "nomEcole": "",
    "sigleEcole": "",
    "civilite": "",
    "paysCode": "",
    "nationalite": "",
    "codeTypePiece": "",
    "typePiece": "",
    "numPiece": "",
    "nomPere": "",
    "nomMere": "",
    "codeTypeUtilisateur": "",
    "typeUtilisateur": "",
    "active": false,
    "notBlocked": false,
    "currentFunctionId": null,
    "codeStatut": "",
    "statut": ""
};


