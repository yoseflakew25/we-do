import { OrgFormData } from '@/app/api/types';
import { createSlice } from '@reduxjs/toolkit'

// Define your initial state
interface OrgState {
    data: null | OrgFormData;
    success: boolean;
    message: string;
    errors: null | any; // You can define a more specific error type
  }
  
  const initialState: OrgState = {
    data: null,
    success: false,
    message: '',
    errors: null,
  };


export const organizationSignupSlice = createSlice({
    name: 'organizationSignup',
    initialState,
    reducers: {
    },

  });



export default organizationSignupSlice.reducer;