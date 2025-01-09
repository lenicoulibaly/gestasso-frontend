import {createSlice} from '@reduxjs/toolkit'
import {FormMode} from "../../../../enums/FormMode";
import {initialDocument} from "../../../../views/production/documents/documentDtos";


const documentSlice = createSlice({
        name: "document",
        initialState: {loading: false, documents: [], error: '', key: '', page: 0, size: 5,
             currentDocToUpdate: {},
            formMode: FormMode.NEW, formOpened: false
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
                },
                createFormClosed: (state)=>
                {
                    state.formOpened = false;
                },
                updateFormOpened: (state, action)=>
                {
                    state.formOpened = true;
                    state.formMode = FormMode.UPDATE
                    state.currentDocToUpdate = action.payload
                },
                updateFormClosed: (state)=>
                {
                    state.formOpened = false;
                    state.currentDocToUpdate = initialDocument
                },
                currentDocumentModified: (state, action)=>
                {
                    state.currentDocToUpdate = action.payload
                }
            }
    })
const documentReducer = documentSlice.reducer;
export  default documentReducer;
export const documentActions= documentSlice.actions;