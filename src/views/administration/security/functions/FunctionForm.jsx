import {Autocomplete, Box, Button, Grid, TextField} from "@mui/material";
import InputLabel from "../../../../ui-component/extended/Form/InputLabel";
import GroupZone from "../../../ui-elements/custom/GroupZone";
import React, {useEffect, useState} from "react";
import {dispatch, useSelector} from "../../../../store";
import {useMutation} from "react-query";
import axiosServices from "../../../../utils/axios";
import {useFeedBackEffects} from "../../../../hooks/useFeedBack";
import {useFormik} from "formik";
import {fncActions} from "../../../../store/slices/administration/security/fncSlice";
import {initialUpdateFncDTO} from "./FncDtos";

const FunctionForm = ()=>
{
    const {updFormOpened, currentFncToUpdate} = useSelector(state=>state.fnc);

    const handleClose = () => {
        dispatch(fncActions.updFormClosed());
    };

    const {mutate: updateFunction, isLoading, isError, error, isSuccess} = useMutation('updateFunction', (dto)=>axiosServices({url: "/functions/update", method: 'put', data: dto}))

    const handleSubmit = async (dto) =>
    {
        updateFunction(dto);
    }
    const [selectedRoles, setSelectedRoles] = useState([])
    const [roleCodes, setRoleCodes] = useState([])
    const [preselectedPrivileges, setPreselectedPrivileges] = useState([])

    useFeedBackEffects(isSuccess, isError, error);

    const formik = useFormik(
        {
            initialValues: initialUpdateFncDTO,
            onSubmit: handleSubmit
        }
    );
    useEffect(()=>
    {
        formik.setValues(currentFncToUpdate)
    }, [currentFncToUpdate]);
    useEffect(() => {
        axiosServices({url: `/privileges/options-by-role-codes?roleCodes=${roleCodes}`}).then(resp=>setPreselectedPrivileges(resp?.data))
    }, [roleCodes]);

    useEffect(() => {
    }, [preselectedPrivileges]);
    return
    (<GroupZone tilte={'Fonction'}>
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12} lg={4}>
                <InputLabel>Nom de la fonction {formik.touched.name&&<small style={{color:'red'}} >{formik.errors.name}</small>}</InputLabel>
                <TextField fullWidth onBlur={formik.handleBlur} name={'name'} value={formik.values.name} placeholder="Saisir le nom de la fonction" size={"small"} onChange={formik.handleChange}/>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
                <InputLabel>Début {formik.touched.startsAt&&<small style={{color:'red'}} >{formik.errors.startsAt}</small>}</InputLabel>
                <TextField fullWidth type={"date"} size={"small"} name={'startsAt'}  value={formik.values.startsAt} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
                <InputLabel>Fin {formik.touched.endsAt&&<small style={{color:'red'}} >{formik.errors.endsAt}</small>}</InputLabel>
                <TextField fullWidth type={"date"} size={"small"} name={'endsAt'} value={formik.values.endsAt} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
                <InputLabel>Rôles {formik.touched.roleCodes&&<small style={{color:'red'}} >{formik.errors.roleCodes}</small>}</InputLabel>

                <Autocomplete multiple
                              fullWidth
                              size={"small"}
                              name={'roleCodes'}
                              onChange={(e, ops) => {
                                  setSelectedRoles(ops);
                                  setRoleCodes(ops?.map(o=>o.id))
                                  formik.setFieldValue('roleCodes', ops?.map(o=>o?.id))
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
    </GroupZone>)

}
export default FunctionForm;