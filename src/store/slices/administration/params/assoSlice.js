import {createSlice} from '@reduxjs/toolkit'

import {initialCreateAssoDTO, initialCreateSectionDTO,
    initialUpdateAssoDTO,
    initialUpdateSectionDTO
} from "../../../../views/administration/parameter/association/AssoDtos";

const assoSlice = createSlice({
        name: "asso",
        initialState: {loading: false, associations: {}, error: '', key: '', page: 0, size: 5,
            currentCreateAssoDTO: initialCreateAssoDTO, currentUpdateAssoDTO: initialUpdateAssoDTO,
            currentUpdateSectionDTO: initialUpdateSectionDTO, createAssoFormOpened: false,
            updateAssoFormOpened: false, newSectionFormOpened: false, updateSectionFormOpened: false
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
                    state.associations = action.payload
                    state.error = '';
                },
                searchFailed:(state, action)=>
                {
                    state.isLoading = false;
                    state.error = action.payload;
                },
                createAssoFormOpened: (state, action)=>
                {
                    state.createAssoFormOpened = true;
                    state.currentCreateAssoDTO = initialCreateAssoDTO
                },
                createAssoFormClosed: (state)=>
                {
                    state.createAssoFormOpened = false;
                    state.currentCreateAssoDTO = initialCreateAssoDTO
                },
                currentUpdateAssoDTOChanged: (state, action)=>
                {
                    state.currentUpdateAssoDTO = action.payload;
                },
                updateAssoFormOpened: (state, action)=>
                {
                    state.updateAssoFormOpened = true;
                    state.currentUpdateAssoDTO = action.payload
                },
                updateAssoFormClosed: (state)=>
                {
                    state.updateAssoFormOpened = false;
                    state.currentUpdateAssoDTO = initialUpdateAssoDTO
                },

                newCreateSectionDTOAdded: (state, action)=>
                {
                    state.currentCreateAssoDTO.createSectionDTOS.push(action.payload);
                },
                createSectionDTORemoved: (state, action)=>
                {
                    state.currentCreateAssoDTO.createSectionDTOS.splice(action.payload, 1);
                },
                createSectionDTOSCleaned: (state)=>
                {
                    state.currentCreateAssoDTO.createSectionDTOS = [];
                },
                createSectionDTOEdited: (state, action)=>
                {
                    state.currentCreateAssoDTO.createSectionDTOS.splice(action.payload, 1);
                },
                addNewSectionFormOpened: (state, action)=>
                {
                    state.newSectionFormOpened = true;
                    state.currentCreateSectionDTO = initialCreateSectionDTO
                },
                addNewSectionFormClosed: (state)=>
                {
                    state.newSectionFormOpened = false;
                    state.currentCreateSectionDTO = initialCreateSectionDTO
                },
                updateSectionFormOpened: (state, action)=>
                {
                    state.updateSectionFormOpened = true
                    state.currentUpdateSectionDTO = action.payload;
                },
                updateSectionFormClosed: (state)=>
                {
                    state.updateSectionFormOpened = false;
                    state.currentUpdateAssoDTO = initialUpdateSectionDTO
                },
            }
    })
const assoReducer = assoSlice.reducer;
export  default assoReducer;
export const assoActions= assoSlice.actions;