import {Grid, Table, TableBody, TableCell, TableRow, TextField} from "@mui/material";
import GroupZone from "../../../ui-elements/custom/GroupZone";
import TableContainer from "@mui/material/TableContainer";
import React, {useState} from "react";
import {dispatch, useSelector} from "../../../../store";
import {prelevementCotisationActions} from "../../../../store/slices/production/prelevement-cotisation/prelevementCotisationSlice";
import {usePrelevementCotisationService} from "../../../../hooks/services/usePrelevementCotisationService";
import {formatNumber} from "../../../../utils/NumberFormat";

export const PrelevementDataForm = ({})=>
{
    const {currentCotisation, prelevementDto} = useSelector(state=>state.prelevementCotisation)
    //const [nbrAdherant, setNbrAdherant] = useState(0);
    const {getEditDto} = usePrelevementCotisationService();

    const onNbrAdherantChange = (nbr)=>
    {
        if(!nbr) nbr = 0;
        //setNbrAdherant(nbr);
        const {docs, ...prelevementDtoWithoutDocs} = prelevementDto
        getEditDto.mutateAsync({...prelevementDtoWithoutDocs, cotisationId: currentCotisation.cotisationId, nbrAdherant: nbr}).then((resp)=>
        {
            dispatch(prelevementCotisationActions.prelevementDtoChanged(resp.data))
        }).catch(err=>console.log('err', err));

    }
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

                        <Grid item xs={12} sm={4}>

                            <TextField label={"Nombre d'adhérants prélevés"} fullWidth type={"number"} size={"small"} value={prelevementDto.nbrAdherant} onChange={e=>onNbrAdherantChange(e.target.value)}/>
                        </Grid>
                        <Grid item xs={12} sm={4} >

                            <TextField label={"Montant"} InputProps={{readOnly: true}} fullWidth placeholder="Saisir le montant" size={"small"} name={'montant'} value={prelevementDto?.montant ? formatNumber(prelevementDto?.montant) : ''} />
                        </Grid>
                        <Grid item xs={12} sm={4} >

                            <TextField title={prelevementDto?.montantLettre + ' FCFA'} label={"Montant en lettre"} InputProps={{readOnly: true}} fullWidth placeholder="Saisir le montant" size={"small"} name={'montantLettre'} value={prelevementDto?.montantLettre + ' FCFA'} />
                        </Grid>
                    </Grid>
                </GroupZone>
            </Grid>
        </Grid>
    </>
}