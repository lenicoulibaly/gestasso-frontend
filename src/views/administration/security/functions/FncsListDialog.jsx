import PropTypes from 'prop-types';
import React, {useEffect} from 'react';

// material-ui
import {styled, useTheme} from '@mui/material/styles';
import {
    Button,
    Chip,
    Dialog,
    FormHelperText,
    Grid,
    IconButton, InputAdornment, Menu, MenuItem, OutlinedInput, Pagination, Stack,
    Table, TableBody,
    TableCell, TableContainer,
    TableHead,
    TableRow,
    TextField, Tooltip, Typography
} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// assets
import CloseIcon from '@mui/icons-material/Close';
import {dispatch, useSelector} from "../../../../store";
import GroupZone from "../../../ui-elements/custom/GroupZone";
import {useFormik} from "formik";

import * as Yup from "yup";
import {useMutation, useQuery, useQueryClient} from "react-query";
import FloatingAlert from "../../../ui-elements/custom/FloatingAlert";
import SimpleBackdrop from "../../../ui-elements/custom/SimpleBackdrop";
import {useFeedBackEffects} from "../../../../hooks/useFeedBack";
import {fncValidationSchema, initialUpdateFncDTO} from "./FncDtos";
import axiosServices from "../../../../utils/axios";
import {fncActions} from "../../../../store/slices/administration/security/fncSlice";
import Avatar from "../../../../ui-component/extended/Avatar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {CheckCircle, Delete, Edit, SettingsBackupRestore} from "@mui/icons-material";
import AlertDialog from "../../../ui-elements/advance/UIDialog/AlertDialog";
import BlockTwoToneIcon from "@mui/icons-material/BlockTwoTone";
import AddLinkIcon from "@mui/icons-material/AddLink";
import ListIcon from "@mui/icons-material/List";
import FncsFormDialog from "./FncsFormDialog";
import {gridSpacing} from "../../../../store/constant";
import {IconSearch} from "@tabler/icons-react";
import NewUserForm from "../users/NewUserForm";
import UpdateUserForm from "../users/UpdateUserForm";
import MainCard from "../../../../ui-component/cards/MainCard";
import {userActions} from "../../../../store/slices/administration/security/userSlice";
import AddIcon from "@mui/icons-material/Add";
import {FormMode} from "../../../../enums/FormMode";
import {isAxiosError} from "axios";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuDialogContent-root': {
        padding: theme.spacing(2)
    },
    '& .MuDialogActions-root': {
        padding: theme.spacing(1)
    }
}));



const BootstrapDialogTitle = ({ children, onClose, ...other }) => (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 10,
                    top: 10,
                    color: (theme) => theme.palette.grey[500]
                }}
            >
                <CloseIcon />
            </IconButton>
        ) : null}
    </DialogTitle>
);

BootstrapDialogTitle.propTypes = {
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node
};

export default function FncsListDialog() {
    const {fncsList, fncsListDialogOpened, currentUser, currentFncToUpdate, key, page, size} = useSelector(state=>state.fnc);
    const theme = useTheme();
    const queryClient = useQueryClient();

    const handleClose = () => {
        dispatch(fncActions.fncsListDialogClosed());
    };

    const onKeyChange = (key)=>
    {
        dispatch(fncActions.keyChanged(key))
        dispatch(fncActions.pageChanged(0))
    }
    const onPageChange = page=>
    {
        dispatch(fncActions.pageChanged(page))
    }
    const onSizeChange = size=>
    {
        dispatch(fncActions.sizeChanged(size))
        dispatch(fncActions.pageChanged(0))
    }
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClickSizeMnu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseSizeMnu = () => {
        setAnchorEl(null);
    };

    const {data: loadedFncsList} = useQuery(['searchFunctions', currentUser.userId, key, page, size],
        ()=>axiosServices({url: `/functions/search/${currentUser.userId}?withRevoked=true&key=${key}&page=${page}&size=${size}`, method: 'get'}))

    const {mutate: updateFnc, isLoading, isError, error, isSuccess} = useMutation('updateFnc', (dto)=>axiosServices({url: "/functions/update", method: 'put', data: dto}))

    const handleSubmit = async (dto) =>
    {
        updateFnc(dto);
    }

    const handleEditFunction = (fnc)=>
    {
        dispatch(fncActions.updFormOpened({currentFncToUpdate: fnc, currentUser: currentUser}));
    }
    const handleOpenFncForm = ()=>
    {
        dispatch(fncActions.newFormOpened({currentUser: currentUser, formMode: FormMode.NEW}));
    }

    const validationSchema = Yup.object(fncValidationSchema);

    useFeedBackEffects(isSuccess, isError, error);

    const formik = useFormik(
        {
            initialValues: initialUpdateFncDTO,
            onSubmit: handleSubmit,
            validationSchema: validationSchema
        }
    );
    useEffect(()=>
    {
        formik.setValues(currentUser)
    }, [currentUser])
    const {mutate: setFunctionAsDefault, isLoading: setFunctionAsDefaultIsLoading, isSuccess: setFunctionAsDefaultIsSuccess, isError: setFunctionAsDefaultIsError, error: setFunctionAsDefaultError}
        = useMutation('setFunctionAsDefault', (fncId)=>axiosServices({url: `/functions/set-fnc-as-default/${fncId}`, method: 'put'}))

    const {mutate: restoreFunction, isLoading: restoreFunctionIsLoading, isSuccess: restoreFunctionIsSuccess, isError: restoreFunctionIsError, error: restoreFunctionError}
        = useMutation('restoreFunction', (fncId)=>axiosServices({url: `/functions/restore/${fncId}`, method: 'put'}))


    const {mutate: revokeFunction, isLoading: revokeFunctionIsLoading, isSuccess: revokeFunctionIsSuccess, isError: revokeFunctionIsError, error: revokeFunctionError}
        = useMutation('revokeFunction', (fncId)=>axiosServices({url: `/functions/revoke/${fncId}`, method: 'put'}))

    useEffect(()=>
    {
        if(setFunctionAsDefaultIsSuccess || restoreFunctionIsSuccess || revokeFunctionIsSuccess)
        {
            queryClient.invalidateQueries('searchFunctions')
        }
    }, [setFunctionAsDefaultIsSuccess, restoreFunctionIsSuccess, revokeFunctionIsSuccess])
    useFeedBackEffects(setFunctionAsDefaultIsSuccess, setFunctionAsDefaultIsError, setFunctionAsDefaultError);
    useFeedBackEffects(restoreFunctionIsSuccess, restoreFunctionIsError, restoreFunctionError);
    useFeedBackEffects(revokeFunctionIsSuccess, revokeFunctionIsError, revokeFunctionError);
    return (
        <div>
            <BootstrapDialog aria-labelledby="customized-dialog-title" open={fncsListDialogOpened} maxWidth="md" fullWidth>

                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    <Typography variant={'h4'}>
                        {`Liste des fonctions de ${currentUser.firstName} ${currentUser.lastName} (${currentUser.email})`}
                    </Typography>
                </BootstrapDialogTitle>

                <DialogContent dividers>
                    <Grid container alignItems={"center"} justifyContent={"space-between"}>
                        <Grid item >
                            <Grid item>
                                <OutlinedInput value={key}
                                               onChange={(e)=>onKeyChange(e.target.value)}
                                               id="input-search-list-style1"
                                               placeholder="Search"
                                               startAdornment={
                                                   <InputAdornment position="start">
                                                       <IconSearch stroke={1.5} size="16px" />
                                                   </InputAdornment>
                                               }
                                               size="small"
                                />
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color={'secondary'} onClick={handleOpenFncForm} title={`Ajout d'une nouvelle fonction`}>
                                <AddIcon />
                            </Button>
                            <FncsFormDialog/>
                        </Grid>
                    </Grid>
                    <FncsFormDialog/>
                    <hr/>
                    <Grid item xs={12}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow >
                                        <TableCell sx={{ pl: 1 }}>#</TableCell>
                                        <TableCell>Nom de la fonction</TableCell>
                                        <TableCell>Début</TableCell>
                                        <TableCell>Fin</TableCell>
                                        <TableCell>Rôles</TableCell>
                                        <TableCell align="center" sx={{ pr: 3 }}>
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loadedFncsList &&
                                    loadedFncsList?.data.content?.map((row, index) => (
                                        <TableRow hover key={index} sx={{ backgroundColor: row.fncStatus === 1 ? '#51E86F' : 'inherit' }}>
                                            <TableCell sx={{ pl: 1 }}>{index+1}</TableCell>
                                            <TableCell>
                                                {row.name}
                                            </TableCell>
                                            <TableCell>{row.startsAt}</TableCell>
                                            <TableCell>{row.endsAt}</TableCell>
                                            <TableCell>{row.roleCodes?.join(' / ')}</TableCell>
                                            <TableCell align="center" sx={{ pr: 3 }}>
                                                <Stack direction="row" justifyContent="center" alignItems="center">
                                                    <Tooltip placement="top" title="Modifier">
                                                        <IconButton color="primary" aria-label="modifier" size="large" onClick={()=> handleEditFunction(row)}>
                                                            <Edit sx={{ fontSize: '1.1rem' }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {row.fncStatus != 1 && row.fncStatus != 3 && <AlertDialog triggerStyle={{
                                                        color: theme.palette.success.dark,
                                                        borderColor: theme.palette.success.main,
                                                        '&:hover ': {background: theme.palette.success.light}
                                                    }} handleConfirmation={() => setFunctionAsDefault(row.id)} openLabel={"Définir comme fonction active"}
                                                                                        message={"Vous êtes sur le point d'activer la fonction " + row.name + ". Confirmez-vous cette action ?"}
                                                                                        actionDisabled={false}
                                                                                        TriggerIcon={<CheckCircle sx={{fontSize: '1.1rem'}}/>}/>}

                                                    {row.fncStatus == 3 && <AlertDialog triggerStyle={{
                                                        color: theme.palette.warning.dark,
                                                        borderColor: theme.palette.warning.main,
                                                        '&:hover ': {background: theme.palette.warning.light}
                                                    }} handleConfirmation={() => setFunctionAsDefault(row.id)} openLabel={"Restaurer"}
                                                                                        message={"Vous êtes sur le point de restaurer la fonction " + row.name + ". Confirmez-vous cette action ?"}
                                                                                        actionDisabled={false}
                                                                                        TriggerIcon={<SettingsBackupRestore sx={{fontSize: '1.1rem'}}/>}/>}

                                                    {row.fncStatus != 3 && row.fncStatus != 1 && <AlertDialog triggerStyle={{
                                                        color: theme.palette.error.dark,
                                                        borderColor: theme.palette.error.main,
                                                        '&:hover ': {background: theme.palette.error.light}
                                                    }} handleConfirmation={() => revokeFunction(row.id)} openLabel={"Revoquer"}
                                                                                    message={"Vous êtes sur le point de revoquer la fonction " + row.name + ". Confirmez-vous cette action ?"}
                                                                                    actionDisabled={false}
                                                                                    TriggerIcon={<BlockTwoToneIcon sx={{fontSize: '1.1rem'}}/>}/>}

                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>

                            </Table>
                            <Grid item xs={12} sx={{ p: 3 }}>
                                <Grid container justifyContent="space-between" spacing={gridSpacing}>
                                    <Grid item>
                                        <Pagination page={page+1} onChange={(e, page)=>onPageChange(page-1)} count={loadedFncsList?.data.totalPages} color="primary" />
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            size="large"
                                            sx={{ color: theme.palette.grey[900] }}
                                            color="secondary"
                                            endIcon={<ExpandMoreRoundedIcon />}
                                            onClick={handleClickSizeMnu}
                                        >
                                            {size} Rows
                                        </Button>
                                        {anchorEl && (
                                            <Menu
                                                id="menu-user-list-style1"
                                                anchorEl={anchorEl}
                                                keepMounted
                                                open={Boolean(anchorEl)}
                                                onClose={handleCloseSizeMnu}
                                                variant="selectedMenu"
                                                anchorOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right'
                                                }}
                                                transformOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'right'
                                                }}
                                            >
                                                <MenuItem onClick={()=>onSizeChange(5)}> 5 Rows</MenuItem>
                                                <MenuItem onClick={()=>onSizeChange(10)}> 10 Rows</MenuItem>
                                                <MenuItem onClick={()=>onSizeChange(20)}> 20 Rows</MenuItem>
                                                <MenuItem onClick={()=>onSizeChange(30)}> 30 Rows </MenuItem>
                                            </Menu>
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>
                    </Grid>
                </DialogContent>
            </BootstrapDialog>
            <FloatingAlert/>
            <SimpleBackdrop open={isLoading || setFunctionAsDefaultIsLoading || revokeFunctionIsLoading || restoreFunctionIsLoading}/>
        </div>
    );
}
