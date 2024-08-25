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
import GroupZone from "../../../ui-elements/custom/GroupZone";
import {gridSpacing} from "../../../../store/constant";
import {useFormik} from "formik";
import {useFeedBackEffects} from "../../../../hooks/useFeedBack";
import {useMutation, useQuery, useQueryClient} from "react-query";
import AlertDialog from "../../../ui-elements/advance/UIDialog/AlertDialog";
import FloatingAlert from "../../../ui-elements/custom/FloatingAlert";
import InputLabel from "../../../../ui-component/extended/Form/InputLabel";
import {Delete, Edit} from "@mui/icons-material";
import {feedBackActions} from "../../../../store/slices/feedBackSlice";
import SimpleBackdrop from "../../../ui-elements/custom/SimpleBackdrop";
import axiosServices from "../../../../utils/axios";

import {
    createAssoFormNotTouched,
    createAssoValidationSchema,
    initialCreateAssoDTO,
    initialCreateSectionDTO
} from "./AssoDtos";
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

export default function NewAssoFormDlg() {
    const {createAssoFormOpened, currentCreateAssoDTO} = useSelector(state=>state.asso);
    const createSectionDTOS = currentCreateAssoDTO?.createSectionDTOS;

    const [selectedStr, setSelectedStr] = useState(null);
    const [selectedModePrelevement, setSelectedModePrelevement] = useState(null);
    const [selectedFrequence, setSelectedFrequence] = useState(null);
    const theme = useTheme();

    const [frequenceOptionsData, setFrequenceOptionsData] = useState([])
    const [modePrelevementOptionsData, setModePrelevementOptionsData] = useState([])
    const [strOptionsData, setStrOptionsData] = useState([])

    useEffect(()=>
    {
        axiosServices({url: '/types/frequences/all-options'}).then(resp=>setFrequenceOptionsData(resp.data))
        axiosServices({url: '/types/modes-prelevement/all-options'}).then(resp=>setModePrelevementOptionsData(resp.data))
        axiosServices({url: '/structures/all-options'}).then(resp=>setStrOptionsData(resp.data))
    }, [])

    const handleClickOpen = () => {
        dispatch(assoActions.createAssoFormOpened());
    };

    const queryClient = useQueryClient();

    const {mutate: createAssociation, isError: isCreateError, isSuccess: isCreateSuccess, error: createError, isLoading}
        = useMutation('createAssociation',
        (values)=> axiosServices({url: '/associations/create', method: 'post', data: values}),
        {onSuccess: ()=>queryClient.invalidateQueries("searchAssociations")}
        );

    const handleSubmit = async (values) =>
    {
        const dto = {...values, createSectionDTOS: createSectionDTOS};
        await createAssociation(dto);
        await clearForm()
    }

    const formik = useFormik(
        {
            initialValues: initialCreateAssoDTO,
            onSubmit: handleSubmit,
            validationSchema: createAssoValidationSchema
        }
    )
    const clearForm = async ()=>
    {
        await formik.setValues(initialCreateAssoDTO)
        await formik.setTouched(createAssoFormNotTouched)
        assoActions.createSectionDTOSCleaned()
        setSelectedFrequence({label:''})
        setSelectedModePrelevement({label:''})
        setSelectedStr({label:''})
    }

    const handleClose = () => {
        clearForm();
        dispatch(assoActions.createAssoFormClosed());
    };

    const canSubmit = formik?.errors.assoName == undefined && formik?.errors.createCotisationDTO == undefined && createSectionDTOS != null && createSectionDTOS != undefined && createSectionDTOS?.length != 0;
    const handleConfirmation = async ()=>
    {
        if(!canSubmit)
        {
            dispatch(feedBackActions.operationFailed("Le formulaire n'est pas valide"))
            return;
        }
        await formik.setErrors({});
        await formik.setFieldValue('createInitialSectionDTO', createSectionDTOS[0])
        await formik.submitForm();
    }
    useEffect(()=>
    {
        if(isCreateSuccess)
        {
            formik.setValues(initialCreateAssoDTO)
            formik.setTouched(createAssoFormNotTouched)
            dispatch(assoActions.createSectionDTOSCleaned())
        }
    }, [isCreateSuccess])
    useFeedBackEffects(isCreateSuccess, isCreateError, createError);

    const handleEditSection = (index, row)=>
    {
        formik.setFieldValue('createInitialSectionDTO', row);
        dispatch(assoActions.createSectionDTOEdited(index))
    };
    const handleAddSection = ()=>
    {
        const dto = formik.values.createInitialSectionDTO;
        dispatch(assoActions.newCreateSectionDTOAdded(dto))
        formik.setFieldValue('createInitialSectionDTO', initialCreateSectionDTO)
        formik.setTouched('createInitialSectionDTO', false)
    }

    return (
        <div>
            <Button variant="contained" color={'secondary'} onClick={handleClickOpen}>
                <AddIcon />
            </Button>
            <BootstrapDialog aria-labelledby="customized-dialog-title" open={createAssoFormOpened} maxWidth="lg" fullWidth >
                <form onSubmit={formik.handleSubmit}>
                    <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose} >
                        <small>Nouvel association</small>
                    </BootstrapDialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} >
                                <Grid container spacing={gridSpacing}>
                                    <Grid item sm={12} md={6}>
                                        <GroupZone tilte={"Informations sur l'association"}>
                                            <Grid container spacing={2}>

                                                <Grid item xs={12} sm={6} >
                                                    <InputLabel>Dénomination <small style={{color:theme.palette.error.main}}>*</small> {formik.touched.assoName&&<small style={{color:theme.palette.error.main}} >{formik.errors.assoName}</small>}</InputLabel>
                                                    <TextField fullWidth placeholder="Saisir le nom de l'association" onBlur={formik.handleBlur} size={"small"} name={'assoName'} value={formik.values.assoName} onChange={formik.handleChange}/>
                                                    <FormHelperText></FormHelperText>
                                                </Grid>
                                                <Grid item xs={12} sm={6} >
                                                    <InputLabel>Sigle {formik.touched.sigle&&<small style={{color:theme.palette.error.main}} >{formik.errors.sigle}</small>}</InputLabel>
                                                    <TextField fullWidth placeholder="Saisir le sigle de l'association" onBlur={formik.handleBlur} size={"small"} name={'sigle'} value={formik.values.sigle} onChange={formik.handleChange}/>
                                                    <FormHelperText></FormHelperText>
                                                </Grid>
                                                <Grid item xs={12} sm={12} lg={6}>
                                                    <InputLabel>Situation géographique {formik.touched.situationGeo&&<small style={{color:theme.palette.error.main}} >{formik.errors.situationGeo}</small>}</InputLabel>
                                                    <TextField fullWidth onBlur={formik.handleBlur} name={'situationGeo'} value={formik.values.situationGeo} placeholder="Saisir la situation géographique" size={"small"} onChange={formik.handleChange}/>
                                                </Grid>
                                                <Grid item xs={12} sm={12} lg={6}>
                                                    <InputLabel>Montant du droit d'adhésion {formik.touched.droitAdhesion&&<small style={{color:theme.palette.error.main}} >{formik.errors.droitAdhesion}</small>}</InputLabel>
                                                    <TextField fullWidth placeholder="Saisir le montant du droit d'adhésion" onBlur={formik.handleBlur} size={"small"} name={'droitAdhesion'} value={formik.values.droitAdhesion} onChange={formik.handleChange}/>
                                                    <FormHelperText></FormHelperText>
                                                </Grid>
                                            </Grid>
                                        </GroupZone>
                                    </Grid>
                                    <Grid item sm={12} md={6}>
                                        <GroupZone tilte={'Ajout de sections'}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={12} lg={4}>
                                                    <InputLabel>Section <small style={{color:theme.palette.error.main}}>*</small> {formik.touched.createInitialSectionDTO?.sectionName&&<small style={{color:theme.palette.error.main}} >{formik.errors.createInitialSectionDTO?.sectionName}</small>}</InputLabel>
                                                    <TextField fullWidth onBlur={formik.handleBlur} name={'createInitialSectionDTO.sectionName'} value={formik.values.createInitialSectionDTO?.sectionName} placeholder="Saisir le nom de la section" size={"small"} onChange={formik.handleChange}/>

                                                </Grid>
                                                <Grid item xs={12} sm={6} lg={4}>
                                                    <InputLabel>Sigle {formik.touched.createInitialSectionDTO?.sigle&&<small style={{color:theme.palette.error.main}} >{formik.errors.createInitialSectionDTO?.sigle}</small>}</InputLabel>
                                                    <TextField fullWidth size={"small"} name={'createInitialSectionDTO.sigle'}  value={formik.values.createInitialSectionDTO?.sigle} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                                </Grid>
                                                <Grid item xs={12} sm={6} lg={4}>
                                                    <InputLabel>Situation géographique {formik.touched.createInitialSectionDTO?.situationGeo&&<small style={{color:theme.palette.error.main}} >{formik.errors.createInitialSectionDTO?.situationGeo}</small>}</InputLabel>
                                                    <TextField fullWidth size={"small"} name={'createInitialSectionDTO.situationGeo'} value={formik.values.createInitialSectionDTO?.situationGeo} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                                </Grid>

                                                <Grid item xs={12} sm={12}>
                                                    <Box display="flex" flexDirection="column">
                                                        <InputLabel>Structure {formik.touched.createInitialSectionDTO?.strId&&<small style={{color:theme.palette.error.main}} >{formik.errors.createInitialSectionDTO?.strId}</small>}</InputLabel>

                                                        <Autocomplete
                                                            fullWidth
                                                            size={"small"}
                                                            name={'createInitialSectionDTO.strId'}
                                                            onChange={(e, o) => {
                                                                setSelectedStr(strOptionsData.find(op => op.id === o.id));
                                                                formik.setFieldValue("createInitialSectionDTO.strId", o.id);
                                                            }}
                                                            getOptionValue={(option) => option.id}
                                                            onBlur={(e) => {
                                                                formik.handleBlur(e);  // Make sure to call the Formik handler
                                                            }}
                                                            value={selectedStr}
                                                            options={strOptionsData}
                                                            getOptionLabel={(option) => option?.label}
                                                            renderInput={(params) => <TextField {...params} label='Sélectionner la structure de rattachement' />}
                                                        />

                                                        <Button sx={{marginTop: 1, marginLeft: 'auto'}} variant={"outlined"} onClick={handleAddSection} disabled={formik.errors.createInitialSectionDTO}>Ajouter</Button>
                                                    </Box>
                                                </Grid>

                                            </Grid>
                                        </GroupZone>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{display: 'none'}}>
                                <GroupZone tilte={"Informations sur les cotisations"}>
                                    <Grid container spacing={2}>

                                        <Grid item xs={12} >
                                            <InputLabel>Dénomination <small style={{color:theme.palette.error.main}}>*</small>  {formik.touched.createCotisationDTO?.nomCotisation&&<small style={{color:theme.palette.error.main}} >{formik.errors.createCotisationDTO?.nomCotisation}</small>}</InputLabel>
                                            <TextField fullWidth placeholder="Saisir le nom de la cotisation" onBlur={formik.handleBlur} size={"small"} name={'createCotisationDTO.nomCotisation'} value={formik.values.createCotisationDTO?.nomCotisation} onChange={formik.handleChange}/>
                                            <FormHelperText></FormHelperText>
                                        </Grid>
                                        <Grid item xs={12} >
                                            <InputLabel>Montant <small style={{color:theme.palette.error.main}}>*</small>  {formik.touched.createCotisationDTO?.montantCotisation&&<small style={{color:theme.palette.error.main}} >{formik?.errors.createCotisationDTO?.montantCotisation}</small>}</InputLabel>
                                            <TextField fullWidth placeholder="Saisir le montant de la cotisation" onBlur={formik.handleBlur} size={"small"} name={'createCotisationDTO.montantCotisation'} value={formik.values.createCotisationDTO?.montantCotisation} onChange={formik.handleChange}/>
                                            <FormHelperText></FormHelperText>
                                        </Grid>
                                        <Grid item xs={12} sm={12} >
                                            <InputLabel>Mode de prélèvement <small style={{color:theme.palette.error.main}}>*</small>  {<small style={{color:theme.palette.error.main}} >{formik?.errors.createCotisationDTO?.modePrelevement}</small>}</InputLabel>
                                            <Autocomplete
                                                fullWidth
                                                size={"small"}
                                                name={'createCotisationDTO.modePrelevement'}
                                                onChange={(e, o) => {
                                                    setSelectedModePrelevement(modePrelevementOptionsData.find(op => op.id === o.id));
                                                    formik.setFieldValue("createCotisationDTO.modePrelevement", o.id);

                                                }}
                                                getOptionValue={(option) => option.id}
                                                onBlur={(e) => {
                                                    formik.handleBlur(e);  // Make sure to call the Formik handler
                                                }}
                                                value={selectedModePrelevement}
                                                options={modePrelevementOptionsData}
                                                getOptionLabel={(option) => option?.label}
                                                renderInput={(params) => <TextField {...params} label='Sélectionner le mode de prélèvement' />}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} >

                                            <InputLabel>Fréquence <small style={{color:theme.palette.error.main}}>*</small> {<small style={{color:theme.palette.error.main}} >{formik?.errors.createCotisationDTO?.frequenceCotisation}</small>}</InputLabel>
                                            <Autocomplete
                                                fullWidth
                                                size={"small"}
                                                name={'createCotisationDTO.frequenceCotisation'}
                                                onChange={(e, o) => {
                                                    setSelectedFrequence(frequenceOptionsData.find(op => op.id === o.id));
                                                    formik.setFieldValue("createCotisationDTO.frequenceCotisation", o.id);
                                                }}
                                                getOptionValue={(option) => option.id}
                                                onBlur={(e) => {
                                                    formik.handleBlur(e);  // Make sure to call the Formik handler
                                                }}
                                                value={selectedFrequence}
                                                options={frequenceOptionsData}
                                                getOptionLabel={(option) => option?.label}
                                                renderInput={(params) => <TextField {...params} label='Sélectionner la fréquence des paiements' />}
                                            />
                                            <FormHelperText></FormHelperText>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <InputLabel>Date de début <small style={{color:theme.palette.error.main}}>*</small>  </InputLabel>
                                            <TextField type={"date"} fullWidth placeholder="Saisir la date de début des cotisations" onBlur={formik.handleBlur} size={"small"} name={'createCotisationDTO.dateDebutCotisation'} value={formik.values.createCotisationDTO?.dateDebutCotisation} onChange={formik.handleChange}/>
                                            <FormHelperText>{formik.touched.createCotisationDTO?.dateDebutCotisation &&<small style={{color:theme.palette.error.main}} >{formik.errors.createCotisationDTO?.dateDebutCotisation}</small>}</FormHelperText>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <InputLabel>Date de fin {formik.touched.createCotisationDTO?.dateFinCotisation &&<small style={{color:theme.palette.error.main}} >{formik.errors.createCotisationDTO?.dateFinCotisation}</small>}</InputLabel>
                                            <TextField type={"date"} fullWidth placeholder="Saisir la date de fin des cotisations" onBlur={formik.handleBlur} size={"small"} name={'createCotisationDTO.dateFinCotisation'} value={formik.values.createCotisationDTO?.dateFinCotisation} onChange={formik.handleChange}/>
                                            <FormHelperText></FormHelperText>
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <InputLabel>Délai {formik.touched.createCotisationDTO?.delaiDeRigueurEnJours&&<small style={{color:theme.palette.error.main}} >{formik.errors.createCotisationDTO?.delaiDeRigueurEnJours}</small>}</InputLabel>
                                            <TextField fullWidth placeholder="Saisir le nombre de jours de retard acceptés" onBlur={formik.handleBlur} size={"small"} name={'createCotisationDTO.delaiDeRigueurEnJours'} value={formik.values.createCotisationDTO?.delaiDeRigueurEnJours} onChange={formik.handleChange}/>
                                            <FormHelperText></FormHelperText>
                                        </Grid>
                                    </Grid>
                                </GroupZone>
                            </Grid>



                            <Grid item xs={12} >
                                <GroupZone tilte={'Liste des sections'}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ pl: 3 }}>#</TableCell>
                                                <TableCell>Nom de la section</TableCell>
                                                <TableCell>Sigle</TableCell>
                                                <TableCell>Situation géographique du siège</TableCell>
                                                <TableCell align="center" sx={{ pr: 3 }}>
                                                    Actions
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {createSectionDTOS &&
                                            createSectionDTOS?.map((row, index) => (
                                                <TableRow hover key={index}>
                                                    <TableCell sx={{ pl: 3 }}>{index+1}</TableCell>
                                                    <TableCell>
                                                        {row.sectionName}
                                                    </TableCell>
                                                    <TableCell>{row.sigle}</TableCell>
                                                    <TableCell>{row.situationGeo}</TableCell>

                                                    <TableCell align="center" sx={{ pr: 3 }}>
                                                        <Stack direction="row" justifyContent="center" alignItems="center">
                                                            <Tooltip placement="top" title="Modifier">
                                                                <IconButton color="primary" aria-label="modifier" size="large" onClick={()=> handleEditSection(index, row)}>
                                                                    <Edit sx={{ fontSize: '1.1rem' }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip placement="top" title="Supprimer">
                                                                <IconButton onClick={()=>dispatch(assoActions.createSectionDTORemoved(index))}
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
                        <AlertDialog actionDisabled={!canSubmit}
                                     openLabel={'Enregistrer'} handleConfirmation={handleConfirmation}/>
                    </DialogActions>
                </form>
            </BootstrapDialog>
            <FloatingAlert/>
            <SimpleBackdrop open={isLoading}/>
        </div>
    );
}
