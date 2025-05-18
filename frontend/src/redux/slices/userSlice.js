import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "users",
    initialState: {
         token: localStorage.getItem("token") || null,
    },
    reducers:{
        userlogin(state,action)
        {
            // console.log(action);
            state.token= action.payload;
            //    console.log(state.token);
        }
    }
});

export const { userlogin } = userSlice.actions;
export default userSlice.reducer;

