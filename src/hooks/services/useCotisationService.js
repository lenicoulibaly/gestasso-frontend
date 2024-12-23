import {useSelector} from "../../store";
import {useMutation, useQuery, useQueryClient} from "react-query";
import axiosServices from "../../utils/axios";
import useAuth from "../useAuth";

export const useCotisationService = ()=>
{
    const authUserAssoId = useAuth().getAuthUser().assoId
    const queryClient = useQueryClient();
    const {page, size, key} = useSelector((state) => state.cotisation);
    const search = useQuery(["search", key, page, size],
        ()=>axiosServices({url: `/cotisations/search`, method: 'get', params: {assoId: authUserAssoId, key: key, page: page, size: size}}),
        {keepPreviousData: true, refetchOnWindowFocus: false});

    const create = useMutation(["create"],
        (dto)=>axiosServices({url: `/cotisations/create`, method: 'post', data: dto}),
        {onSuccess: ()=>queryClient.invalidateQueries("search")});

    const update = useMutation('update',
        (dto)=> axiosServices({url: '/cotisations/update', method: 'put', data: dto}),
        {onSuccess: ()=> {
                queryClient.invalidateQueries("search");
            }});

    return {search, create, update};
}