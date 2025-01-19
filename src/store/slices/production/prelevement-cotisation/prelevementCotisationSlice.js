import {createSlice, current} from '@reduxjs/toolkit'
import {initialCreateMembreDTO, initialUpdateMembreDTO} from "../../../../views/production/membres/MembreDtos";
import {FormMode} from "../../../../enums/FormMode";
import {
    initialCreatePaiementCotisationDTO,
    initialDocument, initialPrelevementDto
} from "../../../../views/production/paiements/cotisation/PaiementCotisationDtos";


const prelevementCotisationSlice = createSlice({
        name: "prelevementCotisation",
        initialState: {loading: false, prelevements: {}, error: '', key: '', page: 0, size: 5,
            currentCotisation: {}, prelevementDto: initialPrelevementDto, formMode: FormMode.NEW,
            formOpened: false, currentDefautPrelevement: {}, currentDocument: initialDocument,
            activeStepToZero: true
        },
        reducers:
            {
                keyChanged: (state, action) =>
                {
                    state.key = action.payload
                },
                pageChanged: (state, action) =>
                {
                    state.page = action.payload
                },
                sizeChanged: (state, action) =>
                {
                    state.size = action.payload
                },
                searchPending:(state)=>
                {
                    state.isLoading = true;
                    state.error = '';
                },
                searchFulfilled:(state, action)=>
                {
                    state.isLoading = false;
                    state.paiements = action.payload
                    state.error = '';
                },
                searchFailed:(state, action)=>
                {
                    state.isLoading = false;
                    state.error = action.payload;
                },
                createFormOpened: (state, action)=>
                {
                    state.formOpened = true;
                    state.formMode = FormMode.NEW
                    state.currentCotisation = action.payload
                },
                createFormClosed: (state)=>
                {
                    state.formOpened = false;
                },
                documentAdded: (state, action)=>
                {
                    if(!state.prelevementDto.docs) state.prelevementDto.docs = [];
                    state.prelevementDto.docs.push(action.payload);
                    state.currentDocument = initialDocument
                },
                documentRemoved: (state, action)=>
                {
                    const index = action.payload
                    state.prelevementDto.docs.splice(index, 1)
                },
                documentModified: (state, action)=>
                {
                    const index = action.payload.index;
                    const document = action.payload.document;
                    state.currentDocument = document
                    state.prelevementDto.docs.splice(index, 1)
                },
                currentDocInput: (state, action)=>
                {
                    state.currentDocument = action.payload
                },
                prelevementDtoChanged: (state, action)=>
                {
                    state.prelevementDto = action.payload
                },
                defautPrelevementAdded: (state, action)=>
                {
                    const newDefaut = action.payload;
                    const index = state.prelevementDto.defautPrelevements.findIndex(defaut => defaut.adhesionId === newDefaut.adhesionId);
                    if(index == -1) state.prelevementDto.defautPrelevements.push(newDefaut)
                    else state.prelevementDto.defautPrelevements[index] = newDefaut

                    state.currentDefautPrelevement = {adhesionId: 0, membre: '', motifDefaut: ''}
                },
                defautPrelevementRemoved: (state, action)=>
                {
                    const index = action.payload
                    state.prelevementDto.defautPrelevements.splice(index, 1)
                },
                defautPrelevementModified: (state, action)=>
                {
                    const index = action.payload.index;
                    const defautPrelevement = action.payload.defautPrelevement;
                    state.currentDefautPrelevement = defautPrelevement
                    state.prelevementDto.defautPrelevements.splice(index, 1)
                },
                currentDefautPrelementChanged: (state, action)=>
                {
                    state.currentDefautPrelevement = action.payload
                },
                formReinitialized: (state)=>
                {
                    state.prelevementDto = initialPrelevementDto
                }
            }
    })
const prelevementCotisationReducer = prelevementCotisationSlice.reducer;
export  default prelevementCotisationReducer;
export const prelevementCotisationActions= prelevementCotisationSlice.actions;