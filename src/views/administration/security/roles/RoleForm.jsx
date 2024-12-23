import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';

// material-ui
import { styled } from '@mui/material/styles';
import {Autocomplete, Button, Dialog, FormHelperText, Grid, IconButton, TextField} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AddIcon from '@mui/icons-material/Add';

// assets
import CloseIcon from '@mui/icons-material/Close';
import {useSelector} from "react-redux";
import {dispatch} from "../../../../store";
import {roleActions} from "../../../../store/slices/administration/security/roleSlice";
import {InitialCreateRoleDTO} from "./RoleTypes";
import {gridSpacing} from "../../../../store/constant";
import InputLabel from "../../../../ui-component/extended/Form/InputLabel";
import {FormMode} from "../../../../enums/FormMode";
import {useFormik} from "formik";
import TransferList from "../../../ui-elements/custom/TransferList";
import axiosServices from "../../../../utils/axios";
import {useMutation, useQuery, useQueryClient} from "react-query";
import FloatingAlert from "../../../ui-elements/custom/FloatingAlert";
import AlertDialog from "../../../ui-elements/advance/UIDialog/AlertDialog";
import {useFeedBackEffects} from "../../../../hooks/useFeedBack";
import GroupZone from "../../../ui-elements/custom/GroupZone";

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

export default function RoleForm() {

    const {currentRole, formOpened, formMode, roles} = useSelector(state => state.role);
    const [selectedPrvTypes, setSelectedPrvTypes] = useState([]);
    const {selected: selectePrivileges} = useSelector(state=>state.transferList);
    const [prvTypes, setPrvTypes] = useState([]);
    const {mutate: createRole, isError: isCreateError, isSuccess: isCreateSuccess, error: createError}
        = useMutation('createRole', (values)=> axiosServices({url: '/roles/create', method: 'post', data: values}),
        {onSuccess: ()=>queryClient.invalidateQueries('searchRoles')});
    const queryClient = useQueryClient();
    const {mutate: updateRole, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError, data: newRole}
        = useMutation('updateRole',
        (values)=> axiosServices({url: '/roles/update', method: 'put', data: values}),
        {onSuccess: ()=>queryClient.invalidateQueries('searchRoles')})

    const handleClickOpen = () => {
        dispatch(roleActions.formOpened({currentRole: InitialCreateRoleDTO, formMode: FormMode.NEW}));
    };
    const handleClose = () => {
        dispatch(roleActions.formClosed());
    };

    useEffect(()=>
    {
        axiosServices({url: "/privileges/types"}).then(resp=>setPrvTypes(resp.data)).catch(err=>console.log(err));
    }, []);

    const selectedPrvtypeCodes = selectedPrvTypes?.map(t=>t.id);
    const {data: unselectedPrvs} = useQuery(["getPrivilegesByTypeCode", selectedPrvtypeCodes],
        ()=>axiosServices ({url: `/privileges/by-typeCodes?typeCodes=${selectedPrvtypeCodes}`}));

    const handleSubmit = values =>
    {
        formMode == FormMode.NEW ? createRole(values) : formMode == FormMode.UPDATE ? updateRole(values) : null
    }

    const formik = useFormik(
        {
            initialValues: currentRole,
            onSubmit: handleSubmit,
        }
    )
    const handleConfirmation = async()=>
    {
        if(!formik.isValid) return;
        formik.submitForm();
    }
    useFeedBackEffects(isCreateSuccess, isCreateError, createError);
    useFeedBackEffects(isUpdateSuccess, isUpdateError, updateError)
    useEffect(()=>
    {
        if(isCreateSuccess || isUpdateSuccess) dispatch(roleActions.formClosed());
    }, [isCreateSuccess, isUpdateSuccess])
    useEffect(()=>
    {
        formik.setFieldValue('prvCodes', selectePrivileges?.map(p=>p.id))
    }, [selectePrivileges])

    useEffect(()=>
    {
        formik.setValues(currentRole)
        const selectedPrvTypeIds = currentRole?.privilegeOptions?.map(po=>po.id);
        const selectedPrvTypes = prvTypes.filter(p=>selectedPrvTypeIds?.indexOf(p.id)>=0 );
            setSelectedPrvTypes(selectedPrvTypes);
    }, [currentRole])

    return (
        <div>
            <Button variant="contained" color={'secondary'} onClick={handleClickOpen} title={'Ajouter un nouvel utilisateur'}>
                <AddIcon />
            </Button>
            <BootstrapDialog aria-labelledby="customized-dialog-title" open={formOpened} maxWidth="md" fullWidth>
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {formMode == FormMode.NEW ? 'Nouveau rôle' : "Modification du rôle " + currentRole?.roleName }
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={6} lg={4}>
                                    <InputLabel>Code rôle {formik.touched.roleCode&&<small style={{color:'red'}} >{formik.errors.roleCode}</small>}</InputLabel>
                                    <TextField InputProps={{ readOnly: formMode==FormMode.UPDATE }} fullWidth onBlur={formik.handleBlur} name={'roleCode'} value={formik.values.roleCode} placeholder="Saisir le code du rôle" size={"small"} onChange={formik.handleChange}/>

                                </Grid>
                                <Grid item xs={12} sm={6} lg={4}>
                                    <InputLabel>Nom {formik.touched.roleName&&<small style={{color:'red'}} >{formik.errors.roleName}</small>}</InputLabel>
                                    <TextField fullWidth placeholder="Saisir le nom du rôle" onBlur={formik.handleBlur} size={"small"} name={'roleName'} value={formik.values.roleName} onChange={formik.handleChange}/>
                                    <FormHelperText></FormHelperText>
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <InputLabel>Type de privilège <small style={{color:'red'}} ></small></InputLabel>
                                    <Autocomplete multiple
                                        fullWidth
                                        size={"small"}
                                        name={'typePrvCodes'}
                                        onChange={(e, ops) => {
                                            setSelectedPrvTypes(ops);
                                        }}
                                        getOptionValue={(option) => option.id}
                                        onBlur={(e) => {
                                            formik.handleBlur(e);  // Make sure to call the Formik handler
                                        }}
                                        value={selectedPrvTypes}
                                        options={prvTypes}

                                        renderInput={(params) => <TextField {...params} label='Filtrer par type' />}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel> {formik.touched.prvCodes&&<small style={{color:'red'}} >{formik.errors.prvCodes}</small>}</InputLabel>
                                    <GroupZone tilte={'Privilèges'}>
                                        <TransferList initialList={unselectedPrvs?.data} preselected={currentRole.privilegeOptions}/>
                                    </GroupZone>

                                    <FormHelperText></FormHelperText>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <AlertDialog actionDisabled={!formik.isValid} openLabel={'Enregistrer'} handleConfirmation={handleConfirmation}/>
                </DialogActions>
            </BootstrapDialog>
            <FloatingAlert/>
        </div>
    );
}
