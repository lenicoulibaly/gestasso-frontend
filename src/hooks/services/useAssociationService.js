import {useMutation, useQuery} from "react-query";
import axiosServices from "../../utils/axios";

export const useAssociationService = ()=>
{
    const generateFicheAdhesion = useMutation(['generateFicheAdhesion'], (assoId)=>axiosServices({url: `/associations/generate-fiche-adhesion/${assoId}`, method: 'get'}))
    return {generateFicheAdhesion}
}