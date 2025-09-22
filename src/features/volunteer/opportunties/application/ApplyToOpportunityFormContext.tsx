'use client';

import { ApplicationFormData } from '@/app/api/types';
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
  formData: ApplicationFormData;
  setFormData: Dispatch<SetStateAction<ApplicationFormData>>;
  onClearSubmit: () => void;
  success: boolean;
  setSuccess: Dispatch<SetStateAction<boolean>>;
}

const emptyFormData = {
  name: '',
  email: '',
  phone: '',
  currentPosition: '',
  linkedIn: '',
  file: null,
  skills: [],
  languages: [],
  privacyConsent: false,
};

const FormContext = createContext<IFormContext>({
  formData: emptyFormData,
  setFormData: () => {},
  onClearSubmit: () => {},
  success: false,
  setSuccess: () => {},
});

export function FormProvider({ children }: IProps) {
  const [formData, setFormData] = useState<ApplicationFormData>(emptyFormData);
  const [success, setSuccess] = useState(false);

  function onClearSubmit() {
    setFormData((prevFormData) => ({ ...prevFormData, ...emptyFormData }));
  }

  return (
    <FormContext.Provider
      value={{
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
