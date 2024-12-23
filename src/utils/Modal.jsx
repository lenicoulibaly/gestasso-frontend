import {styled} from "@mui/material/styles";
import {Autocomplete, Button, Dialog, FormHelperText, Grid, IconButton, TextField} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import {FormMode} from "../enums/FormMode";
import DialogContent from "@mui/material/DialogContent";
import {gridSpacing} from "../store/constant";
import InputLabel from "../ui-component/extended/Form/InputLabel";
import DialogActions from "@mui/material/DialogActions";
import AlertDialog from "../views/ui-elements/advance/UIDialog/AlertDialog";

export const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuDialogContent-root': {
        padding: theme.spacing(2)
    },
    '& .MuDialogActions-root': {
        padding: theme.spacing(1)
    }
}));

export const BootstrapDialogTitle = ({ children, onClose, ...other }) => (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 10,
                    top: 10,
                    color: (theme) => theme.palette.grey[500]
                }}
            >
                <CloseIcon />
            </IconButton>
        ) : null}
    </DialogTitle>
);
BootstrapDialogTitle.propTypes = {
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node
};

const Modal = ({open, title, handleClose, handleConfirmation, content, actionDisabled, actionLabel})=>
{
    return(
        <>
            <BootstrapDialog aria-labelledby="customized-dialog-title" open={open} maxWidth="sm" fullWidth>

                    <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                        {title}
                    </BootstrapDialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                {content}
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <AlertDialog actionDisabled={actionDisabled} openLabel={actionLabel || 'Enregistrer'} handleConfirmation={handleConfirmation}/>
                    </DialogActions>
            </BootstrapDialog>
        </>)
}

export default Modal