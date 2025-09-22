import opportunityDetailReducer from './features/organization/opportunity-detail-slice';
import { apiSlice } from '@/app/api/slices/api-slice';
import ProfileReducer from '@/features/edit-user-profile/profile-slice';
import opportunityReducer from '@/features/organization/opportunities/opportunity-slice';
import orgSideCustomQuestionsReducer from '@/features/organization/org-side-custom-questions-slice';
import organizationProfileReducer from '@/features/organization/organization-slice';
import savedVolunteerPoolReducer from '@/features/organization/saved-volunteer-pool-slice';
import organizationSignupReducer from '@/features/organization/signup/organization-signup-slice';
import orgPoolSlice from '@/features/organization/volunteer-pool/org-volunteer-pool-slice';
import signupReducer from '@/features/signup/signup-slice';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    organizationProfile: organizationProfileReducer,
    organizationSignup: organizationSignupReducer,
    profile: ProfileReducer,
    opportunityDetail: opportunityDetailReducer,
    signup: signupReducer,
    opportunity: opportunityReducer,
    orgPool: orgPoolSlice,
    savedVolunteerPool: savedVolunteerPoolReducer,
    orgSideCustomQuestions: orgSideCustomQuestionsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),

  devTools: process.env.NODE_ENV !== 'production',
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
setupListeners(store.dispatch);
