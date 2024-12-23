import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {Button, Grid, InputAdornment, Menu, MenuItem, OutlinedInput, Pagination, Typography} from '@mui/material';

// project imports
import UserList from './CotisationList';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assetsf
import { IconSearch } from '@tabler/icons-react';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import {dispatch, useSelector} from "../../../../store";
import NewUserForm from "./NewAssoFormDlg";
import {userActions} from "../../../../store/slices/administration/security/userSlice";
import UpdateUserForm from "./UpdateAssoForm";
import FncsListDialog from "../functions/FncsListDialog";
import {fncActions} from "../../../../store/slices/administration/security/fncSlice";

// ==============================|| USER LIST STYLE 1 ||============================== //

const UserListIndex = () => {
    const {key, users, page} = useSelector((state) => state.user)

    const onKeyChange = (key)=>
    {
        dispatch(fncActions.keyChanged(key))
    }
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <MainCard
            title={
                <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
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
                    <Grid item>
                        <Typography variant="h3">
                            <NewUserForm />
                            <UpdateUserForm />
                            <FncsListDialog/>
                        </Typography>
                    </Grid>

                </Grid>
            }
            content={false}
        >
            <FncsListDialog />
            <Grid item xs={12} sx={{ p: 3 }}>
                <Grid container justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Pagination page={page+1} onChange={(e, page)=>onPageChange(page-1)} count={users?.totalPages} color="primary" />
                    </Grid>
                    <Grid item>
                        <Button
                            size="large"
                            sx={{ color: theme.palette.grey[900] }}
                            color="secondary"
                            endIcon={<ExpandMoreRoundedIcon />}
                            onClick={handleClick}
                        >
                            10 Rows
                        </Button>
                        {anchorEl && (
                            <Menu
                                id="menu-user-list-style1"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
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
                            </Menu>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default UserListIndex;
