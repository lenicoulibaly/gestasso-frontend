import {useMutation, useQuery, useQueryClient} from "react-query";
import axiosServices from "../../utils/axios";
import {useSelector} from "../../store";

export const useUserService = () => {
    const queryClient = useQueryClient();
    const {page, size, key} = useSelector((state) => state.user);
    const searchuser = useQuery(['searchUsers', page, size, key], ()=>axiosServices({url: `/users/search?page=${page}&size=${size}&key=${key}`}))


    const blockUser = useMutation(
        (userId) => axiosServices({ url: `/users/block/${userId}`, method: "put" }),
        {
            onSettled: () => {
                queryClient.invalidateQueries("searchUsers");
                queryClient.invalidateQueries("searchMembres");
            },
        }
    );

    const activateUser = useMutation(
        (userId) => axiosServices({ url: `/users/unblock/${userId}`, method: "put" }),
        {
            onSettled: () => {
                queryClient.invalidateQueries("searchUsers");
                queryClient.invalidateQueries("searchMembres");
            },
        }
    );

    const sendActivateAccountLink = useMutation(
        (email) => axiosServices({ url: `/users/send-activation-email/${email}`, method: "put" }),
        {
            onSettled: () => queryClient.invalidateQueries("searchUsers"),
        }
    );
    const changePassword = useMutation(
        (dto) => axiosServices({ url: `/users/change-password`, data:dto, method: "put" })
    );

    return {searchuser, blockUser, activateUser, sendActivateAccountLink, changePassword};
};