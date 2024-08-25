import {Autocomplete, Box, Button, FormHelperText, Grid, IconButton, TextField} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {FormMode} from "../../../../enums/FormMode";
import DialogContent from "@mui/material/DialogContent";
import {gridSpacing} from "../../../../store/constant";
import InputLabel from "../../../../ui-component/extended/Form/InputLabel";
import GroupZone from "../../../ui-elements/custom/GroupZone";
import TransferList from "../../../ui-elements/custom/TransferList";
import DialogActions from "@mui/material/DialogActions";
import AlertDialog from "../../../ui-elements/advance/UIDialog/AlertDialog";
import FloatingAlert from "../../../ui-elements/custom/FloatingAlert";
import React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";

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
const FunctionsList = ()=>
{
    return (
        <div>
            <Button variant="contained" color={'secondary'} onClick={handleClickOpen} title={'Ajouter un nouvel utilisateur'}>
                <AddIcon />
            </Button>
            <BootstrapDialog aria-labelledby="customized-dialog-title" open={formOpened} maxWidth="md" fullWidth>
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {formMode == FormMode.NEW ? 'Nouveau rôle' : "Modification du rôle " + currentRole?.roleName }
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} sm={6}>

                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <GroupZone tilte={'Fonction'}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12} lg={4}>
                                        <InputLabel>Nom de la fonction {formik.touched.createInitialFncDTO?.name&&<small style={{color:'red'}} >{formik.errors.createInitialFncDTO?.name}</small>}</InputLabel>
                                        <TextField fullWidth onBlur={formik.handleBlur} name={'createInitialFncDTO.name'} value={formik.values.createInitialFncDTO?.name} placeholder="Saisir le nom de la fonction" size={"small"} onChange={formik.handleChange}/>

                                    </Grid>
                                    <Grid item xs={12} sm={6} lg={4}>
                                        <InputLabel>Début {formik.touched.createInitialFncDTO?.startsAt&&<small style={{color:'red'}} >{formik.errors.createInitialFncDTO?.startsAt}</small>}</InputLabel>
                                        <TextField fullWidth type={"date"} size={"small"} name={'createInitialFncDTO.startsAt'}  value={formik.values.createInitialFncDTO?.startsAt} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                    </Grid>
                                    <Grid item xs={12} sm={6} lg={4}>
                                        <InputLabel>Fin {formik.touched.createInitialFncDTO?.endsAt&&<small style={{color:'red'}} >{formik.errors.createInitialFncDTO?.endsAt}</small>}</InputLabel>
                                        <TextField fullWidth type={"date"} size={"small"} name={'createInitialFncDTO.endsAt'} value={formik.values.createInitialFncDTO?.endsAt} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                    </Grid>
                                    <Grid item xs={12} sm={12} lg={12}>
                                        <InputLabel>Rôles {formik.touched.createInitialFncDTO?.roleCodes&&<small style={{color:'red'}} >{formik.errors.createInitialFncDTO?.roleCodes}</small>}</InputLabel>

                                        <Autocomplete multiple
                                                      fullWidth
                                                      size={"small"}
                                                      name={'createInitialFncDTO.roleCodes'}
                                                      onChange={(e, ops) => {
                                                          setSelectedRoles(ops);
                                                          setRoleCodes(ops?.map(o=>o.id))
                                                          formik.setFieldValue('createInitialFncDTO.roleCodes', ops?.map(o=>o?.id))
                                                          console.log('roleCodes', roleCodes);
                                                          //setSelectedPrvs(loadedSelectedPrvs?.data);
                                                      }}

                                                      onBlur={(e) => {
                                                          formik.handleBlur(e);  // Make sure to call the Formik handler
                                                      }}
                                                      value={selectedRoles}
                                                      options={roles?.data||[]}

                                                      renderInput={(params) => <TextField {...params} label='Sélectionner les rôles de la fonction' />}
                                        />
                                    </Grid>
                                    <Grid item xs={12} >
                                        <Box display="flex" flexDirection="column">
                                            <InputLabel>Privilèges <small style={{color:'red'}} ></small></InputLabel>
                                            <Autocomplete multiple readOnly
                                                          fullWidth
                                                          size={"small"}
                                                          value={preselectedPrivileges}
                                                          getOptionLabel={(option) => option.label}
                                                          options={privileges?.data||[]}
                                                          style={{maxHeight: '500px'}}
                                                          renderInput={(params) => <TextField {...params}/>}
                                            />
                                            <Button sx={{marginTop: 1, marginLeft: 'auto'}} variant={"outlined"} onClick={handleAddFunction} disabled={!formik.isValid}>Ajouter</Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </GroupZone>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <AlertDialog actionDisabled={!formik.isValid} openLabel={'Enregistrer'} handleConfirmation={handleConfirmation}/>
                </DialogActions>
            </BootstrapDialog>
            <FloatingAlert/>
        </div>
    );
}
export default FunctionsList;