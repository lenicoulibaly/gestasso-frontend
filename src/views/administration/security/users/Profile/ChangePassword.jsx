// material-ui
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
import {useUserService} from "../../../../../hooks/services/useUserService";
import {useFeedBackEffects} from "../../../../../hooks/useFeedBack";
import {useFormik} from "formik";
import {createMembreValidationSchema, initialCreateMembreDTO} from "../../../../production/membres/MembreDtos";
import {useSelector} from "../../../../../store";
import DialogActions from "@mui/material/DialogActions";
import AlertDialog from "../../../../ui-elements/advance/UIDialog/AlertDialog";
import FloatingAlert from "../../../../ui-elements/custom/FloatingAlert";
import SimpleBackdrop from "../../../../ui-elements/custom/SimpleBackdrop";
import React, {useEffect} from "react";
import InputLabel from "../../../../../ui-component/extended/Form/InputLabel";
import * as Yup from "yup";

// ==============================|| PROFILE 1 - CHANGE PASSWORD ||============================== //

const ChangePassword = () =>
{
    const {changePassword} = useUserService();
    useFeedBackEffects(changePassword.isSuccess, changePassword.isError, changePassword.error);
    const { currentProfile} = useSelector((state) => state.membre);
    const initialDto = {
        userId: currentProfile.userId,
        email: currentProfile.email,
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    }
    const formik = useFormik(
        {
            initialValues: initialDto,
            onSubmit: (values)=> {
                changePassword.mutate(values);
                formik.setValues(initialDto);
            },
            validationSchema: Yup.object({
                oldPassword: Yup.string().required('*'),
                newPassword: Yup.string().required('*'),
                confirmPassword: Yup.string().required('*'),

            })
        }
    );
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Alert severity="warning" variant="outlined" sx={{ borderColor: 'warning.dark' }}>
                    <AlertTitle>Alert!</AlertTitle>
                    <strong> Do not share your password</strong>
                </Alert>
            </Grid>
            <Grid item xs={12}>
                <SubCard title="Change Password">
                    <form noValidate autoComplete="off">
                        <Grid container spacing={gridSpacing} sx={{ mb: 1.75 }}>
                            <Grid item xs={12} sm={4}>
                                <InputLabel>Ancien mot de passe {formik.touched?.oldPassword&&<small style={{color:'red'}} >{formik.errors?.oldPassword}</small>}</InputLabel>
                                <TextField name={'oldPassword'} value={formik.values.oldPassword} type="password" id="outlined-basic7" fullWidth label="Ancien mot de passe"  onBlur={formik.handleBlur} onChange={formik.handleChange}/>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <InputLabel>Nouveau mot de passe {formik.touched?.newPassword&&<small style={{color:'red'}} >{formik.errors?.newPassword}</small>}</InputLabel>
                                <TextField name={'newPassword'} value={formik.values.newPassword} type="password" id="outlined-basic8" fullWidth label="Nouveau mot de passe"  onBlur={formik.handleBlur} onChange={formik.handleChange}/>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <InputLabel>Confirmation {formik.touched?.confirmPassword&&<small style={{color:'red'}} >{formik.errors?.confirmPassword}</small>}</InputLabel>
                                <TextField name={'confirmPassword'} value={formik.values.confirmPassword} type="password" id="outlined-basic9" fullWidth label="Confirmation" onBlur={formik.handleBlur} onChange={formik.handleChange}/>
                            </Grid>
                        </Grid>
                    </form>
                    <Grid spacing={2} container justifyContent="flex-end" sx={{ mt: 3 }}>
                        <Grid item>
                            <AnimateButton>
                                <AlertDialog variant={'contained'} actionDisabled={!formik?.isValid}
                                             openLabel={'Changer le mot de passe'} handleConfirmation={formik.handleSubmit}/>
                            </AnimateButton>
                        </Grid>
                        <Grid item>
                            <Button sx={{ color: 'error.main' }} onClick={()=>formik.setValues(initialDto)}>Clear</Button>
                        </Grid>
                    </Grid>
                </SubCard>
            </Grid>
            <FloatingAlert/>
            <SimpleBackdrop open={changePassword.isLoading}/>
        </Grid>
    );
};

export default ChangePassword;
