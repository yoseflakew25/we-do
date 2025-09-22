import { VolunteerProfileData } from '@/app/api/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProfileState {
  profile: VolunteerProfileData;
}

const initialState: ProfileState = {
  profile: {
    userID: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    birthYear: '',
    resumeURL: '',
    linkedIn: '',
    skills: [],
    aboutMe: '',
    profilePicUrl: '',
    profile_status: '',
    is_interested: false,
    visibility: '',
    is_connected: false,
    currentPosition: '',
    twitter: '',
    website: '',
    photo: undefined,
    file: undefined,
    resumeFile: {
      filePath: '',
      fileSize: 0,
      fileURL: '',
    },
    languages: [],
    privacyConsent: false,
    profileCompletePercentage: 0,
  },
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<VolunteerProfileData>) {
      state.profile = action.payload;
    },
    updateProfile(state, action: PayloadAction<Partial<VolunteerProfileData>>) {
      state.profile = { ...state.profile, ...action.payload };
    },
  },
});

export const { setProfile, updateProfile } = profileSlice.actions;
export default profileSlice.reducer;
