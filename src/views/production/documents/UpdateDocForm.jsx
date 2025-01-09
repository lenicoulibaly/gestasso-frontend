import Modal from "../../../utils/Modal";
import {dispatch, useSelector} from "../../../store";
import {useTheme} from "@mui/material/styles";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useDocumentService} from "../../../hooks/services/useDocumentService";
import {documentActions} from "../../../store/slices/production/document/documentSlice";
import InputLabel from "../../../ui-component/extended/Form/InputLabel";
import {Grid, TextField} from "@mui/material";
import React, {useEffect} from "react";
import FloatingAlert from "../../ui-elements/custom/FloatingAlert";
import SimpleBackdrop from "../../ui-elements/custom/SimpleBackdrop";
import {useFeedBackEffects} from "../../../hooks/useFeedBack";

export const UpdateDocForm = ({title, allFields=false, maxSizeMo=5, authorizedFiles=["application/pdf", 'image/png', 'image/jpg', 'image/jpeg']})=>
{
    const {formOpened, currentDocToUpdate} = useSelector(state=>state.document)
    const {updateDocument} = useDocumentService();
    const onClose = ()=> dispatch(documentActions.updateFormClosed())

    const onDocInput = (value, fieldName)=>
    {
        const doc = {...currentDocToUpdate, [fieldName]: value}
        formik.setValues(doc);
        dispatch(documentActions.currentDocumentModified(doc))
    }

    const onDocFileChange = (e)=>
    {
        const doc = {...currentDocToUpdate, file: e.target.files[0]}
        formik.setFieldValue('file', e.target.files[0]);
        dispatch(documentActions.currentDocumentModified(doc))
    }
    const onSubmit = ()=>
    {
        const {file, docPath, docTypeName, ...rest} = currentDocToUpdate
        const dto = {...rest};
        const formData = new FormData();
        formData.append('data', JSON.stringify(dto));
        formData.append('file', file);

        console.log('dto', dto)
        console.log('file', file)
        console.log('formData', formData)
        updateDocument.mutate(formData);
    }
    const formik = useFormik({
        initialValues: {docId: null, file: null, docUniqueCode: '', docNum: '', docName: '', docDescription: ''},
        onSubmit: onSubmit,
        validationSchema: Yup.object(
            {
                //docId: Yup.number().required('Champ obligatoire'),
                file: Yup.mixed()

                    .test("fileSize", `Fichier volumineux (max ${maxSizeMo} Mo)`, (value) => {

                        return value ? value.size <= (maxSizeMo*1000000) : false; // Vérifie si value existe
                    })
                    .test("fileType", "Seuls les fichiers "+ authorizedFiles+" sont autorisés", (value) => {

                        return value && authorizedFiles.includes(value.type);
                    })
            })
    })
    useEffect(()=>
    {
        formik.setFieldValue(currentDocToUpdate);
    }, [currentDocToUpdate])
    useFeedBackEffects(updateDocument.isSuccess, updateDocument.isError, updateDocument.error);

    const theme = useTheme();
    return(
        <div>
            <Modal handleConfirmation={onSubmit} open={formOpened} handleClose={onClose} title={title} actionDisabled={!formik.isValid}
                     width={'sm'} titleBgColor={theme.palette.secondary.main} actionLabel={'Modifier'} >
        <Grid container spacing={1}>

            <Grid item xs={12}>

                <InputLabel>Référence</InputLabel>
                <TextField fullWidth placeholder="Saisir la référence du document" onBlur={formik.handleBlur} size={"small"} name={'docNum'} value={currentDocToUpdate?.docNum} onChange={(e)=>onDocInput(e.target.value, 'docNum')}/>
            </Grid>

            <Grid item xs={12}>
                <InputLabel>Nom du document</InputLabel>
                <TextField fullWidth placeholder="Saisir le nom du document" onBlur={formik.handleBlur} size={"small"} name={'docName'} value={currentDocToUpdate?.docName} onChange={(e)=>onDocInput(e.target.value, 'docName')}/>
            </Grid>

            <Grid item xs={12}>
                <InputLabel>Description</InputLabel>
                <TextField fullWidth placeholder="Saisir la description du document" onBlur={formik.handleBlur} size={"small"} name={'docDescription'} value={currentDocToUpdate?.docDescription} onChange={(e)=>onDocInput(e.target.value, 'docDescription')}/>
            </Grid>

            <Grid item xs={12}>
                <InputLabel>Choisir le fichier {<small style={{color:'red'}} >{formik.errors?.file}</small>}</InputLabel>
                <TextField type={"file"} fullWidth onBlur={formik.handleBlur} size={"small"} name={'file'} onChange={(e)=>onDocFileChange(e)}/>
            </Grid>
        </Grid>


    </Modal>

            <FloatingAlert/>
            <SimpleBackdrop open={updateDocument.isLoading}/>
        </div> )
}