import {useMutation} from "react-query";
import axiosServices from "../../utils/axios";

export const useDocumentService = ()=>
{
    const updateDocument = useMutation(['updateDocument'], (dto)=>axiosServices({url: '/documents/update', method: 'put', data: dto, headers: {"Content-Type": "multipart/form-data"}}))
    return {updateDocument};
}