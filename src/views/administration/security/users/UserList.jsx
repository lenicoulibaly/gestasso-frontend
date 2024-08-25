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
import {useMutation, useQuery, useQueryClient} from "react-query";
import {useFeedBackEffects} from "../../../../hooks/useFeedBack";
import {useSearchEffects} from "../../../../hooks/useSearchEffect";
import {userActions} from "../../../../store/slices/administration/security/userSlice";
import {Edit} from "@mui/icons-material";
import AlertDialog from "../../../ui-elements/advance/UIDialog/AlertDialog";
import SimpleBackdrop from "../../../ui-elements/custom/SimpleBackdrop";
import axiosServices from "../../../../utils/axios";
import {fncActions} from "../../../../store/slices/administration/security/fncSlice";

//const avatarImage = require.context('assets/images/users', true);

// ==============================|| USER LIST 1 ||============================== //

const UserList = () => {
    const theme = useTheme();
    const { users, page, size, key, currentUser} = useSelector((state) => state.user);

    const {data, isSuccess, isLoading, isError, error} = useQuery(['searchUsers', page, size, key], ()=>axiosServices({url: `/users/search?page=${page}&size=${size}&key=${key}`}))
    const queryClient = useQueryClient();

    const handleEditClick = async (user)=>
    {
        await axiosServices({url: `/users/get-update-user-and-fncs-dto/${user.userId}`}).then(resp=> {
            dispatch(userActions.updFormOpened({currentUser: user, currentUserAndFncs: resp.data}))
        }).catch(err=> {
            console.log(err);
            throw err;
        })
    }

    const showFunctionsList = async (user)=>
    {
        await axiosServices({url: `/functions/all-fnc-for-user/${user.userId}`}).then(resp=> {
            dispatch(fncActions.fncsListDialogOpened({currentUser: user, fncsList: resp.data}))
        }).catch(err=> {
            console.log(err);
            throw err;
        })
    }

    useEffect(()=>
    {

    })

    const {mutate: blockUser, isLoading: isBlockLoading, isError: isBlockError, error: blockError, isSuccess: isBlockSuccess} =
        useMutation("blockUser", (userId)=>axiosServices({url: `/users/block/${userId}`, method: 'put'}),
            {
                onSettled: () => {
                    // Invalidate the "userData" query after the mutation has settled
                    queryClient.invalidateQueries("searchUsers");
                },
            });

    const {mutate: activateUser, isLoading: isActivateLoading, isError: isActivateError, error: activateError, isSuccess: isActivateSuccess} =
        useMutation("activateUser", (userId)=>axiosServices({url: `/users/unblock/${userId}`, method: 'put'}),
            {
                onSettled: () => {
                    // Invalidate the "userData" query after the mutation has settled
                    queryClient.invalidateQueries("searchUsers");
                },
            });

    const {mutate: sendActivateAccountLink, isLoading: isSendLinkLoading, isError: isSendLinkError, error: sendLinkError, isSuccess: isSendLinkSuccess} =
        useMutation("sendActivateAccountLink", (email)=>axiosServices({url: `/users/send-activation-email/${email}`, method: 'put'}),
            {
                onSettled: () => {
                    // Invalidate the "userData" query after the mutation has settled
                    queryClient.invalidateQueries("searchUsers");
                },
            });

    useFeedBackEffects(false, isError, error);
    useSearchEffects(isLoading, isSuccess, data, isError, error, userActions);
    useFeedBackEffects(isBlockSuccess, isBlockError, blockError);
    useFeedBackEffects(isActivateSuccess, isActivateError, activateError);
    useFeedBackEffects(isSendLinkSuccess, isSendLinkError, sendLinkError);

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ pl: 3 }}>#</TableCell>
                        <TableCell>User Profile</TableCell>
                        <TableCell>Tel</TableCell>
                        <TableCell>Ecole</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center" sx={{ pr: 3 }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users &&
                    users?.content?.map((row, index) => (
                            <TableRow hover key={index}>
                                <TableCell sx={{ pl: 3 }}>{row.userId}</TableCell>
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
                                <TableCell>{row.tel}</TableCell>
                                <TableCell>{row.nomEcole}</TableCell>
                                <TableCell>
                                    {row.statut === 'Active' && (
                                        <Chip
                                            label="Active"
                                            size="small"
                                            sx={{
                                                background:
                                                    theme.palette.mode === 'dark'
                                                        ? theme.palette.dark.main
                                                        : theme.palette.success.light + 60,
                                                color: theme.palette.success.dark
                                            }}
                                        />
                                    )}
                                    {row.statut === 'Rejected' && (
                                        <Chip
                                            label="Rejected"
                                            size="small"
                                            sx={{
                                                background:
                                                    theme.palette.mode === 'dark'
                                                        ? theme.palette.dark.main
                                                        : theme.palette.orange.light + 80,
                                                color: theme.palette.orange.dark
                                            }}
                                        />
                                    )}
                                    {row.statut === 'Pending' && (
                                        <Chip
                                            label="Pending"
                                            size="small"
                                            sx={{
                                                background:
                                                    theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.warning.light,
                                                color: theme.palette.warning.dark
                                            }}
                                        />
                                    )}
                                </TableCell>
                                <TableCell align="center" sx={{ pr: 3 }}>
                                    <Stack direction="row" justifyContent="center" alignItems="center">
                                        <Tooltip placement="top" title="Modifier">
                                            <IconButton color="primary" aria-label="modify" size="large" onClick={()=>handleEditClick(row)}>
                                                <Edit sx={{ fontSize: '1.1rem' }} />
                                            </IconButton>
                                        </Tooltip>

                                        {row.notBlocked && <AlertDialog triggerStyle={{
                                            color: theme.palette.error.dark,
                                            borderColor: theme.palette.error.main,
                                            '&:hover ': {background: theme.palette.error.light}
                                        }} handleConfirmation={() => blockUser(row.userId)} openLabel={"Bloquer"}
                                                      message={"Vous êtes sur le point de bloquer " + row.firstName + ". Confirmez-vous cette action ?"}
                                                      actionDisabled={false}
                                                      TriggerIcon={<BlockTwoToneIcon sx={{fontSize: '1.1rem'}}/>}/>}

                                        {!row.notBlocked && <AlertDialog triggerStyle={{
                                            color: theme.palette.success.dark,
                                            borderColor: theme.palette.success.main,
                                            '&:hover ': {background: theme.palette.success.light}
                                        }} handleConfirmation={() => activateUser(row.userId)} openLabel={"Débloquer"}
                                                      message={"Vous êtes sur le point de de débloquer " + row.firstName + ". Confirmez-vous cette action ?"}
                                                      actionDisabled={false}
                                                      TriggerIcon={<CheckCircleIcon sx={{fontSize: '1.1rem'}}/>}/>}

                                        <AlertDialog triggerStyle={{
                                            color: theme.palette.orange.dark,
                                            borderColor: theme.palette.orange.main,
                                            '&:hover ': {background: theme.palette.orange.light}
                                        }} handleConfirmation={() => sendActivateAccountLink(row.email)} openLabel={"Envoyer un lien"}
                                                     message={"Vous êtes sur le point de d'envoyer un lien d'activation de compte à " + row.firstName + ". Confirmez-vous cette action ?"}
                                                     actionDisabled={false}
                                                     TriggerIcon={<AddLinkIcon sx={{fontSize: '1.1rem'}}/>}/>

                                        <Tooltip placement="top" title="Voir la liste des fonctions">
                                            <IconButton color="primary" aria-label="Liste des fonctions" size="large" onClick={()=>showFunctionsList(row)}>
                                                <ListIcon sx={{ fontSize: '1.1rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <SimpleBackdrop open={isBlockLoading || isActivateLoading || isSendLinkLoading} />
        </TableContainer>

    );
};

export default UserList;
