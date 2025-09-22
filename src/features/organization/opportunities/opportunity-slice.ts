import { OpportunityFormData } from '@/app/api/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface OpportunityState {
  opportunity: OpportunityFormData;
  step: number;
}
const initialState: OpportunityState = {
  opportunity: {
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    idealCandidate: '',
    categories: [],
    isPaid: true,
    engagementType: '',
    opType: '',
    startDate: null,
    endDate: null,
    deadline: null,
    paymentOption: {
      min: '',
      max: '',
      amount: '',
      currency: '',
      paymentType: '',
      rangePayment: '',
    },
    location: [],
    requiredSkills: [],
    whenAndWhere: '',
    perksAndBenefits: [],
    isRolling: false,
    questions: [],
    visibility: 'public',
    allowedEmails: [],
  },
  step: 1,
};

const opportunitySlice = createSlice({
  name: 'opportunity',
  initialState,
  reducers: {
    setOpportunity(state, action: PayloadAction<OpportunityFormData>) {
      const updatedOpportunity = { ...state.opportunity, ...action.payload };
      state.opportunity = updatedOpportunity;
    },
    handleNext(state) {
      state.step += 1;
    },
    handleBack(state) {
      state.step -= 1;
    },
    setOpportunityToInitialState(state) {
      state.opportunity = initialState.opportunity;
    },
    setStep(state, action: PayloadAction<number>) {
      state.step = action.payload;
    },
  },
});

export const {
  setOpportunity,
  handleBack,
  handleNext,
  setOpportunityToInitialState,
  setStep,
} = opportunitySlice.actions;
export default opportunitySlice.reducer;