import AlertDialog from "../../../ui-elements/advance/UIDialog/AlertDialog";
import React from "react";
import { useTheme } from '@mui/material/styles';
import AddLinkIcon from "@mui/icons-material/AddLink";
import {Edit} from "@mui/icons-material";

export const UpdateDocButton = ({docId, updateDocFunction, alertMessage, openLabel})=>
{
    const theme = useTheme();
    return <AlertDialog triggerStyle={{color: theme.palette.orange.dark, borderColor: theme.palette.orange.main,
                        '&:hover ': {background: theme.palette.orange.light}}}
                        handleConfirmation={() => updateDocFunction(docId)} openLabel={openLabel}
                        message={alertMessage}
                        actionDisabled={false} TriggerIcon={<Edit sx={{fontSize: '1.1rem'}}/>}/>
}