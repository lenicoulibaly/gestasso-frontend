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
import Avatar from 'ui-component/extended/Avatar';

import {dispatch, useSelector} from 'store';
//import { getUsersListStyle1 } from 'store/slices/user';

// assets
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockTwoToneIcon from '@mui/icons-material/BlockTwoTone';
import AddLinkIcon from '@mui/icons-material/AddLink';
import ListIcon from '@mui/icons-material/List';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {useMutation, useQuery, useQueryClient} from "react-query";
import {useFeedBackEffects} from "../../../hooks/useFeedBack";
import {useSearchEffects} from "../../../hooks/useSearchEffect";
import {Edit} from "@mui/icons-material";
import AlertDialog from "../../ui-elements/advance/UIDialog/AlertDialog";
import SimpleBackdrop from "../../ui-elements/custom/SimpleBackdrop";
import axiosServices from "../../../utils/axios";
import {membreActions} from "../../../store/slices/production/membres/cotisationsSlice";
import useAuth from "../../../hooks/useAuth";
import NewUserForm from "../../administration/security/users/NewUserForm";
import NewMembreForm from "./NewMembreForm";
import {BlockUserButton} from "../../administration/security/users/ BlockUserButton";
import {useUserService} from "../../../hooks/services/useUserService";
import {UnblockUserButton} from "../../administration/security/users/UnblockUserButton";
import {SendLinkButton} from "../../administration/security/users/SendLinkButton";
import {useNavigate} from "react-router";

//const avatarImage = require.context('assets/images/users', true);

// ==============================|| USER LIST 1 ||============================== //

const MembreList = () => {
    const theme = useTheme();
    const { membres, page, size, key, currentMembre} = useSelector((state) => state.membre);
    const {getAuthUser} = useAuth();
    const authUser = getAuthUser();
    const  assoId = authUser.assoId;
    const sectionId = authUser.sectionId;
    const {data, isSuccess, isLoading, isError, error} = useQuery(['searchMembres', page, size, key],
        ()=>axiosServices({url: `/adhesions/search-members?page=${page}&size=${size} ${assoId ? `&assoId=${assoId}`: ''} ${sectionId ? `&sectionId=${sectionId}`: ''}`,
        }), {keepPreviousData: true, refetchOnWindowFocus: false})
    const queryClient = useQueryClient();

    const handleEditClick = async (membre)=>
    {
        dispatch(membreActions.updateFormOpened(membre))
    }

    useEffect(()=>
    {

    })

    const {blockUser, activateUser, sendActivateAccountLink} = useUserService();

    const {mutate: unsubscribe, isLoading: isUnsubscribeLoading, isError: isUnsubscribeError, error: unsubscribeError, isSuccess: isUnsubscribeSuccess} =
        useMutation("unsubscribe", (adhesionId)=>axiosServices({url: `/adhesions/desabonner/${adhesionId}`, method: 'put'}),
            {
                onSettled: () => {
                    queryClient.invalidateQueries("searchMembres");
                },
            });

    const {mutate: changeSection, isLoading: isChangeSectionLoading, isError: isChangeSectionError, error: changeSectionError, isSuccess: isChangeSectionSuccess} =
        useMutation("changeSection", (adhesionId, newSectionId)=>axiosServices({url: `/adhesion/changeSection/${adhesionId}//${newSectionId}`, method: 'put'}),
            {
                onSettled: () => {
                    // Invalidate the "userData" query after the mutation has settled
                    queryClient.invalidateQueries("searchMembres");
                },
            });

    useFeedBackEffects(false, isError, error);
    useSearchEffects(isLoading, isSuccess, data, isError, error, membreActions);
    useFeedBackEffects(isUnsubscribeSuccess, isUnsubscribeError, unsubscribeError);
    useFeedBackEffects(isChangeSectionSuccess, isChangeSectionError, changeSectionError);
    useFeedBackEffects(blockUser.isSuccess, blockUser.isError, blockUser.error);
    useFeedBackEffects(blockUser.isSuccess, blockUser.isError, blockUser.error);
    useFeedBackEffects(activateUser.isSuccess, activateUser.isError, activateUser.error);
    useFeedBackEffects(sendActivateAccountLink.isSuccess, sendActivateAccountLink.isError, sendActivateAccountLink.error);
    const navigate = useNavigate();
    function goToProfilePage(user)
    {
        dispatch(membreActions.profileButtonClicked(user));
        navigate(`/administration/access/profile/${user.userId}`);
    }

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ pl: 3 }}>#</TableCell>
                        <TableCell>Nom et prénom</TableCell>
                        <TableCell>Matricule</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Tel</TableCell>
                        <TableCell>Association</TableCell>
                        <TableCell>Section</TableCell>
                        <TableCell>Photo</TableCell>
                        <TableCell align="center" sx={{ pr: 3 }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {membres &&
                    membres?.content?.map((row, index) => (
                            <TableRow hover key={index}>
                                <TableCell sx={{ pl: 3 }}>{row.adhesionId}</TableCell>
                                <TableCell>{row.firstName} {row.lastName}</TableCell>
                                <TableCell>{row.matriculeFonctionnaire}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.tel}</TableCell>
                                <TableCell>{row.assoName}</TableCell>
                                <TableCell>{row.sectionName}</TableCell>
                                <TableCell>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Avatar alt="User 1" src={'#'} />
                                        </Grid>
                                        <Grid item xs zeroMinWidth>
                                            <Typography align="left" variant="subtitle1" component="div">
                                                {row.firstName}{' '}{row.lastName}
                                                {row.statut === 'ACTIVE' && (
                                                    <CheckCircleIcon sx={{ color: 'success.dark', width: 14, height: 14 }} />
                                                )}
                                            </Typography>
                                            <Typography align="left" variant="subtitle2" noWrap>
                                                {row.email}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </TableCell>

                                <TableCell align="center" sx={{ pr: 3 }}>
                                    <Stack direction="row" justifyContent="center" alignItems="center">
                                        <Tooltip placement="top" title="Modifier">
                                            <IconButton color="primary" aria-label="modify" size="large" onClick={()=>handleEditClick(row)}>
                                                <Edit sx={{ fontSize: '1.1rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                        {row.notBlocked && <BlockUserButton user={row} blockUserFunction={blockUser.mutate}/>}

                                        {!row.notBlocked && <UnblockUserButton user={row} unblockUserFunction={activateUser.mutate}/>}

                                        <SendLinkButton user={row} sendLinkFunction={sendActivateAccountLink.mutate}/>

                                        <Tooltip placement="top" title="Consulter le profil">
                                            <IconButton sx={{
                                                color: theme.palette.success.dark,
                                                borderColor: theme.palette.success.main,
                                                '&:hover ': {background: theme.palette.success.light}}} aria-label="Consulter le profil" size="large" onClick={()=>goToProfilePage(row)}>
                                                <VisibilityIcon sx={{ fontSize: '1.1rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <SimpleBackdrop open={isUnsubscribeLoading || isChangeSectionLoading } />
        </TableContainer>

    );
};

export default MembreList;
