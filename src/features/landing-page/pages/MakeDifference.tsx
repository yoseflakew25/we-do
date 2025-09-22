'use client';

import { Button } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import React from 'react';

const MakeDifference = () => {
  const t = useTranslations('volunteerSide.makeDifferencePage');
  return (
    <section id='MakeDifference'>
      <div className='container w-[90%] px-8 py-8 items-center mx-auto flex lg:grid flex-col lg:grid-cols-2 text-center sm:text-start'>
        {/* Image */}
        <div className='pb-8'>
          <img
            src='/assets/akilMobile.png'
            alt='Section 3'
            style={{ maxHeight: 800 }}
            className=' h-full object-contain  rounded-lg '
          />{' '}
        </div>

        {/* Content */}
        <div className=' flex flex-col py-2 lg:py-32 items-center md:items-start'>
          <div className=' align-top'>
            <h1 className='font-epilogue text-center md:text-left text-2xl md:text-5xl font-bold text-[#25324B] font-poppins pb-8 md:pb-4'>
              {t('title1')}
              <span className='text-[#8A86E7]'>{t('title2')}</span>{' '}
            </h1>
            <div className=' text-xl text-[#696984]'>
              <p></p>
              <p className='font-epilogue text-[#696984] max-w-[690px] text-xl md:text-lg pb-6 sm:pb-10'>
                {t('description')}
              </p>
            </div>
          </div>

          <div>
            <div className='pb-8'>
              <div className='flex space-x-4 pb-2'>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z'
                    stroke='#C4897B'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M7.75 11.9999L10.58 14.8299L16.25 9.16992'
                    stroke='#C4897B'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>

                <p className='font-epilogue font-semibold text-xl text-[#25324B]'>
                  {t('subtitle1')}
                </p>
              </div>
              <span className='font-epilogue text-base text-[#696984] '>
                {t('description1')}
              </span>
            </div>
            <div className='pb-8'>
              <div className='flex space-x-4 pb-2'>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z'
                    stroke='#C4897B'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M7.75 11.9999L10.58 14.8299L16.25 9.16992'
                    stroke='#C4897B'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>

                <p className='font-epilogue font-semibold text-xl text-[#25324B]'>
                  {t('subtitle2')}
                </p>
              </div>
              <span className=' font-epilogue text-base text-[#696984] '>
                {t('description2')}{' '}
              </span>
            </div>
            <div className='pb-4'>
              <div className='flex space-x-4 pb-2'>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z'
                    stroke='#C4897B'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M7.75 11.9999L10.58 14.8299L16.25 9.16992'
                    stroke='#C4897B'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <p className='font-epilogue font-semibold text-xl text-[#25324B]'>
                  {t('subtitle3')}
                </p>
              </div>
              <span className='text-base text-[#696984] font-epilogue'>
                {t('description3')}
              </span>
            </div>
          </div>
          <div className=''>
            <a href='https://play.google.com/store/apps/details?id=org.a2sv.akil_mobile'>
              <Button className='bg-[rgba(45,41,142)] text-white px-4 lg:px-6 py-2 lg:py-4 text-xl lg:text-base rounded-full font-semibold hover:bg-amber-400'>
                {t('button')}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MakeDifference;
