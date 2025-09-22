'use client';

import { OrgFormData } from '@/app/api/types';
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
  formData: OrgFormData;
  setFormData: Dispatch<SetStateAction<OrgFormData>>;
  onHandleBack: () => void;
  onHandleNext: () => void;
  onClearSubmit: () => void;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  success: boolean;
  setSuccess: Dispatch<SetStateAction<boolean>>;
}

const FormContext = createContext<IFormContext>({
  formData: {
    id: undefined,
    orgName: '',
    credentials: {},
    shortHandName: '',
    oldName: '',
    location: '',
    ngoType: '',
    orgType: '',
    year: 0,
    orgArea: [],
    geoLocation: {
      longitude: 0,
      latitude: 0,
    },
    primaryPhone: '',
    secondaryPhone: '',
    email: '',
    file: null,
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
    files: [],
    LogoUrl: '',
    average_response_time: 0,
    bankInfo: [{ bankName: '', bankAccount: '' }],
    donateWebsite: '',
    interestStatus: '',
  },
  onHandleBack: () => {},
  onHandleNext: () => {},
  setFormData: () => {},
  step: 1,
  setStep: () => {},
  onClearSubmit: () => {},
  success: false,
  setSuccess: () => {}, // Added setSuccess function
});

export function FormProvider({ children }: IProps) {
  const [formData, setFormData] = useState<OrgFormData>({
    orgName: '',
    credentials: {},
    shortHandName: '',
    oldName: '',
    location: '',
    ngoType: '',
    orgType: '',
    year: new Date().getFullYear(),
    orgArea: [],
    primaryPhone: '',
    geoLocation: {
      longitude: 0,
      latitude: 0,
    },
    secondaryPhone: '',
    email: '',
    file: null,
    files: [],
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
    average_response_time: 0,
    bankInfo: [{ bankName: '', bankAccount: '' }],
    donateWebsite: '',
    interestStatus: '',
  });
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);

  function onHandleNext() {
    setStep((prev) => prev + 1);
    //   setStep(2);
  }

  function onHandleBack() {
    if (step > 1) {
      setStep((prev) => prev - 1);

      //   setStep(1)
    }
  }
  function onClearSubmit() {
    const data = {
      fullname: '',
      orgName: '',
      shortHandName: '',
      oldName: '',
      location: '',
      ngoType: '',
      orgType: '',
      year: 1800,
      orgArea: [],
      primaryPhone: '',
      geoLocation: {
        longitude: 0,
        latitude: 0,
      },
      secondaryPhone: '',
      email: '',
      file: null,
      files: [],
      credentials: {},
      bankInfo: [{ bankName: '', bankAccount: '' }],
      donateWebsite: '',
    };

    setFormData((prevFormData) => ({ ...prevFormData, ...data }));
  }

  return (
    <FormContext.Provider
      value={{
        onHandleBack,
        onHandleNext,
        step,
        setStep,
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
