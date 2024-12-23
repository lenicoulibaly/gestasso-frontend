import {createSlice} from '@reduxjs/toolkit'
import {initialCreateMembreDTO, initialUpdateMembreDTO} from "../../../../views/production/membres/MembreDtos";
import {FormMode} from "../../../../enums/FormMode";
import {
    initialCreateCotisationDTO,
    initialUpdateCotisationDTO
} from "../../../../views/production/cotisations/CotisationDtos";

const cotisationsSlice = createSlice({
        name: "cotisation",
        initialState: {loading: false, cotisations: {}, error: '', key: '', page: 0, size: 5,
            currentCreateDTO: initialCreateCotisationDTO, currentUpdateDTO: initialUpdateCotisationDTO,
            currentCotisation: {},
            formMode: FormMode.NEW, formOpened: false,
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
                    state.currentCreateDTO = initialCreateCotisationDTO
                },
                createFormClosed: (state)=>
                {
                    state.formOpened = false;
                    state.currentCreateDTO = initialCreateCotisationDTO
                },
                currentUpdateDTOChanged: (state, action)=>
                {
                    state.currentUpdateDTO = action.payload;
                },
                updateFormOpened: (state, action)=>
                {
                    state.formOpened = true;
                    state.formMode = FormMode.UPDATE
                    state.currentUpdateDTO = action.payload
                },
                updateFormClosed: (state)=>
                {
                    state.formOpened = false;
                    state.formMode = FormMode.NEW;
                    state.currentUpdateDTO = initialUpdateCotisationDTO;
                },
                detailsButtonClicked: (state, action)=>
                {
                    state.currentCotisation = action.payload;
                }
            }
    })
const cotisationReducer = cotisationsSlice.reducer;
export  default cotisationReducer;
export const cotisationActions= cotisationsSlice.actions;