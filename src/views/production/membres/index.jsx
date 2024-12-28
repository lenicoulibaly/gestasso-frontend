import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {Button, Grid, InputAdornment, Menu, MenuItem, OutlinedInput, Pagination, Typography} from '@mui/material';

// project imports
import MembreList from './MembreList';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assetsf
import { IconSearch } from '@tabler/icons-react';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import {dispatch, useSelector} from "../../../store";
import {membreActions} from "../../../store/slices/production/membres/membresSlice";
import NewMembreForm from "./NewMembreForm";

// ==============================|| USER LIST STYLE 1 ||============================== //

const MembreListIndex = () => {
    const {key, membres, page, size} = useSelector((state) => state.membre)
    const onPageChange = page=>
    {
        dispatch(membreActions.pageChanged(page))
    }
    const onSizeChange = size=>
    {
        dispatch(membreActions.sizeChanged(size))
        dispatch(membreActions.pageChanged(0))
    }
    const onKeyChange = (key)=>
    {
        dispatch(membreActions.keyChanged(key))
        dispatch(membreActions.pageChanged(0))
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
                    <Grid item spacing={0}>
                        <div >
                            <NewMembreForm />
                            {/*<UpdateMembreForm />*/}
                        </div>
                    </Grid>

                </Grid>
            }
            content={false}>

            <MembreList />
            <Grid item xs={12} sx={{ p: 3 }}>
                <Grid container justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Pagination page={page+1} onChange={(e, page)=>onPageChange(page-1)} count={membres?.totalPages} color="primary" />
                    </Grid>
                    <Grid item>
                        <Button
                            size="large"
                            sx={{ color: theme.palette.grey[900] }}
                            color="secondary"
                            endIcon={<ExpandMoreRoundedIcon />}
                            onClick={handleClick}
                        >
                            {size} Rows
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
                                <MenuItem onClick={()=>onSizeChange(5)}> 5 Rows</MenuItem>
                                <MenuItem onClick={()=>onSizeChange(10)}> 10 Rows</MenuItem>
                                <MenuItem onClick={()=>onSizeChange(20)}> 20 Rows</MenuItem>
                                <MenuItem onClick={()=>onSizeChange(30)}> 30 Rows </MenuItem>
                            </Menu>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default MembreListIndex;
