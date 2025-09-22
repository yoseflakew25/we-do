import { APIResponse, OpportunityDetail } from '@/app/api/types';
import { createSlice } from '@reduxjs/toolkit';

// Define your initial state
const initialState: APIResponse<OpportunityDetail[]> = {
  data: [],
  success: false,
  message: '',
  profile: undefined,
  applicationsCount: undefined,
};

export const postOpportunitySlice = createSlice({
  name: 'postOpportunity',
  initialState,
  reducers: {
    addToOpportunity(state, action) {
      state.data = action.payload;
    },
  },
});

export const postOpportunityActions = postOpportunitySlice.actions;

export default postOpportunitySlice.reducer;
