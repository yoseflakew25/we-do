'use client';

import { Footer } from '@/components/Footer';
import OrgNavbar from '@/features/organization/signup/components/OrgNavbar';
import { Button } from '@material-tailwind/react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';
import { BiLogoTelegram } from 'react-icons/bi';
import { MdOutlineArrowOutward } from 'react-icons/md';

function Home() {
  const { data: session } = useSession();
  const t = useTranslations('VolunteerHomePage');

  return (
    <div className='flex flex-col min-h-screen'>
      <OrgNavbar />
      <div className='container flex flex-grow justify-center items-center  '>
        <div className="bg-[url('/assets/under-construction.png')] bg-contain bg-no-repeat bg-center h-[400px]">
          <h3 className='text-2xl font-black font-poppins text-[#25324B] leading-10 text-center'>
            {t('welcome', { name: `${session?.user.name}` })}
          </h3>
          <p className='mt-1 text-lg font-semibold text-[#515B6F] leading-7 text-center'>
            {t('message')}
          </p>
          <div className='mt-6 flex gap-2 justify-center mx-auto'>
            <Link
              href='https://t.me/akilconnectbot'
              className='inline-block'
              target='_blank'
            >
              <Button
                size='md'
                color='amber'
                className='flex rounded-full py-5 mx-auto text-center items-center gap-2'
              >
                <BiLogoTelegram className='my-auto' size={20} />
                {t('buttonText.toAkilBot')}
              </Button>
            </Link>
            <Link href='/about-us'>
              <Button
                size='md'
                color='amber'
                variant='outlined'
                className='flex rounded-full py-5 mx-auto text-center items-center gap-2'
              >
                {t('buttonText.aboutAkil')}
                <MdOutlineArrowOutward size={20} className='my-auto' />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
