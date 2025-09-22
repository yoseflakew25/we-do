'use client';

import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { BsArrowLeftShort } from 'react-icons/bs';

interface ErrorPageProps {
  imageName?: string;
  title?: string;
  description?: string;
  className?: string;
  showBackButton?: boolean;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  imageName = 'server-down.svg',
  title = 'Something went wrong',
  description,
  className,
  showBackButton,
}) => {
  return (
    <div
      className={`fixed bg-primary/10 w-full h-full flex flex-col items-center justify-center ${className}`}
    >
      <Image
        src={`/assets/errors/${imageName}`}
        alt={title}
        width={250}
        height={100}
      />
      <Typography variant='h5' className='mt-2 text-gray-900 font-epilogue'>
        {title}
      </Typography>
      <Typography className='text-gray-700'>{description || ' '}</Typography>
      {showBackButton && (
        <Link href='/'>
          <Button
            color='amber'
            className='bg-primary flex gap-1 items-center mt-3 shadow-none'
          >
            <BsArrowLeftShort size={25} />
            Return to Home
          </Button>
        </Link>
      )}
    </div>
  );
};

export default ErrorPage;
