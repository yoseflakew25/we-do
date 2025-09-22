'use client';

import {
  useResetPasswordMutation,
  useForgotPasswordMutation,
} from '@/app/api/slices/api-slice';
import {
  ForgotPasswordFormData,
  ForgotPasswordSchema,
  ResetPasswordFormData,
  ResetPasswordSchema,
} from '@/app/api/types';
import AuthLeftSection from '@/components/AuthLeftSection';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import LoadingButton from '@/components/buttons/LoadingButton';
import AllFormErrorsAlert from '@/components/forms/AllFormErrorsAlert';
import { InputField } from '@/components/forms/ValidatedInputs';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconButton } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

let currentOTPIndex: number = 0;
export const ForgotPassword = () => {
  const t = useTranslations('ForgotPasswordPage');
  const translateValidation = useTranslations('validationErrors');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState(''); // State to store the user's email
  const { replace } = useRouter();
  const [otp, setOtp] = useState(['', '', '', '']); // Initialize OTP state
  const [activeOTPIndex, setActiveOTPIndex] = useState<number>(0);
  // Create a reference to the OTP input element
  const inputRef = useRef<HTMLInputElement>(null);

  // Use an effect to focus on the input corresponding to the active OTP digit
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

  const {
    register: forgotPasswordRegister,
    handleSubmit: forgotPasswordSubmit,
    formState: { errors: forgotPasswordErrors },
  } = useForm<ForgotPasswordFormData>({
    mode: 'onTouched',
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const {
    register: resetPasswordRegister,
    handleSubmit: resetPasswordSubmit,
    formState: { errors: resetPasswordErrors },
    setValue,
  } = useForm<ResetPasswordFormData>({
    mode: 'onTouched',
    resolver: zodResolver(ResetPasswordSchema),
  });

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
    setValue('otp', newOTP.join(''));
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
  const [forgotPassword] = useForgotPasswordMutation();
  const [resetPassword] = useResetPasswordMutation();
  const handleForgotPasswordSubmit: SubmitHandler<
    ForgotPasswordFormData
  > = async (data) => {
    setLoading(true);
    setEmail(data.email);
    await forgotPassword(data)
      .unwrap()
      .then(() => {
        toast.success('OTP has been sent to your email.', {
          theme: 'light',
        });
        setSuccess(true);
      })
      .catch(({ data: errorData }) => {
        toast.error(errorData.message, {
          autoClose: false,
          theme: 'light',
        });
      });
    setLoading(false);
  };

  const handleResetPasswordSubmit: SubmitHandler<
    ResetPasswordFormData
  > = async (data) => {
    setLoading(true);

    const requestData = {
      email, // Include the saved email
      ...data,
    };

    await resetPassword(requestData)
      .unwrap()
      .then(() => {
        replace('/login');
        toast.success('Password has been reset successfully.', {
          theme: 'light',
        });
      })
      .catch(({ data: errorData }) => {
        toast.error(errorData.message, {
          autoClose: false,
          theme: 'light',
        });
      });
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  return (
    <div className='md:grid md:grid-cols-2 font-epilogue flex h-screen'
    style={{
      background: "#ffffff",
      backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.35) 1px, transparent 0)",
      backgroundSize: "20px 20px",
    }}
    >
      {/* Left Side */}
      <div className='hidden md:block left-section'>
        <AuthLeftSection />
      </div>

      {/* Rigth side */}
      <div className='absolute top-0 right-0 my-4 mx-4'>
        <LocaleSwitcher />
      </div>
      <div className='container my-auto flex flex-col justify-center px-10 py-10 max-w-lg'>
        <div className=' md:hidden p-2 text-center pb-10'>
          <Image
            width={200}
            height={200}
            src='/assets/akil-logo.png'
            className='h-12 mx-auto'
            alt='logo'
          />
        </div>

        {success ? (
          <div>
            <h2 className='text-center title font-black text-3xl font-poppins p-4 text-[#25324B]'>
              {t('resetPassword.title')}
            </h2>
            <p className='text-center text-[#7C8493]'>
              {t('resetPassword.verificationMessage')}
            </p>
            <form
              action=''
              onSubmit={resetPasswordSubmit(handleResetPasswordSubmit)}
            >
              <div>
                <label
                  className='block text-neutrals80 text-base font-semibold pt-6'
                  htmlFor='otp'
                >
                  {t('resetPassword.otpFieldLabel')}
                </label>
                <div className='flex justify-center items-center space-x-7 px-8 mb-2'>
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
                            const copiedText =
                              await navigator.clipboard.readText();
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
                <div className='mb-2'>
                  <label
                    className='block text-neutrals80 text-base font-semibold mb-1'
                    htmlFor='password'
                  >
                    {t('resetPassword.newPasswordFieldLabel')}
                  </label>
                  <InputField
                    name={'password'}
                    type={showPassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
                    register={resetPasswordRegister}
                    crossOrigin={undefined}
                    message={
                      resetPasswordErrors.password?.message
                        ? translateValidation(
                            `${resetPasswordErrors.password?.message}`
                          )
                        : resetPasswordErrors.password?.message
                    }
                    placeholder={t('resetPassword.newPasswordFieldPlaceholder')}
                    required
                    icon={
                      <IconButton
                        className='-mt-2.5 -ml-2 rounded-l-none text-bgPrimary'
                        variant='text'
                        color='amber'
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <FaEyeSlash size={18} />
                        ) : (
                          <FaEye size={18} />
                        )}
                      </IconButton>
                    }
                  />
                </div>

                <div className='mb-2'>
                  <label
                    className='block text-neutrals80 text-base font-semibold mb-1'
                    htmlFor='confirmPassword'
                  >
                    {t('resetPassword.confirmPasswordFieldLabel')}
                  </label>
                  <InputField
                    name={'confirmPassword'}
                    type={showConfirmPassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
                    register={resetPasswordRegister}
                    crossOrigin={undefined}
                    message={
                      resetPasswordErrors.confirmPassword?.message
                        ? translateValidation(
                            `${resetPasswordErrors.confirmPassword?.message}`
                          )
                        : resetPasswordErrors.confirmPassword?.message
                    }
                    placeholder={t(
                      'resetPassword.confirmPasswordFieldPlaceholder'
                    )}
                    required
                    icon={
                      <IconButton
                        className='-mt-2.5 -ml-2 rounded-l-none text-bgPrimary'
                        variant='text'
                        color='amber'
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash size={18} />
                        ) : (
                          <FaEye size={18} />
                        )}
                      </IconButton>
                    }
                  />
                </div>
              </div>
              <div>
                <LoadingButton
                  size='lg'
                  className='rounded-full bg-primary my-2 text-white'
                  type='submit'
                  fullWidth
                  loading={loading}
                  color='amber'
                >
                  {t('resetPassword.continue')}
                </LoadingButton>
              </div>
              <AllFormErrorsAlert
                errors={resetPasswordErrors}
              ></AllFormErrorsAlert>
            </form>
          </div>
        ) : (
          <div>
            <h2 className='text-center title font-black text-3xl font-poppins p-4 text-[#25324B]'>
              {t('title')}
            </h2>
            <p className='text-[#7C8493]'>{t('message')}</p>
            <form
              onSubmit={forgotPasswordSubmit(handleForgotPasswordSubmit)}
              className='form h-[50%] w-full flex flex-col justify-around'
            >
              <div className='py-6'>
                <label
                  className='block text-neutrals80 text-base font-semibold mb-1'
                  htmlFor='email'
                >
                  {t('emailAddressLabel')}
                </label>

                <InputField
                  name={'email'}
                  type='email'
                  register={forgotPasswordRegister}
                  crossOrigin={undefined}
                  message={
                    forgotPasswordErrors.email?.message
                      ? translateValidation(
                          `${forgotPasswordErrors.email?.message}`
                        )
                      : forgotPasswordErrors.email?.message
                  }
                  placeholder={t('emailAddressPlaceholder')}
                  required
                />
              </div>
              <div>
                <LoadingButton
                  size='lg'
                  className='rounded-full bg-primary my-2 text-white'
                  type='submit'
                  fullWidth
                  loading={loading}
                  color='amber'
                >
                  {t('continue')}
                </LoadingButton>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
export default ForgotPassword;
