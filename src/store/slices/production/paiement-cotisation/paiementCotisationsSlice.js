import {createSlice, current} from '@reduxjs/toolkit'
import {initialCreateMembreDTO, initialUpdateMembreDTO} from "../../../../views/production/membres/MembreDtos";
import {FormMode} from "../../../../enums/FormMode";
import {
    initialCreatePaiementCotisationDTO,
    initialDocument
} from "../../../../views/production/paiements/cotisation/PaiementCotisationDtos";


const paiementCotisationsSlice = createSlice({
        name: "paiementCotisation",
        initialState: {loading: false, paiements: {}, error: '', key: '', page: 0, size: 5,
             currentCotisation: {}, selectedAdhesionId: null, montantVersement: 0, modePaiementCode: null,
            formMode: FormMode.NEW, formOpened: false, currentDocument: initialDocument, documents: []
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
                selectedAdhesionChanged: (state, action)=>
                {
                    state.selectedAdhesionId = action.payload
                },
                montantVersementChanged: (state, action)=>
                {
                    state.montantVersement = action.payload
                },
                modePaiementChanged: (state, action)=>
                {
                    state.modePaiementCode = action.payload
                },
                documentAdded: (state, action)=>
                {
                    state.documents.push(action.payload);
                    state.currentDocument = initialDocument
                },
                documentRemoved: (state, action)=>
                {
                    const index = action.payload
                    state.documents.splice(index, 1)
                },
                documentModified: (state, action)=>
                {
                    const index = action.payload.index;
                    const document = action.payload.document;
                    state.currentDocument = document
                    state.documents.splice(index, 1)
                },
                currentDocInput: (state, action)=>
                {
                    state.currentDocument = action.payload
                },
                newPaiementClicked:(state, action)=>
                {
                    state.documents = [];
                    state.currentDocument = initialDocument;
                }
            }
    })
const paiementCotisationReducer = paiementCotisationsSlice.reducer;
export  default paiementCotisationReducer;
export const paiementCotisationActions= paiementCotisationsSlice.actions;