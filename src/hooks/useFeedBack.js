import {useEffect} from "react";
import {dispatch} from "../store";
import {feedBackActions} from "../store/slices/feedBackSlice";

export const useFeedBackEffects = (isSuccess, isError, error)=>
{
    return useEffect(() =>
    {
        if(isError)
        {
            dispatch(feedBackActions.operationFailed(error))
        }
        if(isSuccess)
        {
            dispatch(feedBackActions.operationSuccessful(["Opération réalisée avec succès"]))
        }
    }, [isSuccess, isError, error]);
}