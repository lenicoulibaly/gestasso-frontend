import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';

// material-ui
import {styled, useTheme} from '@mui/material/styles';
import {
    Autocomplete, Box, Button,
    Chip,
    Dialog,
    FormHelperText,
    Grid,
    IconButton, Stack,
    Table, TableBody,
    TableCell, TableContainer,
    TableHead,
    TableRow,
    TextField, Tooltip, Typography
} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// assets
import CloseIcon from '@mui/icons-material/Close';
import {dispatch, useSelector} from "../../../../store";
import GroupZone from "../../../ui-elements/custom/GroupZone";
import {useFormik} from "formik";

import * as Yup from "yup";
import {useMutation, useQuery, useQueryClient} from "react-query";
import FloatingAlert from "../../../ui-elements/custom/FloatingAlert";
import SimpleBackdrop from "../../../ui-elements/custom/SimpleBackdrop";
import {useFeedBackEffects} from "../../../../hooks/useFeedBack";
import {fncValidationSchema, initialUpdateFncDTO} from "./FncDtos";
import axiosServices from "../../../../utils/axios";
import {fncActions} from "../../../../store/slices/administration/security/fncSlice";
import Avatar from "../../../../ui-component/extended/Avatar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {Delete, Edit} from "@mui/icons-material";
import AlertDialog from "../../../ui-elements/advance/UIDialog/AlertDialog";
import BlockTwoToneIcon from "@mui/icons-material/BlockTwoTone";
import AddLinkIcon from "@mui/icons-material/AddLink";
import ListIcon from "@mui/icons-material/List";
import InputLabel from "../../../../ui-component/extended/Form/InputLabel";

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

export default function FncsFormDialog() {
    const {newFormOpened, updFormOpened, currentUser, currentFncToUpdate} = useSelector(state=>state.fnc);
    const {data: roles} = useQuery('getRoleOptions', ()=>axiosServices({url: '/roles/all-options'}), {refetchOnWindowFocus: false})
    const {data: privileges} = useQuery('getPrivilegeOptions', ()=>axiosServices({url: '/privileges/all-options'}), {refetchOnWindowFocus: false})
    const queryClient = useQueryClient();
    const {fncsList} = useSelector((state) => state.fnc);
    const handleClose = () => {
        dispatch(fncActions.updFormClosed());
    };

    const {mutate: addFunction, addFncIsLoading, isError: addFncIsError, error: addFncError, isSuccess: addFncIsSuccess} = useMutation('addFunction', (dto)=>axiosServices({url: "/functions/create", method: 'post', data: dto}))
    const {mutate: updateFunction, isLoading, isError, error, isSuccess} = useMutation('updateFunction', (dto)=>axiosServices({url: "/functions/update", method: 'put', data: dto}))

    const handleAddNewFunction = async (dto)=>
    {
        await addFunction(dto);
    }

    const handleUpdateFunction = async (dto)=>
    {
        await updateFunction(dto);
    }

    const handleSubmit = async (dto) =>
    {

        if(newFormOpened) {
            dto.userId = currentUser.userId;
            await handleAddNewFunction(dto);
        }
        if(updFormOpened) await handleUpdateFunction(dto);
    }

    useEffect(()=>
    {
        if(isSuccess || addFncIsSuccess)
        {
            queryClient.invalidateQueries('searchFunctions')
        }
    }, [isSuccess, addFncIsSuccess])

    const handleConfirmation = async()=>
    {
        if(!formik.isValid) return;
        formik.submitForm();
    }

    const validationSchema = Yup.object(fncValidationSchema);

    useFeedBackEffects(isSuccess, isError, error);
    useFeedBackEffects(addFncIsSuccess, addFncIsError, addFncError);

    const formik = useFormik(
        {
            initialValues: {initialUpdateFncDTO},
            onSubmit: handleSubmit,
            validationSchema: validationSchema
        }
    );
    useEffect(()=>
    {
        //formik.setValues(currentUser)
    }, [currentUser])

    const [selectedRoles, setSelectedRoles] = useState([])

    const [roleCodes, setRoleCodes] = useState([])
    const [preselectedPrivileges, setPreselectedPrivileges] = useState([])



    useEffect(()=>
    {
        formik.setValues(currentFncToUpdate)
        const initialRoles = currentFncToUpdate?.roles == null || currentFncToUpdate?.roles.length == 0 ?  [] : currentFncToUpdate?.roles?.map(r=>{return {'id': r.roleCode, 'label': r.roleName}})
        const roleCodes = initialRoles.length == 0 ? [] : initialRoles.map(r=>r.id);
        setSelectedRoles(initialRoles);
        setRoleCodes(roleCodes);
        formik.setFieldValue('roleCodes', roleCodes);
        formik.setFieldValue('fncId', currentFncToUpdate.id);
    }, [currentFncToUpdate]);
    useEffect(() => {
        axiosServices({url: `/privileges/options-by-role-codes?roleCodes=${roleCodes}`}).then(resp=>setPreselectedPrivileges(resp?.data))
    }, [roleCodes]);

    useEffect(() => {
    }, [preselectedPrivileges]);

    return (
        <div>
            <BootstrapDialog aria-labelledby="customized-dialog-title" open={newFormOpened || updFormOpened} maxWidth="md" fullWidth>
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {newFormOpened ? `Ajout d'une nouvelle fonction` : `Modification d'une fonction`}
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Grid item xs={12}>
                        <GroupZone tilte={`Infos sur l'utilisateur`}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={newFormOpened ? 4 : 6} lg={newFormOpened ? 4 : 3}>
                                    <InputLabel>Nom</InputLabel>
                                    <TextField fullWidth readonly={true} value={currentUser.firstName} size={"small"} />
                                </Grid>
                                <Grid item xs={12} sm={newFormOpened ? 4 : 6} lg={newFormOpened ? 4 : 3}>
                                    <InputLabel>Prénom </InputLabel>
                                    <TextField fullWidth readonly={true} value={currentUser.lastName} size={"small"} />
                                </Grid>
                                <Grid item xs={12} sm={newFormOpened ? 4 : 6} lg={newFormOpened ? 4 : 3}>
                                    <InputLabel>Email</InputLabel>
                                    <TextField fullWidth readonly={true} value={currentUser.email} size={"small"} />
                                </Grid>
                                {updFormOpened && <Grid item xs={12} sm={6} lg={3}>
                                    <InputLabel>Fonction</InputLabel>
                                    <TextField fullWidth readonly={true} value={currentFncToUpdate.name} size={"small"} />
                                </Grid>}
                            </Grid>
                        </GroupZone>
                        <GroupZone tilte={'Fonctionss'}>
                            <Grid container spacing={2}>

                                <Grid item xs={12} sm={12} lg={4}>
                                    <InputLabel>Nom de la fonction {formik.touched.name&&<small style={{color:'red'}} >{formik.errors.name}</small>}</InputLabel>
                                    <TextField disabled={isLoading || addFncIsLoading} fullWidth onBlur={formik.handleBlur} name={'name'} value={formik.values.name} placeholder="Saisir le nom de la fonction" size={"small"} onChange={formik.handleChange}/>
                                </Grid>
                                <Grid item xs={12} sm={6} lg={4}>
                                    <InputLabel>Début {formik.touched.startsAt&&<small style={{color:'red'}} >{formik.errors.startsAt}</small>}</InputLabel>
                                    <TextField disabled={isLoading || addFncIsLoading} fullWidth type={"date"} size={"small"} name={'startsAt'}  value={formik.values.startsAt} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                </Grid>
                                <Grid item xs={12} sm={6} lg={4}>
                                    <InputLabel>Fin {formik.touched.endsAt&&<small style={{color:'red'}} >{formik.errors.endsAt}</small>}</InputLabel>
                                    <TextField disabled={isLoading || addFncIsLoading} fullWidth type={"date"} size={"small"} name={'endsAt'} value={formik.values.endsAt} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                </Grid>
                                <Grid item xs={12} sm={12} lg={12}>
                                    <InputLabel>Rôles {formik.touched.roleCodes&&<small style={{color:'red'}} >{formik.errors.roleCodes}</small>}</InputLabel>

                                    <Autocomplete multiple disabled={isLoading || addFncIsLoading}
                                                  fullWidth
                                                  size={"small"}
                                                  name={'roleCodes'}
                                                  onChange={(e, ops) => {
                                                      setSelectedRoles(ops);
                                                      setRoleCodes(ops?.map(o=>o.id))
                                                      formik.setFieldValue('roleCodes', ops?.map(o=>o?.id))
                                                      console.log('roleCodes', roleCodes);
                                                      //setSelectedPrvs(loadedSelectedPrvs?.data);
                                                  }}

                                                  onBlur={(e) => {
                                                      formik.handleBlur(e);  // Make sure to call the Formik handler
                                                  }}
                                                  value={selectedRoles}
                                                  options={roles?.data||[]}

                                                  renderInput={(params) => <TextField {...params} label='Sélectionner les rôles de la fonction' />}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <Box display="flex" flexDirection="column">
                                        <InputLabel>Privilèges <small style={{color:'red'}} ></small></InputLabel>
                                        <Autocomplete multiple readOnly
                                                      fullWidth
                                                      size={"small"}
                                                      value={preselectedPrivileges}
                                                      getOptionLabel={(option) => option.label}
                                                      options={privileges?.data||[]}
                                                      style={{maxHeight: '500px'}}
                                                      renderInput={(params) => <TextField {...params}/>}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </GroupZone>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <AlertDialog message={'Confirmez-vous la modification ?'} actionDisabled={!formik.isValid} openLabel={'Enregistrer'} handleConfirmation={handleConfirmation}/>
                </DialogActions>
            </BootstrapDialog>

            <FloatingAlert/>
            <SimpleBackdrop open={isLoading || addFncIsLoading}/>
        </div>
    );
}
