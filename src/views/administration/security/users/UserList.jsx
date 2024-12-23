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
import {BlockUserButton} from "./ BlockUserButton";
import {UnblockUserButton} from "./UnblockUserButton";
import {useUserService} from "../../../../hooks/services/useUserService";
import {SendLinkButton} from "./SendLinkButton";

//const avatarImage = require.context('assets/images/users', true);

// ==============================|| USER LIST 1 ||============================== //

const UserList = () => {
    const theme = useTheme();
    const { users} = useSelector((state) => state.user);
    const {searchuser, blockUser, activateUser, sendActivateAccountLink} = useUserService();

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

    useFeedBackEffects(false, searchuser.isError, searchuser.error);
    useSearchEffects(searchuser.isLoading, searchuser.isSuccess, searchuser.data, searchuser.isError, searchuser.error, userActions);
    useFeedBackEffects(blockUser.isSuccess, blockUser.isError, blockUser.error);
    useFeedBackEffects(activateUser.isSuccess, activateUser.isError, activateUser.error);
    useFeedBackEffects(sendActivateAccountLink.isSuccess, sendActivateAccountLink.isError, sendActivateAccountLink.error);

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
                                        {row.notBlocked && <BlockUserButton user={row} blockUserFunction={blockUser.mutate} />}

                                        {!row.notBlocked && <UnblockUserButton user={row} unblockUserFunction={activateUser.mutate}/>}

                                        <SendLinkButton user={row} unblockUserFunction={sendActivateAccountLink.mutate} />

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
            <SimpleBackdrop open={blockUser.isLoading || activateUser.isLoading || sendActivateAccountLink.isLoading} />
        </TableContainer>

    );
};

export default UserList;
