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
    TableRow, TextareaAutosize,
    TextField, Tooltip
} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AddIcon from '@mui/icons-material/Add';

// assets
import GroupZone from "../../../ui-elements/custom/GroupZone";
import {useFormik} from "formik";
import {useFeedBackEffects} from "../../../../hooks/useFeedBack";
import FloatingAlert from "../../../ui-elements/custom/FloatingAlert";
import InputLabel from "../../../../ui-component/extended/Form/InputLabel";
import SimpleBackdrop from "../../../ui-elements/custom/SimpleBackdrop";
import {useTypeService} from "../../../../hooks/services/useTypeService";
import {
    createPaiementCotisationValidationSchema, documentValidationSchema,
    initialCreatePaiementCotisationDTO, initialDocument,
    paiementCotisationNotTouched
} from "./PaiementCotisationDtos";
import {usePaiementCotisationService} from "../../../../hooks/services/usePaiementCotisationService";
import {dispatch, useSelector} from "../../../../store";
import {useAdhesionService} from "../../../../hooks/services/useAdhesionService";
import Modal from "../../../../utils/Modal";
import {paiementCotisationActions} from "../../../../store/slices/production/paiement-cotisation/paiementCotisationsSlice";
import TableContainer from "@mui/material/TableContainer";
import NumberFormat, {formatNumber, getRawValue, handleMontantChange} from "../../../../utils/NumberFormat";
import DocFormList from "./DocFormList";


export default function PaiementCotisationForm()
{
    const {formOpened, currentCotisation, currentDocument, documents} = useSelector(state=>state.paiementCotisation);


    const {getPaiementCotisationDto, createVersementCotisation, createVersementCotisationWithDocuments} = usePaiementCotisationService();
    const {getModePaiementOptions, getDocRegOptions} = useTypeService();
    const {getAdhesionOptions} = useAdhesionService()

    const [selectedModePaiement, setSelectedModePaiement] = useState({label: 'Choisir le Mode de paiement', id: ''});
    const [selectedAdhesion, setSelectedAdhesion] = useState({label: 'Choisir le membre', id: ''})
    const [selectedDocType, setSelectedDocType] = useState({name: 'Choisir le type', uniqueCode: ''})
    const [printVisible, setPrintVisible] = useState(createVersementCotisationWithDocuments.isSuccess)
    const [newVisible, setNewVisible] = useState(createVersementCotisationWithDocuments.isSuccess)

    const theme = useTheme();

    const handleClose = () =>
    {
        dispatch(paiementCotisationActions.createFormClosed());
    };

    const handleSubmit = async (values) =>
    {
        const dto = { ...values, documents: documents };

        const formData = new FormData();
        const dtoWithoutFiles = { ...dto, documents: dto.documents.map(doc => ({ ...doc, file: undefined })) };
        formData.append("data", JSON.stringify(dtoWithoutFiles));

        // Ajouter chaque fichier individuellement à "files"
        dto.documents.forEach((doc) => {
            if (doc.file) {
                formData.append("files", doc.file);  // Ajouter le fichier sans utiliser de tableau
            }
        });

        createVersementCotisationWithDocuments.mutate(formData);


        //createVersementCotisation.mutate(values);
    }
    const onAdhesionIdChange = (adhesionOption)=>
    {
        setSelectedAdhesion(adhesionOption);
        //formik.setFieldValue('adhesionId', adhesionOption.id)
        dispatch(paiementCotisationActions.selectedAdhesionChanged(adhesionOption.id))
    }

    const onModePaiementChanged = (modePaiementOption)=>
    {
        setSelectedModePaiement(modePaiementOption);
        //formik.setFieldValue('modePaiementCode', modePaiementOption.id)
        dispatch(paiementCotisationActions.modePaiementChanged(modePaiementOption.id))
    }

    const onMontantVersementChange = (event)=>
    {
        const montantVersement = event.target.value;
        const rawMontant = getRawValue(montantVersement);
        handleMontantChange(event);
        dispatch(paiementCotisationActions.montantVersementChanged(rawMontant))

    }

    const handleConfirmation = async ()=>
    {
        mainFormik.submitForm();
        mainFormik.setTouched(paiementCotisationNotTouched);
    }

    const onAddDocument = ()=>
    {
        setSelectedDocType({name: 'Choisir le type', uniqueCode: ''})
        dispatch(paiementCotisationActions.documentAdded(currentDocument))
    }

    const onCurrentDocInput =(value, fieldName)=>
    {
        dispatch(paiementCotisationActions.currentDocInput({...currentDocument, [fieldName]: value}));
    }
    const onTypeDocInput =(docType)=>
    {
        dispatch(paiementCotisationActions.currentDocInput({...currentDocument, ...docType}));
    }

    const mainFormik = useFormik(
        {
            initialValues: initialCreatePaiementCotisationDTO,
            onSubmit: handleSubmit,
            validationSchema: createPaiementCotisationValidationSchema
        }
    );

    const docFormik = useFormik({
        initialValues: initialDocument,
        validationSchema: documentValidationSchema
    })

    useEffect(()=>
    {
        setPrintVisible(createVersementCotisationWithDocuments.isSuccess)
        setNewVisible(createVersementCotisationWithDocuments.isSuccess);
    }, [createVersementCotisationWithDocuments.isSuccess])
     const handleNew = ()=>
     {
         mainFormik.setValues(initialCreatePaiementCotisationDTO)
         docFormik.setValues(initialDocument);
         dispatch(paiementCotisationActions.newPaiementClicked())
         setSelectedModePaiement({label: 'Choisir le Mode de paiement', id: ''});
         setSelectedAdhesion({label: 'Choisir le membre', id: ''});
         setSelectedDocType({name: 'Choisir le type', uniqueCode: ''});
         setPrintVisible(false);
         setNewVisible(false);
     }

    useEffect(()=>
    {
        if(getPaiementCotisationDto.isSuccess) mainFormik.setValues(getPaiementCotisationDto.data?.data)
        if(getPaiementCotisationDto.isError) mainFormik.setFieldValue('montant', getPaiementCotisationDto.data?.data.montant)
    }, [getPaiementCotisationDto.data?.data])

    useEffect(()=>
    {
        docFormik.setValues(currentDocument);
    }, [currentDocument])
    useFeedBackEffects(createVersementCotisationWithDocuments.isSuccess, createVersementCotisationWithDocuments.isError, createVersementCotisationWithDocuments.error);
    useFeedBackEffects(false, getPaiementCotisationDto.isError, getPaiementCotisationDto.error);

    return (
        <div>
            <Modal open={formOpened} handleClose={handleClose} handlePrint={()=>{alert('Printing ...')}} printButtonColor={'primary'}
                   title={`Paiement cotisation - ${currentCotisation?.nomCotisation || ""}`} handleNew={handleNew}
                width={"lg"} handleConfirmation={handleConfirmation} actionDisabled={!mainFormik?.isValid}
                titleBgColor={theme.palette.secondary.main} printVisible={printVisible} newVisible={newVisible}
            >
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <GroupZone tilte={<b>Informations utiles</b>}>
                            <TableContainer>
                                <Table sx={{ '& td, & th': { borderBottom: 'none', padding: '4px 8px' } }}  size="small">
                                    <TableBody>

                                        <TableRow key={1}>
                                            <TableCell variant="head" align={"right"}>Paiement de :</TableCell>
                                            <TableCell align={"left"}>{mainFormik.values?.echeanceCoursPaiement}</TableCell>

                                            <TableCell variant="head" align={"right"}>Retard de paiement :</TableCell>
                                            <TableCell align={"left"}>{mainFormik.values&&<NumberFormat unit={'FCFA'} number={mainFormik.values?.retardPaiement}/>}</TableCell>

                                            <TableCell variant="head" align={"right"}>Montant attendu :</TableCell>
                                            <TableCell align={"left"}>{mainFormik.values&&<NumberFormat unit={'FCFA'} number={mainFormik.values?.montantVersementSouhaite}/>}</TableCell>
                                        </TableRow>

                                        <TableRow key={2}>
                                            <TableCell variant="head" align={"right"}>Nombre échéances : </TableCell>
                                            <TableCell align={"left"}>{mainFormik.values?.nbrEcheancesSoldeesParCeVersement}</TableCell>

                                            <TableCell variant="head" align={"right"}>Prochaine échéance :</TableCell>
                                            <TableCell align={"left"}>{mainFormik.values?.prochaineEcheance}</TableCell>

                                            <TableCell variant="head" align={"right"}>Montant prochaine échéance :</TableCell>
                                            <TableCell align={"left"}>{mainFormik.values&&<NumberFormat unit={'FCFA'} number={mainFormik.values?.montantProchaineEcheance}/>}</TableCell>
                                        </TableRow>

                                    </TableBody>
                                </Table>
                            </TableContainer>

                        </GroupZone>
                    </Grid>
                </Grid>
                <Grid container spacing={1} marginTop={1}>
                    <Grid item xs={12}>
                        <GroupZone tilte={'Paiement'}>
                            <Grid container xs={12} spacing={1}>
                                <Grid item xs={12} sm={6}>
                                    <InputLabel>Choisir l'adhérant {<small style={{color:'red'}} >{mainFormik.errors?.frequenceCotisationCode}</small>}</InputLabel>

                                    <Autocomplete
                                        fullWidth
                                        size={"small"}
                                        name={'adhesionId'}
                                        onChange={(e, opt) =>
                                        {
                                            onAdhesionIdChange(opt);
                                        }}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        getOptionValue={(option) => option.id}
                                        getOptionLabel = {option=>option.label}
                                        onBlur={(e) => {
                                            mainFormik.handleBlur(e);  // Make sure to call the Formik handler
                                        }}
                                        options={getAdhesionOptions.data?.data||[]}
                                        value={selectedAdhesion}
                                        renderInput={(params) => <TextField {...params}  label='Sélectionner la civilité du membre' />}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <InputLabel>Date de paiement {mainFormik.touched?.datePaiement&&<small style={{color:'red'}} >{mainFormik.errors?.datePaiement}</small>}</InputLabel>
                                    <TextField fullWidth type={"date"} size={"small"} name={'datePaiement'}  value={mainFormik.values?.datePaiement} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur}/>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InputLabel>Mode de paiement {<small style={{color:'red'}} >{mainFormik.errors?.modePaiementCode}</small>}</InputLabel>

                                    <Autocomplete
                                        fullWidth
                                        size={"small"}
                                        name={'modePaiementCode'}
                                        onChange={(e, ops) =>
                                        {
                                            onModePaiementChanged(ops);
                                        }}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        getOptionValue={(option) => option.id}
                                        getOptionLabel = {option=>option.label}
                                        onBlur={(e) => {
                                            mainFormik.handleBlur(e);  // Make sure to call the Formik handler
                                        }}
                                        options={getModePaiementOptions.data?.data||[]}
                                        value={selectedModePaiement}
                                        renderInput={(params) => <TextField {...params}  label='Sélectionner le mode de paiement' />}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} >
                                    <InputLabel>Montant {mainFormik?.touched?.montant &&<small style={{color:'red'}} >{mainFormik.errors?.montant}</small>}</InputLabel>
                                    <TextField fullWidth placeholder="Saisir le montant" onBlur={mainFormik.handleBlur} size={"small"} name={'montant'} value={mainFormik.values?.montant ? formatNumber(mainFormik.values?.montant) : ''} onChange={e=>onMontantVersementChange(e)}/>
                                    <FormHelperText></FormHelperText>
                                </Grid>
                            </Grid>
                        </GroupZone>
                    </Grid>
                </Grid>
                <Grid container spacing={1} marginTop={1}>
                    <Grid item xs={12}>
                        <GroupZone tilte={'Pièces jointes'}>
                            <Grid container xs={12} spacing={1}>
                                <Grid item xs={12} md={2} >
                                    <TextField fullWidth placeholder="Référence" label={"Référence"} onBlur={docFormik.handleBlur} size={"small"} name={'docNum'} value={currentDocument?.docNum} onChange={(e)=>onCurrentDocInput(e.target.value, 'docNum')}/>
                                </Grid>
                                <Grid item xs={12} md={3} >
                                    {console.log('docFormik.errors', docFormik.errors)}
                                    <Autocomplete
                                        fullWidth
                                        size={"small"}
                                        name={'docUniqueCode'}
                                        onChange={(e, opt) =>
                                        {
                                            setSelectedDocType(opt);
                                            onTypeDocInput({docUniqueCode: opt.uniqueCode, docTypeName: opt.name})

                                        }}
                                        isOptionEqualToValue={(option, value) => option.uniqueCode === value.uniqueCode}
                                        getOptionValue={(option) => option.uniqueCode}
                                        getOptionLabel = {option=>option.name}
                                        onBlur={(e) => {
                                            docFormik.handleBlur(e);  // Make sure to call the Formik handler
                                        }}
                                        options={getDocRegOptions.data?.data||[]}
                                        value={selectedDocType}
                                        renderInput={(params) => <TextField {...params}  label='Type de document' />}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2} >

                                    <TextField fullWidth type={"file"}  placeholder="Fichier" onBlur={docFormik.handleBlur} size={"small"} value={docFormik?.file} name={'file'} onChange={(event) => {
                                        docFormik.setFieldValue("file", event.currentTarget.files[0]); // Enregistre le fichier
                                        onCurrentDocInput(event.currentTarget.files[0], 'file');
                                    }}/>

                                </Grid>
                                <Grid item xs={12} md={4} >

                                    <TextField
                                        fullWidth
                                        maxRows={2}
                                        label="Description"
                                        multiline
                                        name={'docDescription'} value={currentDocument?.docDescription} onChange={e=>{onCurrentDocInput(e.target.value, 'docDescription')}}
                                    />
                                </Grid>
                                <Grid item xs={12} md={1} >
                                    <Button color={"secondary"} variant={"contained"} onClick={onAddDocument} disabled={!docFormik.isValid} >Ajouter</Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <DocFormList />
                                </Grid>
                            </Grid>

                        </GroupZone>
                    </Grid>
                </Grid>
            </Modal>

            <FloatingAlert/>
            <SimpleBackdrop open={createVersementCotisationWithDocuments.isLoading}/>
        </div>
    );
}
