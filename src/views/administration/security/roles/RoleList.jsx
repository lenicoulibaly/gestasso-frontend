import React, {useEffect} from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
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

import {useDispatch, useSelector} from 'store';

// assets
import BlockTwoToneIcon from '@mui/icons-material/BlockTwoTone';
import {roleActions} from "../../../../store/slices/administration/security/roleSlice";
import {useQuery} from "react-query";
import axiosServices from "../../../../utils/axios";
import FloatingAlert from "../../../ui-elements/custom/FloatingAlert";
import {feedBackActions} from "../../../../store/slices/feedBackSlice";
import {Edit} from "@mui/icons-material";
import {FormMode} from "../../../../enums/FormMode";

//const avatarImage = require.context('assets/images/users', true);

// ==============================|| USER LIST 1 ||============================== //

const RoleList = () => {
    const theme = useTheme();
    const dispatch = useDispatch();

    //const [data, setData] = React.useState([]);
    const { roles, page, size, key} = useSelector((state) => state.role);

    React.useEffect(() => {
    }, []);

    const {data, isSuccess, isLoading, isError, error} = useQuery(['searchRoles', page, size, key], ()=>axiosServices({url: `/roles/search?page=${page}&size=${size}&key=${key}`}))
    useEffect(()=>
    {
        if(isLoading) dispatch(roleActions.searchPending())
        if(isSuccess) {
            dispatch(roleActions.searchFulfilled(data.data))
        }
        if(isError) {
            dispatch(roleActions.searchFailed(error))
            dispatch(feedBackActions.operationFailed(error))
        }

    }, [data, isSuccess, isLoading, isError, error]);
    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ pl: 3 }}>#</TableCell>
                        <TableCell>Code du rôle</TableCell>
                        <TableCell>Nom du rôle</TableCell>
                        <TableCell align="center" sx={{ pr: 3 }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {roles &&
                    roles?.content?.map((row, index) => (
                            <TableRow hover key={index}>
                                <TableCell sx={{ pl: 3 }}>{index+1}</TableCell>
                                <TableCell>
                                    {row.roleCode}
                                </TableCell>
                                <TableCell>{row.roleName}</TableCell>
                                <TableCell align="center" sx={{ pr: 3 }}>
                                    <Stack direction="row" justifyContent="center" alignItems="center">
                                        <Tooltip placement="top" title="Modifier">
                                            <IconButton color="primary" aria-label="delete" size="large" onClick={()=>dispatch(roleActions.formOpened({formMode: FormMode.UPDATE, currentRole: row}))}>
                                                <Edit sx={{ fontSize: '1.1rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip placement="top" title="Block">
                                            <IconButton
                                                color="primary"
                                                sx={{
                                                    color: theme.palette.orange.dark,
                                                    borderColor: theme.palette.orange.main,
                                                    '&:hover ': { background: theme.palette.orange.light }
                                                }}
                                                size="large"
                                            >
                                                <BlockTwoToneIcon sx={{ fontSize: '1.1rem' }} />
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

export default RoleList;
