'use client';

import { setUser } from '../signup-slice';
import { useSignupUserMutation } from '@/app/api/slices/api-slice';
import { SignupFormData, SignupFormSchema } from '@/app/api/types';
import { APIResponse } from '@/app/api/types';
import AuthLeftSection from '@/components/AuthLeftSection';
import HorizontalDivider from '@/components/HorizontalDivider';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import LoadingButton from '@/components/buttons/LoadingButton';
import { InputField } from '@/components/forms/ValidatedInputs';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, IconButton } from '@material-tailwind/react';
import { signIn } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const SignupForm = () => {
  const queryParams = useSearchParams();
  const fullNameFromUrl = queryParams.get('fullname');
  const emailFromUrl = queryParams.get('email');

  // Initialize form handling using react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<SignupFormData>({
    mode: 'onTouched',
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      name: fullNameFromUrl || '',
      email: emailFromUrl || '',
    },
  });
  const [signupUser] = useSignupUserMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const t = useTranslations('SignupPage');
  const translateValidation = useTranslations('validationErrors');
  const { replace } = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();

  // const role = localStorage.getItem('role');
  const onSubmit: SubmitHandler<SignupFormData> = async (userData) => {
    setLoading(true);
    toast.dismiss();

    userData.role = ''; // Set the role as needed

    await signupUser(userData)
      .unwrap()
      .then((response) => {
        toast.success(response.message, {
          theme: 'light',
        });
        localStorage.setItem('user', JSON.stringify(userData));
        dispatch(setUser(userData));
        router.push('/signup/verify-email');
        reset();
      })
      .catch(
        (errorResponse: { data: APIResponse<undefined>; status: number }) => {
          if (errorResponse.status === 409) {
            setError('email', {
              type: 'custom',
              message: errorResponse.data?.message,
            });
          }

          toast.error(errorResponse.data?.message, {
            autoClose: false,
            theme: 'light',
          });
        }
      );
    setLoading(false);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSigninWithGoogle = async () => {
    const response = await signIn('google');

    if (!response?.ok) {
      const errorMessage =
        response?.error === 'fetch failed'
          ? 'Failed to Authenticate with Google'
          : response?.error;

      toast.error(errorMessage, {
        autoClose: false,
        theme: 'light',
      });
    } else {
      replace(searchParams.get('callbackUrl') || `/${locale}`);
      toast.success('You have signed in!', {
        theme: 'light',
      });
    }
    setLoading(false);
  };

  return (
    <div className='md:grid md:grid-cols-2 font-epilogue h-screen relative'
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

      {/* Right Side */}
      <div className='absolute top-0 right-0 my-4 mx-2'>
        <LocaleSwitcher />
      </div>

      <div className='container my-auto flex flex-col  items-center justify-center px-10 py-10 max-w-lg'>
        <div className=' md:hidden p-2 text-center pb-10'>
          <Link href={'/'}>
            <Image
              width={200}
              height={200}
              src='/assets/akil-logo.png'
              className='h-12 mx-auto'
              alt='logo'
            />
          </Link>
        </div>

        <div>
          <h2 className='text-center title font-black text-2xl font-poppins p-4 text-[#515B6F] mt-2'>
            {t('title')}
          </h2>
          {/* Sign up with Google */}
          <Button
            variant='outlined'
            color='blue-gray'
            className='mx-auto flex items-center gap-1 rounded-full'
            onClick={handleSigninWithGoogle}
          >
            <Image
              width={200}
              height={200}
              src='/assets/google-icon.svg'
              alt='Google Icon'
              className='h-6 w-6'
            />
            {t('continueWithGoogle')}
          </Button>

          {/* Horizontal Divider */}
          <HorizontalDivider text={t('signupWithEmail')} />

          {/* Sign Up Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='h-[50%] w-full flex flex-col justify-around'
          >
            <div className='mb-2'>
              <label
                className='block text-neutrals80 text-base font-semibold mb-1'
                htmlFor='name'
              >
                {t('fullName')}
              </label>
              <InputField
                name={'name'}
                type='text'
                register={register}
                className={`${fullNameFromUrl ? 'bg-secondary' : ''}`}
                crossOrigin={undefined}
                message={
                  errors.name?.message
                    ? translateValidation(`${errors.name?.message}`)
                    : errors.name?.message
                }
                placeholder={t('nameAreaPlaceholder')}
                required
                readOnly={!!fullNameFromUrl}
              />
            </div>

            <div className='mb-2'>
              <label
                className='block text-neutrals80 text-base font-semibold mb-1 '
                htmlFor='email'
              >
                {t('emailAddressLabel')}
              </label>
              <InputField
                name={'email'}
                type='email'
                register={register}
                crossOrigin={undefined}
                message={
                  errors.email?.message
                    ? translateValidation(`${errors.email?.message}`)
                    : errors.email?.message
                }
                placeholder={t('emailAddressPlaceholder')}
                required
                readOnly={!!emailFromUrl}
              />
            </div>

            <div className='mb-2'>
              <label
                className='block text-neutrals80 text-base font-semibold mb-1'
                htmlFor='password'
              >
                {t('passwordAreaLabel')}
              </label>
              <InputField
                name={'password'}
                type={showPassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
                register={register}
                crossOrigin={undefined}
                message={
                  errors.password?.message
                    ? translateValidation(`${errors.password?.message}`)
                    : errors.password?.message
                }
                placeholder={t('passwordAreaPlaceholder')}
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
                className='block text-neutrals80 text-base font-semibold mb-1 '
                htmlFor='confirmPassword'
              >
                {t('confirmPassword')}
              </label>
              <InputField
                name={'confirmPassword'}
                type={showConfirmPassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
                register={register}
                crossOrigin={undefined}
                message={
                  errors.confirmPassword?.message
                    ? translateValidation(`${errors.confirmPassword?.message}`)
                    : errors.confirmPassword?.message
                }
                placeholder={t('confirmPasswordPlaceholder')}
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

          {/* Login link */}
          <p className='text-[#63666f] text-center sm:mt-6'>
            {t('alreadyHaveAccount')}{' '}
            <a href='/login' className='text-bgPrimary ml-1 font-semibold'>
              {t('login')}
            </a>
          </p>

          {/* Terms of Service and Privacy Policy */}
          <p className='text-[#7C8493] text-sm mt-2 sm:mt-4 text-justify'>
            {t.rich('terms.acceptanceMessage', {
              ts: (chunks) => (
                <a href='/legals' className='text-bgPrimary'>
                  {' '}
                  {chunks}{' '}
                </a>
              ),
              pp: (chunks) => (
                <Link
                  className=' text-bgPrimary'
                  href={'/legals#privacy-policy'}
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
