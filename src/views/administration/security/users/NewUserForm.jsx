import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';

// material-ui
import {styled, useTheme} from '@mui/material/styles';
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    FormHelperText,
    Grid,
    IconButton, Stack, Table, TableBody, TableCell,
    TableHead,
    TableRow,
    TextField, Tooltip
} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AddIcon from '@mui/icons-material/Add';

// assets
import CloseIcon from '@mui/icons-material/Close';
import {dispatch, useSelector} from "../../../../store";
import {userActions} from "../../../../store/slices/administration/security/userSlice";
import {FormMode} from "../../../../enums/FormMode";
import GroupZone from "../../../ui-elements/custom/GroupZone";
import {gridSpacing} from "../../../../store/constant";
import {useFormik} from "formik";
import {useFeedBackEffects} from "../../../../hooks/useFeedBack";
import {initialCreateUserAndFunctionDTO, initialCreateUserDTO} from "./UserDtos";
import {useMutation, useQuery, useQueryClient} from "react-query";
import AlertDialog from "../../../ui-elements/advance/UIDialog/AlertDialog";
import FloatingAlert from "../../../ui-elements/custom/FloatingAlert";
import InputLabel from "../../../../ui-component/extended/Form/InputLabel";
import {Delete, Edit} from "@mui/icons-material";
import * as Yup from "yup";
import {isValidDate} from "../../../utilities/DateUtils";
import {feedBackActions} from "../../../../store/slices/feedBackSlice";
import SimpleBackdrop from "../../../ui-elements/custom/SimpleBackdrop";
import axiosServices from "../../../../utils/axios";
import {initialCreateFncDTO} from "../functions/FncDtos";
import {fncActions} from "../../../../store/slices/administration/security/fncSlice";
import {palette} from "@mui/system";
import {purple} from "@mui/material/colors";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuDialogContent-root': {
        padding: theme.spacing(2)
    },
    '& .MuDialogActions-root': {
        padding: theme.spacing(1)
    }
}));

const BootstrapDialogTitle = ({ children, onClose, ...other }) => (
    <DialogTitle sx={{m: 0, p: 1}} {...other}>
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

export default function NewUserForm() {
    const {formOpened} = useSelector(state=>state.user);
    const {currentCreateUserAndFncsDTO} = useSelector(state=>state.fnc);
    const createFncDTOS = currentCreateUserAndFncsDTO?.createFncDTOS;
    const [selectedRoles, setSelectedRoles] = useState([])
    const [preselectedPrivileges, setPreselectedPrivileges] = useState([])
    const {data: roles} = useQuery('getRoleOptions', ()=>axiosServices({url: '/roles/all-options'}), {refetchOnWindowFocus: false})
    const {data: privileges} = useQuery('getPrivilegeOptions', ()=>axiosServices({url: '/privileges/all-options'}), {refetchOnWindowFocus: false})
    const [roleCodes, setRoleCodes] = useState([]);
    const theme = useTheme();
    useEffect(() => {
        axiosServices({url: `/privileges/options-by-role-codes?roleCodes=${roleCodes}`}).then(resp=>setPreselectedPrivileges(resp?.data))
    }, [roleCodes]);

    useEffect(() => {
    }, [preselectedPrivileges]);

    const handleClickOpen = () => {
        dispatch(userActions.formOpened({formMode: FormMode.NEW}))
    };
    const handleClose = () => {
        dispatch(userActions.formClosed());
        dispatch(fncActions.newUserFormClosed());
    };
    const queryClient = useQueryClient();


    const {mutate: createUserAndFncs, isError: isCreateError, isSuccess: isCreateSuccess, error: createError, isLoading}
        = useMutation('createUserAndFncs',
        (values)=> axiosServices({url: '/users/create-user-and-functions', method: 'post', data: values}),
        {onSuccess: ()=>queryClient.invalidateQueries("searchUsers")});

    const handleSubmit = async (values) =>
    {
        const dto = {createUserDTO: values.createUserDTO, createInitialFncDTOS: currentCreateUserAndFncsDTO.createFncDTOS};
        await createUserAndFncs(dto);
    }

    const validationSchema = Yup.object({
        createUserDTO: Yup.object({
            email: Yup.string().email('Mail invalide').required('Champ obligatoire'),
            tel: Yup.string().required('Champ obligatoire'),
            firstName: Yup.string().required('Champ obligatoire'),
            lastName: Yup.string().required('Champ obligatoire'),
        }),
        createInitialFncDTO: Yup.object({
                name: Yup.string().required('Champ obligatoire'),
                startsAt: Yup.string().required('Champ obligatoire')
                    .test('validStartingDate', 'Format incorrect', (value)=>
                    {
                        return isValidDate(value)
                    })
                    .test('NotTooLateStartingDate', 'La date de début doit être antérieure à la date de fin', function startingDateIsValid(startsAt)
                    {
                        const {endsAt} = this.parent
                        return new Date(startsAt) <= new Date(endsAt);
                    }),

                endsAt: Yup.date().required('Champ obligatoire')
                    .test('validEndingDate', 'Format incorrect', (value)=>
                    {
                        return isValidDate(value)
                    })
                    .test('NotTooEarlyEndingDate', 'La date de fin doit être ultérieure à la date de début', function endDateIsValid(endsAt)
                    {
                        const {startsAt} = this.parent
                        return new Date(startsAt) <= new Date(endsAt);
                    }),
                roleCodes : Yup.array().required('Champ obligatoire').test((roleCodes)=>
                {
                    return !(roleCodes == null || roleCodes == undefined || roleCodes.length == 0)
                })}),
    });

    const formik = useFormik(
        {
            initialValues: initialCreateUserAndFunctionDTO,
            onSubmit: handleSubmit,
            validationSchema: validationSchema
        }
    )

    const handleConfirmation = async ()=>
    {
        const canSubmit = !formik.errors.createUserDTO || createFncDTOS == null || createFncDTOS == undefined || createFncDTOS.length == 0;
        if(!canSubmit)
        {
            dispatch(feedBackActions.operationFailed("Le formulaire n'est pas valide"))
            return;
        }
        await formik.setErrors({});
        await formik.setFieldValue('createInitialFncDTO', createFncDTOS[0])
        formik.submitForm();
        await formik.setFieldValue('createInitialFncDTO', initialCreateFncDTO)
        formik.setTouched({createInitialFncDTO: false, createUserDTO: false})
    }
    useEffect(()=>
    {
        if(isCreateSuccess)
        {
            formik.setFieldValue('createInitialFncDTO', initialCreateFncDTO)
            formik.setFieldValue('createUserDTO', initialCreateUserDTO);
            formik.setTouched({createInitialFncDTO: false, createUserDTO: false})
            dispatch(fncActions.createFncDTOSCleaned())
        }
    }, [isCreateSuccess])
    useFeedBackEffects(isCreateSuccess, isCreateError, createError);

    const handleEditFunction = (index, row)=>
    {
        formik.setFieldValue('createInitialFncDTO', row);
        axiosServices({url: `/roles/options-by-roleCodes?roleCodes=${row.roleCodes}`})
            .then(resp=>setSelectedRoles(resp.data)).catch(err=>console.log(err));
        axiosServices({url: `/privileges/options-by-role-codes?roleCodes=${row.roleCodes}`})
            .then(resp=>setPreselectedPrivileges(resp.data)).catch(err=>console.log(err));
        dispatch(fncActions.createFncDTOEdited(index))
    };
    const handleAddFunction = ()=>
    {
        const dto = formik.values.createInitialFncDTO;
        dispatch(fncActions.newCreateFncDTOAdded(dto))
        formik.setFieldValue('createInitialFncDTO', initialCreateFncDTO)
        formik.setTouched('createInitialFncDTO', false)
        setSelectedRoles([]);
        setPreselectedPrivileges([]);
    }

    return (
        <div>
            <Button variant="contained" color={'secondary'} onClick={handleClickOpen}>
                <AddIcon />
            </Button>
            <BootstrapDialog aria-labelledby="customized-dialog-title" open={formOpened} maxWidth="lg" fullWidth >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose} >
                    <small>Nouvel utilisateur</small>
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} sm={6}>
                            <GroupZone tilte={'Informations sur l\'utilisateur'}>
                                <Grid container spacing={2}>

                                    <Grid item xs={12} sm={12} lg={12}>
                                        <InputLabel>Nom {formik.touched.createUserDTO?.firstName&&<small style={{color:'red'}} >{formik.errors.createUserDTO?.firstName}</small>}</InputLabel>
                                        <TextField fullWidth placeholder="Saisir le nom de l'utilisateur" onBlur={formik.handleBlur} size={"small"} name={'createUserDTO.firstName'} value={formik.values.createUserDTO?.firstName} onChange={formik.handleChange}/>
                                        <FormHelperText></FormHelperText>
                                    </Grid>
                                    <Grid item xs={12} sm={12} lg={12}>
                                        <InputLabel>Prénom {formik.touched.createUserDTO?.lastName&&<small style={{color:'red'}} >{formik.errors.createUserDTO?.lastName}</small>}</InputLabel>
                                        <TextField fullWidth placeholder="Saisir le prénom de l'utilisateur" onBlur={formik.handleBlur} size={"small"} name={'createUserDTO.lastName'} value={formik.values.createUserDTO?.lastName} onChange={formik.handleChange}/>
                                        <FormHelperText></FormHelperText>
                                    </Grid>
                                    <Grid item xs={12} sm={12} lg={6}>
                                        <InputLabel>Email {formik.touched.createUserDTO?.email&&<small style={{color:'red'}} >{formik.errors.createUserDTO?.email}</small>}</InputLabel>
                                        <TextField fullWidth onBlur={formik.handleBlur} name={'createUserDTO.email'} value={formik.values.createUserDTO?.email} placeholder="Saisir le mail de l'utilisateur" size={"small"} onChange={formik.handleChange}/>
                                    </Grid>
                                    <Grid item xs={12} sm={12} lg={6}>
                                        <InputLabel>Téléphone {formik.touched.createUserDTO?.tel&&<small style={{color:'red'}} >{formik.errors.createUserDTO?.tel}</small>}</InputLabel>
                                        <TextField fullWidth placeholder="Saisir le téléphone de l'utilisateur" onBlur={formik.handleBlur} size={"small"} name={'createUserDTO.tel'} value={formik.values.createUserDTO?.tel} onChange={formik.handleChange}/>
                                        <FormHelperText></FormHelperText>
                                    </Grid>
                                </Grid>
                            </GroupZone>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <GroupZone tilte={'Fonction'}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12} lg={4}>
                                        <InputLabel>Nom de la fonction {formik.touched.createInitialFncDTO?.name&&<small style={{color:'red'}} >{formik.errors.createInitialFncDTO?.name}</small>}</InputLabel>
                                        <TextField fullWidth onBlur={formik.handleBlur} name={'createInitialFncDTO.name'} value={formik.values.createInitialFncDTO?.name} placeholder="Saisir le nom de la fonction" size={"small"} onChange={formik.handleChange}/>

                                    </Grid>
                                    <Grid item xs={12} sm={6} lg={4}>
                                        <InputLabel>Début {formik.touched.createInitialFncDTO?.startsAt&&<small style={{color:'red'}} >{formik.errors.createInitialFncDTO?.startsAt}</small>}</InputLabel>
                                        <TextField fullWidth type={"date"} size={"small"} name={'createInitialFncDTO.startsAt'}  value={formik.values.createInitialFncDTO?.startsAt} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                    </Grid>
                                    <Grid item xs={12} sm={6} lg={4}>
                                        <InputLabel>Fin {formik.touched.createInitialFncDTO?.endsAt&&<small style={{color:'red'}} >{formik.errors.createInitialFncDTO?.endsAt}</small>}</InputLabel>
                                        <TextField fullWidth type={"date"} size={"small"} name={'createInitialFncDTO.endsAt'} value={formik.values.createInitialFncDTO?.endsAt} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                    </Grid>
                                    <Grid item xs={12} lg={6}>
                                        <InputLabel>Rôles {formik.touched.createInitialFncDTO?.roleCodes&&<small style={{color:'red'}} >{formik.errors.createInitialFncDTO?.roleCodes}</small>}</InputLabel>

                                        <Autocomplete multiple
                                                      fullWidth
                                                      size={"small"}
                                                      name={'createInitialFncDTO.roleCodes'}
                                                      onChange={(e, ops) => {
                                                          setSelectedRoles(ops);
                                                          setRoleCodes(ops?.map(o=>o.id))
                                                          formik.setFieldValue('createInitialFncDTO.roleCodes', ops?.map(o=>o?.id))
                                                          console.log('roleCodes', roleCodes);
                                                          //setSelectedPrvs(loadedSelectedPrvs?.data);
                                                      }}

                                                      onBlur={(e) => {
                                                          formik.handleBlur(e);  // Make sure to call the Formik handler
                                                      }}
                                                      value={selectedRoles}
                                                      options={roles?.data||[]}

                                                      renderInput={(params) => <TextField {...params} label='Sélectionner les rôles' />}
                                        />
                                    </Grid>
                                    <Grid item xs={12} lg={6} >
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
                                            <Button sx={{marginTop: 1, marginLeft: 'auto'}} variant={"outlined"} onClick={handleAddFunction} disabled={!formik.isValid}>Ajouter</Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </GroupZone>
                        </Grid>

                        <Grid item xs={12}>
                            <GroupZone tilte={'Liste des fonctions'}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ pl: 3 }}>#</TableCell>
                                            <TableCell>Nom de la fonction</TableCell>
                                            <TableCell>Début</TableCell>
                                            <TableCell>Fin</TableCell>
                                            <TableCell>Rôles</TableCell>
                                            <TableCell align="center" sx={{ pr: 3 }}>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {createFncDTOS &&
                                        createFncDTOS?.map((row, index) => (
                                            <TableRow hover key={index}>
                                                <TableCell sx={{ pl: 3 }}>{index+1}</TableCell>
                                                <TableCell>
                                                    {row.name}
                                                </TableCell>
                                                <TableCell>{row.startsAt}</TableCell>
                                                <TableCell>{row.endsAt}</TableCell>
                                                <TableCell>{row.roleCodes?.join(' / ')}</TableCell>
                                                <TableCell align="center" sx={{ pr: 3 }}>
                                                    <Stack direction="row" justifyContent="center" alignItems="center">
                                                        <Tooltip placement="top" title="Modifier">
                                                            <IconButton color="primary" aria-label="modifier" size="large" onClick={()=> handleEditFunction(index, row)}>
                                                                <Edit sx={{ fontSize: '1.1rem' }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip placement="top" title="Supprimer">
                                                            <IconButton onClick={()=>dispatch(fncActions.createFncDTORemoved(index))}
                                                                color="primary"
                                                                sx={{
                                                                    color: theme.palette.orange.dark,
                                                                    borderColor: theme.palette.orange.main,
                                                                    '&:hover ': { background: theme.palette.orange.light }
                                                                }}
                                                                size="large"
                                                            >
                                                                <Delete sx={{ fontSize: '1.1rem' }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </GroupZone>
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <AlertDialog actionDisabled={formik?.errors?.createUserDTO != undefined || createFncDTOS == null || createFncDTOS == undefined || createFncDTOS.length == 0}
                                 openLabel={'Enregistrer'} handleConfirmation={handleConfirmation}/>
                </DialogActions>
            </BootstrapDialog>
            <FloatingAlert/>
            <SimpleBackdrop open={isLoading}/>
        </div>
    );
}
