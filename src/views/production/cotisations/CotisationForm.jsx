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
    createCotisationValidationSchema,
    initialCreateCotisationDTO, cotisationNotTouched,
} from "./CotisationDtos";
import {useMutation, useQuery, useQueryClient} from "react-query";
import AlertDialog from "../../ui-elements/advance/UIDialog/AlertDialog";
import FloatingAlert from "../../ui-elements/custom/FloatingAlert";
import InputLabel from "../../../ui-component/extended/Form/InputLabel";
import {Delete, Edit} from "@mui/icons-material";
import {feedBackActions} from "../../../store/slices/feedBackSlice";
import SimpleBackdrop from "../../ui-elements/custom/SimpleBackdrop";
import axiosServices from "../../../utils/axios";
import {membreActions} from "../../../store/slices/production/membres/membresSlice";
import useAuth from "../../../hooks/useAuth";
import {FormMode} from "../../../enums/FormMode";
import {cotisationActions} from "../../../store/slices/production/cotisations/cotisationsSlice";
import {useCotisationService} from "../../../hooks/services/useCotisationService";
import {useTypeService} from "../../../hooks/services/useTypeService";
import {formatNumber, handleMontantChange} from "../../../utils/NumberFormat";
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

export default function CotisationForm()
{
    const authUser = useAuth().getAuthUser();
    const assoId = authUser.assoId
    const assoName = authUser.assoName;
    const {create, update} = useCotisationService();
    const {getFrequenceOptions, getModePrelevementOptions} = useTypeService();

    const {formOpened, formMode, currentUpdateDTO} = useSelector(state=>state.cotisation);

    const [selectedFrequence, setSelectedFreqence] = useState();
    const [selectedModePrelevement, setSelectedModePrelevement] = useState();


    const theme = useTheme();

    const handleClickOpen = () => {
        dispatch(cotisationActions.createFormOpened())
    };
    const handleClose = () => {
        dispatch(cotisationActions.createFormClosed());
    };

    const handleSubmit = async (values) =>
    {
        console.log('values just before submit', values)
        if(formMode == FormMode.NEW) create.mutate(values);
        if(formMode == FormMode.UPDATE) update.mutate(values);
    }


    const formik = useFormik(
        {
            initialValues: initialCreateCotisationDTO,
            onSubmit: handleSubmit,
            validationSchema: createCotisationValidationSchema
        }
    );
    useEffect(()=>
    {
        if(formMode == FormMode.UPDATE)
        {
            formik.setValues(currentUpdateDTO);
            setSelectedFreqence({id: currentUpdateDTO.frequenceCotisationCode, label: currentUpdateDTO.frequenceCotisation});
            setSelectedModePrelevement({id: currentUpdateDTO.modePrelevementCode, label: currentUpdateDTO.modePrelevement});
        }
        else
        {
            formik.setValues(initialCreateCotisationDTO);
            setSelectedFreqence({id:"", label:"Selectionner la civilité"});
            setSelectedModePrelevement({id:"", label: "Selectionner la section"});
        }
    }, [formMode])

    const handleConfirmation = async ()=>
    {
        formik.setFieldValue("assoId", assoId);
        await formik.submitForm();
        //await formik.setValues(initialCreateMembreDTO);
        formik.setTouched(cotisationNotTouched);
    }
    useEffect(()=>
    {
        if(create.isSuccess)
        {
            formik.setValues(initialCreateCotisationDTO);
            formik.setTouched(cotisationNotTouched);
        }
    }, [create.isSuccess])
    useFeedBackEffects(create.isSuccess, create.isError, create.error);
    useFeedBackEffects(update.isSuccess, update.isError, update.error);

    return (
        <div>
            <Button variant="contained" color={'secondary'} onClick={handleClickOpen}>
                <AddIcon />
            </Button>
                            <Modal handleClose={handleClose} open={formOpened} title={<small>{formMode == FormMode.NEW ? `Nouvelle levée de fonds - ${decodeURIComponent(escape(assoName))}` : `Modification d'une levée de fond - ${decodeURIComponent(escape(assoName))}`}</small>}
                                   handleConfirmation={handleConfirmation} width={"sm"} actionDisabled={!formik?.isValid} actionLabel={'Enregistrer'} >
                                <Grid container spacing={2}>

                                    <Grid item xs={12} sm={6} >
                                        <InputLabel>Désignation {formik?.touched?.nomCotisation &&<small style={{color:'red'}} >{formik.errors.nomCotisation}</small>}</InputLabel>
                                        <TextField fullWidth placeholder="Saisir la désignation" onBlur={formik.handleBlur} size={"small"} name={'nomCotisation'} value={formik.values.nomCotisation} onChange={formik.handleChange}/>
                                        <FormHelperText></FormHelperText>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel>Motif {formik.touched?.motif&&<small style={{color:'red'}} >{formik.errors?.motif}</small>}</InputLabel>
                                        <TextField fullWidth placeholder="Saisir le motif" onBlur={formik.handleBlur} size={"small"} name={'motif'} value={formik.values?.motif} onChange={formik.handleChange}/>
                                        <FormHelperText></FormHelperText>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel>Montant {formik.touched?.montantCotisation&&<small style={{color:'red'}} >{formik.errors?.montantCotisation}</small>}</InputLabel>
                                        <TextField fullWidth name={'montantCotisation'} onChange={(e) =>handleMontantChange(e, formik, 'montantCotisation')} value={formik.values?.montantCotisation ? formatNumber(formik.values?.montantCotisation) : ''} placeholder="Saisir le montant" size={"small"}/>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel>Délai en jours {formik.touched?.delaiDeRigueurEnJours&&<small style={{color:'red'}} >{formik.errors?.delaiDeRigueurEnJours}</small>}</InputLabel>
                                        <TextField type={"number"} fullWidth onBlur={formik.handleBlur} name={'delaiDeRigueurEnJours'} value={formik.values?.delaiDeRigueurEnJours} placeholder="Saisir le délais" size={"small"} onChange={formik.handleChange}/>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <InputLabel>Périodicité {<small style={{color:'red'}} >{formik.errors?.frequenceCotisationCode}</small>}</InputLabel>

                                        <Autocomplete
                                            fullWidth
                                            size={"small"}
                                            name={'frequenceCotisationCode'}
                                            onChange={(e, ops) =>
                                            {
                                                setSelectedFreqence(ops);
                                                formik.setFieldValue("frequenceCotisationCode", ops.id);
                                            }}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            getOptionValue={(option) => option.id}
                                            getOptionLabel = {option=>option.label}
                                            onBlur={(e) => {
                                                formik.handleBlur(e);  // Make sure to call the Formik handler
                                            }}
                                            options={getFrequenceOptions.data?.data||[]}
                                            value={selectedFrequence}
                                            renderInput={(params) => <TextField {...params}  label='Sélectionner la civilité du membre' />}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel>Mode de prélèvement {<small style={{color:'red'}} >{formik.errors?.modePrelevementCode}</small>}</InputLabel>

                                        <Autocomplete
                                            fullWidth
                                            size={"small"}
                                            name={'modePrelevementCode'}
                                            onChange={(e, ops) =>
                                            {
                                                setSelectedModePrelevement(ops);
                                                formik.setFieldValue("modePrelevementCode", ops.id);
                                            }}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            getOptionValue={(option) => option.id}
                                            getOptionLabel = {option=>option.label}
                                            onBlur={(e) => {
                                                formik.handleBlur(e);  // Make sure to call the Formik handler
                                            }}
                                            options={getModePrelevementOptions.data?.data||[]}
                                            value={selectedModePrelevement}
                                            renderInput={(params) => <TextField {...params}  label='Sélectionner la civilité du membre' />}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel>Début {formik.touched?.dateDebutCotisation&&<small style={{color:'red'}} >{formik.errors?.dateDebutCotisation}</small>}</InputLabel>
                                        <TextField fullWidth type={"date"} size={"small"} name={'dateDebutCotisation'}  value={formik.values?.dateDebutCotisation} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel>Fin {formik.touched?.dateFinCotisation&&<small style={{color:'red'}} >{formik.errors?.dateFinCotisation}</small>}</InputLabel>
                                        <TextField fullWidth type={"date"} size={"small"} name={'dateFinCotisation'}  value={formik.values?.dateFinCotisation} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                    </Grid>

                                </Grid>
                            </Modal>
            <FloatingAlert/>
            <SimpleBackdrop open={create.isLoading || update.isLoading}/>
        </div>
    );
}
