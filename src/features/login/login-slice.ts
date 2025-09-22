import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  userInfo: {}, // for user object
  userToken: null, // for storing the JWT
  error: null,
  success: false, // for monitoring the registration process.
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logIn: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});
export const { logIn } = loginSlice.actions;

export default loginSlice.reducer;
