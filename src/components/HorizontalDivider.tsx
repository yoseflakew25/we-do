import React from 'react';

interface HorizontalDividerProps {
  text?: string; // Make the 'text' prop optional
}

const HorizontalDivider: React.FC<HorizontalDividerProps> = ({ text }) => {
  if (!text) {
    return <hr className='text-lightGrey my-6' />; // Return just the <hr> element if 'text' prop is not provided
  }

  return (
    <div className='flex items-center mt-4'>
      <div className='flex-grow bg-gray-300 h-[1px]'></div>
      <p className='mx-2 text-neutrals60 font-normal text-lg'>{text}</p>
      <div className='flex-grow bg-grey  h-[1px]'></div>
    </div>
  );
};

export default HorizontalDivider;
