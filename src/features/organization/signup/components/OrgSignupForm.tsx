'use client';

import OrgNavbar from './OrgNavbar';
import { useFormState } from './OrgSignupFormContext';
import { AboutOrgForm } from './about/AboutOrgForm';
import OrgDetailsForm from './details/OrgDetailsForm';
import Review from './review/Review';
import ThreeStageStepper from '@/components/steppers/ThreeStageStepper';
import React from 'react';

const OrgSignupForm: React.FC = () => {
  const { step } = useFormState();

  return (
    <div className=' font-epilogue'>
      {/* Navbar Component */}
      <OrgNavbar />

      <div className='container mx-auto'>
        <div className='px-3 '>
          {/* Stepper Component */}

          <ThreeStageStepper />

          {step === 1 ? <OrgDetailsForm /> : null}
          {step === 2 ? <AboutOrgForm /> : null}
          {step === 3 ? <Review /> : null}
        </div>
      </div>
    </div>
  );
};

export default OrgSignupForm;
