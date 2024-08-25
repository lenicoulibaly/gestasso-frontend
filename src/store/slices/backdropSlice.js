import {createSlice} from "@reduxjs/toolkit";

const initialState = {open: false}
const backdropSlice = createSlice({
    name: "backdrop",
    initialState: initialState,
    reducers: {
        uiBlocked: (state) => {
            state.open = true
        },
        uiUnBlocked: (state)=>
        {
            state.open = false
        }
    }
})

const backdropReducer = backdropSlice.reducer;
export  default backdropReducer;
export const backdropActions = backdropSlice.actions;