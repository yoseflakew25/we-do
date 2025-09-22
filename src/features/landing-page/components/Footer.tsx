'use client';

import { Button, Typography } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaInstagram } from 'react-icons/fa';
import { FaLinkedinIn } from 'react-icons/fa';
import { MdOutlineQuickreply } from 'react-icons/md';
import { PiTelegramLogoDuotone } from 'react-icons/pi';

const Footer: React.FC = () => {
  // form states
  const router = useRouter();
  const t = useTranslations('volunteerSide.footer');
  return (
    <footer
      id='footer'
      className='bg-[#202430] text-white p-5 sm:py-10 sm:px-8 xl:px-10'
    >
      <div className='xl:container'>
        {/* Footer content */}
        <div className='flex flex-col gap-4 md:grid md:grid-cols-4 md:gap-0 place-content-end'>
          {/* Masar description */}
          <div className='lg:col-span-2 md:col-span-1 flex flex-col gap-4'>
            <img
              src='/assets/Hoopoe navbar logo.png'
              alt='Masar Logo'
              className='h-8 self-start'
            />

            <p className='hidden lg:block text-left text-base text-[#7C8493]'>
              {t('description')}
            </p>
          </div>
          <div className='lg:col-span-2 md:col-span-3 flex flex-col sm:flex-row gap-4 md:justify-around'>
            {/* Resources */}
            <div className=''>
              <Typography className='font-poppins font-semibold text-lg'>
                {t('resourcesButton.title')}
              </Typography>

              <div className='flex flex-col items-start -ml-6'>
                <a href='https://play.google.com/store/apps/details?id=org.a2sv.akil_mobile'>
                  <Button
                    variant='text'
                    className='rounded-full text-[#A8ADB7]  hover:text-lighterPrimary'
                  >
                    {t('resourcesButton.getTheApp')}
                  </Button>
                </a>
                <a
                  href='https://t.me/HOOPOEconnectbot'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Button
                    variant='text'
                    className='rounded-full text-[#A8ADB7] hover:text-lighterPrimary'
                  >
                    {t('resourcesButton.tryTelegramBot')}
                  </Button>
                </a>
                <Button
                  onClick={() => router.push('/about-us')}
                  variant='text'
                  className='rounded-full text-[#A8ADB7]  hover:text-lighterPrimary'
                >
                  {t('resourcesButton.aboutUs')}
                </Button>
              </div>
            </div>
            {/* Contact Us */}
            <div className='flex flex-col gap-4'>
              <p className='font-semibold font-poppins text-lg'>
                {t('contactUs')}
              </p>
              <a href='mailto:contact-HOOPOE@a2sv.org' className='flex gap-x-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                >
                  <path
                    d='M17 21.25H7C3.35 21.25 1.25 19.15 1.25 15.5V8.5C1.25 4.85 3.35 2.75 7 2.75H17C20.65 2.75 22.75 4.85 22.75 8.5V15.5C22.75 19.15 20.65 21.25 17 21.25ZM7 4.25C4.14 4.25 2.75 5.64 2.75 8.5V15.5C2.75 18.36 4.14 19.75 7 19.75H17C19.86 19.75 21.25 18.36 21.25 15.5V8.5C21.25 5.64 19.86 4.25 17 4.25H7Z'
                    fill='#A8ADB7'
                  />
                  <path
                    d='M11.9988 12.87C11.1588 12.87 10.3088 12.61 9.6588 12.08L6.5288 9.57997C6.2088 9.31997 6.14881 8.84997 6.4088 8.52997C6.66881 8.20997 7.13881 8.14997 7.45881 8.40997L10.5888 10.91C11.3488 11.52 12.6388 11.52 13.3988 10.91L16.5288 8.40997C16.8488 8.14997 17.3288 8.19997 17.5788 8.52997C17.8388 8.84997 17.7888 9.32997 17.4588 9.57997L14.3288 12.08C13.6888 12.61 12.8388 12.87 11.9988 12.87Z'
                    fill='#A8ADB7'
                  />
                </svg>
                <p className='text-[#A8ADB7] self-center hover:text-lighterPrimary'>
                  contact-hoopoe@a2sv.org
                </p>
              </a>
              <a href='tel:+251930774196' className='flex gap-x-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                >
                  <path
                    d='M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.27 13.75 11.79 14.24 12.32 14.69C12.84 15.13 13.27 15.43 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.3 21.81 17.55C21.91 17.8 21.97 18.05 21.97 18.33Z'
                    stroke='#A8ADB7'
                    strokeWidth='1.5'
                    strokeMiterlimit='10'
                  />
                </svg>
                <p className='text-[#A8ADB7] self-center hover:text-lighterPrimary'>
                  +251-984-004-521
                </p>
              </a>

              <Link href='/about-us#contact' scroll>
                <div className='flex gap-x-2 flex-wrap items-center cursor-pointer text-bgPrimary hover:text-lighterPrimary'>
                  <MdOutlineQuickreply size={20} className='text-inherit' />
                  <p className='text-left text-base text-inherit'>
                    {t('quickContact')}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/** Bottom part */}
        <div className=' flex justify-between gap-4 border-t border-[#7C8493] py-3 mt-3'>
          <div className='flex gap-x-2 '>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              className='stroke-[#A8ADB7]'
            >
              <path
                d='M12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22Z'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M14.8783 15C14.1683 15.62 13.2483 16 12.2383 16C10.0283 16 8.23828 14.21 8.23828 12C8.23828 9.79 10.0283 8 12.2383 8C13.2483 8 14.1683 8.38 14.8783 9'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span className='text-base text-[#A8ADB7]'>
              &copy; {new Date().getFullYear()} {t('copyRight')}
            </span>
          </div>
          <div className='-ml-2'>
            <a
              href='https://www.instagram.com/HOOPOEconnect?utm_source=qr&igsh=MWMwdTcwcHMwdzNxaw=='
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button
                variant='text'
                className='rounded-full text-[#A8ADB7] p-2 hover:bg-amber-600 hover:text-white inline-flex'
              >
                <FaInstagram className='text-[#A8ADB7] text-2xl' />
              </Button>
            </a>
            <a
              href='https://t.me/+8cU3_d5Eek01MmE0'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button
                variant='text'
                className='rounded-full text-[#A8ADB7] p-2 hover:bg-amber-600 hover:text-white inline-flex'
              >
                <PiTelegramLogoDuotone className='text-[#A8ADB7] text-2xl' />
              </Button>
            </a>
            <a
              href='https://www.linkedin.com/company/HOOPOE/'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button
                variant='text'
                className='rounded-full text-[#A8ADB7] p-2 hover:bg-amber-600 hover:text-white inline-flex'
              >
                <FaLinkedinIn className='text-[#A8ADB7] text-2xl' />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
