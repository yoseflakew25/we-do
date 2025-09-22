import AuthLeftSection from '@/components/AuthLeftSection';
import AuthVerificationCode from '@/components/AuthVerificationCode';
import React from 'react';

const EmailVerification: React.FC = () => {
  return (
    <div className='h-screen md:grid md:grid-cols-2 '>
      <div className='hidden md:block left-section'>
        <AuthLeftSection />
      </div>

      <AuthVerificationCode
        title='Verify Email'
        description="We've sent a verification code to the email address you provided. To complete the verification process, please enter the code here."
      />
    </div>
  );
};

export default EmailVerification;
