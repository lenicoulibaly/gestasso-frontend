import {useQuery} from "react-query";
import axiosServices from "../../utils/axios";

export const useTypeService = ()=>
{
    const getFrequenceOptions = useQuery(['getFrequenceOptions'],
        ()=>axiosServices({url: `/types/TYPE_FREQUENCE/all-options`, method: 'get'}), {keepPreviousData: true, refetchOnWindowFocus: false});

    const getModePrelevementOptions = useQuery(['getModePrelevementOptions'],
        ()=>axiosServices({url: `/types/MODE_PRELEVEMENT/all-options`, method: 'get'}), {keepPreviousData: true, refetchOnWindowFocus: false});

    return {getFrequenceOptions, getModePrelevementOptions};
}