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
import {dispatch, useSelector} from "../../../store";
import GroupZone from "../../ui-elements/custom/GroupZone";
import {gridSpacing} from "../../../store/constant";
import {useFormik} from "formik";
import {useFeedBackEffects} from "../../../hooks/useFeedBack";
import {
    createMembreValidationSchema,
    initialCreateMembreDTO, membreNotTouched,
} from "./MembreDtos";
import {useMutation, useQuery, useQueryClient} from "react-query";
import AlertDialog from "../../ui-elements/advance/UIDialog/AlertDialog";
import FloatingAlert from "../../ui-elements/custom/FloatingAlert";
import InputLabel from "../../../ui-component/extended/Form/InputLabel";
import {Delete, Edit} from "@mui/icons-material";
import {feedBackActions} from "../../../store/slices/feedBackSlice";
import SimpleBackdrop from "../../ui-elements/custom/SimpleBackdrop";
import axiosServices from "../../../utils/axios";
import {initialCreateFncDTO} from "../../administration/security/functions/FncDtos";
import {fncActions} from "../../../store/slices/administration/security/fncSlice";
import {membreActions} from "../../../store/slices/production/membres/membresSlice";
import useAuth from "../../../hooks/useAuth";
import {FormMode} from "../../../enums/FormMode";
import Modal from "../../../utils/Modal";

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

export default function NewMembreForm()
{
    const authUser = useAuth().getAuthUser();
    const assoId = authUser.assoId
    const assoName = authUser.assoName;

    const {formOpened, formMode, currentUpdateDTO} = useSelector(state=>state.membre);



    const {data: association} = useQuery('getAssociation', ()=>axiosServices({url: `/associations/find-by-id/${assoId}`}), {refetchOnWindowFocus: false})
    const {data: sections} = useQuery(['getSections', assoId], ()=>axiosServices({url: `/sections/find-by-asso/${assoId}`}), {refetchOnWindowFocus: false})
    const {data: civilites} = useQuery(['getCivilites', assoId], ()=>axiosServices({url: `/types/TYPE_CIVILITE/all-options`}), {refetchOnWindowFocus: false})
    const [selectedCivilite, setSelectedCivilite] = useState();
    const [selectedSection, setSelectedSection] = useState();


    const theme = useTheme();

    const handleClickOpen = () => {
        dispatch(membreActions.createFormOpened())
    };
    const handleClose = () => {
        dispatch(membreActions.createFormClosed());
    };
    const queryClient = useQueryClient();


    const {mutate: createMembre, isError: isCreateError, isSuccess: isCreateSuccess, error: createError, isLoading: isCreateLoading}
        = useMutation('createMembre',
        (values)=> axiosServices({url: '/adhesions/create', method: 'post', data: values}),
        {onSuccess: ()=> {
                formik.setValues(initialCreateMembreDTO);
                queryClient.invalidateQueries("searchMembres");
            }});

    const {mutate: updateMembre, isError: isUpdateError, isSuccess: isUpdateSuccess, error: updateError, isUpdateLoading}
        = useMutation('updateMembre',
        (values)=> axiosServices({url: '/adhesions/update', method: 'put', data: values}),
        {onSuccess: ()=> {
                queryClient.invalidateQueries("searchMembres");
            }});

    const handleSubmit = async (values) =>
    {
        if(formMode == FormMode.NEW) createMembre(values);
        if(formMode == FormMode.UPDATE) updateMembre(values);
    }


    const formik = useFormik(
        {
            initialValues: initialCreateMembreDTO,
            onSubmit: handleSubmit,
            validationSchema: createMembreValidationSchema
        }
    );
    useEffect(()=>
    {
        if(formMode == FormMode.UPDATE)
        {
            formik.setValues(currentUpdateDTO);
            setSelectedCivilite({id: currentUpdateDTO.codeCivilite, label: currentUpdateDTO.civilite});
            setSelectedSection({id: currentUpdateDTO.sectionId, label: currentUpdateDTO.sectionName});
        }
        else
        {
            formik.setValues(initialCreateMembreDTO);
            setSelectedCivilite({id:"", label:"Selectionner la civilité"});
            setSelectedSection({id:"", label: "Selectionner la section"});
        }
    }, [formMode])

    const [identifier, setIdentifier] = useState("#");
    const [userAlreadyExists, setUserAlreadyExists] = useState(false);
    const onIdentifierChange = (e)=>
    {
        setIdentifier(e.target.value)
    }

    useEffect(()=>
    {
        axiosServices({url: `/adhesions/get-membre-dto?identifier=${identifier}`}).then(resp=>
        {
            const dto = resp?.data;
            if(dto)
            {
                formik.setValues(dto);
                setSelectedCivilite({id: dto.codeCivilite, label: dto.nomCivilite})
                setUserAlreadyExists(true);
            }
            else
            {
                formik.setValues(initialCreateMembreDTO);
                setSelectedCivilite({id:"", label:"Selectionner la civilité"})
                setUserAlreadyExists(false);
            }
            setSelectedSection({id:"", label: "Selectionner la section"})
        })
    }, [identifier]);
    const handleConfirmation = async ()=>
    {
        formik.setFieldValue("assoId", assoId);
        await formik.submitForm();
        //await formik.setValues(initialCreateMembreDTO);
        formik.setTouched(membreNotTouched);
    }
    useEffect(()=>
    {
        if(isCreateSuccess)
        {
            formik.setValues(initialCreateMembreDTO);
            formik.setTouched(membreNotTouched);
        }
    }, [isCreateSuccess])
    useFeedBackEffects(isCreateSuccess, isCreateError, createError);
    useFeedBackEffects(isUpdateSuccess, isUpdateError, updateError);

    return (
        <div>
            <Button variant="contained" color={'secondary'} onClick={handleClickOpen}>
                <AddIcon />
            </Button>
            <Modal handleClose={handleClose} open={formOpened}
                               width={'md'} actionDisabled={!formik.isValid}
                               handleConfirmation={handleConfirmation}
                               title={formMode == FormMode.NEW ? `Nouveau membre - ${decodeURIComponent(encodeURIComponent(assoName))}` : `Modification d'un membre - ${decodeURIComponent(encodeURIComponent(assoName))}`}>
                <Grid item xs={12} >
                                    <GroupZone tilte={'Identification'}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={3} >
                                                <InputLabel title={"Charger à partir de matricule | e-mail | tel "}>Charger à partir de matricule | e-mail | tel <small style={{color:'red'}} >{formik.errors.maticuleFonctionnaire}</small></InputLabel>
                                                <TextField disabled={formMode==FormMode.UPDATE} fullWidth placeholder="Matricule - Email - Tel" size={"small"}  value={identifier} onChange={(e)=>onIdentifierChange(e)}/>
                                                <FormHelperText></FormHelperText>
                                            </Grid>

                                            <Grid item xs={12} sm={3} >
                                                <InputLabel>Matricule fonctionnaire {formik?.touched?.matriculeFonctionnaire &&<small style={{color:'red'}} >{formik.errors.matriculeFonctionnaire}</small>}</InputLabel>
                                                <TextField InputProps={{readOnly: userAlreadyExists}} fullWidth placeholder="Saisir le matricule fonctionnaire" onBlur={formik.handleBlur} size={"small"} name={'matriculeFonctionnaire'} value={formik.values.matriculeFonctionnaire} onChange={formik.handleChange}/>
                                                <FormHelperText></FormHelperText>
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <InputLabel>Email {formik.touched?.email&&<small style={{color:'red'}} >{formik.errors?.email}</small>}</InputLabel>
                                                <TextField InputProps={{readOnly: userAlreadyExists || formMode == FormMode.UPDATE}} fullWidth onBlur={formik.handleBlur} name={'email'} value={formik.values?.email} placeholder="Saisir le mail" size={"small"} onChange={formik.handleChange}/>
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <InputLabel>Téléphone {formik.touched?.tel&&<small style={{color:'red'}} >{formik.errors?.tel}</small>}</InputLabel>
                                                <TextField InputProps={{readOnly: userAlreadyExists}} fullWidth placeholder="Saisir le numéro de téléphone" onBlur={formik.handleBlur} size={"small"} name={'tel'} value={formik.values?.tel} onChange={formik.handleChange}/>
                                                <FormHelperText></FormHelperText>
                                            </Grid>
                                        </Grid>
                                    </GroupZone>
                                </Grid>

                <Grid item xs={12} >
                                <GroupZone tilte={'Informations générales'}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={4} md={4}>
                                            <InputLabel>Nom {formik.touched?.firstName&&<small style={{color:'red'}} >{formik.errors?.firstName}</small>}</InputLabel>
                                            <TextField InputProps={{readOnly: userAlreadyExists}} fullWidth onBlur={formik.handleBlur} name={'firstName'} value={formik.values?.firstName} placeholder="Saisir le nom du membre" size={"small"} onChange={formik.handleChange}/>

                                        </Grid>
                                        <Grid item xs={12} sm={4} md={4}>
                                            <InputLabel>Prénom {formik.touched?.lastName&&<small style={{color:'red'}} >{formik.errors?.lastName}</small>}</InputLabel>
                                            <TextField InputProps={{readOnly: userAlreadyExists}} fullWidth placeholder="Saisir le prénom du membre" onBlur={formik.handleBlur} size={"small"} name={'lastName'} value={formik.values?.lastName} onChange={formik.handleChange}/>
                                            <FormHelperText></FormHelperText>
                                        </Grid>
                                        <Grid item xs={12} sm={4} md={4}>
                                            <InputLabel>Civilité {formik.touched?.codeCivilite&&<small style={{color:'red'}} >{formik.errors?.codeCivilite}</small>}</InputLabel>

                                            <Autocomplete
                                                          fullWidth
                                                          size={"small"}
                                                          name={'codeCivilite'}
                                                          onChange={(e, ops) => {
                                                              if(userAlreadyExists)
                                                              {
                                                                  setSelectedCivilite(selectedCivilite);
                                                                  formik.setFieldValue("codeCivilite", selectedCivilite.id);
                                                              }
                                                              else {
                                                                  setSelectedCivilite(ops);
                                                                  formik.setFieldValue("codeCivilite", ops.id);
                                                              }
                                                          }}
                                                          isOptionEqualToValue={(option, value) => option.id === value.id}
                                                          getOptionValue={(option) => option.id}
                                                          getOptionLabel = {option=>option.label}
                                                          onBlur={(e) => {
                                                              formik.handleBlur(e);  // Make sure to call the Formik handler
                                                          }}
                                                          options={civilites?.data||[]}
                                                          value={selectedCivilite}
                                                          renderInput={(params) => <TextField {...params}  label='Sélectionner la civilité du membre' />}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4} lg={4}>
                                            <InputLabel>Date de naissance {formik.touched?.dateNaissance&&<small style={{color:'red'}} >{formik.errors?.dateNaissance}</small>}</InputLabel>
                                            <TextField InputProps={{readOnly: userAlreadyExists}} fullWidth type={"date"} size={"small"} name={'dateNaissance'}  value={formik.values?.dateNaissance} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                        </Grid>
                                        <Grid item xs={12} sm={4} lg={4}>
                                            <InputLabel>Lieu de naissance {formik.touched?.lieuNaissance&&<small style={{color:'red'}} >{formik.errors?.lieuNaissance}</small>}</InputLabel>
                                            <TextField InputProps={{readOnly: userAlreadyExists}} fullWidth placeholder="Saisir le lieu de naissance du membre" onBlur={formik.handleBlur} size={"small"} name={'lieuNaissance'} value={formik.values?.lieuNaissance} onChange={formik.handleChange}/>
                                            <FormHelperText></FormHelperText>
                                        </Grid>
                                        <Grid item xs={12} sm={4} md={4}>
                                            <InputLabel>Section {<small style={{color:'red'}} >{formik.errors?.sectionId}</small>}</InputLabel>

                                            <Autocomplete
                                                fullWidth
                                                size={"small"}
                                                name={'sectionId'}
                                                onChange={(e, ops) => {
                                                    setSelectedSection(ops);
                                                    formik.setFieldValue("sectionId", ops.id)
                                                }}
                                                getOptionValue={(option) => option.id}
                                                onBlur={(e) => {
                                                    formik.handleBlur(e);  // Make sure to call the Formik handler
                                                }}
                                                value={selectedSection}
                                                options={sections?.data||[]}

                                                renderInput={(params) => <TextField {...params} label='Sélectionner la section du membre' />}
                                            />
                                        </Grid>
                                    </Grid>
                                </GroupZone>
                            </Grid>
            </Modal>
            <FloatingAlert/>
            <SimpleBackdrop open={isCreateLoading}/>
        </div>
    );
}
