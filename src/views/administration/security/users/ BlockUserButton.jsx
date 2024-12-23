import AlertDialog from "../../../ui-elements/advance/UIDialog/AlertDialog";
import BlockTwoToneIcon from "@mui/icons-material/BlockTwoTone";
import React from "react";
import { useTheme } from '@mui/material/styles';

export const BlockUserButton = ({user, blockUserFunction})=>
{
    const theme = useTheme();
    return <AlertDialog triggerStyle={{color: theme.palette.error.dark,
                        borderColor: theme.palette.error.main, '&:hover ': {background: theme.palette.error.light}}}
                        handleConfirmation={() => blockUserFunction(user.userId)} openLabel={"Bloquer"}
                        message={"Vous êtes sur le point de bloquer " + user.firstName + ". Confirmez-vous cette action ?"}
                        actionDisabled={false} TriggerIcon={<BlockTwoToneIcon sx={{fontSize: '1.1rem'}}/>}/>
}