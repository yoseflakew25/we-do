import { VolunteerDetail} from '@/app/api/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface OrgPoolState {
  data: VolunteerDetail[] | null;
  success: boolean;
  message: string;
  errors: null | any; 
  loading: boolean;
}

const initialState: OrgPoolState = {
  data: null,
  success: false,
  message: '',
  errors: null,
  loading: false,
};


const orgPoolSlice = createSlice({
  name: 'orgPool',
  initialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.success = false;
      state.message = '';
      state.errors = null;
    },

    bulkAddSuccess(state, action: PayloadAction<VolunteerDetail[]>) {
      state.loading = false;
      state.success = true;
      state.data = action.payload;
      state.message = 'Bulk addition to the pool was successful.';
      state.errors = null;
    },

    bulkAddFailure(state, action: PayloadAction<any>) {
      state.loading = false;
      state.success = false;
      state.errors = action.payload;
      state.message = 'Failed to add users to the pool.';
    },

    addSingleSuccess(state, action: PayloadAction<VolunteerDetail>) {
      state.loading = false;
      state.success = true;
      state.data = state.data
        ? [...state.data, action.payload]
        : [action.payload];
      state.message = 'User added to the pool successfully.';
      state.errors = null;
    },

    addSingleFailure(state, action: PayloadAction<any>) {
      state.loading = false;
      state.success = false;
      state.errors = action.payload;
      state.message = 'Failed to add the user to the pool.';
    },
  },
});


export const {
  requestStart,
  bulkAddSuccess,
  bulkAddFailure,
  addSingleSuccess,
  addSingleFailure,
} = orgPoolSlice.actions;


export default orgPoolSlice.reducer;
