import React, {useEffect} from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Chip,
    Grid,
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
//import { getUsersListStyle1 } from 'store/slices/user';

// assets
import BlockTwoToneIcon from '@mui/icons-material/BlockTwoTone';
import AddLinkIcon from '@mui/icons-material/AddLink';
import ListIcon from '@mui/icons-material/List';
import PaymentsIcon from '@mui/icons-material/Payments';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {useMutation, useQuery, useQueryClient} from "react-query";
import {useFeedBackEffects} from "../../../hooks/useFeedBack";
import {useSearchEffects} from "../../../hooks/useSearchEffect";
import {Edit} from "@mui/icons-material";
import AlertDialog from "../../ui-elements/advance/UIDialog/AlertDialog";
import SimpleBackdrop from "../../ui-elements/custom/SimpleBackdrop";
import axiosServices from "../../../utils/axios";
import {membreActions} from "../../../store/slices/production/membres/membresSlice";
import useAuth from "../../../hooks/useAuth";
import NewUserForm from "../../administration/security/users/NewUserForm";
import CotisationForm from "./CotisationForm";
import {BlockUserButton} from "../../administration/security/users/ BlockUserButton";
import {useUserService} from "../../../hooks/services/useUserService";
import {UnblockUserButton} from "../../administration/security/users/UnblockUserButton";
import {SendLinkButton} from "../../administration/security/users/SendLinkButton";
import {useNavigate} from "react-router";
import {useCotisationService} from "../../../hooks/services/useCotisationService";
import {cotisationActions} from "../../../store/slices/production/cotisations/cotisationsSlice";
import {userActions} from "../../../store/slices/administration/security/userSlice";
import NumberFormat from "../../../utils/NumberFormat";
import {paiementCotisationActions} from "../../../store/slices/production/paiement-cotisation/paiementCotisationsSlice";
import {prelevementCotisationActions} from "../../../store/slices/production/prelevement-cotisation/prelevementCotisationSlice";

//const avatarImage = require.context('assets/images/users', true);

// ==============================|| USER LIST 1 ||============================== //

const CotisationList = () => {
    const theme = useTheme();
    const { search} = useCotisationService();
    const {getAuthUser} = useAuth();
    const authUser = getAuthUser();
    const  assoId = authUser.assoId;
    const sectionId = authUser.sectionId;


    const handleEditClick = async (cotisation)=>
    {
        dispatch(cotisationActions.updateFormOpened(cotisation))
    }

    useFeedBackEffects(false, search.isError, search.error);
    useSearchEffects(search.isLoading, search.isSuccess, search.data, search.isError, search.error, cotisationActions);
    //useSearchEffects(searchuser.isLoading, searchuser.isSuccess, searchuser.data, searchuser.isError, searchuser.error, userActions);

    const navigate = useNavigate();
    function goToDetailsPage(cotisation)
    {
        dispatch(cotisationActions.detailsButtonClicked(cotisation));
        navigate(`/production/cotisations/details/${cotisation?.cotisationId}`);
    }
    const OnEnregistrerPaiementButtonClicked = (cotisation)=>
    {
        dispatch(paiementCotisationActions.createFormOpened(cotisation))
    }

    const OnEnregistrerPrelevementButtonClicked = (cotisation)=>
    {
        dispatch(prelevementCotisationActions.createFormOpened(cotisation))
    }

    useEffect(()=>
    {

    })
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ pl: 3 }}>#</TableCell>
                        <TableCell>Intitulé</TableCell>
                        <TableCell>Motif</TableCell>
                        <TableCell>Montant (FCFA)</TableCell>
                        <TableCell>Périodicité</TableCell>
                        <TableCell>Délai en jours</TableCell>
                        <TableCell>Mode prélèvement</TableCell>
                        <TableCell>Début</TableCell>
                        <TableCell>Fin</TableCell>
                        <TableCell align="center" sx={{ pr: 3 }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {search.data &&
                    search.data.data?.content?.map((row, index) => (
                            <TableRow hover key={index}>
                                <TableCell sx={{ pl: 3 }}>{index+1}</TableCell>
                                <TableCell>{row.nomCotisation}</TableCell>
                                <TableCell>{row.motif}</TableCell>
                                <TableCell><NumberFormat number={row.montantCotisation}/></TableCell>
                                <TableCell>{row.frequenceCotisation}</TableCell>
                                <TableCell>{row.delaiDeRigueurEnJours}</TableCell>
                                <TableCell>{row.modePrelevement}</TableCell>
                                <TableCell>{row.dateDebutCotisation}</TableCell>
                                <TableCell>{row.dateFinCotisation}</TableCell>

                                <TableCell align="center" sx={{ pr: 3 }}>
                                    <Stack direction="row" justifyContent="center" alignItems="center">
                                        <Tooltip placement="top" title="Modifier">
                                            <IconButton color="primary" aria-label="modify" size="large" onClick={()=>handleEditClick(row)}>
                                                <Edit sx={{ fontSize: '1.1rem' }} />
                                            </IconButton>
                                        </Tooltip>

                                        {row.modePrelevementCode == 'SPONT' && <Tooltip placement="top" title="Enregistrer un paiement">

                                            <IconButton sx={{
                                                color: theme.palette.success.dark,
                                                borderColor: theme.palette.success.main,
                                                '&:hover ': {background: theme.palette.success.light}}} aria-label="Enregistrer un paiement" size="large" onClick={()=>OnEnregistrerPaiementButtonClicked(row)}>
                                                <PaymentsIcon sx={{ fontSize: '1.1rem' }} />
                                            </IconButton>
                                        </Tooltip>}

                                        {row.modePrelevementCode == 'SOURCE' && <Tooltip placement="top" title="Enregistrer un prelevement">
                                            <IconButton sx={{
                                                color: theme.palette.success.dark,
                                                borderColor: theme.palette.success.main,
                                                '&:hover ': {background: theme.palette.success.light}}} aria-label="Enregistrer un paiement" size="large" onClick={()=>OnEnregistrerPrelevementButtonClicked(row)}>
                                                <PaymentsIcon sx={{ fontSize: '1.1rem' }} />
                                            </IconButton>
                                        </Tooltip>}

                                        <Tooltip placement="top" title="Consulter les détails">
                                            <IconButton sx={{
                                                color: theme.palette.success.dark,
                                                borderColor: theme.palette.success.main,
                                                '&:hover ': {background: theme.palette.success.light}}} aria-label="Consulter les détails" size="large" onClick={()=>goToDetailsPage(row)}>
                                                <VisibilityIcon sx={{ fontSize: '1.1rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <SimpleBackdrop open={search.isLoading} />
        </TableContainer>

    );
};

export default CotisationList;
