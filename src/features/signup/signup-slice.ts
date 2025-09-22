import { RootState } from '@/store';
import { createSlice } from '@reduxjs/toolkit'
const initialState = {
  user: null,
};


export const signupSlice = createSlice({
    name: 'signup',
    initialState,
    reducers: {
      setUser: (state, action) => {
        state.user = action.payload;
      },
    },
  });
  
export const selectsignup =(state: RootState) => state.signup
export const {setUser} = signupSlice.actions
export default signupSlice.reducer;

  
  
  
  