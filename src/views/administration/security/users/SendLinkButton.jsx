import AlertDialog from "../../../ui-elements/advance/UIDialog/AlertDialog";
import BlockTwoToneIcon from "@mui/icons-material/BlockTwoTone";
import React from "react";
import { useTheme } from '@mui/material/styles';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddLinkIcon from "@mui/icons-material/AddLink";

export const SendLinkButton = ({user, sendLinkFunction})=>
{
    const theme = useTheme();
    return <AlertDialog triggerStyle={{color: theme.palette.orange.dark, borderColor: theme.palette.orange.main,
                        '&:hover ': {background: theme.palette.orange.light}}}
                        handleConfirmation={() => sendLinkFunction(user.email)} openLabel={"Envoyer un lien"}
                        message={"Vous êtes sur le point de d'envoyer un lien d'activation de compte à " + user.firstName + ". Confirmez-vous cette action ?"}
                        actionDisabled={false} TriggerIcon={<AddLinkIcon sx={{fontSize: '1.1rem'}}/>}/>
}