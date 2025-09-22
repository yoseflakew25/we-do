import { format } from 'date-fns';
import Image from 'next/image';
import React from 'react';

interface CertificateProps {
  title?: string;
  subtitle?: string;
  description?: string;
  volunteerName: string;
  opportunityTitle: string;
  orgLogo?: string;
  orgRepresentativeName?: string;
  orgRepresentativeTitle?: string;
  orgRepSignature?: string;
  date?: Date;
}

const Certificate = ({
  title,
  subtitle,
  description,
  volunteerName,
  opportunityTitle,
  orgLogo,
  orgRepresentativeName,
  orgRepresentativeTitle,
  date,
}: CertificateProps) => {
  return (
    <>
      {/* add a message for screens smaller than lg to use bigger screens */}
      <div className='block lg:hidden'>
        <p className='text-center my-4 text-lg font-bold text-red-500'>
          Please use a bigger screen to view the certificate.
        </p>
      </div>
      <div className='transform lg:scale-[0.9] xl:scale-[1] origin-center'>
        <div className="hidden relative bg-no-repeat bg-contain bg-center bg-[url('/assets/certificate/frame.png')] lg:flex items-center justify-center">
          <div className='relative max-w-3xl z-10 transform lg:scale-[0.95] xl:scale-[1] origin-center'>
            <Image
              src='/assets/akil-logo.svg'
              alt='Logo'
              className='mx-auto pt-4 w-24'
              width={100}
              height={100}
            />
            <div className='py-10 px-8'>
              <h1 className='font-serif uppercase text-3xl text-center mb-4'>
                {title}
              </h1>

              <p className='text-center text-lg mb-4 capitalize'>{subtitle}</p>

              <div className='relative w-full'>
                <h2 className='text-4xl font-medium text-center capitalize pb-5'>
                  {volunteerName}
                </h2>
                <div className='border-b border-[#274972] w-3/4 mx-auto'></div>
              </div>

              <p className='text-center mb-6 mt-8 font-light text-sm leading-5'>
                The volunteer served as{' '}
                <span className='font-bold'>{opportunityTitle}</span>.{' '}
                {description}
              </p>

              <div className='flex items-center justify-center mt-10'>
                <img src={orgLogo} alt='Org Logo' className='w-24 max-h-20' />
                <img
                  src='/assets/certificate/ribbon.png'
                  alt='Ribbon'
                  className='w-20 mx-4'
                />
                <div className='text-center'>
                  <p className='text-lg font-bold capitalize'>
                    {orgRepresentativeName}
                  </p>
                  <p className='text-sm'>{orgRepresentativeTitle}</p>
                  <p className='font-cursive text-large'>
                    {orgRepresentativeName}
                  </p>
                </div>
              </div>

              <p className='text-center mt-4 font-serif italic'>
                Issued on {format(date || new Date(), 'MMMM dd, yyyy')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Certificate;
