import { createSlice } from "@reduxjs/toolkit";

import {
  createUserAsync,
  loginUserAsync,
  signOutAsync,
} from "@/lib/features/auth/auth-async-thunk";
import { AuthState } from "@/types/redux-slice/auth/auth.slice.type";

const initialState: AuthState = {
  loggedInUserToken: null,
  status: "idle",
  error: null,
};

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    increment: (state) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUserToken = action.payload;
      })
      .addCase(loginUserAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUserToken = action.payload;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })

      .addCase(signOutAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signOutAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUserToken = null;
      });
  },
});
export const { increment } = authSlice.actions;
export const selectLoggedInUser = (state: { auth: AuthState }) =>
  state.auth.loggedInUserToken;
export const selectError = (state: { auth: AuthState }) => state.auth.error;

export default authSlice.reducer;
