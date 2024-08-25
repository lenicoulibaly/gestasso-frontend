import PropTypes from 'prop-types';
import React, {useEffect} from 'react';

// material-ui
import { styled } from '@mui/material/styles';
import {Dialog, FormHelperText, Grid, IconButton, TextField} from '@mui/material';
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

import * as Yup from "yup";
import {useMutation, useQueryClient} from "react-query";
import FloatingAlert from "../../../ui-elements/custom/FloatingAlert";
import SimpleBackdrop from "../../../ui-elements/custom/SimpleBackdrop";
import AlertDialog from "../../../ui-elements/advance/UIDialog/AlertDialog";
import {useFeedBackEffects} from "../../../../hooks/useFeedBack";
import {initialUpdateUserDTO} from "./UserDtos";
import axiosServices from "../../../../utils/axios";

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

export default function UpdateUserForm() {
    const {updFormOpened, currentUser} = useSelector(state=>state.user);

    const handleClose = () => {
        dispatch(userActions.updFormClosed());
    };
    const queryClient = useQueryClient();
    const {mutate: updateUser, isLoading, isError, error, isSuccess} = useMutation('updateUser',
        (dto)=>axiosServices({url: "/users/update", method: 'put', data: dto}),
        {onSuccess: ()=>queryClient.invalidateQueries("searchUsers")})

    const handleSubmit = async (dto) =>
    {
        updateUser(dto);
    }

    const validationSchema = Yup.object(
        {
            userId: Yup.number().required("Veuillez selectionner l'utilisateur à modifier"),
            tel: Yup.string().required("Veuillez saisir le N° de téléphone"),
            firstName: Yup.string().required("Veuillez saisir le nom de l'utilisateur"),
            lastName: Yup.string().required("Veuillez saisir le prénom de l'utilisateur")
        });

    useFeedBackEffects(isSuccess, isError, error);

    const formik = useFormik(
        {
            initialValues: initialUpdateUserDTO,
            onSubmit: handleSubmit,
            validationSchema: validationSchema
        }
    );
    useEffect(()=>
    {
        formik.setValues(currentUser)
    }, [currentUser])
    return (
        <div>
            <BootstrapDialog aria-labelledby="customized-dialog-title" open={updFormOpened} maxWidth="sm" fullWidth>
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {`Modification de ${currentUser?.email}`}
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Grid item xs={12}>
                        <GroupZone tilte={'Informations sur l\'utilisateur'}>
                            <Grid container spacing={2}>

                                <Grid item xs={12} sm={12} lg={12}>
                                    <InputLabel>Nom {formik.touched.firstName&&<small style={{color:'red'}} >{formik.errors?.firstName}</small>}</InputLabel>
                                    <TextField fullWidth placeholder="Saisir le nom de l'utilisateur" onBlur={formik.handleBlur} size={"small"} name={'firstName'} value={formik.values?.firstName} onChange={formik.handleChange}/>
                                    <FormHelperText></FormHelperText>
                                </Grid>
                                <Grid item xs={12} sm={12} lg={12}>
                                    <InputLabel>Prénom {formik.touched.lastName&&<small style={{color:'red'}} >{formik.errors?.lastName}</small>}</InputLabel>
                                    <TextField fullWidth placeholder="Saisir le prénom de l'utilisateur" onBlur={formik.handleBlur} size={"small"} name={'lastName'} value={formik.values?.lastName} onChange={formik.handleChange}/>
                                    <FormHelperText></FormHelperText>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <InputLabel>Téléphone {formik.touched.tel&&<small style={{color:'red'}} >{formik.errors?.tel}</small>}</InputLabel>
                                    <TextField fullWidth placeholder="Saisir le téléphone de l'utilisateur" onBlur={formik.handleBlur} size={"small"} name={'tel'} value={formik.values?.tel} onChange={formik.handleChange}/>
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
