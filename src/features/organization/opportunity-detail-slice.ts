import { OpportunityDetail } from '@/app/api/types';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface OpportunityDetailState {
  opportunity: OpportunityDetail;
}

const initialState: OpportunityDetailState = {
  opportunity: {
    id: '',
    title: '',
    description: '',
    responsibilities: '',
    requirements: '',
    idealCandidate: '',
    categories: [],
    opType: '',
    engagementType: '',
    paymentOption: {
      min: '',
      max: '',
      amount: '',
      currency: '',
      paymentType: '',
      rangePayment: '',
    },
    startDate: new Date(),
    endDate: new Date(),
    deadline: new Date(),
    location: [],
    requiredSkills: [],
    whenAndWhere: '',
    datePosted: '',
    status: 'open',
    applicantsCount: 0,
    orgID: '',
    orgName: '',
    orgEmail: '',
    logoUrl: '',
    perksAndBenefits: [],
    isRolling: false,
    isBookmarked: false,
    questions: [],
    total_reviews: 0,
    average_rating: 0,
    isPaid: false,
    visibility: 'public',
    allowedEmails: [],
  },
};

const opportunityDetailSlice = createSlice({
  name: 'opportunityDetail',
  initialState,
  reducers: {
    setOpportunity(state, action: PayloadAction<OpportunityDetail>) {
      state.opportunity = action.payload;
    },
  },
});

export const { setOpportunity } = opportunityDetailSlice.actions;

export default opportunityDetailSlice.reducer;
