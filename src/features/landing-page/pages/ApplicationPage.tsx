import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react';

const ApplicationPage: React.FC = () => {
  const router = useRouter();
  const t = useTranslations('volunteerSide.applicationPage');
  return (
    <section id='Application' className='pt-20 pb-8 bg-white'>
      <div className='w-[90%] container mx-auto items-center flex lg:grid flex-col lg:grid-cols-2 text-center sm:text-start '>
        {/** image on the left*/}
        <div className='pl-10 lg:pl-20 '>
          <img
            className='object-fit h-auto '
            src='/assets/peopleimageandstroke.png'
            alt='aid'
          />
        </div>

        <div className='px-8 lg:pl-8  '>
          <span className='text-center lg:text-left block text-2xl md:text-5xl pb-5 font-poppins font-black leading-snug text-[#25324B] '>
            {t('title')}
          </span>
          <div className='pt-5 p-0 sm:pr-24 flex justify-center lg:justify-start'>
            <span className='text-xl lg:text-2xl text-[#696984]  font-poppins'>
              {t('description')}
            </span>
          </div>
          {/* Rounded Button */}
          <div className='py-10 flex justify-center lg:justify-start'>
            <button
              onClick={() => router.push(`/signup`)}
              className='bg-[rgba(45,41,142)] text-white px-4 lg:px-6 py-2 lg:py-4 text-xl lg:text-base rounded-full font-semibold uppercase hover:bg-amber-400'
            >
              {t('button')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicationPage;
