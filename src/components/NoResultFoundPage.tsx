import { Typography } from '@material-tailwind/react';
import React from 'react';

interface NoResultFoundPageProps {
  text?: string;
  className?: string;
}

const NoResultFoundPage: React.FC<NoResultFoundPageProps> = ({
  text,
  className,
}) => {
  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center ${className}`}
    >
      <Typography className='mt-4 text-gray-700 text-lg'>{text}</Typography>
    </div>
  );
};

export default NoResultFoundPage;
