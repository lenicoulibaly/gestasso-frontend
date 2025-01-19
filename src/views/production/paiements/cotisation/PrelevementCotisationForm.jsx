import Modal from "../../../../utils/Modal";
import CustumWizard from "../../../ui-elements/custom/CustomWizard";

import React, {useRef} from "react";

import {usePrelevementCotisationService} from "../../../../hooks/services/usePrelevementCotisationService";

import {dispatch, useSelector} from "../../../../store";
import {prelevementCotisationActions} from "../../../../store/slices/production/prelevement-cotisation/prelevementCotisationSlice";
import {PrelevementDataForm} from "./PrelevementDataForm";
import {DefautPrelevementForm} from "./DefautPrelevementForm";
import {PrelevementDocForm} from "./PrelevementDocForm";
import FloatingAlert from "../../../ui-elements/custom/FloatingAlert";
import {useFeedBackEffects} from "../../../../hooks/useFeedBack";
import SimpleBackdrop from "../../../ui-elements/custom/SimpleBackdrop";

export const PrelevementCotisationForm = ({})=>
{
    const {formOpened, prelevementDto, } = useSelector(state=>state.prelevementCotisation)

    const {savePrelevement} = usePrelevementCotisationService();

    const onSubmit = ()=>
    {
        const formData = new FormData()
        const prelDto = {...prelevementDto, docs: prelevementDto.docs.map(doc=>({...doc, file: undefined}))}
        const jsonString = JSON.stringify(prelDto);
        formData.append('data', jsonString)
        prelevementDto.docs.forEach((doc)=>
        {
            formData.append('files', doc.file)
        });

        savePrelevement.mutate(formData);
    }

    const handleNew = ()=>
    {
        dispatch(prelevementCotisationActions.formReinitialized())
        savePrelevement.reset();
        wizardRef.current.resetWizard();
    }
    if(savePrelevement.isError) console.log('savePrelevement.error', savePrelevement.error)
    useFeedBackEffects(savePrelevement.isSuccess, savePrelevement.isError, savePrelevement.error);
    const wizardRef = useRef();

    const steps=[{index: 0, label: 'Données du prélvement', nextDisabled: (false), component: <PrelevementDataForm />},
        {index: 1, label: 'Defauts de prélèvement', nextDisabled:false, component: <DefautPrelevementForm />},
        {index: 2, label: 'Pièces jointes', nextDisabled:true, component: <PrelevementDocForm />}]

    return <Modal newVisible={savePrelevement.isSuccess} handleNew={handleNew} actionVisible={true} actionDisabled={savePrelevement.isSuccess} handleConfirmation={onSubmit} open={formOpened} handleClose={()=>{dispatch(prelevementCotisationActions.createFormClosed())}}title={'Prélèvement à la source'} width={"md"} >

            <CustumWizard steps={steps} ref={wizardRef}/>
            <FloatingAlert />
            <SimpleBackdrop open={savePrelevement.isLoading} />
    </Modal>
}