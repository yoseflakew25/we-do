import { Typography } from '@material-tailwind/react';
import React from 'react';

interface TitleProps {
  text1: string;
  text2?: string;
}

const Title = ({ text1, text2 }: TitleProps) => {
  return (
    <Typography className='font-poppins font-medium text-xl sm:text-2xl md:text-4xl lg:text-5xl lg:leading-[70px]'>
      {text1} <br /> {text2}
    </Typography>
  );
};

export default Title;
