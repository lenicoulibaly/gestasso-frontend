import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

// project imports
import Profile from './Profile';
import PersonalAccount from './PersonalAccount';
import MyAccount from './MyAccount';
import ChangePassword from './ChangePassword';
import Settings from './Settings';
import MainCard from 'ui-component/cards/MainCard';
import { ThemeMode } from 'config';

import { gridSpacing } from 'store/constant';

// assets
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import LibraryBooksTwoToneIcon from '@mui/icons-material/LibraryBooksTwoTone';
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';
import useAuth from "../../../../../hooks/useAuth";
import {useSelector} from "../../../../../store";

// tabs panel
function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

// tabs option
const tabsOption = [
    {
        id: 'profile',
        label: 'Profile',
        icon: <AccountCircleTwoToneIcon sx={{ fontSize: '1.3rem' }} />
    },
    {
        id: 'changePassword',
        label: 'Changer mon mot de passe',
        icon: <LockTwoToneIcon sx={{ fontSize: '1.3rem' }} />
    },
    {
        id: 'adhesionList',
        label: 'Liste des adhésions',
        icon: <LockTwoToneIcon sx={{ fontSize: '1.3rem' }} />
    },
    {
        id: 'stats',
        label: 'Statistiques',
        icon: <LockTwoToneIcon sx={{ fontSize: '1.3rem' }} />
    }
];

// ==============================|| PROFILE 1 ||============================== //

const Profile1 = () => {
    const theme = useTheme();

    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const authUserId = useAuth().getAuthUser().userId
    //const authUser = useAuth().getAuthUser().userId
    const { currentProfile} = useSelector((state) => state.membre);
    {console.log("authUserId", authUserId)}
    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Tabs
                        value={value}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={handleChange}
                        aria-label="simple tabs example"
                        variant="scrollable"
                        sx={{
                            mb: 3,
                            '& a': {
                                minHeight: 'auto',
                                minWidth: 10,
                                py: 1.5,
                                px: 1,
                                mr: 2.25,
                                color: theme.palette.mode === ThemeMode.DARK ? 'grey.600' : 'grey.900',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            },
                            '& a.Mui-selected': {
                                color: 'primary.main'
                            },
                            '& .MuiTabs-indicator': {
                                bottom: 2
                            },
                            '& a > svg': {
                                marginBottom: '0px !important',
                                mr: 1.25
                            }
                        }}
                    >
                        {tabsOption.filter(tab=>tab.id != 'changePassword' || authUserId == currentProfile.userId).map((tab, index) => (
                            <Tab key={index} component={Link} to="#" icon={tab.icon} label={tab.label} {...a11yProps(index)} />
                        ))}
                    </Tabs>
                    <TabPanel value={value} index={0}>
                        <Profile />
                    </TabPanel>
                    {authUserId == currentProfile.userId && <TabPanel value={value} index={1}>
                        <ChangePassword/>
                    </TabPanel>}
                    <TabPanel value={value} index={2}>
                        <PersonalAccount />
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <PersonalAccount />
                    </TabPanel>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default Profile1;
