import {createSlice} from '@reduxjs/toolkit'
import {FormMode} from "../../../../enums/FormMode";
import {InitialCreateRoleDTO} from "../../../../views/administration/security/roles/RoleTypes";

const currentRole = {}

//this is a slice. How do i get the value of roles state in the roleUpdated reducer function ?
const roleSlice = createSlice(
    {
    name: "role",
    initialState: {loading: false, roles: {}, error: '', key: '', page: 0, size: 5,
        formMode: FormMode.NEW, currentRole: currentRole, formOpened: false},
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
            state.roles = action.payload
            state.error = '';
        },
        searchFailed:(state, action)=>
        {
            state.isLoading = false;
            state.error = action.payload;
            alert(action.payload);
        },
        formOpened: (state, action)=>
        {
            state.formOpened = true;
            state.currentRole = action.payload.currentRole
            state.formMode = action.payload.formMode
        },
        formClosed: (state)=>
        {
            state.formOpened = false;
            state.currentRole = InitialCreateRoleDTO
        },
        roleUpdated: (state, action)=>
        {
            const roles = state.roles.content;
            console.log('action', action)
            console.log('roles', roles)

            state.roles = replaceRoleByCode(roles, action.payload);
        }
    }
})

const replaceRoleByCode = (roles, newRole) => {

    return roles.map(role => {
        if (role.roleCode === newRole.roleCode) {
            return newRole; // Replace with new object
        } else {
            return role; // Keep the original object
        }
    });
}
const roleReducer = roleSlice.reducer;
export  default roleReducer;

export const roleActions = roleSlice.actions;

