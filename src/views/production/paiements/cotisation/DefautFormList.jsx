import React, {useEffect} from 'react';

// material-ui
import {
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material';

// project imports


import {dispatch, useSelector} from 'store';

// assets
import {Edit} from "@mui/icons-material";
import {paiementCotisationActions} from "../../../../store/slices/production/paiement-cotisation/paiementCotisationsSlice";
import {prelevementCotisationActions} from "../../../../store/slices/production/prelevement-cotisation/prelevementCotisationSlice";

//const avatarImage = require.context('assets/images/users', true);

// ==============================|| USER LIST 1 ||============================== //

const DefautFormList = () => {
    const {prelevementDto} = useSelector(state=>state.prelevementCotisation);
    const defautPrelevements = prelevementDto.defautPrelevements;
    {console.log('prelevementDto', prelevementDto)}
    const onModify = (defautPrelevement, index)=>
    {
        dispatch(prelevementCotisationActions.defautPrelevementModified({defautPrelevement: defautPrelevement, index: index}))
    }
    const onRemove = (index)=>
    {
        dispatch(prelevementCotisationActions.defautPrelevementRemoved(index))
    }
    return (
        <TableContainer >
            <Table size={"small"}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ pl: 3 }}>#</TableCell>
                        <TableCell>Membre</TableCell>
                        <TableCell>Motif</TableCell>
                        <TableCell align="center" sx={{ pr: 3 }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {prelevementDto?.defautPrelevements &&
                    prelevementDto.defautPrelevements?.map((row, index) => (
                            <TableRow hover key={index}>
                                <TableCell sx={{ pl: 3 }}>{index+1}</TableCell>
                                <TableCell>{row.membre}</TableCell>
                                <TableCell>{row.motifDefaut}</TableCell>


                                <TableCell align="center" sx={{ pr: 3 }}>
                                    <Stack direction="row" justifyContent="center" alignItems="center">
                                        <Tooltip placement="top" title="Modifier">
                                            <IconButton color="primary" aria-label="modify" size="large" onClick={()=>onModify(row, index)}>
                                                <Edit sx={{ fontSize: '1.1rem' }} />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip placement="top" title="Supprimer">
                                            <IconButton color="error" aria-label="modify" size="large" onClick={()=>onRemove(row, index)}>
                                                <Edit sx={{ fontSize: '1.1rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>

    );
};

export default DefautFormList;
