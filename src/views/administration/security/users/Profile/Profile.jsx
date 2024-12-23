import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// project imports
import useAuth from 'hooks/useAuth';
import Avatar from 'ui-component/extended/Avatar';
import SubCard from 'ui-component/cards/SubCard';

import { gridSpacing } from 'store/constant';

// assets
import { IconEdit } from '@tabler/icons-react';
import PhonelinkRingTwoToneIcon from '@mui/icons-material/PhonelinkRingTwoTone';
import PinDropTwoToneIcon from '@mui/icons-material/PinDropTwoTone';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';

import Avatar3 from 'assets/images/users/avatar-3.png';
import {Formik} from "formik";
import * as yup from "yup";
import Stack from "@mui/material/Stack";
import UploadAvatar from "../../../../../ui-component/third-party/dropzone/Avatar";
import FormHelperText from "@mui/material/FormHelperText";
import MainCard from "../../../../../ui-component/cards/MainCard";
import {fileToBase64Url, image64Url} from "../../../../../utils/FileManager";
import {useParams} from "react-router";
import axiosServices from "../../../../../utils/axios";
import {dispatch, useSelector} from "../../../../../store";
import WorkIcon from '@mui/icons-material/Work';

// progress
function LinearProgressWithLabel({ value, ...others }) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    mr: 1
                }}
            >
                <LinearProgress value={value} {...others} />
            </Box>
            <Box
                sx={{
                    minWidth: 35
                }}
            >
                <Typography variant="body2" color="textSecondary">{`${Math.round(value)}%`}</Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    value: PropTypes.number
};

// personal details table
/** names Don&apos;t look right */
function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

// ==============================|| PROFILE 1 - PROFILE ||============================== //

const Profile = () => {
    const { user } = useAuth();
    const { currentProfile} = useSelector((state) => state.membre);
    const rows = [
        createData('Full Name', ':', user?.name),
        createData('Fathers Name', ':', 'Mr. Deepen Handgun'),
        createData('Address', ':', 'Street 110-B Kalians Bag, Dewan, M.P. INDIA'),
        createData('Zip Code', ':', '12345'),
        createData('Phone', ':', '+0 123456789 , +0 123456789'),
        createData('Email', ':', 'support@example.com'),
        createData('Website', ':', 'http://example.com')
    ];
    const {userId} = useParams();

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item lg={4} xs={12}>
                <SubCard
                    title={
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <Avatar alt="User 1" src={Avatar3} />
                            </Grid>
                        </Grid>
                    }
                    secondary={<Chip size="small" label="Membre" color="primary" />}
                >
                    <List component="nav" aria-label="main mailbox folders">
                        <ListItemButton>
                            <ListItemIcon>
                                <MailTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="subtitle1">Email</Typography>} />
                            <ListItemSecondaryAction>
                                <Typography variant="subtitle2" align="right">
                                    {currentProfile?.email}
                                </Typography>
                            </ListItemSecondaryAction>
                        </ListItemButton>
                        <Divider />
                        <ListItemButton>
                            <ListItemIcon>
                                <PhonelinkRingTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="subtitle1">Phone</Typography>} />
                            <ListItemSecondaryAction>
                                <Typography variant="subtitle2" align="right">
                                    {currentProfile?.tel}
                                </Typography>
                            </ListItemSecondaryAction>
                        </ListItemButton>
                        <Divider />
                        <ListItemButton>
                            <ListItemIcon>
                                <WorkIcon sx={{ fontSize: '1.3rem' }} />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="subtitle1">Matricule</Typography>} />
                            <ListItemSecondaryAction>
                                <Typography variant="subtitle2" align="right">
                                    {currentProfile?.matriculeFonctionnaire}
                                </Typography>
                            </ListItemSecondaryAction>
                        </ListItemButton>
                    </List>
                </SubCard>
            </Grid>
            <Grid item lg={8} xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <SubCard
                            title="About me"
                            secondary={
                                <Button>
                                    <IconEdit stroke={1.5} size="20px" aria-label="Edit Details" />
                                </Button>
                            }
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">Détails</Typography>
                                </Grid>
                                <Divider sx={{ pt: 1 }} />
                                <Grid item xs={12}>
                                    <TableContainer>
                                        <Table
                                            sx={{
                                                '& td': {
                                                    borderBottom: 'none'
                                                }
                                            }}
                                            size="small"
                                        >
                                            <TableBody>
                                                <TableRow key={'matricule'}>
                                                    <TableCell variant="head">Matricule</TableCell>
                                                    <TableCell>{currentProfile.matriculeFonctionnaire}</TableCell>
                                                </TableRow>

                                                    <TableRow key={'Nom'}>
                                                        <TableCell variant="head">Nom</TableCell>
                                                        <TableCell>{currentProfile.firstName}</TableCell>
                                                    </TableRow>
                                                <TableRow key={'Prénom'}>
                                                    <TableCell variant="head">Prénom</TableCell>
                                                    <TableCell>{currentProfile.lastName}</TableCell>
                                                </TableRow>
                                                <TableRow key={'civilite'}>
                                                    <TableCell variant="head">Civilité</TableCell>
                                                    <TableCell>{currentProfile.civilite}</TableCell>
                                                </TableRow>
                                                <TableRow key={'email'}>
                                                    <TableCell variant="head">Email</TableCell>
                                                    <TableCell>{currentProfile.email}</TableCell>
                                                </TableRow>
                                                <TableRow key={'tel'}>
                                                    <TableCell variant="head">Téléphone</TableCell>
                                                    <TableCell>{currentProfile.tel}</TableCell>
                                                </TableRow>
                                                <TableRow key={'dateNaissance'}>
                                                    <TableCell variant="head">Date de naissance</TableCell>
                                                    <TableCell>{currentProfile.dateNaissance}</TableCell>
                                                </TableRow>
                                                <TableRow key={'lieuNaissance'}>
                                                    <TableCell variant="head">Lieu de naissance</TableCell>
                                                    <TableCell>{currentProfile.lieuNaissance}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                        </SubCard>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Profile;
