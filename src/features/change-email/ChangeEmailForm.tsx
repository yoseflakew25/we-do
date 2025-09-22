import {
  useUpdateEmailForOrgUserMutation,
  useVerifyUpdatedEmailForOrgUserMutation,
} from '@/app/api/slices/api-slice';
import {
  UpdateEmailFormData,
  UpdateEmailSchema,
  VerifyUpdatedEmailFormData,
  VerifyUpdatedEmailSchema,
} from '@/app/api/types';
import LoadingButton from '@/components/buttons/LoadingButton';
import AllFormErrorsAlert from '@/components/forms/AllFormErrorsAlert';
import { InputField } from '@/components/forms/ValidatedInputs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export const ChangeEmailForm = () => {
  const t = useTranslations('updateEmailPage');
  const translateValidation = useTranslations('validationErrors');
  const { replace } = useRouter();
  let currentOTPIndex: number = 0;
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']); // Initialize OTP state
  const [activeOTPIndex, setActiveOTPIndex] = useState<number>(0);
  // Create a reference to the OTP input element
  const inputRef = useRef<HTMLInputElement>(null);
  // Use an effect to focus on the input corresponding to the active OTP digit
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);
  const {
    register: changeEmailRegister,
    handleSubmit: changeEmailSubmit,
    formState: { errors: updateEmailForOrgUserErrors },
  } = useForm<UpdateEmailFormData>({
    mode: 'onTouched',
    resolver: zodResolver(UpdateEmailSchema),
  });
  const {
    handleSubmit: verifyChangeEmailSubmit,
    formState: { errors: verifyUpdatedEmailErrors },
    setValue,
  } = useForm<VerifyUpdatedEmailFormData>({
    mode: 'onTouched',
    resolver: zodResolver(VerifyUpdatedEmailSchema),
  });
  const handleOtpInputChange = ({
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
  const [updateEmailForOrgUser] = useUpdateEmailForOrgUserMutation();
  const [verifyUpdatedEmail] = useVerifyUpdatedEmailForOrgUserMutation();
  const handleUpdateEmailSubmit: SubmitHandler<UpdateEmailFormData> = async (
    data
  ) => {
    setLoading(true);
    setEmail(data.email);
    await updateEmailForOrgUser(data)
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
  const handleVerifyUpdatedEmailSubmit: SubmitHandler<
    VerifyUpdatedEmailFormData
  > = async (data) => {
    setLoading(true);
    const requestData = {
      email, // Include the saved email
      ...data,
    };
    await verifyUpdatedEmail(requestData)
      .unwrap()
      .then(() => {
        replace('/login');
        toast.success('Email has been changed successfully.', {
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
  return (
    <div className='container my-auto flex flex-col justify-center px-10 py-10 max-w-lg'>
      <div className=' md:hidden p-2 text-center pb-10'>
        <img src='/assets/akil-logo.png' className='h-12 mx-auto' alt='logo' />
      </div>
      {success ? (
        <div>
          <h2 className='text-center title font-black text-3xl font-poppins p-4 text-[#25324B]'>
            {t('verifiyEmail.title')}
          </h2>
          <p className='text-center text-[#7C8493]'>
            {t('verifiyEmail.subtitle')}
          </p>
          <form
            action=''
            onSubmit={verifyChangeEmailSubmit(handleVerifyUpdatedEmailSubmit)}
          >
            <div>
              <label
                className='block text-neutrals80 text-base font-semibold pt-6 text-[#515B6F]'
                htmlFor='otp'
              >
                {t('verifiyEmail.otpFieldLabel')}
              </label>
              <div className='flex justify-center items-center space-x-7 px-8 mb-2'>
                {otp.map((_, index) => {
                  const isEmpty = otp[index] === '';
                  return (
                    <React.Fragment key={index}>
                      <input
                        ref={index === activeOTPIndex ? inputRef : null}
                        type='number'
                        onChange={handleOtpInputChange}
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
            </div>
            <div>
              <LoadingButton
                size='lg'
                className='rounded-full bg-primary my-2'
                type='submit'
                fullWidth
                loading={loading}
                color='amber'
              >
                {t('continueButtonText')}
              </LoadingButton>
            </div>
            <AllFormErrorsAlert
              errors={verifyUpdatedEmailErrors}
            ></AllFormErrorsAlert>
          </form>
        </div>
      ) : (
        <div>
          <h2 className='text-center title font-black text-3xl font-poppins p-4 text-[#25324B]'>
            {t('title')}
          </h2>
          <p className='text-[#7C8493]'>{t('subtitle')}</p>
          <form
            onSubmit={changeEmailSubmit(handleUpdateEmailSubmit)}
            className='form h-[50%] w-full flex flex-col justify-around'
          >
            <div className='py-6'>
              <label
                className='block text-neutrals80 text-base font-semibold mb-1 text-[#515B6F]'
                htmlFor='email'
              >
                {t('labels.email')}
              </label>
              <InputField
                name={'email'}
                type='email'
                register={changeEmailRegister}
                crossOrigin={undefined}
                message={
                  updateEmailForOrgUserErrors.email?.message
                    ? translateValidation(
                        `${updateEmailForOrgUserErrors.email?.message}`
                      )
                    : updateEmailForOrgUserErrors.email?.message
                }
                placeholder={t('emailFieldPlaceholder')}
                required
              />
            </div>
            <div>
              <LoadingButton
                size='lg'
                className='rounded-full bg-primary my-2'
                type='submit'
                fullWidth
                loading={loading}
                color='amber'
              >
                {t('continueButtonText')}
              </LoadingButton>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
