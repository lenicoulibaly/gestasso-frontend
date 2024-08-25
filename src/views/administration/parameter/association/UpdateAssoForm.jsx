import PropTypes from 'prop-types';
import React, {useEffect} from 'react';

// material-ui
import { styled } from '@mui/material/styles';
import {Dialog, FormHelperText, Grid, IconButton, TextField, Typography} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// assets
import CloseIcon from '@mui/icons-material/Close';
import {dispatch, useSelector} from "../../../../store";
import {userActions} from "../../../../store/slices/administration/security/userSlice";
import GroupZone from "../../../ui-elements/custom/GroupZone";
import InputLabel from "../../../../ui-component/extended/Form/InputLabel";
import {useFormik} from "formik";

import {useMutation, useQueryClient} from "react-query";
import FloatingAlert from "../../../ui-elements/custom/FloatingAlert";
import SimpleBackdrop from "../../../ui-elements/custom/SimpleBackdrop";
import AlertDialog from "../../../ui-elements/advance/UIDialog/AlertDialog";
import {useFeedBackEffects} from "../../../../hooks/useFeedBack";
import axiosServices from "../../../../utils/axios";
import {initialUpdateAssoDTO, updateAssoValidationSchema} from "./AssoDtos";
import {assoActions} from "../../../../store/slices/administration/params/assoSlice";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuDialogContent-root': {
        padding: theme.spacing(2)
    },
    '& .MuDialogActions-root': {
        padding: theme.spacing(1)
    }
}));

const BootstrapDialogTitle = ({ children, onClose, ...other }) => (
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

export default function UpdateAssoForm() {
    const {updateAssoFormOpened, currentUpdateAssoDTO} = useSelector(state=>state.asso);

    const handleClose = () => {
        dispatch(assoActions.updateAssoFormClosed());
    };
    const queryClient = useQueryClient();
    const {mutate: updateAsso, isLoading, isError, error, isSuccess} = useMutation('updateAsso',
        (dto)=>axiosServices({url: "/associations/update", method: 'put', data: dto}),
        {onSuccess: ()=>queryClient.invalidateQueries("searchAssociations")})

    const handleSubmit = async (dto) =>
    {
        updateAsso(dto);
    }

    useFeedBackEffects(isSuccess, isError, error);

    const formik = useFormik(
        {
            initialValues: initialUpdateAssoDTO,
            onSubmit: handleSubmit,
            validationSchema: updateAssoValidationSchema

        }
    );
    useEffect(()=>
    {
        formik.setValues(currentUpdateAssoDTO)
    }, [currentUpdateAssoDTO])
    return (
        <div>
            <BootstrapDialog aria-labelledby="customized-dialog-title" open={updateAssoFormOpened} maxWidth="sm" fullWidth>
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {`Modification de`} <Typography variant="h3" component={"span"}>{currentUpdateAssoDTO?.sigle}</Typography>
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Grid item xs={12}>
                        <GroupZone tilte={'Informations sur l\'association'}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} lg={12}>
                                    <InputLabel>Dénomination {formik.touched.assoName&&<small style={{color:'red'}} >{formik.errors?.assoName}</small>}</InputLabel>
                                    <TextField fullWidth placeholder="Saisir le nom de l'association" onBlur={formik.handleBlur} size={"small"} name={'assoName'} value={formik.values?.assoName} onChange={formik.handleChange}/>
                                    <FormHelperText></FormHelperText>
                                </Grid>
                                <Grid item xs={12} sm={12} lg={12}>
                                    <InputLabel>Sigle {formik.touched.sigle&&<small style={{color:'red'}} >{formik.errors?.sigle}</small>}</InputLabel>
                                    <TextField fullWidth placeholder="Saisir le sigle de l'assocuiation" onBlur={formik.handleBlur} size={"small"} name={'sigle'} value={formik.values?.sigle} onChange={formik.handleChange}/>
                                    <FormHelperText></FormHelperText>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <InputLabel>Situation géographique {formik.touched.situationGeo&&<small style={{color:'red'}} >{formik.errors?.situationGeo}</small>}</InputLabel>
                                    <TextField fullWidth placeholder="Saisir la situation géographique de l'association" onBlur={formik.handleBlur} size={"small"} name={'situationGeo'} value={formik.values?.situationGeo} onChange={formik.handleChange}/>
                                    <FormHelperText></FormHelperText>
                                </Grid>

                                <Grid item xs={12} sm={12}>
                                    <InputLabel>Droit d'adhésion {formik.touched.droitAdhesion&&<small style={{color:'red'}} >{formik.errors?.droitAdhesion}</small>}</InputLabel>
                                    <TextField fullWidth placeholder="Saisir le montant du droit d'ahésion de l'association" onBlur={formik.handleBlur} size={"small"} name={'droitAdhesion'} value={formik.values?.droitAdhesion} onChange={formik.handleChange}/>
                                    <FormHelperText></FormHelperText>
                                </Grid>
                            </Grid>
                        </GroupZone>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <AlertDialog actionDisabled={!formik.isValid}
                                 openLabel={'Modifier'} handleConfirmation={formik.submitForm}/>
                </DialogActions>
            </BootstrapDialog>
            <FloatingAlert/>
            <SimpleBackdrop open={isLoading}/>
        </div>
    );
}
