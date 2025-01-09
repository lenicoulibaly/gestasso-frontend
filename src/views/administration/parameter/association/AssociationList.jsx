import React, {useEffect, useState} from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Grid,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip
} from '@mui/material';

// project imports

import {dispatch, useDispatch, useSelector} from 'store';

// assets
import {useQuery} from "react-query";
import axiosServices from "../../../../utils/axios";
import FloatingAlert from "../../../ui-elements/custom/FloatingAlert";
import {Edit, Print} from "@mui/icons-material";
import {assoActions} from "../../../../store/slices/administration/params/assoSlice";
import ListIcon from "@mui/icons-material/List";
import PeopleIcon from '@mui/icons-material/People';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import {useSearchEffects} from "../../../../hooks/useSearchEffect";
import NumberFormat from "../../../../utils/NumberFormat";
import {documentActions} from "../../../../store/slices/production/document/documentSlice";
import Avatar from "../../../../ui-component/extended/Avatar";
import {useAssociationService} from "../../../../hooks/services/useAssociationService";
import Modal from "../../../../utils/Modal";
import {IFrameModal} from "../../../../utils/IFrameModal";

//const avatarImage = require.context('assets/images/users', true);

// ==============================|| USER LIST 1 ||============================== //

const AssociationList = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const {generateFicheAdhesion} = useAssociationService();
    const [ficheAdhesionState, setFicheAdhesionState] = useState({opened: false, currentAsso: null, base64String: null})
    const onCloseFicheAdhesion = ()=>
    {
        setFicheAdhesionState({...ficheAdhesionState, opened: false})
    }

    const {page, size, key} = useSelector((state) => state.asso);

    React.useEffect(() => {
    }, []);

    const onPrint = (row) => {
        generateFicheAdhesion.mutateAsync(row.assoId)
            .then((resp) =>
            {
                setFicheAdhesionState({
                    ...ficheAdhesionState,
                    base64String: resp.data,
                    opened: true,
                    currentAsso: row,
                });
            })
            .catch((err) => console.error('Erreur lors du chargement du PDF :', err));
    };


    const {data: associationsData, isSuccess, isLoading, isError, error} = useQuery(['searchAssociations', page, size, key], ()=>axiosServices({url: `/associations/search?page=${page}&size=${size}&key=${key}`}), {refetchOnWindowFocus: false, keepPreviousData: true})
    const associations = associationsData?.data;

    useSearchEffects(isLoading, isSuccess, associationsData, isError, error, assoActions)

    const showSectionList = ()=>
    {

    }
    const showCotisationList = ()=>
    {

    }
    return (
        <TableContainer>

            <IFrameModal  title={"Fiche d'adhesion"} opened={ficheAdhesionState.opened} handleClose={onCloseFicheAdhesion} base64String={ficheAdhesionState.base64String}/>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ pl: 3 }}>#</TableCell>
                        <TableCell>Nom</TableCell>
                        <TableCell>Sigle</TableCell>
                        <TableCell>Situation géographique</TableCell>
                        <TableCell>Droit d'adhésion (FCFA)</TableCell>
                        <TableCell align="center" sx={{ pr: 3 }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {associations &&
                    associations?.content?.map((row, index) => (
                            <TableRow hover key={index}>
                                <TableCell sx={{ pl: 3 }}>{index+1}</TableCell>
                                <TableCell>
                                        {row.assoName}
                                </TableCell>
                                <TableCell>


                                    <Grid item>
                                        <Avatar alt="User 1" src={`data:image/jpeg;base64,${row.logo?.file}`} />
                                    </Grid>
                                    <Grid  item xs zeroMinWidth>
                                        {row.sigle}
                                    </Grid>

                                </TableCell>
                                <TableCell>{row.situationGeo}</TableCell>
                                <TableCell><NumberFormat number={row.droitAdhesion} /></TableCell>
                                <TableCell align="center" sx={{ pr: 3 }}>
                                    <Stack direction="row" justifyContent="center" alignItems="center">
                                        <Tooltip placement="top" title="Modifier">
                                            <IconButton color="warning" aria-label="delete" size="large" onClick={()=>dispatch(assoActions.updateAssoFormOpened(row))}>
                                                <Edit sx={{ fontSize: '1.1rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip placement="top" title="Voir la liste des membres">
                                            <IconButton color="secondary" aria-label="Liste des sections" size="large" onClick={()=>showSectionList(row)}>
                                                <PeopleIcon sx={{ fontSize: '1.1rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip placement="top" title="Voir la liste des sections">
                                            <IconButton color="primary" aria-label="Liste des sections" size="large" onClick={()=>showSectionList(row)}>
                                                <ListIcon sx={{ fontSize: '1.1rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip placement="top" title="Voir la liste des cotisations">
                                            <IconButton color="success" aria-label="Liste des cotisations" size="large" onClick={()=>showCotisationList(row)}>
                                                <MonetizationOnIcon sx={{ fontSize: '1.1rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip placement="top" title="Modifier le logo">
                                            <IconButton color="warning" aria-label="Modifier le logo" size="large" onClick={()=>dispatch(documentActions.updateFormOpened(row.logo))}>
                                                <Edit sx={{ fontSize: '1.1rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip placement="top" title="Modifier le logo">
                                            <IconButton color="primary" aria-label="Imprimer la fiche d'adhésion" size="large" onClick={()=>onPrint(row)}>
                                                <Print sx={{ fontSize: '1.1rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <FloatingAlert />
        </TableContainer>
    );
};

export default AssociationList;
