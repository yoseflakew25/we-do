'use client';

import { Button, Typography } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

const ImpactPage: React.FC = () => {
  const router = useRouter();
  const t = useTranslations('volunteerSide.impactPage');
  return (
    <section id='ImpactPage' className='lg:pt-32'>
      <div className='container w-4/5 px-8 md:px-16 py-8 items-center mx-auto'>
        <div className='flex flex-col items-center justify-between '>
          <Typography className='text-2xl md:text-3xl lg:text-5xl font-bold text-[#25324B] font-poppins pb-8 text-center leading-10'>
            {' '}
            {t('title1')} <span className='text-[#8A86E7]'> {t('title2')}</span>{' '}
            {t('title3')}{' '}
          </Typography>
          <p className='text-gray-600 text-xl font-epilogue pb-8 text-center leading-8'>
            {' '}
            {t('subtitle1')}
            <span className='block'>{t('subtitle2')}</span> {t('subtitle3')}
          </p>
          <div className='text-left'>
            <Button
              onClick={() => router.push(`/talent/opportunities`)}
              className='bg-[rgba(45,41,142)] text-white px-4 lg:px-6 py-2 lg:py-4 text-xl lg:text-base rounded-full font-semibold hover:bg-amber-400'
            >
              {t('button')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactPage;
