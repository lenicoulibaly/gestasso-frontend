import AlertDialog from "../../../ui-elements/advance/UIDialog/AlertDialog";
import BlockTwoToneIcon from "@mui/icons-material/BlockTwoTone";
import React from "react";
import { useTheme } from '@mui/material/styles';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export const UnblockUserButton = ({user, unblockUserFunction})=>
{
    const theme = useTheme();
    return <AlertDialog triggerStyle={{color: theme.palette.success.dark, borderColor: theme.palette.success.main,
                        '&:hover ': {background: theme.palette.success.light}}} handleConfirmation={() => unblockUserFunction(user.userId)}
                        openLabel={"Débloquer"} message={"Vous êtes sur le point de de débloquer " + user.firstName + ". Confirmez-vous cette action ?"}
                        actionDisabled={false} TriggerIcon={<CheckCircleIcon sx={{fontSize: '1.1rem'}}/>}/>
}