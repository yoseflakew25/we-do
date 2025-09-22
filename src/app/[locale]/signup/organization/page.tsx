import OrgSignupForm from '@/features/organization/signup/components/OrgSignupForm';
import { FormProvider } from '@/features/organization/signup/components/OrgSignupFormContext';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'HOOPOE - Organization Registration',
};

function OrgSignup() {
  return (
    <FormProvider>
      <OrgSignupForm />
    </FormProvider>
  );
}

export default OrgSignup;
