import {useEffect} from "react";
import {dispatch} from "../store";
import {feedBackActions} from "../store/slices/feedBackSlice";

export const useSearchEffects = (isLoading, isSuccess, data, isError, error, actions)=>
{
    useEffect(()=>
    {
        if(isLoading) dispatch(actions.searchPending())
        if(isSuccess) {
            dispatch(actions.searchFulfilled(data.data))
        }
        if(isError) {
            dispatch(actions.searchFailed(error))
            dispatch(feedBackActions.operationFailed(error))
        }

    }, [data, isSuccess, isLoading, isError, error]);
}