'use client';

import { LoginFormData, LoginFormSchema } from '@/app/api/types';
import AuthLeftSection from '@/components/AuthLeftSection';
import HorizontalDivider from '@/components/HorizontalDivider';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import LoadingButton from '@/components/buttons/LoadingButton';
import { InputField } from '@/components/forms/ValidatedInputs';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, IconButton } from '@material-tailwind/react';
import { BuiltInProviderType } from 'next-auth/providers/index';
import { ClientSafeProvider, LiteralUnion, signIn } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface SignInFormProps {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
}

export const LoginForm: FC<SignInFormProps> = ({}) => {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const t = useTranslations('LoginPage');
  const translateValidation = useTranslations('validationErrors');
  const locale = useLocale();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    mode: 'onTouched',
    resolver: zodResolver(LoginFormSchema),
  });

  const { replace } = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setLoading(true);
    toast.dismiss();

    const { email, password } = data;
    const callbackUrl = searchParams.get('callbackUrl') || `/${locale}`;

    const response = await signIn('credentials', {
      email,
      password,
      callbackUrl,
      redirect: false,
    });

    if (!response?.ok) {
      const errorMessage =
        response?.error === 'fetch failed'
          ? 'Failed to Authenticate'
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
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
    <div className='md:grid md:grid-cols-2 font-epilogue flex h-screen relative'
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
      {/* <AuthLeftSection /> */}

      {/* Rigth side */}
      <div className='absolute top-0 right-0 my-4 mx-4'>
        <LocaleSwitcher />
      </div>
      <div className='container my-auto flex flex-col justify-center px-10 py-10 max-w-lg'>
        {/* Sign Up Title */}

        <div className=' md:hidden p-2 text-center pb-10'>
          <Link href={'/'}>
          <Image
              width={48}
              height={48}
              src='/assets/Hoopoe navbar logo.png'
              className='h-12 mx-auto'
              alt='logo'
            />
          </Link>
        </div>
        <h2 className='text-center title font-black text-2xl font-poppins p-4 text-[#515B6F]'>
          {t('title')}
        </h2>

        {/* Sign up with Google */}

        <Button
          variant='outlined'
          color='blue-gray'
          className='flex items-center rounded-full gap-1 mx-auto'
          onClick={handleSigninWithGoogle}
        >
          <Image
            width={100}
            height={100}
            src='/assets/google-icon.svg'
            alt='Google Icon'
            className='h-6 w-6'
          />
          {t('continueWithGoogle')}
        </Button>

        <HorizontalDivider text={t('loginWithEmail')}  />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='form h-[50%] w-full flex flex-col justify-around mt-4'
        >
          <div className='mb-2'>
            <label
              className='block text-neutrals80 text-base font-semibold mb-1'
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
          <div className='flex justify-end mt-2'>
            <p className='italic'>
              <a href='/login/forgot-password' className='text-bgPrimary'>
                {t('forgotPassword')}
              </a>
            </p>
          </div>
          {/* Button */}
          <div>
            <LoadingButton
              size='lg'
              className='rounded-full bg-primary my-2 text-white'
              type='submit'
              fullWidth
              loading={loading}
              color='amber'
            >
              {t('submit')}
            </LoadingButton>
          </div>
        </form>

        {/* Sing up link */}
        <p className='text-[#63666f] text-base sm:mt-6'>
          {t('noAccount')}
          <a href='/signup' className='text-bgPrimary ml-1 font-semibold'>
            {t('signup')}
          </a>
        </p>
      </div>
    </div>
  );
};
export default LoginForm;
