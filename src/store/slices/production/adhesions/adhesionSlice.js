import {createSlice} from '@reduxjs/toolkit'


const adhesionSlice = createSlice({
        name: "adhesion",
        initialState: {loading: false, adhesions: {}, error: '', key: '', page: 0, size: 5,
            currentCreateAdhesionDTO: initialCreateAdhesionDTO, currentUpdateAdhesionDTO: initialUpdateAdhesionDTO,
            createAdhesionFormOpened: false,
            updateAdhesionFormOpened: false
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
                    state.adhesions = action.payload
                    state.error = '';
                },
                searchFailed:(state, action)=>
                {
                    state.isLoading = false;
                    state.error = action.payload;
                },
                createAdhesionFormOpened: (state, action)=>
                {
                    state.createAdhesionFormOpened = true;
                    state.currentCreateAdhesionDTO = initialCreateAdhesionDTO
                },
                createAdhesionFormClosed: (state)=>
                {
                    state.createAdhesionFormOpened = false;
                    state.currentCreateAdhesionDTO = initialCreateAdhesionDTO
                },
                currentUpdateAdhesionDTOChanged: (state, action)=>
                {
                    state.currentUpdateAdhesionDTO = action.payload;
                },
                updateAdhesionFormOpened: (state, action)=>
                {
                    state.updateAdhesionFormOpened = true;
                    state.currentUpdateAdhesionDTO = action.payload
                },
                updateAdhesionFormClosed: (state)=>
                {
                    state.updateAdhesionFormOpened = false;
                    state.currentUpdateAdhesionDTO = initialUpdateAdhesionDTO
                }
            }
    })
const adhesionReducer = adhesionSlice.reducer;
export  default adhesionReducer;
export const adhesionActions= adhesionSlice.actions;