import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../types";

const authSlice = createSlice({
  name: "token",
  initialState: {
    userToken: "",
  },
  reducers: {
    setUserToken: (state, { payload }) => {
      state.userToken = payload;
    },
    removeUserToken: (state) => {
      state.userToken = "";
    },
  },
});

//helper for useSelector
export const userTokenHelper = (state:RootState) => state.authToken.userToken;

//action for using dispatch
export const { setUserToken, removeUserToken } = authSlice.actions;

//reducer for authSlice
export default authSlice.reducer;
