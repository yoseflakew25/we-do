import Paragraph from './ui/Paragraph';
import { Typography } from '@material-tailwind/react';
import { useState } from 'react';

interface DescriptionCardProps {
  src: string;
  title: string;
  description: string;
}

const DescriptionCard: React.FC<DescriptionCardProps> = ({
  src,
  title,
  description,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className='flex bg-[#FAFAFA] hover:bg-[#F4F4F5] w-full p-4 xl:p-8 rounded-2xl  transform duration-500 hover:scale-110 transition-colors mx-auto cursor-default'
    >
      <div className='flex gap-2 xl:gap-3 items-center justify-center'>
        <div
          className={`
         ${
           isHovered ? 'bg-[#E4EBFD]' : 'bg-[#F4F4F5]'
         } p-4 gap-2.5 rounded-full w-18 xl:w-22 h-18 xl:h-22 flex items-center justify-center flex-shrink-0`}
        >
          <img src={src} className='w-10 xl:w-14 h-10 xl:h-14' alt='Icon' />
        </div>
        <div className='flex flex-col gap-2'>
          <Typography className='font-poppins font-normal text-lg lg:text-2xl'>
            {title}
          </Typography>
          <Paragraph text1={description} />
        </div>
      </div>
    </div>
  );
};

export default DescriptionCard;
