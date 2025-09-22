import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react';

const ElevatePage: React.FC = () => {
  const router = useRouter();
  const t = useTranslations('volunteerSide.elevatePage');
  return (
    <section id='section5' className=''>
      <div className='container w-[90%] mx-auto px-8 py-4 lg:py-8 flex lg:grid flex-col lg:grid-cols-2 items-center text-center md:text-start'>
        <div>
          <h1 className='font-bold text-2xl md:text-5xl pb-6 text-[#25324B] font-poppins'>
            {t('title1')} <span className='text-[#8A86E7]'>{t('title2')}</span>{' '}
            {t('title3')}
          </h1>
          <p className='text-[#696984] text-xl md:text-lg pb-10 font-epilogue'>
            {t('description')}
          </p>

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

              <p className='font-semibold text-xl text-[#25324B] font-epilogue'>
                {t('subtitle1')}
              </p>
            </div>
            <span className='text-base  text-[#696984] font-epilogue'>
              {t('subtitle1description')}
            </span>
          </div>
          <div className=''>
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

              <p className='font-semibold text-xl text-[#25324B] font-epilogue'>
                {t('subtitle2')}
              </p>
            </div>
            <span className='text-base text-[#696984] font-epilogue'>
              {t('subtitle2description')}
            </span>
          </div>
          <div className='py-10'>
            <button
              onClick={() => router.push(`/signup`)}
              className='bg-[rgba(45,41,142)] text-white px-4 lg:px-6 py-2 lg:py-4 text-xl lg:text-base rounded-full font-semibold hover:bg-amber-400 uppercase'
            >
              {t('button')}
            </button>
          </div>
        </div>
        <div className=''>
          <img src='/assets/opportunity.png' alt='Opportunity Listing' />
        </div>
      </div>
    </section>
  );
};

export default ElevatePage;
