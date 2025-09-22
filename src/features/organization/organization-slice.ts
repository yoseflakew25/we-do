import { OrganizationProfile } from '@/app/api/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface OrganizationProfileState {
  profile: OrganizationProfile;
  isLoading: boolean;
  error?: string;
  isEditing: boolean;
}

const initialState: OrganizationProfileState = {
  profile: {
    id: '',
    orgName: '',
    shortHandName: '',
    oldName: '',
    location: '',
    ngoType: '',
    year: 0,
    orgArea: [],
    primaryPhone: '',
    secondaryPhone: '',
    email: '',
    description: '',
    vission: '',
    mission: '',
    futurePlan: '',
    website: '',
    linkedIn: '',
    instagram: '',
    facebook: '',
    telegram: '',
    whatsapp: '',
    LogoUrl: '',
    oppCount: 0,
    viewsCount: 0,
    credentials: {},
    files: [],
    total_reviews: 0,
    average_rating: 0,
    average_response_time: 0,
    orgType: '',
    bankInfo: [{ bankName: '', bankAccount: '' }],
    donateWebsite: '',
    interestStatus: '',
  },
  isLoading: false,
  isEditing: false,
};

export const organizationProfileSlice = createSlice({
  name: 'organizationProfile',
  initialState,
  reducers: {
    getProfileStart: (state) => {
      state.isLoading = true;
    },
    setCurrentOrgProfile(state, action: PayloadAction<OrganizationProfile>) {
      state.profile = action.payload;
    },
  },
});

export const { getProfileStart, setCurrentOrgProfile } =
  organizationProfileSlice.actions;

export default organizationProfileSlice.reducer;
