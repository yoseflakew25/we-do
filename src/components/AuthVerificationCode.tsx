'use client';

import LoadingButton from './buttons/LoadingButton';
import {
  useResendOTPMutation,
  useVerifyEmailMutation,
} from '@/app/api/slices/api-slice';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

//Props interface for the EmailVerificationCodeInput component
interface EmailVerificationCodeInputProps {
  title: string;
  description: string;
}

interface UserData {
  name: string;
  email: string;
  password: string;
  role: string;
  // Add other fields if needed
}

// Initialize a variable to keep track of the currently active OTP
let currentOTPIndex: number = 0;

const AuthVerificationCode: React.FC<EmailVerificationCodeInputProps> = ({
  title,
  description,
}) => {
  const router = useRouter();
  // State variable to store the email retrieved from localStorage
  const [userEmail, setUserEmail] = useState<string | null>(null);
  // State variable to store the password retrieved from localStorage
  const [userPassword, setUserPassword] = useState<string | null>(null);

  const [verifyEmail] = useVerifyEmailMutation();
  const [resendOTP] = useResendOTPMutation();

  // Retrieve the email from localStorage on component mount
  useEffect(() => {
    const userDataString = localStorage.getItem('user');
    // const userDataString = useSelector((state: RootState) => state.signup.user);
    if (userDataString) {
      const parsedUserData = JSON.parse(userDataString) as UserData;
      setUserEmail(parsedUserData.email);
      setUserPassword(parsedUserData.password);
    }
  }, []);

  //Define state variables for OTP input and the active OTP digit
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(''));
  const [activeOTPIndex, setActiveOTPIndex] = useState<number>(0);

  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number | null>(30);

  const [isResendEnabled, setIsResendEnabled] = useState<boolean>(false);

  // Create a reference to the OTP input element
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle the change event when a digit in the OTP input changes
  const handleOnChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = target;
    const newOTP: string[] = [...otp];

    // Update the OTP array with the entered digit
    newOTP[currentOTPIndex] = value.substring(value.length - 1);

    // Update the active OTP digit index based on input
    if (!value) setActiveOTPIndex(currentOTPIndex - 1);
    else setActiveOTPIndex(currentOTPIndex + 1);

    // Update the OTP state with the new digit
    setOtp(newOTP);
  };

  // Handle the key down event, especially the Backspace key, to navigate and delete digits
  const handleOnKeyDown = (
    { key }: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    currentOTPIndex = index;

    // If the Backspace key is pressed and there's an active digit to the left, move back
    if (key === 'Backspace' && currentOTPIndex >= 0) {
      setActiveOTPIndex(currentOTPIndex - 1);
    }
  };

  // Use an effect to focus on the input corresponding to the active OTP digit
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

  // Use an effect to check if all OTP fields are filled and enable the button
  useEffect(() => {
    const areAllFieldsFilled = otp.every((digit) => digit !== '');
    setIsButtonEnabled(areAllFieldsFilled);
  }, [otp]);

  // Use an effect to handle the resend timer
  useEffect(() => {
    if (resendTimer === 0) {
      // When timer reaches 00:00, enable "Resend code"
      setIsResendEnabled(true);
    } else {
      // Start the timer when the component is mounted
      const timerInterval = setInterval(() => {
        if (resendTimer && resendTimer > 0) {
          setResendTimer(resendTimer - 1);
        } else {
          clearInterval(timerInterval); // Clear the timer when it reaches 00:00
          setIsResendEnabled(true); // Enable "Resend code" when timer reaches 00:00
        }
      }, 1000);

      return () => clearInterval(timerInterval); // Cleanup on unmount
    }
  }, [resendTimer]);

  const [loading, setLoading] = useState(false);
  // Handle button click event here
  const handleButtonClick = async () => {
    setLoading(true);
    toast.dismiss();
    if (isButtonEnabled && userEmail) {
      const otpCode = otp.join(''); // Convert OTP array to a string
      const requestData = {
        email: userEmail,
        otp: otpCode,
      };
      await verifyEmail(requestData)
        .unwrap()
        .then(async () => {
          await signIn('credentials', {
            email: userEmail,
            password: userPassword,
            callbackUrl: '/',
            redirect: false,
          });
          setOtp(new Array(4).fill(''));
          setActiveOTPIndex(0);
          toast.success('Your email is verified!', {
            theme: 'light',
          });
          router.push('/');
        })
        .catch(({ data: errorData }) => {
          toast.error(errorData.message, {
            autoClose: false,
            theme: 'light',
          });
          setOtp(new Array(4).fill(''));
          setActiveOTPIndex(0);
        });
    }
    setLoading(false);
  };

  // Handle "Resend code" click event
  const handleResendClick = async () => {
    if (isResendEnabled && userEmail) {
      const requestBody = {
        email: userEmail,
      };
      // Disable "Resend code" when it's clicked
      await resendOTP(requestBody)
        .unwrap()
        .then(() => {
          setResendTimer(30);
          setIsResendEnabled(false);
          toast.success('OTP has been resent.', {
            theme: 'light',
          });
        })
        .catch(({ data: errorData }) => {
          toast.error(errorData.message, {
            autoClose: false,
            theme: 'light',
          });
        });
    }
  };

  return (
    <div className='container flex flex-col items-center justify-center h-screen max-w-lg'>
      <div className=' md:hidden p-2 text-center pb-10'>
        <img src='/assets/akil-logo.png' className='h-12 mx-auto' alt='logo' />
      </div>
      <div className='flex flex-col justify-center items-center'>
        <p className='text-3xl font-poppins font-black text-[#25324B] pb-10'>
          {title}
        </p>
        <p className='text-center px-10 xl:px-20 text-[#7C8493] font-epilogue text-sm'>
          {description}
        </p>
      </div>
      {/* OTP Input */}
      <div className='flex justify-center items-center space-x-7 pt-8 px-8 pb-4 md:pt-16 md:px-16 md:pb-8'>
        {otp.map((_, index) => {
          const isEmpty = otp[index] === '';
          return (
            <React.Fragment key={index}>
              <input
                ref={index === activeOTPIndex ? inputRef : null}
                type='number'
                onChange={handleOnChange}
                onKeyDown={(e) => handleOnKeyDown(e, index)}
                value={otp[index]}
                onClick={async () => {
                  const copiedText = await navigator.clipboard.readText();
                  if (
                    /^\d{4}$/.test(copiedText) &&
                    otp.every((digit) => digit == '')
                  ) {
                    setOtp(copiedText.split(''));
                  }
                }}
                placeholder='-'
                className={`w-14 h-11 sm:w-16 sm:h-12 border-2 rounded-lg outline-none text-center font-semibold text-xl border-primary focus:border-[#C4897B] focus:text-gray-800 text-gray-600 transition spin-button-none ${
                  isEmpty ? 'opacity-50' : '' // Apply opacity for empty fields
                }`}
              />
            </React.Fragment>
          );
        })}
      </div>
      <div className='text-center  text-[#7C8493] font-epilogue text-sm px-14 md:pb-16 pb-8'>
        You can request to{' '}
        <span
          className={`${
            isResendEnabled
              ? 'text-bgPrimary cursor-pointer'
              : 'text-bgPrimary cursor-not-allowed'
          }`}
          onClick={handleResendClick}
        >
          Resend code
        </span>{' '}
        {resendTimer !== null ? (
          <>
            in{' '}
            <span className='text-bgPrimary'>
              {`${Math.floor((resendTimer || 0) / 60)
                .toString()
                .padStart(2, '0')}:${((resendTimer || 0) % 60)
                .toString()
                .padStart(2, '0')}`}
            </span>
          </>
        ) : (
          <>infinite time</>
        )}
      </div>
      {/* Button */}
      <div>
        <LoadingButton
          className='rounded-full bg-primary'
          fullWidth
          loading={loading}
          color='amber'
          size='lg'
          disabled={!isButtonEnabled}
          onClick={handleButtonClick}
        >
          Verify
        </LoadingButton>
      </div>
    </div>
  );
};

export default AuthVerificationCode;
