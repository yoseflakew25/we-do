'use client';

import { ContactUsFormData, ContactUsFormSchema } from '@/app/api/types';
import LoadingButton from '@/components/buttons/LoadingButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Textarea, Typography } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export type FormData = {
  name: string;
  email: string;
  message: string;
};

const AboutUs = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactUsFormData>({
    mode: 'onTouched',
    resolver: zodResolver(ContactUsFormSchema),
  });
  const [loading, setLoading] = useState(false);
  const t = useTranslations('AboutUsPage');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    toast.dismiss();
    const apiEndpoint = '/api/email';

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 500) {
        const errorData: { error: string } = await response.json();
        toast.error(errorData.error, {
          autoClose: false,
          theme: 'light',
        });
      } else {
        const responseData: { message: string } = await response.json();
        toast.success(responseData.message, {
          theme: 'light',
        });
      }
    } catch (err: any) {
      toast.error(err, {
        autoClose: false,
        theme: 'light',
      });
    }
    reset();
    setLoading(false);
  };

  return (
    <main className='container flex flex-col gap-32 py-32 items-center'>
      {/* about Masar */}
      <div className=' flex md:gap-20 md:flex-row flex-col-reverse gap-8 items-center justify-center'>
        <div className=' flex flex-col justify-center items-center md:justify-normal md:items-baseline basis-2/3'>
          <Typography className=' text-center md:text-left text-3xl sm:text-4xl md:text-5xl font-bold text-[#25324B] font-poppins pb-4'>
            {t('aboutMasar.title').split(' ').length > 1
              ? t('aboutMasar.title').split(' ')[0]
              : ''}{' '}
            <span className='text-[#C4897B]'>
              {t('aboutMasar.title').split(' ').length > 1
                ? t('aboutMasar.title').split(' ')[1]
                : t('aboutMasar.title')}
            </span>
          </Typography>{' '}
          <p className='font-inherit text-[#696984] sm:max-w-3xl sm:text-md sm:pb-10 text-justify'>
            {t('aboutMasar.description')}
          </p>{' '}
        </div>
        <div className='basis-1/3'>
          <Image
            src='/assets/Group 33883.png'
            width={350}
            height={200}
            alt='masar'
          />
        </div>
      </div>
      {/* mission */}
      <div className=' flex md:gap-20 md:flex-row flex-col gap-8 items-center justify-center'>
        <div className='basis-1/3'>
          <Image
            src='/assets/mission.png'
            width={350}
            height={200}
            alt='mission'
          />
        </div>
        <div className=' flex flex-col justify-center items-center md:justify-normal md:items-baseline basis-2/3'>
          <Typography className=' text-center md:text-left text-3xl sm:text-4xl md:text-5xl font-bold text-[#25324B] font-poppins md:pb-4'>
            {t('mission.title').split(' ').length > 1
              ? t('mission.title').split(' ')[0]
              : ''}{' '}
            <span className='text-[#C4897B]'>
              {t('mission.title').split(' ').length > 1
                ? t('mission.title').split(' ')[1]
                : t('mission.title')}
            </span>
          </Typography>{' '}
          <p className='font-inherit text-[#696984] sm:max-w-3xl sm:text-md sm:pb-10 text-justify'>
            {t('mission.description')}
          </p>{' '}
        </div>
      </div>
      {/* vision */}
      <div className=' flex md:gap-20 md:flex-row flex-col-reverse gap-8 items-center justify-center sm:pb-10 pb-6'>
        <div className=' flex flex-col justify-center items-center md:justify-normal md:items-baseline basis-2/3'>
          <Typography className=' text-center md:text-left text-3xl sm:text-4xl md:text-5xl font-bold text-[#25324B] font-poppins md:pb-4'>
            {t('vision.title').split(' ').length > 1
              ? t('vision.title').split(' ')[0]
              : ''}{' '}
            <span className='text-[#C4897B]'>
              {t('vision.title').split(' ').length > 1
                ? t('vision.title').split(' ')[1]
                : t('vision.title')}
            </span>
          </Typography>{' '}
          <p className='font-inherit text-[#696984] sm:max-w-3xl sm:text-md sm:pb-10 text-justify'>
            {t('vision.description')}
          </p>{' '}
        </div>
        <div className='basis-1/3'>
          <Image
            src='/assets/vision.png'
            width={350}
            height={200}
            alt='mission'
          />
        </div>
      </div>
      {/* about a2sv */}
      <div className=' flex flex-col items-center sm:pb-10 pb-6'>
        <Typography className='text-center text-3xl md:text-5xl font-bold text-[#25324B] font-inherit pb-4'>
          {t('aboutA2SV.title').split(' ')[0]}
          <span className='text-[#C4897B]'>
            {' '}
            {t('aboutA2SV.title').split(' ')[1]}
          </span>{' '}
          {t('aboutA2SV.title').split(' ')[2]}
        </Typography>
        <p className='font-inherit text-[#696984]  sm:text-md text-justify lg:px-16'>
          {t('aboutA2SV.description')}
        </p>
      </div>
      {/* contact us */}
      <section
        id='contact'
        className='flex w-full flex-col gap-y-10 pb-2 text-center justify-center items-center'
      >
        <Typography className='text-center text-3xl md:text-5xl font-bold text-[#25324B] font-inherit'>
          {t('contactUsForm.title').split(' ').length > 1
            ? t('contactUsForm.title').split(' ')[0]
            : ''}{' '}
          <span className='text-[#C4897B]'>
            {t('contactUsForm.title').split(' ').length > 1
              ? t('contactUsForm.title').split(' ')[1]
              : t('contactUsForm.title')}
          </span>
        </Typography>
        <form
          className='flex flex-col gap-6 w-full md:w-2/3'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='flex flex-col justify-start'>
            <Input
              label={t('contactUsForm.nameAreaLabel')}
              type='text'
              crossOrigin={undefined}
              {...register('name', { required: true })}
              error={errors.name?.message != undefined}
            />
            {errors.name?.message && (
              <Typography
                variant='small'
                color='red'
                className='font-normal self-start'
              >
                {t(`contactUsForm.errorMessages.nameIsRequired`)}
              </Typography>
            )}
          </div>
          <div className='flex flex-col justify-start'>
            <Input
              label={t('contactUsForm.emailAddressLabel')}
              type='email'
              crossOrigin={undefined}
              {...register('email', { required: true })}
              error={errors.email?.message != undefined}
            />
            {errors.email?.message && (
              <Typography
                variant='small'
                color='red'
                className='font-normal self-start'
              >
                {t(`contactUsForm.errorMessages.emailIsRequired`)}
              </Typography>
            )}
          </div>
          <div className='flex flex-col justify-start'>
            <Textarea
              label={t('contactUsForm.messageAreaLabel')}
              {...register('message', { required: true })}
              error={errors.message?.message != undefined}
            />
            {errors.message?.message && (
              <Typography
                variant='small'
                color='red'
                className='font-normal self-start'
              >
                {t(`contactUsForm.errorMessages.message`)}
              </Typography>
            )}
          </div>

          <LoadingButton
            type='submit'
            color='amber'
            className='bg-primary rounded-full'
            loading={loading}
          >
            {t('contactUsForm.submitButtonText')}
          </LoadingButton>
        </form>
      </section>
    </main>
  );
};

export default AboutUs;
