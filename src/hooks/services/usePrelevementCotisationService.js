import {useMutation} from "react-query";
import axiosServices from "../../utils/axios";

export const usePrelevementCotisationService = ()=>
{
    const getEditDto = useMutation(['getPrelevementDto'], (dto)=> axiosServices({url: '/prelevement-cotisation/edit-dto', method: 'post', data: dto}))
    const savePrelevement = useMutation(['savePrelevement'], (dto)=> axiosServices({url: '/prelevement-cotisation/save', method: 'post', data: dto}))

    return {getEditDto, savePrelevement}
}