import {Autocomplete, Button, Grid, TextField} from "@mui/material";
import GroupZone from "../../../ui-elements/custom/GroupZone";
import DocFormList from "./DocFormList";
import React, {useEffect, useState} from "react";
import {useTypeService} from "../../../../hooks/services/useTypeService";
import {dispatch, useSelector} from "../../../../store";
import {prelevementCotisationActions} from "../../../../store/slices/production/prelevement-cotisation/prelevementCotisationSlice";

export const PrelevementDocForm = ()=>
{
    const {prelevementDto, currentDocument} = useSelector(state=>state.prelevementCotisation)
    const {getDocRegOptions} = useTypeService();
    const [selectedDocType, setSelectedDocType] = useState({uniqueCode: '', name: 'Selectionner le type de document'});
    const onModifyDoc = (doc, index)=>
    {
        dispatch(prelevementCotisationActions.documentModified({document: doc, index: index}))
    }
    const onRemoveDoc = (index)=>
    {
        dispatch(prelevementCotisationActions.documentRemoved(index))
    }

    const onCurrentDocInput = (value, fieldName)=>
    {
        const doc = {...currentDocument, [fieldName]: value}
        dispatch(prelevementCotisationActions.currentDocInput(doc))
    }

    const  onTypeDocInput = (opt)=>
    {
        const doc = {...currentDocument, docUniqueCode: opt.uniqueCode, docTypeName: opt.name}
        dispatch(prelevementCotisationActions.currentDocInput(doc));
    }

    useEffect(()=>
    {
        setSelectedDocType({uniqueCode: currentDocument.docUniqueCode, name: currentDocument.docTypeName})
    }, [currentDocument])


    return<>
        <Grid container spacing={1} marginTop={1}>
            <Grid item xs={12}>
                <GroupZone tilte={'Pièces jointes'}>
                    <Grid container xs={12} spacing={1}>
                        <Grid item xs={12} md={2} >
                            <TextField fullWidth placeholder="Référence" label={"Référence"} size={"small"} name={'docNum'} value={currentDocument.docNum} onChange={e=>{
                                onCurrentDocInput(e.target.value, 'docNum')}} />
                        </Grid>
                        <Grid item xs={12} md={3} >
                            <Autocomplete
                                fullWidth
                                size={"small"}
                                name={'docUniqueCode'}
                                onChange={(e, opt) =>
                                {
                                    setSelectedDocType(opt);
                                    onTypeDocInput(opt);
                                }}
                                isOptionEqualToValue={(option, value) => option.uniqueCode === value.uniqueCode}
                                getOptionValue={(option) => option.uniqueCode}
                                getOptionLabel = {option=>option.name}
                                options={getDocRegOptions.data?.data||[]}
                                value={selectedDocType}
                                renderInput={(params) => <TextField {...params}  label='Type de document' />}/>
                        </Grid>
                        <Grid item xs={12} md={2} >

                            <TextField fullWidth type={"file"}  placeholder="Fichier"  size={"small"} name={'file'} onChange={(event) => {

                                onCurrentDocInput(event.currentTarget.files[0], 'file');
                            }}/>

                        </Grid>
                        <Grid item xs={12} md={4} >

                            <TextField
                                fullWidth
                                maxRows={2}
                                label="Description"
                                multiline
                                name={'docDescription'} value={currentDocument.docDescription} onChange={e=>{
                                onCurrentDocInput(e.target.value, 'docDescription')
                            }}
                            />
                        </Grid>
                        <Grid item xs={12} md={1} >
                            <Button color={"secondary"} variant={"contained"} onClick={()=>{dispatch(prelevementCotisationActions.documentAdded(currentDocument))}} disabled={false} >Ajouter</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <DocFormList documents={prelevementDto?.docs} onRemove={onRemoveDoc} onModify={onModifyDoc}/>
                        </Grid>
                    </Grid>

                </GroupZone>
            </Grid>
        </Grid>
    </>
}