import {createSlice} from '@reduxjs/toolkit'
import {initialCreateMembreDTO, initialUpdateMembreDTO} from "../../../../views/production/membres/MembreDtos";
import {FormMode} from "../../../../enums/FormMode";


const membresSlice = createSlice({
        name: "paiementCotisation",
        initialState: {loading: false, membres: {}, error: '', key: '', page: 0, size: 5,
            currentCreateMembreDTO: initialCreateMembreDTO, currentUpdateDTO: initialUpdateMembreDTO,
            currentProfile: {},
            formMode: FormMode.NEW, formOpened: false,
            createMembreFormOpened: false,
            updateMembreFormOpened: false
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
                    state.membres = action.payload
                    state.error = '';
                },
                searchFailed:(state, action)=>
                {
                    state.isLoading = false;
                    state.error = action.payload;
                },
                createFormOpened: (state)=>
                {

                    state.formOpened = true;
                    state.formMode = FormMode.NEW
                    state.currentCreateDTO = initialCreateMembreDTO
                },
                createFormClosed: (state)=>
                {
                    state.formOpened = false;
                    state.currentCreateDTO = initialCreateMembreDTO
                },
                currentUpdateDTOChanged: (state, action)=>
                {
                    state.currentUpdateDTO = action.payload;
                },
                updateFormOpened: (state, action)=>
                {
                    console.log("New form should open...")
                    state.formOpened = true;
                    state.formMode = FormMode.UPDATE
                    state.currentUpdateDTO = action.payload
                },
                updateFormClosed: (state)=>
                {
                    state.formOpened = false;
                    state.formMode = FormMode.NEW;
                    state.currentUpdateDTO = initialUpdateMembreDTO;
                },
                profileButtonClicked: (state, action)=>
                {
                    state.currentProfile = action.payload;
                }
            }
    })
const membreReducer = membresSlice.reducer;
export  default membreReducer;
export const membreActions= membresSlice.actions;