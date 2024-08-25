import {createSlice} from '@reduxjs/toolkit'
import {
    initialCreateUserAndFunctionDTO,
    initialReadUserDTO
} from "../../../../views/administration/security/users/UserDtos";
import {initialCreateFncDTO, initialUpdateFncDTO} from "../../../../views/administration/security/functions/FncDtos";

const fncSlice = createSlice({
        name: "fnc",
        initialState: {loading: false, error: '', key: '', page: 0, size: 5,
            currentUser: initialReadUserDTO, newStartsAt: null, newEndsAt: null, updStartsAt: null, updEndsAt: null,
            currentCreateFncDTO: initialCreateFncDTO,
            currentCreateUserAndFncsDTO: initialCreateUserAndFunctionDTO,
            createFncDTOS: [],
            newFormOpened: false, updFormOpened: false,
            fncsList: [],
            fncsListDialogOpened: false,
            currentFncToUpdate: {},
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
                    state.users = action.payload
                    state.error = '';
                },
                searchFailed:(state, action)=>
                {
                    state.isLoading = false;
                    state.error = action.payload;
                },
                newFormOpened: (state, action)=>
                {
                    state.newFormOpened = true;
                    state.updFormOpened = false;
                    state.currentUser = action.payload.currentUser
                    state.currentUserAndFncs = initialCreateUserAndFunctionDTO
                    state.currentFncToUpdate = initialUpdateFncDTO
                    state.formMode = action.payload.formMode
                },
                newFormClosed: (state)=>
                {
                    state.newFormOpened = false;
                    state.updFormOpened = false;
                    state.currentUser = initialReadUserDTO
                    state.currentUserAndFncs = initialCreateUserAndFunctionDTO
                },
                updFormOpened: (state, action)=>
                {
                    state.updFormOpened = true;
                    state.newFormOpened = false;
                    state.currentUser = action.payload.currentUser
                    state.currentFncToUpdate = action.payload.currentFncToUpdate;
                    state.currentUserAndFncs = action.payload.currentUserAndFncs
                },
                updFormClosed: (state)=>
                {
                    state.updFormOpened = false;
                    state.newFormOpened = false;
                    state.currentUserAndFncs = initialCreateUserAndFunctionDTO
                },
                newCreateFncDTOAdded: (state, action)=>
                {
                    console.log('action.payload', action.payload)
                    state.currentCreateUserAndFncsDTO.createFncDTOS.push(action.payload);
                    console.log('state.currentCreateUserAndFncsDTO.createFncDTOS', state.currentCreateUserAndFncsDTO.createFncDTOS)
                    state.currentCreateFncDTO = initialCreateFncDTO;
                },
                createFncDTORemoved: (state, action)=>
                {
                    state.currentCreateUserAndFncsDTO.createFncDTOS.splice(action.payload, 1);
                },
                createFncDTOSCleaned: (state)=>
                {
                    state.currentCreateUserAndFncsDTO.createFncDTOS = [];
                },
                createFncDTOEdited: (state, action)=>
                {
                    state.currentCreateUserAndFncsDTO.createFncDTOS.splice(action.payload, 1);
                },
                newUserFormClosed: (state)=>
                {
                    state.currentCreateUserAndFncsDTO = initialCreateUserAndFunctionDTO
                },
                fncsListDialogOpened: (state, action)=>
                {
                    state.fncsListDialogOpened = true;
                    state.fncsList = action.payload.fncsList;
                    state.currentUser = action.payload.currentUser;
                },
                fncsListDialogClosed: (state)=>
                {
                    state.fncsListDialogOpened = false;
                    state.fncsList = [];
                },
                updateFncFormOpened: (state, action)=>
                {
                    state.updFormOpened = true;
                    state.currentFncToUpdate = action.payload;
                },
                updateFncFormClosed: (state)=>
                {
                    state.updFormOpened = false;
                }
            }
    })
const fncReducer = fncSlice.reducer;
export  default fncReducer;

export const fncActions = fncSlice.actions;

