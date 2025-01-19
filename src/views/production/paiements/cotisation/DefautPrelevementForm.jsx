import {Autocomplete, Button, Grid, Table, TableBody, TableCell, TableRow, TextField} from "@mui/material";
import GroupZone from "../../../ui-elements/custom/GroupZone";
import TableContainer from "@mui/material/TableContainer";
import DocFormList from "./DocFormList";
import React, {useEffect, useState} from "react";
import {useAdhesionService} from "../../../../hooks/services/useAdhesionService";
import {dispatch, useSelector} from "../../../../store";
import {prelevementCotisationActions} from "../../../../store/slices/production/prelevement-cotisation/prelevementCotisationSlice";
import DefautFormList from "./DefautFormList";

export const DefautPrelevementForm = ()=>
{
    const [selectedAdhesion, setSelectedAdhesion] = useState({id: 0, label: 'selectionner le membre'});
    const {currentCotisation, prelevementDto, currentDefautPrelevement} = useSelector(state=>state.prelevementCotisation)
    const {getAdhesionOptions} = useAdhesionService();

    useEffect(()=>
    {
        console.log('currentDefautPrelevement', currentDefautPrelevement)
        setSelectedAdhesion({id: currentDefautPrelevement.adhesionId, label: currentDefautPrelevement.membre})
    },[currentDefautPrelevement])
    return <>
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <GroupZone tilte={<b>Informations utiles</b>}>
                    <TableContainer>
                        <Table sx={{ '& td, & th': { borderBottom: 'none', padding: '4px 8px' } }}  size="small">
                            <TableBody>

                                <TableRow key={0}>
                                    <TableCell variant="head" align={"right"}>Cotisation :</TableCell>
                                    <TableCell align={"left"}>{currentCotisation?.nomCotisation}</TableCell>

                                    <TableCell variant="head" align={"right"}>Motif :</TableCell>
                                    <TableCell align={"left"}>{currentCotisation?.motif}</TableCell>

                                    <TableCell variant="head" align={"right"}>Echéance : </TableCell>
                                    <TableCell align={"left"}>{prelevementDto?.nomEcheance}</TableCell>

                                </TableRow>

                                <TableRow key={2}>

                                </TableRow>

                            </TableBody>
                        </Table>
                    </TableContainer>

                </GroupZone>
            </Grid>
        </Grid>
        <Grid container spacing={1} marginTop={1}>
            <Grid item xs={12}>
                <GroupZone tilte={'Prélèvement'}>
                    <Grid container xs={12} spacing={1}>

                        <Grid item xs={12} sm={6}>
                            <Autocomplete title={selectedAdhesion?.label}
                                fullWidth
                                size={"small"}
                                name={'adhesionId'}
                                onChange={(e, opt) =>
                                {
                                    setSelectedAdhesion(opt);
                                    dispatch(prelevementCotisationActions.currentDefautPrelementChanged({...currentDefautPrelevement, adhesionId: opt?.id, membre: opt.label}))
                                }}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                getOptionValue={(option) => option.id}
                                getOptionLabel = {option=>option.label}
                                onBlur={(e) => {
                                    //mainFormik.handleBlur(e);  // Make sure to call the Formik handler
                                }}
                                options={getAdhesionOptions.data?.data||[]}
                                value={selectedAdhesion}
                                renderInput={(params) => <TextField {...params}  label='Sélectionner le membre' />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={5} >
                            <TextField fullWidth label="Motif du défaut de prélèvement" size={"small"} name={'motif'} value={currentDefautPrelevement?.motifDefaut}
                                       onChange={(e) => {
                                           dispatch(prelevementCotisationActions.currentDefautPrelementChanged({...currentDefautPrelevement, motifDefaut: e.target.value}))
                                       }}
                                multiline/>
                        </Grid>
                        <Grid item xs={12} md={1} >
                            <Button color={"secondary"} variant={"contained"} onClick={()=>{

                                dispatch(prelevementCotisationActions.defautPrelevementAdded(currentDefautPrelevement))
                            }}

                                    disabled={false} >Ajouter</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <DefautFormList />
                        </Grid>
                    </Grid>
                </GroupZone>
            </Grid>
        </Grid>
    </>
}