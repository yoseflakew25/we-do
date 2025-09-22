'use client';

import { OpportunityFormData } from '@/app/api/types';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

interface IProps {
  children: ReactNode;
}

interface IFormContext {
  formData: OpportunityFormData;
  setFormData: Dispatch<SetStateAction<OpportunityFormData>>;
  onHandleBack: () => void;
  onHandleNext: () => void;
  onClearSubmit: () => void;
  step: number;
  success: boolean;
  setSuccess: Dispatch<SetStateAction<boolean>>;
}

const emptyPaymentOption = {
  min: '',
  max: '',
  amount: '',
  currency: '',
  paymentType: '',
  rangePayment: '',
};

const emptyFormData: OpportunityFormData = {
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
  paymentOption: emptyPaymentOption, // Initialize paymentOption
  location: [],
  requiredSkills: [],
  whenAndWhere: '',
  perksAndBenefits: [],
  isRolling: false,
  questions: [],
  visibility: 'public',
  allowedEmails: [],
};

const FormContext = createContext<IFormContext>({
  formData: emptyFormData,
  onHandleBack: () => {},
  onHandleNext: () => {},
  setFormData: () => {},
  step: 1,
  onClearSubmit: () => {},
  success: false,
  setSuccess: () => {}, // Added setSuccess function
});

export function FormProvider({ children }: IProps) {
  const [formData, setFormData] = useState<OpportunityFormData>(emptyFormData);
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);

  function onHandleNext() {
    setStep((prev) => prev + 1);
  }

  function onHandleBack() {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  }

  function onClearSubmit() {
    setFormData((prevFormData) => ({ ...prevFormData, ...emptyFormData }));
  }

  return (
    <FormContext.Provider
      value={{
        onHandleBack,
        onHandleNext,
        step,
        formData,
        setFormData,
        onClearSubmit,
        success,
        setSuccess,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormState() {
  return useContext(FormContext);
}
