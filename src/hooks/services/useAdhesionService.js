import {useMutation, useQuery} from "react-query";
import axiosServices from "../../utils/axios";
import useAuth from "../useAuth";

export const useAdhesionService = ()=>
{
    const assoId = useAuth().getAuthUser().assoId
    const getAdhesionOptions = useQuery(["getAdhesionOptions", assoId],
        ()=>axiosServices({url: `/adhesions/all-options?assoId=${assoId}`, method: 'get'}),
        {keepPreviousData: true, refetchOnWindowFocus: false});

    return {getAdhesionOptions};
}