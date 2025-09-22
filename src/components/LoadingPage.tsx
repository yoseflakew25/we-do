import { Spinner } from '@material-tailwind/react';
import React from 'react';

interface LoadingPageProps {
  text?: string;
  className?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ text, className }) => {
  return (
    <div
      className={`fixed bg-primary/10 w-full h-full flex flex-col items-center justify-center ${className}`}
    >
      <Spinner className='h-10 w-10' color='amber' />
      <span className='mt-2 text-gray-700 text-sm'>{text}</span>
    </div>
  );
};

export default LoadingPage;
