import {createSlice} from '@reduxjs/toolkit'
import {
    initialCreateUserAndFunctionDTO,
    initialReadUserDTO
} from "../../../../views/administration/security/users/UserDtos";
import {initialCreateFncDTO} from "../../../../views/administration/security/functions/FncDtos";

const userSlice = createSlice({
        name: "user",
        initialState: {loading: false, users: {}, error: '', key: '', page: 0, size: 5,
            currentUser: initialReadUserDTO, newStartsAt: null, newEndsAt: null, updStartsAt: null, updEndsAt: null,

            currentCreateUserAndFncsDTO: initialCreateUserAndFunctionDTO,
            currentUserAndFncs: initialCreateUserAndFunctionDTO
            /*
            currentCreateFncDTO: initialCreateFncDTO,
            formOpened: false, updFormOpened: false,
            fncsList: [],
            fncsListDialogOpened: false,
            updateFncFormOpened: true,
            currentFncToUpdate: {},*/
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
                formOpened: (state, action)=>
                {
                    state.formOpened = true;
                    state.currentUser = action.payload.currentUser
                    state.currentUserAndFncs = initialCreateUserAndFunctionDTO
                    state.formMode = action.payload.formMode
                },
                formClosed: (state)=>
                {
                    state.formOpened = false;
                    state.currentUser = initialReadUserDTO
                    state.currentUserAndFncs = initialCreateUserAndFunctionDTO
                },
                currentUserChanged: (state, action)=>
                {
                    state.currentUser = action.payload;
                },
                updFormOpened: (state, action)=>
                {
                    state.updFormOpened = true;
                    state.currentUser = action.payload.currentUser
                    state.currentUserAndFncs = action.payload.currentUserAndFncs
                },
                updFormClosed: (state)=>
                {
                    state.updFormOpened = false;
                    state.currentUser = initialReadUserDTO
                    state.currentUserAndFncs = initialCreateUserAndFunctionDTO
                },
                newCreateFncDTOAdded: (state, action)=>
                {
                    state.currentCreateUserAndFncsDTO.createFncDTOS.push(action.payload);
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
                    state.updateFncFormOpened = true;
                    state.currentFncToUpdate = action.payload;
                },
                updateFncFormClosed: (state)=>
                {
                    state.updateFncFormOpened = false;
                    state.fncsList = [];
                }
            }
    })
const userReducer = userSlice.reducer;
export  default userReducer;
export const userActions = userSlice.actions;

