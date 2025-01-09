import {styled} from "@mui/material/styles";
import {
    Dialog,
    DialogTitle,
    IconButton,
    DialogContent,
    DialogActions,
    Grid,
    Tooltip,
    useTheme,
    Box
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import React from "react";
import AlertDialog from "../views/ui-elements/advance/UIDialog/AlertDialog";
import {gridSpacing} from "../store/constant";
import PrintIcon from '@mui/icons-material/Print';
import AddBoxIcon from '@mui/icons-material/AddBox';
import {Edit} from "@mui/icons-material";
import SaveIcon from '@mui/icons-material/Save';

export const StyledDialog = styled(Dialog)(({ theme, bgcolor }) => ({
    '& .MuiDialog-paper': {
        overflow: 'hidden', // Empêche les débordements
        margin: 0, // Supprime les marges par défaut
        paddingTop: 0,
        border: `1px solid ${bgcolor || theme.palette.secondary.main}`, // Bordure de la même couleur que le fond du titre
        borderRadius: '5px', // Arrondit les coins de la modal
    },
}));

export const StyledDialogTitle = styled(DialogTitle)(({ theme, bgcolor }) => ({
    margin: 0, // Supprime les marges
    padding: 10, // Supprime les padding inutiles
    display: 'flex',
    justifyContent: 'space-between', // Espace entre le texte et la croix
    alignItems: 'center', // Centrage vertical
    backgroundColor: bgcolor || theme.palette.secondary.main, // Couleur définie par props ou couleur secondaire par défaut
    color: theme.palette.getContrastText(bgcolor || theme.palette.secondary.main), // Contraste pour une meilleure lisibilité
    height: '50px', // Hauteur explicite
}));

export const StyledCloseButton = styled(IconButton)(({ theme, bgcolor }) => ({
    width: '36px', // Taille explicite
    height: '36px',
    display: 'flex',
    alignItems: 'center', // Centrage vertical du contenu
    justifyContent: 'center', // Centrage horizontal du contenu
    color: theme.palette.getContrastText(bgcolor || theme.palette.secondary.main), // Contraste sur le fond
}));
const Modal = ({ open, printVisible=false, newVisible=false,
                   title, handleClose, handleConfirmation, handlePrint, handleNew,
                   children, actionVisible =true, actionDisabled, actionLabel, width,
                   titleBgColor, printButtonColor, zIndex = 1300}) => {
    return (
        <StyledDialog
            aria-labelledby="customized-dialog-title"
            open={open}
            maxWidth={width || 'sm'}
            fullWidth
            bgcolor={titleBgColor}
        >
            <StyledDialogTitle bgcolor={titleBgColor}>
                <small>{decodeURIComponent(encodeURIComponent(title))}</small>
                {handleClose && (
                    <StyledCloseButton bgcolor={titleBgColor} aria-label="close" onClick={handleClose}>
                        <CloseIcon />
                    </StyledCloseButton>
                )}
            </StyledDialogTitle>
            <DialogContent dividers>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        {children}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Box sx={{ display: "flex", justifyContent: "flex-start", width: "100%" }}>
                    {printVisible && <Tooltip placement="top" title="Imprimer">
                        <IconButton color={printButtonColor} aria-label="Print" size="large" onClick={handlePrint}>
                            <PrintIcon sx={{ fontSize: '2rem' }} />
                        </IconButton>
                    </Tooltip>}
                    {newVisible && <Tooltip placement="top" title="Nouveau">
                        <IconButton aria-label="New" size="large" onClick={handleNew}>
                            <AddBoxIcon sx={{ fontSize: '2rem' }} />
                        </IconButton>
                    </Tooltip>}
                </Box>
                <AlertDialog actionVisible={actionVisible}
                    actionDisabled={actionDisabled}
                    openLabel={actionLabel || 'Enregistrer'}
                    handleConfirmation={handleConfirmation}
                    TriggerIcon={<SaveIcon sx={{ fontSize: '2rem' }} />}
                />
            </DialogActions>
        </StyledDialog>
    );
};

Modal.propTypes = {
    open: PropTypes.bool.isRequired,
    printVisible: PropTypes.bool,
    newVisible: PropTypes.bool,
    title: PropTypes.string.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleConfirmation: PropTypes.func,
    children: PropTypes.node,
    actionDisabled: PropTypes.bool,
    actionLabel: PropTypes.string,
    width: PropTypes.string,
    titleBgColor: PropTypes.string, // Prop pour la couleur de fond de la zone de titre
    handlePrint: PropTypes.func,
};

export default Modal;
