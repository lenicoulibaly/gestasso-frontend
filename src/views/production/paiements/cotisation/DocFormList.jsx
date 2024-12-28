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

//const avatarImage = require.context('assets/images/users', true);

// ==============================|| USER LIST 1 ||============================== //

const DocFormList = () => {
    const { documents} = useSelector((state) => state.paiementCotisation);
    const onModify = (doc, index)=>
    {
        dispatch(paiementCotisationActions.documentModified({document: doc, index: index}))
    }
    const onRemove = (index)=>
    {
        dispatch(paiementCotisationActions.documentRemoved(index))
    }
    return (
        <TableContainer >
            <Table size={"small"}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ pl: 3 }}>#</TableCell>
                        <TableCell>Type de pièce</TableCell>
                        <TableCell>Référence</TableCell>
                        <TableCell>Fichier</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="center" sx={{ pr: 3 }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {documents &&
                    documents?.map((row, index) => (
                            <TableRow hover key={index}>
                                <TableCell sx={{ pl: 3 }}>{index}</TableCell>
                                <TableCell>{row.docTypeName}</TableCell>
                                <TableCell>{row.docNum}</TableCell>
                                <TableCell>{row.file.name}</TableCell>
                                <TableCell>{row.docDescription}</TableCell>


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

export default DocFormList;
